---
layout: default
title: Amazon ElastiCache (Valkey/Redis)
parent: Infrastructure
---

# Amazon ElastiCache for Valkey / Redis

The SwasthX backend has the application-side wiring to use Amazon ElastiCache for Valkey (Redis-compatible) as the Socket.IO pub/sub adapter for cross-instance WebSocket broadcast. The adapter is **fully wired in code and env-gated** — it activates automatically the moment a `REDIS_URL` is provided in the App Runner environment.

> **Current deployment state:** the AWS ElastiCache cluster is not yet provisioned. App Runner runs at `min: 1` instance (see [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html)), so the Socket.IO adapter operates in its **in-memory fallback** mode today. No code change is required to enable Valkey — provisioning the cluster and setting `REDIS_URL` is sufficient.

This page documents what is **implemented in code** right now.

---

## Application-side wiring (what's in the code)

### 1. The Socket.IO adapter

Path: `src/sockets/adapters/redis-io.adapter.ts`

A NestJS WebSocket adapter that subclasses `IoAdapter` and layers `@socket.io/redis-adapter` on top. When pub/sub clients are available, every `io.to(room).emit(...)` call also publishes to Redis, so other App Runner instances receive the broadcast and deliver it to their locally-connected sockets — that's the cross-instance fan-out.

The adapter **always overrides** `createIOServer()` to set CORS on the Socket.IO server (mirroring HTTP CORS in `main.ts`) — that part is unconditional. The Redis layering is the only part that depends on `REDIS_URL` being set.

### 2. The Redis client factory

Path: `src/sockets/adapters/redis-client.factory.ts`

A `@Injectable()` factory that builds the pub + sub `ioredis` clients. Two connections are mandatory because Redis (and Valkey, which is wire-compatible) forbids running commands on a connection that's in `SUBSCRIBE` mode — the pub side stays normal, the sub side is `duplicate()`d.

The factory handles three ElastiCache-specific concerns:

- **TLS** — encryption-in-transit is on by default for Valkey clusters. Toggled via `REDIS_TLS=true`. Uses ioredis's `tls: {}` empty-object option (matches ElastiCache server-side TLS without client cert requirement).
- **Cluster mode** — sharded ElastiCache clusters need `ioredis`'s `Cluster` client, not the single-node `Redis` client. Toggled via `REDIS_CLUSTER_MODE=true`.
- **Auth token** — if the cluster has an AUTH token, passed as `password`. Read from `REDIS_AUTH_TOKEN` env (should ultimately come from Secrets Manager, not a plain env var).

### 3. Wiring in `main.ts`

The adapter is registered before `app.listen()` so the underlying Socket.IO server is created with the adapter:

```ts
import { RedisIoAdapter } from "./sockets/adapters/redis-io.adapter";
import { RedisClientFactory } from "./sockets/adapters/redis-client.factory";

// ... (after app creation)
const socketAdapter = new RedisIoAdapter(app, app.get(RedisClientFactory));
await socketAdapter.connectToRedis();
app.useWebSocketAdapter(socketAdapter);

await app.listen(3000);
```

`connectToRedis()` is a **no-op when `REDIS_URL` is unset** — the factory returns null, the adapter never attaches `@socket.io/redis-adapter`, and the app continues with the built-in in-memory adapter. This is what keeps single-instance dev and prod-at-`min:1` working without any Valkey infrastructure.

---

## Environment variables (the only configuration surface)

| Env var | Default | Behavior |
| :--- | :--- | :--- |
| `REDIS_URL` | *(unset)* | Connection URL (`redis://` or `rediss://` for TLS). When unset → in-memory adapter, no cross-instance broadcast. |
| `REDIS_TLS` | `false` | `true` → ioredis uses TLS (`tls: {}`). Required for ElastiCache encryption-in-transit. |
| `REDIS_CLUSTER_MODE` | `false` | `true` → ioredis Cluster client; `false` → single-node Redis client. Set this only when the ElastiCache cluster has cluster-mode-enabled (sharded). |
| `REDIS_AUTH_TOKEN` | *(unset)* | Passed as `password` when set. Use Secrets Manager rather than raw env. |

All four are read via `ConfigService.get()` — no code change is needed to toggle Valkey on or off; provisioning the cluster + setting the env vars in App Runner is sufficient.

---

## Fallback semantics (the safety guarantees)

The wiring is fail-safe at every boot path:

| Condition | What happens |
| :--- | :--- |
| `REDIS_URL` unset | Factory logs `REDIS_URL not set — socket adapter will use in-memory fallback (single-pod mode)` and returns null. Adapter falls back to in-memory IoAdapter. |
| Cluster unreachable (wrong VPC / DNS / auth) | Factory waits for `ready` event with a 5s timeout (`maxRetriesPerRequest: 3`, `connectTimeout: 5000`). On failure, logs `Socket adapter: Valkey connect failed (<reason>). Falling back to in-memory adapter — multi-pod broadcast will NOT work until resolved.` and returns null. App continues to boot. |
| Transient blip after initial connect | `ioredis` auto-reconnects. Each transient error logs via Winston (`Redis pub client error: <msg>`); no process crash. |

A misconfigured Valkey endpoint will **never take the API down**. The trade-off is that cross-instance WebSocket broadcast silently fails until the connection is restored — visible only via the log line and the absence of cross-instance events.

---

## CORS — handled in the same adapter

The Socket.IO server's CORS is set inside `RedisIoAdapter.createIOServer()` rather than via gateway decorators, so every gateway in the app shares the same allow-list as the HTTP server:

```ts
cors: {
  origin: true,         // mirror HTTP CORS in main.ts
  credentials: false,
  methods: ['GET', 'POST'],
}
```

If the HTTP CORS whitelist is tightened later, mirror the change here so `wss` handshakes stay aligned. This is unconditional — present even when the in-memory adapter is in use.

---

## Connection topology when Valkey IS provisioned

```
       App Runner Instance #1                        App Runner Instance #2
            │                                              │
            │  pub                                         │  pub
            ▼                                              ▼
     ┌────────────────────────────────────────────────────────┐
     │           Amazon ElastiCache for Valkey                 │
     │                  (pub/sub channel)                       │
     └────────────────────────────────────────────────────────┘
            ▲                                              ▲
            │  sub                                         │  sub
            │                                              │
       App Runner Instance #1                        App Runner Instance #2
```

Each instance opens two connections to Valkey — one pub, one sub. When an instance calls `io.to('doctor:9658965:queue').emit('result:published', payload)`, the call:

1. Delivers locally to any socket on that instance in the target room
2. Publishes to Valkey
3. Other instances' sub clients receive the publish and replay the emit to their local sockets in the same room

End-to-end latency added by Valkey: typically <5 ms within the same VPC.

---

## Dependencies (npm)

These packages are present in the backend:

- `ioredis` — Redis client (handles both single-node and Cluster modes; TLS-aware)
- `@socket.io/redis-adapter` — the official Socket.IO Redis adapter

No additional packages are needed to activate Valkey support. Both are already in `package.json` and `package-lock.json`.

---

## Operational notes

- **One Lambda, all instances** — the adapter is built per-process. When App Runner spawns a new instance, that instance opens its own pub/sub pair to Valkey at boot. No central orchestration.
- **`@socket.io/redis-adapter` is the official adapter** — separate from `socket.io-redis` (which is deprecated). The factory targets the modern adapter.
- **Valkey vs Redis** — AWS ElastiCache for Valkey is wire-compatible with Redis 7.x; the same client works for both. No code change needed if the cluster is created as Valkey rather than Redis.
- **Two connections per instance × N instances** — connection count scales linearly with App Runner instance count. ElastiCache bills per connection, but at 2 per instance the cost is negligible.
- **The pub side stays a normal client** — can run any Redis command. Only the sub side is in `SUBSCRIBE` mode.

---

## What this page does NOT cover (intentionally — not implemented yet)

The following items appear in the original SRS NFR requirement but are **not implemented**. Documenting them here would be aspirational; they will get their own sections in this file once the work lands:

- **ElastiCache cluster provisioning** — no cluster exists in AWS today. When provisioned, document config (engine version, instance type, primary/replica count, subnet groups, security group) at the top of this file.
- **CloudWatch alarms** for memory usage, evictions, connection count
- **AWS Secrets Manager** entry for `swasthx/redis/url`
- **Redis-backed `ThrottlerModule`** — currently `ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }])` in `app.module.ts` uses the default in-memory store. Switching to a Redis-backed throttler is a separate ticket.
- **VPC security group rules** for ElastiCache (port 6379 inbound from App Runner SG)

---

## Related documentation

- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — where the Socket.IO server runs; currently `min: 1` instance
- [AWS Lambda]({{ site.baseurl }}/docs/infra/lambda.html) — other event-driven components (not related to WebSocket broadcast)
- [Security Groups]({{ site.baseurl }}/docs/infra/security-groups.html) — VPC rules will need a Valkey ingress rule when the cluster is provisioned
- [Website Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) — where `REDIS_URL` and `REDIS_AUTH_TOKEN` will live in Secrets Manager

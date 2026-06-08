---
layout: default
title: CI/CD Pipeline
parent: Infrastructure
---

# CI/CD Pipeline

The SwasthX backend uses **GitHub Actions** for continuous integration and continuous deployment to AWS. This page documents what's actually wired in the `swasthx_backend_website` repository today.

> **Compute target:** AWS App Runner (not ECS). Per [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html), each App Runner service is configured with **Automatic** deployment from its ECR repository — once a new image is pushed to ECR with the right tag, App Runner auto-pulls and rolls the service forward. The GitHub Actions workflow's job ends at "image pushed to ECR"; App Runner takes it from there.

---

## Workflows in `.github/workflows/`

Two workflow files, both small and focused.

### 1. `ci.yml` — PR + push checks

**Triggers:**
- Pull request to `main` or `development` branches
- Push to `main`
- `workflow_call` (reused by `deploy.yml` so the same checks run before deploy)

**Three parallel jobs** on `ubuntu-latest`, each on Node.js 18 with `npm ci`:

| Job | Command | Blocking? |
| :--- | :--- | :--- |
| `lint` | `npm run lint` | ❌ **Non-blocking** — `continue-on-error: true`, lint failures do NOT block merge |
| `typecheck` | `npx tsc --noEmit -p tsconfig.json` | ✅ Blocking |
| `test` | `npm test -- --passWithNoTests` | ⚠️ Passes if there are no tests (flag set explicitly) |

```yaml
name: CI

on:
  pull_request:
    branches: [ main, development ]
  push:
    branches: [ main ]
  workflow_call:

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    continue-on-error: true   # ← lint failures do not block
    # ... npm ci → npm run lint

  typecheck:
    # ... npm ci → npx tsc --noEmit -p tsconfig.json

  test:
    # ... npm ci → npm test -- --passWithNoTests
```

### 2. `deploy.yml` — Build + push to ECR

**Trigger:** push to `development` branch only (NOT main).

**Order:** runs `ci.yml` first (via `workflow_call`), then the `deploy` job runs only if CI succeeds.

**Steps:**

1. **Checkout** the source
2. **Configure AWS credentials** — uses static access keys from `secrets.AWS_ACCESS_KEY_ID` and `secrets.AWS_SECRET_ACCESS_KEY`
3. **Login to Amazon ECR**
4. **Set up Docker Buildx**
5. **Compute semver tag** — `${packageJson.version}-${shortSha}` (e.g., `1.2.3-abc1234`)
6. **Build Docker image** — tagged with three labels in one build:
   - `<git_sha>` (full commit SHA)
   - `<package.version>-<short_sha>` (semver-style)
   - `latest`
7. **Push all three tags** to ECR

**ECR repository:** `515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_development`
**AWS region:** `ap-south-1`

```yaml
name: Build and Push to ECR

on:
  push:
    branches: [ development ]

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: 515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_development
  CONTAINER_NAME: hmis_development

jobs:
  ci:
    uses: ./.github/workflows/ci.yml

  deploy:
    needs: ci
    # ... checkout → configure-aws-credentials → ecr-login → setup-buildx →
    # ... compute IMAGE_SEMVER → docker build -t :SHA -t :SEMVER -t :latest → docker push x3
```

**What happens after ECR push:** App Runner's automatic deployment picks up the new `:latest` tag and rolls the service. No explicit App Runner deploy step in the workflow.

---

## Dockerfile

Path: `Dockerfile`

Multi-stage build producing a slim production image.

### Stage 1 — Builder

- Base: `node:18-alpine`
- Installs build deps (`python3 make g++` for `node-gyp` compilation)
- `npm ci` for the full dep tree
- Copies source + tsconfigs
- Runs `npm run build` (NestJS compile to `dist/`)
- Removes build deps

### Stage 2 — Production runner

- Base: `node:18-alpine`
- Installs only **production** deps (`npm ci --only=production`)
- Installs **Chromium** + font packages (`chromium nss freetype harfbuzz ca-certificates ttf-freefont font-noto-emoji wqy-zenhei`) for Puppeteer-based PDF rendering
- Sets Puppeteer env vars (`PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`, `CHROME_BIN`, etc.) so Puppeteer uses the system Chromium rather than downloading its own
- Sets `NODE_OPTIONS=--max-old-space-size=4096` (4 GB Node heap)
- Copies built `dist/` from builder
- Copies `.env*` files and `key.json`
- Copies the DocumentDB / RDS CA bundle: `src/certs/global-bundle.pem` → `/app/certs/global-bundle.pem`
- Copies static seed data: `DoctorProfileStaticData` directory
- Sets `DOCDB_CA_FILE=/app/certs/global-bundle.pem` (used by Mongoose TLS connections)
- `EXPOSE 3000`
- `CMD ["node", "dist/main"]`

### Production runtime env vars baked in

```dockerfile
ENV NODE_ENV=production
ENV GOOGLE_CREDENTIALS_SECRET_NAME=GOOGLE_APPLICATION_CREDENTIALS
ENV DOCDB_CA_FILE=/app/certs/global-bundle.pem
```

---

## `apprunner.yaml`

Path: `apprunner.yaml`

Minimal — just tells App Runner the image name and port:

```yaml
version: 1.0
build:
  image: swasthx-backend-service
  dockerfile: Dockerfile
run:
  port: 3000
```

All other App Runner config (scaling, health check, VPC, env vars) lives in the App Runner service configuration in the AWS console — see [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html).

---

## `docker-compose.yml`

Path: `docker-compose.yml`

Local development convenience — runs the production container against the host's MongoDB:

```yaml
services:
  app:
    build: { context: ., dockerfile: Dockerfile }
    container_name: swasthx-backend
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://host.docker.internal:27017/testingdb
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./logs:/app/logs
```

Not used in any CI/CD or production path — purely a `docker compose up` helper for local container testing.

---

## End-to-end flow (as built today)

```
Developer pushes to feature branch
            │
            ▼
Opens PR to main or development
            │
            ▼
   ci.yml fires
   ├── lint        (non-blocking)
   ├── typecheck   (blocking)
   └── test        (blocking; passes if no tests)
            │
            ▼
   PR merged to development
            │
            ▼
   deploy.yml fires
   ├── ci.yml (workflow_call — re-runs all 3 jobs)
   └── deploy job
       ├── AWS credentials (static keys from GitHub Secrets)
       ├── ECR login
       ├── Compute semver = ${package.version}-${shortSha}
       ├── docker build -t :SHA -t :SEMVER -t :latest
       └── docker push x3
            │
            ▼
   ECR receives the new image
            │
            ▼  (App Runner automatic deployment)
   App Runner pulls :latest, rolls the service forward
            │
            ▼
   New container live on App Runner endpoint
```

---

## GitHub Secrets used

| Secret | Used by | Purpose |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | `deploy.yml` step "Configure AWS credentials" | Static IAM access key for ECR push |
| `AWS_SECRET_ACCESS_KEY` | same | Static IAM secret key |

See [Key Management (Website)]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) for the broader secrets flow (App Runner-side env vars are separate — managed in App Runner config + Secrets Manager).

---

## Image tagging convention

Every successful deploy.yml run produces three tags on the same image digest:

| Tag | Format | Use |
| :--- | :--- | :--- |
| `<git_sha>` | full 40-char SHA | Immutable — for forensic / rollback lookups by exact commit |
| `<package.version>-<short_sha>` | e.g. `1.2.3-abc1234` | Human-readable semver+commit, for release notes / changelog cross-reference |
| `latest` | literal `latest` | The tag App Runner's automatic deployment watches |

---

## Branch / environment mapping

| Branch | What fires | Result |
| :--- | :--- | :--- |
| Feature branches | (nothing — workflows don't trigger) | No CI runs on push |
| PR → `main` or `development` | `ci.yml` | Lint + typecheck + test |
| Push to `main` | `ci.yml` | Lint + typecheck + test (no deploy) |
| Push to `development` | `deploy.yml` (CI + build + ECR push) | New image in ECR → App Runner auto-rolls dev service |

> No `staging` or `production` branch workflow exists. Promotion to non-dev environments is currently manual (operator triggers a redeploy of the prod / qa App Runner service against the desired ECR image tag).

---

## What is NOT implemented

Items in the ticket spec that are NOT in this codebase today:

| Ticket AC | Status |
| :--- | :--- |
| Lint failures block PR merge | ❌ `continue-on-error: true` on the lint job |
| Tests block merge when missing | ❌ `--passWithNoTests` flag |
| Staging deploy workflow (manual, 1 approver) | ❌ No `deploy-staging.yml` |
| Production deploy workflow (manual, 2 approvers) | ❌ No `deploy-prod.yml` |
| GitHub Environments with required reviewers | ❌ Not configured |
| OIDC authentication with AWS | ❌ Uses long-lived `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` GitHub Secrets |
| Blue/green deployment | ❌ App Runner uses rolling deploys; native blue/green is not available |
| One-click rollback workflow | ❌ No `workflow_dispatch` rollback in any file |
| Dockerfile non-root user | ❌ Container runs as `root` |
| Dockerfile HEALTHCHECK CMD | ❌ Not present (App Runner has its own external health check on `/api`) |
| Build time < 5 min target | ❓ Not measured / not enforced (Chromium install + Puppeteer setup is heavy) |
| ECS deployment | ❌ Repo uses App Runner; "ECS" in the ticket spec is a terminology mismatch — the actual deploy target is App Runner |
| Separate `swasthx-worker` ECR repo | ❌ Single repo `hmis_development`; no separate worker image |

These are tracked here as gaps; the items can be picked up in follow-up tickets.

---

## Related documentation

- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — the deploy target; automatic deployment from ECR
- [Website Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) — full GitHub Secrets + App Runner env + Secrets Manager flow
- [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — same flow for the PHR repo
- [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — step-by-step for rotating the `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` used by `deploy.yml`
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — the IAM user `s3andsnsAccess` is unrelated to the deploy workflow; the deploy uses a separate (undocumented) access key

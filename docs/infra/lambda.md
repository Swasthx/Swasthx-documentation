---
layout: default
title: AWS Lambda
parent: Infrastructure
---

# AWS Lambda

AWS Lambda is used for event-driven serverless workloads that don't justify their own App Runner service. Currently one function in production.

## Configuration

- **Region**: Asia Pacific (Mumbai) `ap-south-1`
- **Account**: `515966508772`

## Deployed Functions

### 1. SlackABDMdlqNotification

Forwards every message that lands in the diagnostic ABDM publish DLQ to a Slack channel for ops visibility. Acts as the consumer of the DLQ — each invocation reads one message, formats it as a Slack attachment, POSTs to the incoming webhook, and lets SQS delete the message on successful return.

| Parameter | Value |
| :--- | :--- |
| **Function name** | `SlackABDMdlqNotification` |
| **Runtime** | Node.js 20.x |
| **Architecture** | arm64 |
| **Handler** | `index.handler` |
| **Timeout** | 30 seconds |
| **Memory** | 128 MB |
| **Execution role** | `arn:aws:iam::515966508772:role/SlackABDMdlqNotification-role-bxize9no` |

#### Trigger configuration

| Parameter | Value |
| :--- | :--- |
| **Source** | Amazon SQS |
| **Queue** | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish-dlq` |
| **Activate trigger** | Yes |
| **Batch size** | 1 (one Slack message per DLQ message — no batching) |
| **Batch window** | 0 seconds (fire immediately) |
| **Maximum concurrency** | unlimited (DLQ traffic is low-volume) |
| **Report batch item failures** | No (Lambda swallows errors per fail-safe pattern below) |
| **Filter criteria** | none (every DLQ message triggers a Slack notification) |

#### Environment variables

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/T.../B.../...` | The Slack incoming webhook URL (channel-specific). Stored as plain env var; the webhook is the secret — leak = receive notifications, no AWS impact |

#### Execution role permissions

Two managed policies attached to the role:

**1. `AWSLambdaSQSQueueExecutionRole`** (AWS-managed)
- `sqs:ReceiveMessage`
- `sqs:DeleteMessage`
- `sqs:GetQueueAttributes`
- `logs:CreateLogGroup`
- `logs:CreateLogStream`
- `logs:PutLogEvents`
- Resource: `*` (any queue / any log group)

**2. `AWSLambdaBasicExecutionRole-46f59ad0-f80e-4e13-8cbc-1d46635c713d`** (AWS-managed, account-specific)
- `logs:CreateLogGroup` on `arn:aws:logs:ap-south-1:515966508772:*`
- `logs:CreateLogStream` and `logs:PutLogEvents` on `arn:aws:logs:ap-south-1:515966508772:log-group:/aws/lambda/SlackABDMdlqNotification:*`

#### Trust relationship

Trusted entity: `lambda.amazonaws.com` (standard for Lambda execution roles).

#### Handler code

The function reads SQS-event records, extracts the body / metadata, formats a Slack attachment, and posts to the webhook. Errors are caught and logged but never rethrown — this prevents an infinite Lambda-retry loop if Slack is unreachable. The trade-off is silent loss of the Slack notification during a Slack outage (the failure shows up in CloudWatch Logs as `[dlq-to-slack] FAILED`).

```js
import https from 'node:https';
import { URL } from 'node:url';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export const handler = async (event) => {
  if (!SLACK_WEBHOOK_URL) {
    console.error('[dlq-to-slack] SLACK_WEBHOOK_URL env var is not set');
    return { statusCode: 200, body: 'webhook not configured — skipped' };
  }

  for (const record of event.Records ?? []) {
    try {
      await processRecord(record);
    } catch (err) {
      // CRITICAL: swallow so SQS deletes the message.
      console.error(
        '[dlq-to-slack] FAILED to notify Slack for messageId=%s; swallowing to prevent retry loop. error=%s',
        record.messageId ?? '(unknown)',
        err?.stack ?? err,
      );
    }
  }

  return { statusCode: 200, body: 'ok' };
};

async function processRecord(record) {
  const body = record.body ?? '';
  const messageId = record.messageId ?? 'unknown';
  const queueArn = record.eventSourceARN ?? '';
  const queueName = queueArn.split(':').pop() || 'unknown-queue';
  const receiveCount = record.attributes?.ApproximateReceiveCount ?? '?';
  const sentTimestamp = record.attributes?.SentTimestamp;
  const sentIso = sentTimestamp
    ? new Date(Number(sentTimestamp)).toISOString()
    : '(unknown)';

  let prettyBody = body;
  try {
    prettyBody = JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    // not JSON — keep raw
  }
  const SLACK_FIELD_LIMIT = 2800;
  const clipped =
    prettyBody.length > SLACK_FIELD_LIMIT
      ? prettyBody.slice(0, SLACK_FIELD_LIMIT) + '\n... (truncated)'
      : prettyBody;

  const slackPayload = {
    text: `🚨 *DLQ message received in* \`${queueName}\``,
    attachments: [
      {
        color: '#dc2626',
        fields: [
          { title: 'Queue', value: queueName, short: true },
          { title: 'Message ID', value: messageId, short: true },
          { title: 'Receive count', value: String(receiveCount), short: true },
          { title: 'Originally sent', value: sentIso, short: true },
          {
            title: 'Body',
            value: '```' + clipped + '```',
            short: false,
          },
        ],
        footer: 'SQS DLQ → Lambda → Slack',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await postToSlack(slackPayload);
}

function postToSlack(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(SLACK_WEBHOOK_URL);
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname + url.search,
        port: url.port || 443,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(
              new Error(`Slack webhook responded ${res.statusCode}: ${data}`),
            );
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
```

#### Trade-off — message consumption

Lambda being the SQS trigger target means messages are **consumed and deleted** after successful Lambda return. This is a deliberate trade-off:

- ✅ Slack notified within ~5 seconds of message landing in DLQ
- ❌ Message no longer sits in the DLQ for inspection / native AWS redrive — the Slack notification IS the audit trail
- 🛠 Operators can copy-paste the body from Slack if they need to recreate or replay the original payload

If you need to preserve DLQ messages for inspection or use the AWS-native "Start DLQ redrive" flow, temporarily disable the Lambda trigger (Configuration → Triggers → toggle off) before injecting test messages.

#### Fail-safe behavior

The handler's `try/catch` per record means:
- Lambda always returns `200` to SQS
- SQS always deletes the message
- Slack-side failures (webhook 404 / 403 / timeout) are logged but never trigger SQS retry
- No infinite-loop risk if Slack is down for extended outages

Cost of this design: silent loss of Slack notifications during outage windows. The CloudWatch Logs for the function (log group `/aws/lambda/SlackABDMdlqNotification`) carry every failure with the prefix `[dlq-to-slack] FAILED to notify Slack for messageId=...`.

#### Testing the function

**End-to-end (production-equivalent):**
1. AWS Console → SQS → `swasthx-diagnostic-abdm-publish-dlq` → Send and receive messages
2. Send a test JSON body (e.g. `{"test": "smoke test", "ts": "..."}`)
3. Slack receives a formatted alert within ~5 seconds
4. DLQ "Messages available" drops back to 0 (Lambda consumed + deleted)

**Lambda-only (without touching SQS):**
1. Lambda Console → SlackABDMdlqNotification → Test
2. Create new test event from the `sqs` template
3. Customize body field
4. Click Test
5. Slack receives the notification; DLQ untouched

### 2. AppRunnerStateChangeAlerts

Event-driven monitoring + alerting for AWS App Runner services. Captures App Runner service state-change events from EventBridge, extracts the service identity and the previous/current state, formats a Slack alert, and posts to the ops channel. Lets the team react immediately when a production App Runner service stops, fails deployment, or transitions out of the healthy `RUNNING` state.

> Built earlier (Apr–May 2026), not part of the SWX-INFRA-009 SQS pilot. Documented here retroactively.

| Parameter | Value |
| :--- | :--- |
| **Function name** | `AppRunnerStateChangeAlerts` *(update with exact deployed name if different)* |
| **Runtime** | Python 3.x |
| **Architecture** | x86_64 |
| **Handler** | `lambda_function.lambda_handler` |
| **Timeout** | 10 seconds |
| **Memory** | 128 MB |
| **Execution role** | `AppRunnerStateChangeAlerts-role-*` *(update with exact ARN)* |

#### Why this approach (and NOT a CloudWatch alarm)

AWS App Runner does not expose "container crashed" as a simple CloudWatch metric like EC2 CPU utilization. Service lifecycle state changes are published as **EventBridge events** instead. So the correct architecture for this use case is:

```
App Runner Service
       │
       │ state-change event (e.g., RUNNING → OPERATION_IN_PROGRESS,
       │                          RUNNING → CREATE_FAILED,
       │                          RUNNING → PAUSED)
       ▼
Amazon EventBridge
(rule matches source: "aws.apprunner")
       │
       ▼
AWS Lambda  (AppRunnerStateChangeAlerts)
       │
       │  HTTPS POST
       ▼
Slack Webhook → #alerts channel
```

#### Trigger configuration

| Parameter | Value |
| :--- | :--- |
| **Source** | Amazon EventBridge |
| **Rule name** | `AppRunnerStateChangeRule` *(update with exact rule name)* |
| **Event source** | `aws.apprunner` |
| **Event pattern** | See below |

**Event pattern (the EventBridge rule):**

```json
{
  "source": ["aws.apprunner"],
  "detail-type": ["App Runner Service Status Change"]
}
```

A broader pattern that captures everything from App Runner:

```json
{
  "source": ["aws.apprunner"]
}
```

The narrower variant is preferred — keeps the Lambda from firing on every App Runner event (deployments, image pulls, etc.) and focuses only on service status changes.

#### Monitored state transitions

The Lambda treats any state OTHER than `RUNNING` as critical:

| State | Severity | Meaning |
| :--- | :--- | :--- |
| `RUNNING` | INFO | Service is healthy — recovery message after a prior alert |
| `OPERATION_IN_PROGRESS` | CRITICAL | Service is mid-deployment, restart, or scale event |
| `CREATE_FAILED` | CRITICAL | Initial provisioning failed |
| `DELETE_FAILED` | CRITICAL | Service couldn't be cleanly torn down |
| `PAUSED` | CRITICAL | Service was paused (manually or due to billing) |

#### Environment variables

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `SLACK_WEBHOOK_URL` | `https://hooks.slack.com/services/T.../B.../...` | The Slack incoming webhook for the `#alerts` channel |

#### Execution role permissions

The Lambda needs minimal permissions — just the standard CloudWatch Logs basic execution role:

**`AWSLambdaBasicExecutionRole`** (AWS-managed)
- `logs:CreateLogGroup`
- `logs:CreateLogStream`
- `logs:PutLogEvents`

EventBridge invokes the Lambda via a resource-based policy automatically added when the EventBridge rule was created. No outbound AWS API calls needed — the Lambda only makes an outbound HTTPS request to Slack.

#### Trust relationship

Trusted entity: `lambda.amazonaws.com` (standard for Lambda execution roles).

#### Handler code

The handler parses the EventBridge payload, dynamically extracts the App Runner service name (rather than hard-coding it — this enhancement landed during code review so one function can monitor every App Runner service in the account), maps severity, builds the Slack message, posts to the webhook.

```python
import json
import os
import urllib.request

SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL")


def lambda_handler(event, context):
    # Always log the raw event — App Runner event shapes vary by transition
    # type (deployment failure vs runtime crash vs config change), so we
    # keep a CloudWatch Logs trail of every payload for future reference.
    print("EVENT RECEIVED:")
    print(json.dumps(event))

    if not SLACK_WEBHOOK_URL:
        print("SLACK_WEBHOOK_URL not set — skipping notification")
        return {"statusCode": 200, "body": "webhook not configured"}

    detail = event.get("detail", {}) or {}

    # Dynamically extract the App Runner service name. Two sources to try
    # — the detail payload is preferred, falling back to parsing the ARN
    # from the resources array. This was the code-review enhancement: one
    # Lambda monitors every App Runner service in the account.
    service_name = detail.get("serviceName")
    if not service_name:
        resources = event.get("resources", []) or []
        if resources:
            # arn:aws:apprunner:<region>:<account>:service/<serviceName>/<serviceId>
            try:
                service_name = resources[0].split(":service/")[1].split("/")[0]
            except (IndexError, AttributeError):
                service_name = "unknown-service"
        else:
            service_name = "unknown-service"

    previous_status = detail.get("previousStatus", "UNKNOWN")
    current_status = detail.get("currentStatus", "UNKNOWN")
    timestamp = event.get("time", "unknown")
    region = event.get("region", "unknown")

    severity = "INFO" if current_status == "RUNNING" else "CRITICAL"
    emoji = "✅" if severity == "INFO" else "🚨"

    slack_payload = {
        "text": f"{emoji} *App Runner Service Alert — {severity}*",
        "attachments": [
            {
                "color": "#16a34a" if severity == "INFO" else "#dc2626",
                "fields": [
                    {"title": "Service", "value": service_name, "short": True},
                    {"title": "Region", "value": region, "short": True},
                    {"title": "Previous State", "value": previous_status, "short": True},
                    {"title": "Current State", "value": current_status, "short": True},
                    {"title": "Timestamp", "value": timestamp, "short": False},
                ],
                "footer": "App Runner → EventBridge → Lambda → Slack",
            }
        ],
    }

    try:
        req = urllib.request.Request(
            SLACK_WEBHOOK_URL,
            data=json.dumps(slack_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            response.read()
    except Exception as e:
        # Swallow — don't let Slack failure trigger Lambda retries
        print(f"Slack POST failed: {e}")

    return {"statusCode": 200, "body": "ok"}
```

#### Sample Slack notification

When `backend-production` transitions out of `RUNNING`:

```
🚨 App Runner Service Alert — CRITICAL
┌─ red sidebar ───────────────────────────────────────┐
│ Service: backend-production                         │
│ Region: ap-south-1                                  │
│ Previous State: RUNNING                             │
│ Current State: OPERATION_IN_PROGRESS                │
│ Timestamp: 2026-05-11T14:22:01Z                     │
│ App Runner → EventBridge → Lambda → Slack          │
└─────────────────────────────────────────────────────┘
```

When the service returns to `RUNNING`:

```
✅ App Runner Service Alert — INFO
┌─ green sidebar ─────────────────────────────────────┐
│ Service: backend-production                         │
│ Region: ap-south-1                                  │
│ Previous State: OPERATION_IN_PROGRESS               │
│ Current State: RUNNING                              │
│ Timestamp: 2026-05-11T14:24:17Z                     │
│ App Runner → EventBridge → Lambda → Slack          │
└─────────────────────────────────────────────────────┘
```

#### Coverage

This single Lambda + single EventBridge rule covers every App Runner service in the account. No per-service configuration needed. As new App Runner services are deployed (e.g., a future `phr-staging` or `analytics-worker`), they're automatically monitored — their state-change events match the same rule pattern.

Current App Runner services covered:
- `website-production-service`
- `website-qa-service`
- `website-development-service`
- `PHR_production`
- `PHR_QA_DEPLOYMENT`
- `swasthx-backend-service`

See [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) for the full service inventory.

#### Logging

Every invocation prints the raw EventBridge payload via `print("EVENT RECEIVED:") + print(json.dumps(event))`. CloudWatch Logs (log group `/aws/lambda/AppRunnerStateChangeAlerts`) retains these for inspection — useful because App Runner event payloads differ slightly by transition type (deployment failures vs runtime crashes vs config changes).

#### Testing

**End-to-end:** stop / restart any App Runner service from the console → Slack receives a notification within ~10 seconds.

**Lambda-only (without touching real services):**
1. Lambda Console → AppRunnerStateChangeAlerts → Test
2. Create new test event from the EventBridge sample
3. Customize `detail.serviceName`, `detail.previousStatus`, `detail.currentStatus`
4. Click Test → Slack receives the notification

#### Cost

| Component | Monthly cost |
| :--- | :--- |
| Lambda invocations | $0 — App Runner state changes happen <100 times/month in normal operation; well within free tier |
| EventBridge rule | $0 — event publishing from AWS service sources is free |
| CloudWatch Logs | <$0.01/month at this invocation rate |

Total: effectively free.

## Future Lambda functions

This file is the single canonical record of all Lambda functions. As more land in production, add them as new `### N. <FunctionName>` sub-sections under "Deployed Functions" above, following the same template (configuration table → trigger → env vars → IAM → code excerpt → trade-offs).

Lambda candidates discussed but not yet built:
- A function to relay CloudWatch alarms to Slack via SNS topic subscription (deferred — currently the SlackABDMdlqNotification function handles the only alerting case from queues)
- A function to consume the SNS topic `swasthx-ops-alerts` (planned per `docs/RUNBOOK_SQS.md` in the backend repo, not yet provisioned)

## Related documentation

- [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html) — the DLQ this Lambda consumes from
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — the Lambda execution role
- [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — for rotating any future Lambda credentials

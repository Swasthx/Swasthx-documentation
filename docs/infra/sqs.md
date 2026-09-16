---
layout: default
title: Amazon SQS
parent: Infrastructure
---

# Amazon Simple Queue Service (SQS)

Amazon SQS is used for queue-backed retry-aware async work in the SwasthX backend. The first production consumer is the diagnostic ABDM publish pilot (SWX-INFRA-009), which decouples the operator's "submit diagnostic result" action from the downstream NHA ABDM `linkRecord` / `notifyPatient` calls so a slow or failing ABDM gateway never blocks the clinical action.

## Configuration

- **Region**: Asia Pacific (Mumbai) `ap-south-1`
- **Account**: `515966508772`
- **Encryption**: Amazon SQS key (SSE-SQS, AWS-managed)
- **Type**: Standard queues (FIFO not used)

## Queues

### 1. swasthx-diagnostic-abdm-publish (main queue)

The producer queue for the diagnostic ABDM publish flow. The backend's `SqsEnqueueService` (defined at `src/infra/sqs/sqs-enqueue.service.ts` in the repo) enqueues a job here when an operator submits a diagnostic result. The worker process (App Runner with `WORKER_ENABLED=true`) polls and processes the job via `DiagnosticAbdmPublishProcessor`.

| Parameter | Value |
| :--- | :--- |
| **Name** | `swasthx-diagnostic-abdm-publish` |
| **ARN** | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |
| **URL** | `https://sqs.ap-south-1.amazonaws.com/515966508772/swasthx-diagnostic-abdm-publish` |
| **Type** | Standard |
| **Created** | 2026-06-01T16:41+05:30 |
| **Encryption** | Amazon SQS key (SSE-SQS) |
| **Dead-letter queue** | `swasthx-diagnostic-abdm-publish-dlq` (enabled) |
| **Maximum receives** | 10 (before SQS auto-routes to DLQ) |
| **Visibility timeout** | 30 seconds (default) |
| **Message retention** | 4 days (default) |
| **Receive wait time (long poll)** | 20 seconds |

### 2. swasthx-diagnostic-abdm-publish-dlq (dead-letter queue)

Catches messages that have failed processing 10 times on the main queue. Operators can inspect failed payloads, decide whether to redrive (push back to main queue) or delete.

| Parameter | Value |
| :--- | :--- |
| **Name** | `swasthx-diagnostic-abdm-publish-dlq` |
| **ARN** | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish-dlq` |
| **URL** | `https://sqs.ap-south-1.amazonaws.com/515966508772/swasthx-diagnostic-abdm-publish-dlq` |
| **Type** | Standard |
| **Created** | 2026-06-01T16:27+05:30 |
| **Encryption** | Amazon SQS key (SSE-SQS) |
| **Dead-letter queue** | None (DLQs do not have their own DLQ) |
| **Trigger** | AWS Lambda (`SlackABDMdlqNotification` — see [Lambda]({{ site.baseurl }}/docs/infra/lambda.html)) |

### 3. swasthx-critical-queue (high-priority queue)

Dedicated queue for mission-critical, time-sensitive asynchronous background tasks and high-priority operations in the SwasthX backend services.

| Parameter | Value |
| :--- | :--- |
| **Name** | `swasthx-critical-queue` |
| **ARN** | `arn:aws:sqs:ap-south-1:515966508772:swasthx-critical-queue` |
| **URL** | `https://sqs.ap-south-1.amazonaws.com/515966508772/swasthx-critical-queue` |
| **Type** | Standard |
| **Encryption** | Amazon SQS key (SSE-SQS) |
| **Visibility timeout** | 60 seconds |
| **Message retention** | 4 days (345,600 seconds) |

### 4. swasthx-standard-queue (general queue)

General-purpose background job queue for non-critical, standard asynchronous workloads across SwasthX platform modules.

| Parameter | Value |
| :--- | :--- |
| **Name** | `swasthx-standard-queue` |
| **ARN** | `arn:aws:sqs:ap-south-1:515966508772:swasthx-standard-queue` |
| **URL** | `https://sqs.ap-south-1.amazonaws.com/515966508772/swasthx-standard-queue` |
| **Type** | Standard |
| **Encryption** | Amazon SQS key (SSE-SQS) |
| **Visibility timeout** | 60 seconds |
| **Message retention** | 4 days (345,600 seconds) |

## Retry policy (consumer-side)

The `DiagnosticAbdmPublishProcessor` consumer (defined under `src/diagnostic/abdm/` in the repo) implements the per-message retry schedule via SQS's `ChangeMessageVisibility`:

| Attempt | Delay until retry |
| :--- | :--- |
| 1 | (immediate — first poll) |
| 2 | +30 seconds |
| 3 | +2 minutes |
| 4 | +10 minutes |
| 5 | +30 minutes |
| 6 | +1 hour |
| 7–10 | +1 hour each |
| 11+ | (would-be retry → SQS auto-routes to DLQ via `maxReceiveCount: 10`) |

Total time from first failure to DLQ landing: ~5.5 hours under the standard schedule. Acceptable for the BFR-C-02 retry policy.

## Producer flow (SDK calls from the backend)

```
Operator → POST /diagnostic/submitDiagnosticReport
              │
              ▼
       Backend service
              │
              ▼  AWS SDK SendMessage
swasthx-diagnostic-abdm-publish  (main queue)
              │
              ▼  long-poll ReceiveMessage (worker)
DiagnosticAbdmPublishProcessor  (App Runner worker, WORKER_ENABLED=true)
              │
              │  attempts ABDM linkRecord / notifyPatient
              │
              ├──▶ Success → DeleteMessage → done
              │
              └──▶ Failure → ChangeMessageVisibility (per retry schedule)
                         │
                         │ ... 10 failed attempts ...
                         │
                         ▼  (automatic by SQS RedrivePolicy)
swasthx-diagnostic-abdm-publish-dlq  (DLQ)
                         │
                         ▼  event source mapping (batch size 1)
AWS Lambda  (SlackABDMdlqNotification)
                         │
                         ▼  HTTPS POST
Slack incoming webhook  (#ops-alerts channel)
```

## IAM permissions

### App Runner instance role (producer + consumer side)

The backend's App Runner services run as `arn:aws:iam::515966508772:role/AppRunnerInstanceRole`. For the diagnostic ABDM publish pipeline to function, this role needs:

| Action | Resource |
| :--- | :--- |
| `sqs:SendMessage` | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |
| `sqs:ReceiveMessage` | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |
| `sqs:DeleteMessage` | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |
| `sqs:GetQueueAttributes` | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |
| `sqs:ChangeMessageVisibility` | `arn:aws:sqs:ap-south-1:515966508772:swasthx-diagnostic-abdm-publish` |

A customer-managed policy `SwasthxDiagnosticAbdmQueueAccess` covers both the main queue and the DLQ.

### Lambda execution role (DLQ consumer)

The `SlackABDMdlqNotification` Lambda's execution role (`SlackABDMdlqNotification-role-bxize9no`) has:

- `AWSLambdaSQSQueueExecutionRole` (AWS-managed policy) — grants `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes` on `*`
- `AWSLambdaBasicExecutionRole-46f59ad0-f80e-4e13-8cbc-1d46635c713d` — CloudWatch Logs access scoped to the Lambda's log group

## Backend environment flags

The diagnostic ABDM publish pipeline is feature-flagged via two environment variables on App Runner:

| Env var | Value to enable | Purpose |
| :--- | :--- | :--- |
| `WORKER_ENABLED` | `true` | Activates the SQS poll loop in the worker process |
| `DIAGNOSTIC_ABDM_USE_QUEUE` | `true` | Routes diagnostic ABDM publish jobs through SQS instead of the legacy inline call |
| `SQS_DIAGNOSTIC_ABDM_URL` | `https://sqs.ap-south-1.amazonaws.com/515966508772/swasthx-diagnostic-abdm-publish` | The producer's target queue URL |

Both `WORKER_ENABLED` and `DIAGNOSTIC_ABDM_USE_QUEUE` must be `true` for the pipeline to be active. Either set to `false` falls back to the legacy inline ABDM call path.

## Resource access via console

- **Main queue**: AWS Console → SQS → Queues → `swasthx-diagnostic-abdm-publish`
- **DLQ**: AWS Console → SQS → Queues → `swasthx-diagnostic-abdm-publish-dlq`
- **Send test message**: queue page → Send and receive messages → Send message
- **Poll for messages**: queue page → Send and receive messages → Poll for messages
- **Purge queue**: queue page → Purge (60-second cooldown)
- **Start DLQ redrive**: DLQ page → Start DLQ redrive → "Redrive to source queue(s)"

## Operational gotchas

- **At-least-once delivery** — the consumer's `processMessage` MUST be idempotent. Always check current state before acting (e.g., `if (record.status === "PUBLISHED") return;`). SQS will redeliver after a crash, missed deletion, or network blip.
- **DLQ configuration is on the queue, not in code** — `RedrivePolicy` + `maxReceiveCount` are set on AWS via Console / Terraform. The backend code consumes whatever AWS gives it.
- **Manual polling counts as a receive** — using the AWS Console's "Poll for messages" on the main queue increments `ApproximateReceiveCount`. Polling 10 times manually will trigger DLQ routing on the 11th poll, even if the consumer never failed it.
- **DLQ messages are auto-consumed by Lambda** — once the SQS → Lambda event source mapping is wired, messages landing in the DLQ are deleted by Lambda after Slack notification. To preserve DLQ messages for inspection, temporarily disable the trigger before injecting test messages.
- **FIFO queue support exists at the SDK level** (`messageGroupId`, `deduplicationId`) but is not in use — all queues are Standard.

## Related documentation

- [AWS Lambda — SlackABDMdlqNotification]({{ site.baseurl }}/docs/infra/lambda.html) — the DLQ notification Lambda
- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — where the producer + consumer run
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — `AppRunnerInstanceRole` and Lambda execution role detail

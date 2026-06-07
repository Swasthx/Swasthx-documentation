---
layout: default
title: Amazon EventBridge
parent: Infrastructure
---

# Amazon EventBridge

Amazon EventBridge is a serverless event bus that delivers AWS service events to targets (Lambda, SQS, Step Functions, etc.) based on rule patterns. SwasthX uses EventBridge as the bridge between AWS-service lifecycle events and our notification Lambdas.

## Why EventBridge (and not CloudWatch alarms)

For some monitoring use cases, AWS service health is not expressed as a numeric CloudWatch metric. Service lifecycle changes — "the App Runner service just transitioned out of RUNNING" — are published as **events**, not metrics. The event-driven pattern looks like:

```
AWS Service  →  EventBridge (rule match)  →  Target (Lambda / SQS / etc.)
```

This is the right shape for App Runner state-change monitoring, where there is no "container crashed" metric.

## Configuration

- **Region**: Asia Pacific (Mumbai) `ap-south-1`
- **Account**: `515966508772`
- **Event bus**: default (no custom buses today)

## Rules

### 1. AppRunnerStateChangeRule

Captures App Runner service state-change events and routes them to the `AppRunnerStateChangeAlerts` Lambda, which posts a formatted alert to Slack.

| Parameter | Value |
| :--- | :--- |
| **Rule name** | `AppRunnerStateChangeRule` *(update with exact deployed name if different)* |
| **Event bus** | default |
| **Source** | `aws.apprunner` |
| **Status** | Enabled |
| **Target** | AWS Lambda → `AppRunnerStateChangeAlerts` |

**Event pattern:**

```json
{
  "source": ["aws.apprunner"],
  "detail-type": ["App Runner Service Status Change"]
}
```

A broader pattern that captures all App Runner events:

```json
{
  "source": ["aws.apprunner"]
}
```

The narrower variant is preferred so the Lambda only fires on actual status changes (not on every deployment / image-pull / config-change event).

**Sample event payload** (App Runner publishes this to EventBridge on a status change):

```json
{
  "version": "0",
  "id": "abc12345-de67-89f0-1234-56789abcdef0",
  "detail-type": "App Runner Service Status Change",
  "source": "aws.apprunner",
  "account": "515966508772",
  "time": "2026-05-11T14:22:01Z",
  "region": "ap-south-1",
  "resources": [
    "arn:aws:apprunner:ap-south-1:515966508772:service/backend-production/abc123def456"
  ],
  "detail": {
    "serviceName": "backend-production",
    "serviceId": "abc123def456",
    "previousStatus": "RUNNING",
    "currentStatus": "OPERATION_IN_PROGRESS"
  }
}
```

The downstream Lambda extracts `detail.serviceName` (or parses the ARN under `resources[0]` as a fallback) so a single rule + single Lambda covers every App Runner service in the account without per-service configuration.

#### App Runner state values the rule observes

| State | Severity (Lambda-side) |
| :--- | :--- |
| `RUNNING` | INFO — recovery from a prior alert |
| `OPERATION_IN_PROGRESS` | CRITICAL — service is mid-deployment / restart |
| `CREATE_FAILED` | CRITICAL — initial provisioning failed |
| `DELETE_FAILED` | CRITICAL — service couldn't be cleanly torn down |
| `PAUSED` | CRITICAL — service paused (manually or due to billing) |

## Permissions

When you wire a Lambda as an EventBridge target via the console, AWS automatically adds a resource-based policy statement to the Lambda allowing `events.amazonaws.com` to invoke it. No additional IAM setup required.

For the `AppRunnerStateChangeAlerts` Lambda, the relevant inbound policy statement looks like:

```json
{
  "Sid": "AppRunnerStateChangeRule",
  "Effect": "Allow",
  "Principal": { "Service": "events.amazonaws.com" },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:ap-south-1:515966508772:function:AppRunnerStateChangeAlerts",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:events:ap-south-1:515966508772:rule/AppRunnerStateChangeRule"
    }
  }
}
```

This is visible in the Lambda's **Configuration → Permissions → Resource-based policy statements** section.

## Operational notes

- **AWS-source events are free** — EventBridge does not charge for events from `aws.*` sources, only for custom events you publish yourself.
- **No event replay configured today** — if the Lambda is broken and an event is missed, that event is lost (EventBridge does not store events for replay unless you configure an archive).
- **One rule, all services** — the pattern matches every App Runner service in the account. New services are automatically monitored without rule changes.
- **Sample event JSON is logged** — the Lambda prints every received event to CloudWatch Logs (`/aws/lambda/AppRunnerStateChangeAlerts`) for debugging. Useful because App Runner event payloads differ slightly by transition type.

## Future rules

This file is the canonical record of all EventBridge rules. As more land in production (e.g., DocumentDB cluster events, S3 object events, Amplify build status changes), add them as new `### N. <RuleName>` sub-sections under "Rules" above.

Possible future rules:
- DocumentDB cluster health events → Slack alerts
- Amplify build failure / deployment failure events → Slack alerts
- S3 bucket policy / public-access changes → ops audit log
- Lambda function error rate spike events → Slack alerts (if/when other Lambdas land)

## Related documentation

- [AWS Lambda]({{ site.baseurl }}/docs/infra/lambda.html) — the `AppRunnerStateChangeAlerts` Lambda function targeted by the rule
- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — the source of the events captured here
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — Lambda execution role detail

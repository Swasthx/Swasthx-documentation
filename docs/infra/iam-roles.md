---
layout: default
title: IAM Roles
parent: Cloud Documentation
grand_parent: Infrastructure
---

# IAM Roles and User Groups

This page contains documentation for Identity and Access Management (IAM) configurations, including Roles and User Groups.

## User Groups
The following IAM User Groups are defined:

| Group name | Users | Permissions | Creation time |
| :--- | :--- | :--- | :--- |
| `developer` | 7 | Defined | 7 months ago |
| `swasthxAwsFullAccess` | 3 | Defined | 7 months ago |

![IAM User Groups](/Swasthx-documentation/docs/images/iam-user-groups.png)

### `developer` Group
**Users:**
- `ameerk`
- `hasanali`
- `krishnachaitanya`
- `omar-faruk`
- `Priyanshu_Rajput`
- `riazuddin`
- `Suhaas`

![Developer Group Users](/Swasthx-documentation/docs/images/iam-group-developer-users.png)

**Permissions:**
- `AmazonBedrockFullAccess`
- `AmazonEC2FullAccess`
- `AmazonRoute53FullAccess`
- `AmazonS3FullAccess`
- `AmazonSNSFullAccess`
- `AmplifyBackendDeployFullAccess`

![Developer Group Permissions](/Swasthx-documentation/docs/images/iam-group-developer-permissions.png)

### `swasthxAwsFullAccess` Group
**Users:**
- `aarogyaIDAdminAccess`
- `gautamAccessForRoutec2`
- `Suhaas`

![SwasthxAwsFullAccess Group Users](/Swasthx-documentation/docs/images/iam-group-swasthx-users.png)

**Permissions:**
- `AdministratorAccess`


![SwasthxAwsFullAccess Group Permissions](/Swasthx-documentation/docs/images/iam-group-swasthx-permissions.png)

## Programmatic Access Users
Specific IAM users are configured for programmatic access to AWS services.

### `s3andsnsAccess`
This user is configured with access keys to perform specific actions programmatically, primarily sending SMS via SNS and accessing S3 buckets.

**User Details:**
- **User name:** `s3andsnsAccess`
- **Access key ID:** `Active - AKIAXQIQAD3...`
- **Active key age:** ~252 days

![IAM User List - s3andsnsAccess](/Swasthx-documentation/docs/images/iam-user-s3sns-list.png)

**Permissions:**
- `AmazonBedrockFullAccess`
- `AmazonS3FullAccess`
- `AmazonSNSFullAccess`

![IAM User s3andsnsAccess Details](/Swasthx-documentation/docs/images/iam-user-s3sns-details.png)

## Service-linked Roles

These roles are assumed by AWS services (Lambda, App Runner, etc.) — not by human users. Each is tied to a specific compute target.

### `AppRunnerInstanceRole`

The instance role assumed by every App Runner service at runtime. Used by the backend container to call AWS APIs from inside the App Runner managed environment.

- **ARN**: `arn:aws:iam::515966508772:role/AppRunnerInstanceRole`
- **Used by**: All 6 App Runner services (see [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html))
- **Permissions** (relevant to deployed features):
  - **S3** — uploads/downloads to `swasthx-bucket`
  - **SNS** — publish to `sendSmsToPatient` topic
  - **SQS** — `SendMessage` / `ReceiveMessage` / `DeleteMessage` / `GetQueueAttributes` / `ChangeMessageVisibility` on `swasthx-diagnostic-abdm-publish` + `swasthx-diagnostic-abdm-publish-dlq` (for the diagnostic ABDM publish pipeline; see [SQS]({{ site.baseurl }}/docs/infra/sqs.html))
  - **Secrets Manager** — read access to env-config secrets
  - **CloudWatch Logs** — write app logs

### `AppRunnerECRAccessRole`

Allows App Runner to pull container images from Amazon ECR during deployment.

- **ARN**: `arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole`
- **Used by**: All App Runner services (image source: `515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_production:latest`)
- **Permissions**: ECR pull (managed by AWS)

### `SlackABDMdlqNotification-role-bxize9no`

Execution role for the [`SlackABDMdlqNotification` Lambda]({{ site.baseurl }}/docs/infra/lambda.html#1-slackabdmdlqnotification) — consumes the diagnostic ABDM publish DLQ and posts Slack notifications.

- **Trusted entity**: `lambda.amazonaws.com`
- **Attached managed policies**:
  - `AWSLambdaSQSQueueExecutionRole` (AWS-managed) — `sqs:ReceiveMessage` / `sqs:DeleteMessage` / `sqs:GetQueueAttributes` on `*`
  - `AWSLambdaBasicExecutionRole-46f59ad0-f80e-4e13-8cbc-1d46635c713d` (account-specific) — CloudWatch Logs scoped to `/aws/lambda/SlackABDMdlqNotification`

### `AppRunnerStateChangeAlerts-role-*` *(update with exact role name)*

Execution role for the [`AppRunnerStateChangeAlerts` Lambda]({{ site.baseurl }}/docs/infra/lambda.html#2-apprunnerstatechangealerts) — consumes App Runner state-change events from EventBridge and posts Slack notifications.

- **Trusted entity**: `lambda.amazonaws.com`
- **Attached managed policies**:
  - `AWSLambdaBasicExecutionRole` (AWS-managed) — CloudWatch Logs only; no outbound AWS API calls needed (the Lambda only POSTs to a Slack webhook over HTTPS)

### `SNSDeliveryLoggingRole`

Used by SNS for delivery status logging (success / failure of SMS sends).

- **ARN**: `arn:aws:iam::515966508772:role/SNSDeliveryLoggingRole`
- **Used by**: The `sendSmsToPatient` SNS topic (see [SNS]({{ site.baseurl }}/docs/infra/sns.html))

## Related documentation

- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — services that assume `AppRunnerInstanceRole`
- [AWS Lambda]({{ site.baseurl }}/docs/infra/lambda.html) — functions using execution roles above
- [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html) — queues `AppRunnerInstanceRole` accesses
- [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — rotating the `s3andsnsAccess` user's access keys

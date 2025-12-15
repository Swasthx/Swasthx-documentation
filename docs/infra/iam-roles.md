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




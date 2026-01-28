---
layout: default
title: Update AWS Keys
parent: Key Management
grand_parent: Infrastructure
---

# Update AWS Keys

We are using aws services like s3 bucket, sns etc whic requires aws access keys while accessing them using from code. It may happen that the current access keys are not working or may have expired - in this case we will have to get new access keys.

## Steps to generate new access keys

1. Login to aws with role having the access to [IAM roles page](/Swasthx-documentation/docs/infra/iam-roles.html) fully.

    ![IAM Dashboard](/Swasthx-documentation/docs/images/aws-iam-dashboard.png)

2. Go to **IAM roles -> Users**.

    ![IAM Users](/Swasthx-documentation/docs/images/aws-iam-users.png)

3. Click on the role and you will see the option to create access key on top right.

    ![Create Access Key Option](/Swasthx-documentation/docs/images/aws-create-access-key-option.png)

4. Click on **Create access key** and it will ask you basic information. At last you will get the access keys which you save as csv file also.

    ![Create Access Key Flow](/Swasthx-documentation/docs/images/aws-create-access-key-flow.png)

5. The new acccess keys are now ready to be used in code.

> [!NOTE]
> Make sure once you update the keys in github actions/app runner config, the app runner service needs to be redeployed to load the updated values into the environment.
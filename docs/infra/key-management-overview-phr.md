---
layout: default
title: PHR Key Management Overview
parent: Key Management
grand_parent: Infrastructure
---

# Key Management

There are various keys which we are using at code/architecture level. For code we are maintain a .env file where all the required keys are defined consiting of google keys, aws access keys, firebase keys etc. At infrastructure level - as we are using app runner to run the deployed code, so some keys are defined in aws app runner's configuration and some are defined in aws secret manager. Also while deploying the code using github actions, there also we are using some keys which are defined in settings of github:

## GitHub Keys

![GitHub Workflow Part 1](/Swasthx-documentation/docs/images/github_workflow_p1.png)
![GitHub Workflow Part 2](/Swasthx-documentation/docs/images/github_workflow_p2.png)

This file uses some secrets which are defined in **Settings -> Secrets and variables -> Actions**.

![Repository Secrets](/Swasthx-documentation/docs/images/github-secrets.png)

For deployment using GitHub Actions, the required keys/secrets are picked from GitHub Actions secrets.

> [!NOTE]
> We cannot see the existing value of a secret/key. However, if you want to update any key, you can do that (includes password/code verification).

If a developer encounters any error related to secrets while deploying the code, they can check the action secrets and update them if required.

## AWS Keys

After deployment, the PHR runs in App Runner. While running, all the keys or secrets required by APIs are picked from the App Runner configuration and some from AWS Secret Manager. So when the server starts, the env keys or secrets are loaded into the environment which can then be used by code at runtime.

![PHR App Runner Configuration](/Swasthx-documentation/docs/images/phr_app_runner_config.png)

For PHR, we also have a separate secret manager.

![PHR Secret Managers List](/Swasthx-documentation/docs/images/phr_secret_managers_list.png)

It contains the 1mg and firebase details.

![PHR Secret Manager Details](/Swasthx-documentation/docs/images/phr_secret_manager_details.png)

> [!NOTE]
> If we update any key or secret, the App Runner service needs to be redeployed to load the updated values into the environment.

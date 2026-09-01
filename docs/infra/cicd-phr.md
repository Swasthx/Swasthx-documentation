---
layout: default
title: CI/CD Pipeline (PHR)
parent: Infrastructure
---

# CI/CD Pipeline — PHR Backend

The PHR backend (`swasthx_Backend`) deploys to **AWS App Runner** via **GitHub Actions**. This page documents what is actually wired in the repository today.

**Four branches deploy:** `development`, `QA`, `preprod`, and `production`. Unlike the website repo — where each branch carries its own edited copy of one workflow — PHR keeps **five workflow files, and every branch carries all five**. Which one fires is decided purely by each file's own `on.push.branches` filter.

> ### ⚠️ `deploy.yml` is two different workflows sharing one filename
>
> The copy of `.github/workflows/deploy.yml` on `development` triggers on `development` and deploys the dev service. The copy on `production` is a **completely different pipeline** — different name, different ECR repo, different env handling — that triggers on `production`.
>
> They are the same path, so a diff between the branches looks like an ordinary file change, but they are not versions of one pipeline. `development` and `QA` both carry the *dev* variant; only `production` carries the *prod* variant. **Merging `QA` → `production` will overwrite the production pipeline with the dev one** unless `deploy.yml` is excluded from the merge.

> **No CI exists in this repo.** There is no lint, typecheck, or test workflow on any branch. The only pre-merge gates are the two branch-policy checks documented below, and neither one runs the code.

---

## Branch → environment map

| Branch | Workflow that fires | ECR repository | App Runner service | Image tag |
| :--- | :--- | :--- | :--- | :--- |
| `development` | `deploy.yml` *(dev variant)* | `swasthx-backend` | from `secrets.APP_RUNNER_SERVICE_ARN_LATEST` | `<git_sha>` |
| `QA` | `deploy_qa.yml` | `phr_qa` | `PHR_QA_DEPLOYMENT` | `build-<run_number>-<sha[0:8]>` |
| `preprod` | `deploy_preprod.yml` | `swasthx-backend-preprod` | `swasthx-backend-service-preprod` | `build-<run_number>-<sha[0:8]>` |
| `production` | `deploy.yml` *(prod variant)* | `phr_production` | `PHR_production` | `<git_sha>` |
| `main` | *(none)* | — | — | — |

> **`main` is dormant** — last commit **2024-09-02** ("Create README.md"), no `.github/workflows/` directory at all.
>
> **`preprod` is stale** — last commit **2025-07-28**. It also does not carry `deploy_qa.yml`, since that file was added after `preprod` last took a merge.

**AWS region for all four:** `ap-south-1` · **AWS account:** `515966508772`

All four deploy workflows set `AutoDeploymentsEnabled: false` and call `aws apprunner update-service` explicitly — none of them rely on App Runner's ECR auto-deploy.

### Which files are on which branch

`development`, `QA`, and `production` each carry all five files. Every file is byte-identical across the three branches **except `deploy.yml`**.

| File | `development` | `QA` | `production` | `preprod` |
| :--- | :---: | :---: | :---: | :---: |
| `deploy.yml` | dev variant | dev variant | **prod variant** | dev variant |
| `deploy_qa.yml` | ✅ | ✅ | ✅ | ❌ |
| `deploy_preprod.yml` | ✅ | ✅ | ✅ | ✅ |
| `name_enforce_feature_branch_naming.yml` | ✅ | ✅ | ✅ | ✅ |
| `restrict-staging-merges.yml` | ✅ | ✅ | ✅ | ✅ |
| `Dockerfile` | ✅ identical on all branches | | | |

Carrying `deploy_qa.yml` on `production` is harmless — its trigger is `push` to `QA`, so it never fires there. The same is true of every non-matching file.

---

## `development` — `.github/workflows/deploy.yml` (dev variant)

Push to `development` → `.env` written from a secret and baked into the image → build → push `:<sha>` → `update-service` → poll for `RUNNING`.

The service ARN comes from `secrets.APP_RUNNER_SERVICE_ARN_LATEST`, and the ECR access role is hardcoded in the inline JSON.

{% raw %}
```yaml
name: Build and Deploy Swasthx API to AWS App Runner

on:
  push:
    branches:
      - development

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: swasthx-backend
  IMAGE_TAG: ${{ github.sha }}

jobs:
  deploy:
    name: Deploy swasthx-backend to AWS App Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout to repo
        uses: actions/checkout@v4

      - name: Create .env file from secret
        run: |
          echo "${{ secrets.ENV_FILE_NEW }}" > .env

      - name: Set AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push Docker image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }} .
          docker push $ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}

      - name: Deploy to AWS App Runner (explicit config)
        run: |
          aws apprunner update-service \
            --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN_LATEST }} \
            --source-configuration "{
              \"ImageRepository\": {
                \"ImageIdentifier\": \"${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}\",
                \"ImageRepositoryType\": \"ECR\",
                \"ImageConfiguration\": {
                  \"Port\": \"3000\"
                }
              },
              \"AutoDeploymentsEnabled\": false,
              \"AuthenticationConfiguration\": {
                \"AccessRoleArn\": \"arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole\"
              }
            }"

      - name: Wait for App Runner update to complete
        run: |
          echo "Waiting for App Runner to finish deployment..."
          attempt=0
          until [[ "$status" == "RUNNING" || $attempt -ge 20 ]]; do
            sleep 15
            status=$(aws apprunner describe-service \
              --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN_LATEST }} \
              --query "Service.Status" --output text)
            echo "Attempt $((++attempt)): Status = $status"
          done

          if [[ "$status" != "RUNNING" ]]; then
            echo "Deployment did not complete successfully within expected time." >&2
            exit 1
          fi

          echo "App Runner service is now RUNNING."
```
{% endraw %}

> **This workflow wipes the service's runtime environment on every deploy.** `ImageConfiguration` is sent containing only `Port`, and `update-service` replaces the whole block — so `RuntimeEnvironmentVariables` set on the service is dropped. The dev service survives on the `.env` file baked into the image by the Dockerfile's `COPY . .`. The production workflow's own comments call this out as the bug it was written to fix; dev has not been migrated.

---

## `QA` — `.github/workflows/deploy_qa.yml`

Push to `QA` → build → push a `build-<run_number>-<sha[0:8]>` tag → `update-service` → poll for `RUNNING`.

The service ARN and ECR access role are hardcoded in `env:`. The source configuration is assembled with `jq -n` rather than string-interpolated JSON.

{% raw %}
```yaml
name: Build and Deploy Swasthx API to AWS App Runner QA

on:
  push:
    branches:
      - QA

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: phr_qa
  APP_RUNNER_SERVICE_ARN: arn:aws:apprunner:ap-south-1:515966508772:service/PHR_QA_DEPLOYMENT/75ecdb72df284f07abee5f8ef6224420
  ACCESS_ROLE_ARN: arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole

jobs:
  deploy:
    name: Deploy swasthx-backend-qa to AWS App Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Create .env file from secret
        run: echo "${{ secrets.ENV_FILE_NEW }}" > .env

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Set dynamic image tag
        run: echo "IMAGE_TAG=build-${{ github.run_number }}-$(echo ${{ github.sha }} | cut -c1-8)" >> $GITHUB_ENV

      - name: Build, tag, and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          IMAGE_URI="$ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}"
          echo "Building and pushing image: $IMAGE_URI"
          docker build -t $IMAGE_URI .
          docker push $IMAGE_URI

      - name: Deploy to AWS App Runner
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          IMAGE_URI="$ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}"
          echo "Deploying image: $IMAGE_URI"

          aws apprunner update-service \
            --service-arn "${{ env.APP_RUNNER_SERVICE_ARN }}" \
            --source-configuration "$(jq -n \
              --arg img "$IMAGE_URI" \
              --arg role "${{ env.ACCESS_ROLE_ARN }}" \
              '{
                ImageRepository: {
                  ImageIdentifier: $img,
                  ImageRepositoryType: "ECR"
                },
                AutoDeploymentsEnabled: false,
                AuthenticationConfiguration: {
                  AccessRoleArn: $role
                }
              }')"

      - name: Confirm App Runner deployment status
        run: |
          echo "Waiting for App Runner deployment to complete..."
          attempt=0
          status=""
          until [[ "$status" == "RUNNING" || $attempt -ge 20 ]]; do
            sleep 15
            status=$(aws apprunner describe-service \
              --service-arn "${{ env.APP_RUNNER_SERVICE_ARN }}" \
              --query "Service.Status" --output text)
            echo "Attempt $((++attempt)): Status = $status"
          done

          if [[ "$status" != "RUNNING" ]]; then
            echo "Deployment did not complete successfully. Final status: $status" >&2
            exit 1
          fi

          echo "App Runner QA service is now RUNNING."
```
{% endraw %}

> **QA omits `ImageConfiguration` entirely.** Since `update-service` replaces the `ImageRepository` block wholesale, this drops both `RuntimeEnvironmentVariables` **and** the explicit `Port` on every deploy. Like dev, QA runs on the `.env` baked into the image.
>
> **QA also has no idle-wait.** `preprod` and `production` both poll `Service.Status` before calling `update-service`; QA calls it immediately, so a deploy that lands while an earlier operation is still settling fails with `OPERATION_IN_PROGRESS`.

---

## `preprod` — `.github/workflows/deploy_preprod.yml`

Push to `preprod` → build → push → **wait for the service to be idle** → `update-service` → poll for `RUNNING`.

This is the only non-production workflow that waits for the service to settle before updating it.

{% raw %}
```yaml
name: Build and Deploy Swasthx API to AWS App Runner PreProd

on:
  push:
    branches:
      - preprod

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: swasthx-backend-preprod
  APP_RUNNER_SERVICE_ARN: arn:aws:apprunner:ap-south-1:515966508772:service/swasthx-backend-service-preprod/0f131c597af04c1da1ddd0739a8c75ef
  ACCESS_ROLE_ARN: arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole

jobs:
  deploy:
    name: Deploy swasthx-backend-preprod to AWS App Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name:  Create .env file from secret
        run: echo "${{ secrets.ENV_FILE_NEW }}" > .env

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Set dynamic image tag
        run: echo "IMAGE_TAG=build-${{ github.run_number }}-$(echo ${{ github.sha }} | cut -c1-8)" >> $GITHUB_ENV

      - name: 🛠️ Build, tag, and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          IMAGE_URI="$ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}"
          echo "Building and pushing image: $IMAGE_URI"
          docker build -t $IMAGE_URI .
          docker push $IMAGE_URI

      - name: Wait for App Runner to be idle
        run: |
          echo "Checking if App Runner is ready for update..."
          attempt=0
          max_attempts=20
          while [[ $attempt -lt $max_attempts ]]; do
            status=$(aws apprunner describe-service \
              --service-arn "${{ env.APP_RUNNER_SERVICE_ARN }}" \
              --query "Service.Status" --output text)

            echo "Status check $((++attempt)): $status"

            if [[ "$status" == "RUNNING" || "$status" == "PAUSED" ]]; then
              break
            fi

            echo "Service busy ($status), retrying in 15s..."
            sleep 15
          done

          if [[ "$status" != "RUNNING" && "$status" != "PAUSED" ]]; then
            echo "Timed out waiting for App Runner to be idle. Current status: $status"
            exit 1
          fi

      - name: Deploy to AWS App Runner
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          IMAGE_URI="$ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}"
          echo "Deploying image: $IMAGE_URI"

          aws apprunner update-service \
            --service-arn "${{ env.APP_RUNNER_SERVICE_ARN }}" \
            --source-configuration "$(jq -n \
              --arg img "$IMAGE_URI" \
              --arg port "3000" \
              --arg role "${{ env.ACCESS_ROLE_ARN }}" \
              '{
                ImageRepository: {
                  ImageIdentifier: $img,
                  ImageRepositoryType: "ECR",
                  ImageConfiguration: { Port: $port }
                },
                AutoDeploymentsEnabled: false,
                AuthenticationConfiguration: {
                  AccessRoleArn: $role
                }
              }')"

      - name: Confirm App Runner deployment status
        run: |
          echo "Waiting for App Runner deployment to complete..."
          attempt=0
          status=""
          until [[ "$status" == "RUNNING" || $attempt -ge 20 ]]; do
            sleep 15
            status=$(aws apprunner describe-service \
              --service-arn "${{ env.APP_RUNNER_SERVICE_ARN }}" \
              --query "Service.Status" --output text)
            echo "Attempt $((++attempt)): Status = $status"
          done

          if [[ "$status" != "RUNNING" ]]; then
            echo "Deployment did not complete successfully. Final status: $status" >&2
            exit 1
          fi

          echo "App Runner service is now RUNNING."
```
{% endraw %}

> The idle-wait accepts `PAUSED` as "ready", then calls `update-service` against a paused service. It also carries the same `ImageConfiguration`-only-`Port` env wipe as dev.

---

## `production` — `.github/workflows/deploy.yml` (prod variant)

Push to `production`, or a manual **Run workflow** (`workflow_dispatch`) → build → push `:<sha>` → wait for idle → read the live service config, swap the image, and write the **full runtime environment** from `PHR_PROD_APP_RUNNER_ENV_JSON` → poll the specific operation ID to completion.

This is the only PHR workflow that manages runtime environment as code, and the only one with a `concurrency` group (`phr-prod-apprunner-deploy`, `cancel-in-progress: false`, so production deploys queue rather than cancel each other).

{% raw %}
```yaml
name: Build and Deploy Swasthx PHR API to AWS App Runner

on:
  push:
    branches:
      - production
  workflow_dispatch:

concurrency:
  group: phr-prod-apprunner-deploy
  cancel-in-progress: false

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: phr_production
  APP_RUNNER_SERVICE_ARN: arn:aws:apprunner:ap-south-1:515966508772:service/PHR_production/67fab8abe1304c25936b4b9a1716c544
  APP_PORT: "3000"

jobs:
  deploy:
    name: Deploy PHR to AWS App Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout to repo
        uses: actions/checkout@v4

      # Dockerfile's `COPY . .` bakes this into the image. It stays only as a
      # fallback: Nest's ConfigModule lets real environment variables win over a
      # .env file, and PHR_PROD_APP_RUNNER_ENV_JSON below supplies every key.
      - name: Create .env file from secret
        run: |
          echo "${{ secrets.ENV_FILE_NEW }}" > .env

      - name: Set AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" .
          docker push "$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

      # An operation still settling parks the service in OPERATION_IN_PROGRESS,
      # and update-service is rejected outright in that state.
      - name: Wait for App Runner service to be idle
        run: |
          for attempt in {1..30}; do
            STATUS="$(aws apprunner describe-service \
              --service-arn "$APP_RUNNER_SERVICE_ARN" \
              --query 'Service.Status' --output text)"
            echo "Service status: $STATUS"
            [ "$STATUS" = "RUNNING" ] && exit 0
            if [ "$STATUS" = "PAUSED" ]; then
              echo "Service is PAUSED. Resume it in the App Runner console first."
              exit 1
            fi
            if [ "$STATUS" = "CREATE_FAILED" ] || [ "$STATUS" = "DELETED" ]; then
              echo "Service is $STATUS and cannot be deployed to."
              exit 1
            fi
            sleep 20
          done
          echo "Service was still busy after 10 minutes."
          exit 1

      # The previous version sent ImageConfiguration containing only Port, which
      # drops RuntimeEnvironmentVariables on every deploy. This reads the live
      # configuration, swaps the image, and writes the full env from the secret,
      # so the secret -- not the console -- is the source of truth.
      - name: Build App Runner update config
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
          PHR_PROD_APP_RUNNER_ENV_JSON: ${{ secrets.PHR_PROD_APP_RUNNER_ENV_JSON }}
        run: |
          if [ -z "$PHR_PROD_APP_RUNNER_ENV_JSON" ]; then
            echo "Missing GitHub secret PHR_PROD_APP_RUNNER_ENV_JSON."
            exit 1
          fi

          aws apprunner describe-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" > service.json

          umask 077
          printf '%s' "$PHR_PROD_APP_RUNNER_ENV_JSON" > phr-runtime-env.json

          IMAGE_URI="$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" node <<'NODE'
          const fs = require('fs');

          const service = JSON.parse(fs.readFileSync('service.json', 'utf8')).Service;
          const source = service && service.SourceConfiguration;
          if (!source || !source.ImageRepository) {
            throw new Error('The App Runner service must be configured from an image repository.');
          }

          const raw = fs.readFileSync('phr-runtime-env.json', 'utf8').trim();
          if (!raw) throw new Error('phr-runtime-env.json is empty.');

          let parsed;
          try { parsed = JSON.parse(raw); }
          catch (e) { throw new Error(`phr-runtime-env.json is not valid JSON: ${e.message}`); }

          const runtimeEnv =
            parsed.RuntimeEnvironmentVariables || parsed.EnvironmentVariables ||
            parsed.variables || parsed;

          const runtimeVariables = Object.fromEntries(
            Object.entries(runtimeEnv).map(([k, v]) => {
              if (!k || typeof k !== 'string') throw new Error('Invalid environment key.');
              if (v !== null && typeof v === 'object') {
                throw new Error(`${k} must be a string-compatible value.`);
              }
              return [k, v === null || v === undefined ? '' : String(v)];
            }),
          );

          if (Object.prototype.hasOwnProperty.call(runtimeVariables, 'PORT')) {
            throw new Error('Remove PORT from the secret. App Runner reserves it; use ImageConfiguration.Port.');
          }

          // App Runner requires every value to match `.*`, which does not match
          // newlines, and caps values at 51200 characters. Validate here rather
          // than letting the CLI echo the whole rejected map into the build log:
          // GitHub's secret masking is line-based, so a multi-line value would
          // leak in plaintext. These errors name the offending key only.
          for (const [key, value] of Object.entries(runtimeVariables)) {
            if (/[\r\n]/.test(value)) {
              throw new Error(`${key} contains a newline; App Runner env values must be single-line.`);
            }
            if (value.length > 51200) {
              throw new Error(`${key} is ${value.length} characters; App Runner allows at most 51200.`);
            }
          }

          source.AutoDeploymentsEnabled = false;
          source.ImageRepository.ImageIdentifier = process.env.IMAGE_URI;
          source.ImageRepository.ImageRepositoryType =
            source.ImageRepository.ImageRepositoryType || 'ECR';
          source.ImageRepository.ImageConfiguration =
            source.ImageRepository.ImageConfiguration || {};
          source.ImageRepository.ImageConfiguration.Port =
            process.env.APP_PORT ||
            source.ImageRepository.ImageConfiguration.Port || '3000';
          source.ImageRepository.ImageConfiguration.RuntimeEnvironmentVariables = runtimeVariables;

          fs.writeFileSync('source-configuration.json', JSON.stringify(source));
          console.log(`Prepared App Runner config for ${process.env.IMAGE_URI}.`);
          console.log(`Runtime variable count: ${Object.keys(runtimeVariables).length}`);
          NODE

      - name: Update App Runner service
        id: update-apprunner
        run: |
          OPERATION_ID="$(aws apprunner update-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" \
            --source-configuration file://source-configuration.json \
            --query 'OperationId' --output text)"
          echo "operation_id=$OPERATION_ID" >> "$GITHUB_OUTPUT"
          echo "Started App Runner operation $OPERATION_ID"

      - name: Wait for App Runner deployment
        env:
          OPERATION_ID: ${{ steps.update-apprunner.outputs.operation_id }}
        run: |
          for attempt in {1..90}; do
            STATUS="$(aws apprunner list-operations \
              --service-arn "$APP_RUNNER_SERVICE_ARN" \
              --max-results 20 \
              --query "OperationSummaryList[?Id=='$OPERATION_ID'].Status | [0]" \
              --output text)"
            echo "App Runner operation status: $STATUS"

            if [ "$STATUS" = "SUCCEEDED" ]; then
              SERVICE_URL="$(aws apprunner describe-service \
                --service-arn "$APP_RUNNER_SERVICE_ARN" \
                --query 'Service.ServiceUrl' --output text)"
              echo "PHR production deployed successfully: https://$SERVICE_URL"
              exit 0
            fi

            if [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "ROLLBACK_FAILED" ] || [ "$STATUS" = "ROLLBACK_SUCCEEDED" ]; then
              echo "App Runner deployment did not succeed."
              aws apprunner list-operations \
                --service-arn "$APP_RUNNER_SERVICE_ARN" --max-results 5 \
                --query 'OperationSummaryList[].{Id:Id,Type:Type,Status:Status,UpdatedAt:UpdatedAt}' \
                --output table
              exit 1
            fi
            sleep 20
          done
          echo "Timed out waiting for App Runner operation $OPERATION_ID."
          exit 1

      - name: Clean generated deployment files
        if: always()
        run: |
          rm -f phr-runtime-env.json service.json source-configuration.json
```
{% endraw %}

### The `PHR_PROD_APP_RUNNER_ENV_JSON` contract

- **It is the complete production environment, not a patch.** `RuntimeEnvironmentVariables` is written wholesale, so anything set by hand in the App Runner console is dropped on the next deploy. **The secret, not the console, is the source of truth.**
- **`PORT` must not be present.** App Runner reserves it; the workflow fails fast. The port comes from `APP_PORT` → `ImageConfiguration.Port`.
- **No newlines in any value**, and each value is capped at **51,200 characters**. Both are validated *before* the AWS call on purpose: if the CLI rejects the map it echoes the whole thing into the build log, and GitHub's secret masking is line-based — so a multi-line value would leak in plaintext. The pre-flight errors name only the offending key, never its value.
- Accepted top-level shapes: `{"RuntimeEnvironmentVariables": {...}}`, `{"EnvironmentVariables": {...}}`, `{"variables": {...}}`, or a bare flat object.
- The `.env` from `ENV_FILE_NEW` is still written and baked in, but only as a fallback — NestJS's `ConfigModule` lets real environment variables win over a `.env` file.

Generated `phr-runtime-env.json`, `service.json`, and `source-configuration.json` are removed in an `if: always()` cleanup step.

---

## Branch-policy workflows

Both run on pull requests and are identical on every branch. Neither builds, lints, or tests anything — they only check branch names.

### `name_enforce_feature_branch_naming.yml`

PR head branches must match `^feature/[a-z0-9-]+$` (kebab-case). `preprod` and `development` are exempt.

{% raw %}
```yaml
name: Enforce Feature Branch Naming

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  check-branch-name:
    runs-on: ubuntu-latest
    steps:
      - name: Skip for exempt branches
        run: |
          BRANCH_NAME="${{ github.head_ref }}"
          echo "Checking branch: $BRANCH_NAME"

          # List of exempt branches
          if [[ "$BRANCH_NAME" == "preprod" || "$BRANCH_NAME" == "development" ]]; then
            echo "Skipping naming check for exempt branch: $BRANCH_NAME"
            exit 0
          fi

          # Enforce naming pattern for feature branches
          if [[ ! "$BRANCH_NAME" =~ ^feature\/[a-z0-9\-]+$ ]]; then
            echo "Invalid branch name: $BRANCH_NAME"
            echo "Expected format: feature/{short-description} (kebab-case)"
            exit 1
          fi
```
{% endraw %}

> The pattern allows exactly one path segment, so `feature/sachin/patient-directory` fails. `fix/…`, `bugfix/…`, `refactor/…`, and `docs/…` all fail too — every PR into `QA` or `production` from anything other than a single-segment `feature/…` branch is blocked by this check.

### `restrict-staging-merges.yml`

Enforces the promotion path: `development → QA → production`.

{% raw %}
```yaml
name: Enforce Allowed Branch Merge Paths

on:
  pull_request:
    branches:
      - development
      - QA
      - production

jobs:
  restrict-merge-origin:
    runs-on: ubuntu-latest
    steps:
      - name: Check allowed source branch
        run: |
          echo "Base branch (target): ${{ github.base_ref }}"
          echo "Head branch (source): ${{ github.head_ref }}"

          allowed=false

          # Allow only QA -> production
          if [[ "${{ github.base_ref }}" == "production" && "${{ github.head_ref }}" == "QA" ]]; then
            allowed=true
          fi

          # Allow only development -> QA
          if [[ "${{ github.base_ref }}" == "QA" && "${{ github.head_ref }}" == "development" ]]; then
            allowed=true
          fi

          # (Optional) allow anything into development:
          if [[ "${{ github.base_ref }}" == "development" ]]; then
            allowed=true
          fi

          if [[ "$allowed" != true ]]; then
            echo "::error::Invalid branch combination."
            echo "Allowed paths:"
            echo "  development -> QA"
            echo "  QA -> production"
            exit 1
          fi
```
{% endraw %}

| Target | Allowed source |
| :--- | :--- |
| `development` | anything |
| `QA` | `development` only |
| `production` | `QA` only |

> `preprod` is not covered — it is absent from the `on.pull_request.branches` list, so PRs into `preprod` skip this check entirely.
>
> Note this is exactly the merge path that overwrites the production `deploy.yml`: the only permitted route into `production` is from `QA`, and `QA` carries the *dev* variant of that file.

---

## Dockerfile

Path: `Dockerfile` (repo root). **Identical on all branches.** Single-stage, unlike the website repo's multi-stage build.

```dockerfile
# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code and config files
COPY . .

COPY src/google_translator/google-key.json /app/google-key.json

# Copy DocumentDB/RDS CA bundle from source repo
COPY src/certs/global-bundle.pem /app/certs/global-bundle.pem

# Set environment variables for production
ENV DOCDB_CA_FILE=/app/certs/global-bundle.pem
# Ensure Node trusts the CA bundle at runtime
ENV NODE_EXTRA_CA_CERTS=/app/certs/global-bundle.pem

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

Points worth noting:

- **`COPY . .` bakes the generated `.env` into the image.** This is what keeps dev, QA, and preprod running despite those workflows wiping `RuntimeEnvironmentVariables`.
- **`npm install`, not `npm ci`** — the lockfile is not enforced, so a build can silently resolve different dependency versions than the last one.
- **Full `node:20` base, single stage** — dev dependencies and build toolchain ship in the runtime image. No `--only=production` prune.
- **Runs as `root`**, no `HEALTHCHECK`, no `.dockerignore`-driven slimming documented here.
- `NODE_EXTRA_CA_CERTS` is set in addition to `DOCDB_CA_FILE`, so Node trusts the DocumentDB CA bundle globally — see [PHR DocumentDB]({{ site.baseurl }}/docs/infra/phr-documentdb.html).

There is **no `apprunner.yaml` and no `docker-compose.yml`** in this repo.

---

## GitHub Secrets used

| Secret | Used by | Purpose |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | all four deploy workflows | Static IAM access key |
| `AWS_SECRET_ACCESS_KEY` | all four deploy workflows | Static IAM secret key |
| `ENV_FILE_NEW` | all four deploy workflows | Written to `.env` and baked into the image. **One secret shared by every environment** — dev, QA, preprod, and production all get the same file |
| `APP_RUNNER_SERVICE_ARN_LATEST` | `development` only | Dev service ARN |
| `PHR_PROD_APP_RUNNER_ENV_JSON` | `production` only | Complete production runtime environment as JSON — see the contract above |

QA, preprod, and production hardcode their service ARNs in the workflow `env:` block rather than using secrets. Authentication is via static access keys throughout — no OIDC anywhere in this repo.

See [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) for rotation and [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) for the broader secrets flow.

---

## How the four workflows compare

| | `development` | `QA` | `preprod` | `production` |
| :--- | :--- | :--- | :--- | :--- |
| File | `deploy.yml` | `deploy_qa.yml` | `deploy_preprod.yml` | `deploy.yml` |
| Manual trigger | ❌ | ❌ | ❌ | ✅ `workflow_dispatch` |
| `concurrency` group | ❌ | ❌ | ❌ | ✅ queues |
| Image tag | `<sha>` | `build-<run>-<sha8>` | `build-<run>-<sha8>` | `<sha>` |
| Config built with | inline JSON string | `jq -n` | `jq -n` | Node script on live config |
| Waits for idle before update | ❌ | ❌ | ✅ (accepts `PAUSED`) | ✅ |
| Sets `ImageConfiguration.Port` | ✅ | ❌ | ✅ | ✅ |
| Preserves runtime env | ❌ wipes | ❌ wipes | ❌ wipes | ✅ writes from secret |
| Tracks the operation ID | ❌ polls service status | ❌ | ❌ | ✅ polls the exact operation |
| Deploy timeout | 20 × 15s = 5 min | 20 × 15s = 5 min | 20 × 15s = 5 min | 90 × 20s = 30 min |
| Service ARN source | secret | hardcoded | hardcoded | hardcoded |

> The three older workflows poll `Service.Status` rather than the operation they started. A service that is already `RUNNING` when polling begins reports success immediately — so those jobs can pass without the new image having rolled out. Only production polls its own `OperationId`.

---

## What is NOT implemented

| Item | Status |
| :--- | :--- |
| Any lint / typecheck / test workflow | ❌ None exists on any branch |
| CI gating before deploy | ❌ Nothing runs the code before it ships to any environment |
| GitHub Environments with required reviewers | ❌ Not configured — production deploys on push |
| Runtime env managed as code (dev / QA / preprod) | ❌ All three wipe `RuntimeEnvironmentVariables` each deploy; only production writes it from a secret |
| Per-environment `.env` secrets | ❌ One shared `ENV_FILE_NEW` across all four environments |
| Secrets kept out of the image | ❌ `COPY . .` bakes the generated `.env` into every image |
| OIDC authentication with AWS | ❌ Static access keys throughout |
| `deploy.yml` split into distinct filenames per environment | ❌ Dev and prod pipelines share one path; a `QA → production` merge overwrites the prod pipeline |
| `npm ci` / lockfile-enforced installs | ❌ Dockerfile uses `npm install` |
| Multi-stage Docker build / production-only deps | ❌ Single-stage full `node:20` image |
| Dockerfile non-root user | ❌ Runs as `root` |
| Dockerfile `HEALTHCHECK` | ❌ Not present |
| Deploy verification tied to the actual operation | ⚠️ Production only; the other three poll service status and can pass without rolling out |
| One-click rollback workflow | ❌ `workflow_dispatch` on production redeploys branch HEAD; it cannot target an older image tag |
| Branch-policy coverage for `preprod` | ❌ `preprod` is excluded from `restrict-staging-merges.yml` |
| Multi-segment branch names in PRs | ❌ `name_enforce_feature_branch_naming.yml` rejects `feature/a/b`, `fix/…`, `refactor/…`, `docs/…` |
| Blue/green deployment | ❌ App Runner does rolling deploys; native blue/green is unavailable |

---

## Related documentation

- [CI/CD Pipeline (Website)]({{ site.baseurl }}/docs/infra/cicd.html) — the website backend's pipeline, which took a different approach per branch
- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — the deploy target for all four environments
- [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — GitHub Secrets + App Runner env + Secrets Manager flow
- [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — rotating `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- [PHR DocumentDB]({{ site.baseurl }}/docs/infra/phr-documentdb.html) — the CA bundle copied in by the Dockerfile
- [Branching Strategy]({{ site.baseurl }}/docs/workflows/branching-strategy.html) — the promotion path the policy workflows enforce

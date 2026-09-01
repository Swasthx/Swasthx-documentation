---
layout: default
title: CI/CD Pipeline (Website)
parent: Infrastructure
---

# CI/CD Pipeline — Website Backend

The SwasthX website backend uses **GitHub Actions** for continuous integration and continuous deployment to AWS. This page documents what is actually wired in the `swasthx_backend_website` repository today.

> For the PHR backend (`swasthx_Backend`), see [CI/CD Pipeline (PHR)]({{ site.baseurl }}/docs/infra/cicd-phr.html) — it is a separate repository with a different pipeline.

Three branches deploy: **`development`**, **`QA`**, and **`production`**. Each branch carries its *own* copy of `.github/workflows/`, and the three copies are **not** the same file. GitHub Actions runs the workflow file from the branch being pushed to, so each branch's YAML is reproduced separately below — what is on `development` does not describe what happens on `production`.

> **Compute target:** AWS App Runner (not ECS). See [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html).
>
> The three branches reach App Runner by **two different mechanisms**. `development` pushes an image tagged `:latest` and lets App Runner's *automatic deployment* pull it. `QA` and `production` explicitly call `aws apprunner update-service` and then **wait for the rollout to finish**, so the workflow run fails if the deployment fails. Both of those also set `AutoDeploymentsEnabled = false`.

---

## Branch → environment map

| Branch | Workflow files present | ECR repository | How App Runner is updated | Runs CI first? |
| :--- | :--- | :--- | :--- | :--- |
| `development` | `ci.yml`, `deploy.yml` | `hmis_development` | Automatic deploy off the `:latest` tag | ✅ Yes — `deploy.yml` calls `ci.yml` |
| `QA` | `ci.yml`, `deploy.yml` | `hmis_qa` | Explicit `update-service` + wait | ❌ No — `deploy.yml` never calls `ci.yml` |
| `production` | `deploy.yml` only | `hmis_production` | Explicit `update-service` + wait | ❌ No — there is no `ci.yml` on this branch |
| `main` | *(none)* | — | — | — |

> **`main` is dormant.** Its last commit is dated **2024-11-13** and it carries no `.github/workflows/` directory at all, so a push to `main` triggers nothing today. (`ci.yml` still *lists* `main` in its triggers, and a pull request targeting `main` does run CI — for `pull_request` events GitHub builds the workflow from the merge commit, so the head branch's `ci.yml` applies.)

**AWS region for all three:** `ap-south-1` · **ECR registry:** `515966508772.dkr.ecr.ap-south-1.amazonaws.com`

---

## `development` branch

Push to `development` → CI runs → image built and pushed to ECR with three tags → App Runner's automatic deployment picks up `:latest`.

### `.github/workflows/ci.yml`

Three parallel jobs on `ubuntu-latest`, Node 18, npm cache enabled. Lint is **non-blocking** (`continue-on-error: true`); typecheck and test are blocking. Lint and typecheck both raise the Node heap to 8 GB.

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
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: NODE_OPTIONS=--max-old-space-size=8192 npm run lint

  typecheck:
    name: Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit -p tsconfig.json

  test:
    name: Unit tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --passWithNoTests
```

### `.github/workflows/deploy.yml`

{% raw %}
```yaml
name: Build and Push to ECR

on:
  push:
    branches: [ development ]  # Change this to your default branch

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: 515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_development
  CONTAINER_NAME: hmis_development

jobs:
  ci:
    uses: ./.github/workflows/ci.yml

  deploy:
    name: Deploy
    needs: ci
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Compute semver tag
      run: |
        VERSION=$(node -p "require('./package.json').version")
        SHORT_SHA=${GITHUB_SHA::7}
        echo "IMAGE_SEMVER=${VERSION}-${SHORT_SHA}" >> $GITHUB_ENV

    - name: Build and tag Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build \
          -t $ECR_REPOSITORY:$IMAGE_TAG \
          -t $ECR_REPOSITORY:$IMAGE_SEMVER \
          -t $ECR_REPOSITORY:latest \
          .

    - name: Push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker push $ECR_REPOSITORY:$IMAGE_TAG
        docker push $ECR_REPOSITORY:$IMAGE_SEMVER
        docker push $ECR_REPOSITORY:latest
```
{% endraw %}

**Three tags on one image digest:**

| Tag | Format | Use |
| :--- | :--- | :--- |
| `<git_sha>` | full 40-char SHA | Immutable — forensic / rollback lookup by exact commit |
| `<package.version>-<short_sha>` | e.g. `1.2.3-abc1234` | Human-readable semver+commit for release notes |
| `latest` | literal `latest` | The tag App Runner's automatic deployment watches |

**After the push:** the workflow ends. App Runner sees the new `:latest` and rolls the dev service forward on its own. The workflow reports success regardless of whether that rollout later succeeds.

---

## `QA` branch

Push to `QA` → image built and pushed as `:<sha>` only → workflow rewrites the App Runner service config (image **and** full environment) → waits up to 30 minutes for the rollout.

`concurrency` is set to `qa-apprunner-deploy` with `cancel-in-progress: true`, so a newer push cancels an in-flight QA deploy.

### `.github/workflows/ci.yml`

This file is present on `QA` and is **byte-identical to the `development` copy** shown above. It is, however, **not wired into the QA deploy** — `deploy.yml` on this branch has no `ci` job, and `ci.yml`'s own triggers (`pull_request` → `main`/`development`, `push` → `main`, `workflow_call`) do not include `QA`. So pushing to `QA` runs no lint, no typecheck, and no tests.

### `.github/workflows/deploy.yml`

{% raw %}
```yaml
name: Deploy QA to App Runner

on:
  push:
    branches: [QA]

concurrency:
  group: qa-apprunner-deploy
  cancel-in-progress: true

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: 515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_qa
  APP_PORT: "3000"

jobs:
  deploy:
    name: Build and deploy QA
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t "$ECR_REPOSITORY:$IMAGE_TAG" .

      - name: Push image to Amazon ECR
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker push "$ECR_REPOSITORY:$IMAGE_TAG"

      # QA_APP_RUNNER_ENV_JSON is the COMPLETE runtime environment, not a patch:
      # RuntimeEnvironmentVariables is replaced wholesale below, so anything set
      # by hand in the App Runner console is dropped on every deploy. A key left
      # out of the secret does not fall back -- it simply stops existing. Note
      # that also makes this secret, not the AWS Secrets Manager entry, the
      # source of truth for QA.
      - name: Build App Runner update config
        env:
          APP_RUNNER_SERVICE_ARN: ${{ secrets.APP_RUNNER_QA_SERVICE_ARN }}
          IMAGE_URI: ${{ env.ECR_REPOSITORY }}:${{ github.sha }}
          QA_APP_RUNNER_ENV_JSON: ${{ secrets.QA_APP_RUNNER_ENV_JSON }}
        run: |
          if [ -z "$APP_RUNNER_SERVICE_ARN" ]; then
            echo "Missing GitHub secret APP_RUNNER_QA_SERVICE_ARN."
            exit 1
          fi

          aws apprunner describe-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" \
            > service.json

          if [ -z "$QA_APP_RUNNER_ENV_JSON" ]; then
            echo "Missing GitHub secret QA_APP_RUNNER_ENV_JSON. Store the full .env.qa.aws.json content there."
            exit 1
          fi

          umask 077
          printf '%s' "$QA_APP_RUNNER_ENV_JSON" > .env.qa.aws.json

          node <<'NODE'
          const fs = require('fs');

          const service = JSON.parse(fs.readFileSync('service.json', 'utf8')).Service;
          const source = service && service.SourceConfiguration;

          if (!source || !source.ImageRepository) {
            throw new Error('The App Runner service must be configured from an image repository.');
          }

          const envFile = '.env.qa.aws.json';
          const envJson = fs.readFileSync(envFile, 'utf8').trim();

          if (!envJson) {
            throw new Error(`${envFile} is empty.`);
          }

          let rawEnv;

          try {
            rawEnv = JSON.parse(envJson);
          } catch (error) {
            throw new Error(`${envFile} is not valid JSON: ${error.message}`);
          }

          const runtimeEnv =
            rawEnv.RuntimeEnvironmentVariables ||
            rawEnv.EnvironmentVariables ||
            rawEnv.variables ||
            rawEnv;
          const runtimeSecrets =
            rawEnv.RuntimeEnvironmentSecrets ||
            rawEnv.EnvironmentSecrets ||
            rawEnv.secrets;

          const validateMap = (name, input) => {
            if (!input || Array.isArray(input) || typeof input !== 'object') {
              throw new Error(`${name} must be a JSON object.`);
            }

            return Object.fromEntries(
              Object.entries(input).map(([key, value]) => {
                if (!key || typeof key !== 'string') {
                  throw new Error(`${name} contains an invalid environment key.`);
                }

                if (value !== null && typeof value === 'object') {
                  throw new Error(`${name}.${key} must be a string-compatible value.`);
                }

                return [key, value === null || value === undefined ? '' : String(value)];
              }),
            );
          };

          const runtimeVariables = validateMap('RuntimeEnvironmentVariables', runtimeEnv);

          if (Object.prototype.hasOwnProperty.call(runtimeVariables, 'PORT')) {
            throw new Error('Remove PORT from QA_APP_RUNNER_ENV_JSON. App Runner reserves PORT; use ImageConfiguration.Port instead.');
          }

          // Validate BEFORE calling AWS. App Runner requires every value to match
          // `.*`, which does not match newlines, and caps values at 51200 chars.
          // Letting AWS reject them instead is not just slower: the CLI echoes the
          // whole rejected map into the build log, and GitHub's secret masking is
          // line-based, so a multi-line value leaks in plaintext. These errors name
          // the offending key only -- never its value.
          for (const [key, value] of Object.entries(runtimeVariables)) {
            if (/[\r\n]/.test(value)) {
              throw new Error(
                `${key} contains a newline. App Runner env values must match ".*" ` +
                `(newlines not allowed). Compact JSON values onto a single line.`,
              );
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
            source.ImageRepository.ImageConfiguration.Port ||
            '3000';
          source.ImageRepository.ImageConfiguration.RuntimeEnvironmentVariables =
            runtimeVariables;

          if (runtimeSecrets) {
            source.ImageRepository.ImageConfiguration.RuntimeEnvironmentSecrets =
              validateMap('RuntimeEnvironmentSecrets', runtimeSecrets);
          }

          fs.writeFileSync('source-configuration.json', JSON.stringify(source));
          console.log(`Prepared App Runner config for ${process.env.IMAGE_URI}.`);
          console.log(`Runtime variable count: ${Object.keys(runtimeVariables).length}`);
          NODE

      - name: Update App Runner service
        id: update-apprunner
        env:
          APP_RUNNER_SERVICE_ARN: ${{ secrets.APP_RUNNER_QA_SERVICE_ARN }}
        run: |
          OPERATION_ID="$(aws apprunner update-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" \
            --source-configuration file://source-configuration.json \
            --query 'OperationId' \
            --output text)"

          echo "operation_id=$OPERATION_ID" >> "$GITHUB_OUTPUT"
          echo "Started App Runner operation $OPERATION_ID"

      - name: Wait for App Runner deployment
        env:
          APP_RUNNER_SERVICE_ARN: ${{ secrets.APP_RUNNER_QA_SERVICE_ARN }}
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
                --query 'Service.ServiceUrl' \
                --output text)"
              echo "QA deployed successfully: https://$SERVICE_URL"
              exit 0
            fi

            if [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "ROLLBACK_FAILED" ] || [ "$STATUS" = "ROLLBACK_SUCCEEDED" ]; then
              echo "App Runner deployment did not succeed."
              aws apprunner list-operations \
                --service-arn "$APP_RUNNER_SERVICE_ARN" \
                --max-results 5 \
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
          rm -f .env.qa.aws.json service.json source-configuration.json
```
{% endraw %}

### The `QA_APP_RUNNER_ENV_JSON` contract

This is the part most likely to bite an operator, so it is worth stating plainly:

- **It is the complete environment, not a patch.** `RuntimeEnvironmentVariables` is replaced wholesale on every deploy. Anything added by hand in the App Runner console is wiped the next time `QA` is pushed. A key omitted from the secret does not fall back to a previous value — it simply stops existing.
- **This secret, not AWS Secrets Manager, is the source of truth for QA runtime env.**
- **`PORT` must not be present.** App Runner reserves it; the workflow fails fast with an explicit error. The port comes from `APP_PORT` → `ImageConfiguration.Port` instead.
- **No newlines in any value.** App Runner requires values to match `.*`, which excludes newlines. The workflow validates this *before* calling AWS deliberately: if AWS rejects the map, the CLI echoes the whole map into the build log, and GitHub's secret masking is line-based — so a multi-line value would leak in plaintext. The pre-flight errors name only the offending key, never its value.
- **Each value is capped at 51,200 characters.**
- Optional `RuntimeEnvironmentSecrets` (aliases: `EnvironmentSecrets`, `secrets`) is passed through if present.
- Accepted top-level shapes: `{"RuntimeEnvironmentVariables": {...}}`, `{"EnvironmentVariables": {...}}`, `{"variables": {...}}`, or a bare flat object.

The generated `.env.qa.aws.json`, `service.json`, and `source-configuration.json` are deleted in an `if: always()` cleanup step.

---

## `production` branch

Push to `production`, or a manual **Run workflow** (`workflow_dispatch`), → image pushed as `:<sha>` only → wait for the service to be idle → swap the image, **leaving the environment untouched** → wait for the rollout.

`concurrency` is `prod-apprunner-deploy` with `cancel-in-progress: **false**` — production deploys queue rather than cancel each other.

Unlike QA, the service ARN is **hardcoded in `env:`** rather than read from a secret. There is no `ci.yml` on this branch, so nothing is linted, typechecked, or tested before a production deploy.

### `.github/workflows/deploy.yml`

{% raw %}
```yaml
name: Deploy Production to App Runner

on:
  push:
    branches: [ production ]
  workflow_dispatch:

concurrency:
  group: prod-apprunner-deploy
  cancel-in-progress: false

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: 515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_production
  APP_RUNNER_SERVICE_ARN: arn:aws:apprunner:ap-south-1:515966508772:service/website-production-service/951748e1c0dd47fb985dc56032526756
  APP_PORT: "3000"

jobs:
  deploy:
    name: Build and deploy Production
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Only the immutable sha tag is published. Pushing :latest as well would
      # trip the service's own ECR auto-deploy, and that deployment then blocks
      # the explicit update-service below with OPERATION_IN_PROGRESS.
      - name: Build Docker image
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t "$ECR_REPOSITORY:$IMAGE_TAG" .

      - name: Push image to Amazon ECR
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker push "$ECR_REPOSITORY:$IMAGE_TAG"

      # A console Resume, or an auto-deploy left over from an earlier :latest
      # push, parks the service in OPERATION_IN_PROGRESS -- update-service is
      # rejected outright in that state. Wait it out rather than failing.
      - name: Wait for App Runner service to be idle
        run: |
          for attempt in {1..30}; do
            STATUS="$(aws apprunner describe-service \
              --service-arn "$APP_RUNNER_SERVICE_ARN" \
              --query 'Service.Status' \
              --output text)"

            echo "Service status: $STATUS"

            if [ "$STATUS" = "RUNNING" ]; then
              exit 0
            fi

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

      # Phase 1 deliberately does NOT touch RuntimeEnvironmentVariables. The env
      # already on the service is read back from describe-service and returned
      # unchanged, so this deploy swaps the image and nothing else -- if it fails,
      # the cause is the pipeline, not a half-filled env map. Production env moves
      # into a PROD_APP_RUNNER_ENV_JSON secret in phase 2, mirroring QA.
      - name: Build App Runner update config (image only, env preserved)
        env:
          IMAGE_URI: ${{ env.ECR_REPOSITORY }}:${{ github.sha }}
        run: |
          aws apprunner describe-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" \
            > service.json

          node <<'NODE'
          const fs = require('fs');

          const service = JSON.parse(fs.readFileSync('service.json', 'utf8')).Service;
          const source = service && service.SourceConfiguration;

          if (!source || !source.ImageRepository) {
            throw new Error('The App Runner service must be configured from an image repository.');
          }

          source.AutoDeploymentsEnabled = false;
          source.ImageRepository.ImageIdentifier = process.env.IMAGE_URI;
          source.ImageRepository.ImageRepositoryType =
            source.ImageRepository.ImageRepositoryType || 'ECR';
          source.ImageRepository.ImageConfiguration =
            source.ImageRepository.ImageConfiguration || {};
          source.ImageRepository.ImageConfiguration.Port =
            process.env.APP_PORT ||
            source.ImageRepository.ImageConfiguration.Port ||
            '3000';

          const preserved =
            source.ImageRepository.ImageConfiguration.RuntimeEnvironmentVariables || {};

          fs.writeFileSync('source-configuration.json', JSON.stringify(source));
          console.log(`Prepared App Runner config for ${process.env.IMAGE_URI}.`);
          console.log(`Preserved ${Object.keys(preserved).length} existing runtime variables.`);
          NODE

      - name: Update App Runner service
        id: update-apprunner
        run: |
          OPERATION_ID="$(aws apprunner update-service \
            --service-arn "$APP_RUNNER_SERVICE_ARN" \
            --source-configuration file://source-configuration.json \
            --query 'OperationId' \
            --output text)"

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
                --query 'Service.ServiceUrl' \
                --output text)"
              echo "Production deployed successfully: https://$SERVICE_URL"
              exit 0
            fi

            if [ "$STATUS" = "FAILED" ] || [ "$STATUS" = "ROLLBACK_FAILED" ] || [ "$STATUS" = "ROLLBACK_SUCCEEDED" ]; then
              echo "App Runner deployment did not succeed."
              aws apprunner list-operations \
                --service-arn "$APP_RUNNER_SERVICE_ARN" \
                --max-results 5 \
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
          rm -f service.json source-configuration.json
```
{% endraw %}

### Two deliberate design choices, per the in-file comments

1. **Only the `:<sha>` tag is published — never `:latest`.** Pushing `:latest` would trip the service's own ECR auto-deploy, and that deployment then blocks the explicit `update-service` with `OPERATION_IN_PROGRESS`.
2. **Phase 1 does not touch `RuntimeEnvironmentVariables`.** The existing env is read back via `describe-service` and returned unchanged, so a failed deploy points at the pipeline rather than a half-filled env map. **Phase 2** will move production env into a `PROD_APP_RUNNER_ENV_JSON` secret, mirroring QA — not yet implemented.

The idle-wait exists because a console **Resume**, or a leftover auto-deploy from an earlier `:latest` push, parks the service in `OPERATION_IN_PROGRESS`, where `update-service` is rejected outright.

---

## Workflow differences at a glance

| | `development` | `QA` | `production` |
| :--- | :--- | :--- | :--- |
| Workflow name | Build and Push to ECR | Deploy QA to App Runner | Deploy Production to App Runner |
| Manual trigger | ❌ | ❌ | ✅ `workflow_dispatch` |
| Runs lint/typecheck/test | ✅ via `workflow_call` | ❌ | ❌ |
| `concurrency` group | none | `qa-apprunner-deploy`, cancels in-flight | `prod-apprunner-deploy`, queues |
| Tags pushed | `:sha`, `:semver`, `:latest` | `:sha` | `:sha` |
| App Runner update | Automatic (watches `:latest`) | Explicit `update-service` | Explicit `update-service` |
| `AutoDeploymentsEnabled` | left enabled | set to `false` | set to `false` |
| Waits for rollout | ❌ | ✅ up to 30 min | ✅ up to 30 min (+10 min idle wait) |
| Runtime env handling | untouched | **replaced** from `QA_APP_RUNNER_ENV_JSON` | **preserved** as-is |
| Service ARN source | n/a | `secrets.APP_RUNNER_QA_SERVICE_ARN` | hardcoded in `env:` |
| `checkout` | `@v3` | `@v4` | `@v4` |
| `configure-aws-credentials` | `@v2` | `@v4` | `@v4` |
| `amazon-ecr-login` | `@v1` | `@v2` | `@v2` |
| `setup-buildx-action` | `@v2` | `@v3` | `@v3` |

> The `development` workflow is a version behind on every action. Worth bumping when that branch is next touched.

---

## Dockerfile

Path: `Dockerfile` (repo root). Multi-stage build producing a slim production image. All three branches share the same structure; two lines differ.

### Stage 1 — Builder

- Base `node:18-alpine`; installs `python3 make g++` as a virtual `.gyp` package for `node-gyp`
- `npm ci` for the full dep tree, copies source + tsconfigs
- `RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build` (NestJS compile to `dist/`)
- `apk del .gyp`

### Stage 2 — Production runner

- Base `node:18-alpine`, `npm ci --only=production`
- Installs **Chromium** + fonts (`chromium nss freetype harfbuzz ca-certificates ttf-freefont font-noto-emoji wqy-zenhei`) for Puppeteer PDF rendering
- Puppeteer env vars point at the system Chromium (`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`, `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`, `CHROME_BIN`, `CHROME_PATH`, `CHROME_DEVEL_SANDBOX`, `PUPPETEER_PRODUCT=chrome`, `DISPLAY=:99`)
- `NODE_OPTIONS=--max-old-space-size=4096` (4 GB Node heap at runtime)
- Copies built `dist/` from builder, plus `key.json`
- Copies the DocumentDB/RDS CA bundle: `src/certs/global-bundle.pem` → `/app/certs/global-bundle.pem`
- Copies `DoctorProfileStaticData` into the built `dist/` tree
- `mkdir -p /tmp/credentials`, `EXPOSE 3000`, `CMD ["node", "dist/main"]`

```dockerfile
ENV NODE_ENV=production
ENV GOOGLE_CREDENTIALS_SECRET_NAME=GOOGLE_APPLICATION_CREDENTIALS
ENV DOCDB_CA_FILE=/app/certs/global-bundle.pem
```

### Per-branch differences

| Branch | Difference vs `development` |
| :--- | :--- |
| `development` | baseline — has `COPY .env* ./`; build stage runs `NODE_OPTIONS=--max-old-space-size=4096 npm run build` |
| `QA` | **`COPY .env* ./` removed** — QA gets its entire environment from App Runner runtime variables, not baked-in `.env` files |
| `production` | build stage is plain `RUN npm run build` (no `NODE_OPTIONS`); still has `COPY .env* ./` |

> The `COPY .env* ./` still present on `development` and `production` bakes whatever `.env*` files exist at build time into the image. QA has already moved off this pattern; the other two have not.

---

## `apprunner.yaml`

Path: `apprunner.yaml`. **Identical on all three branches.** Minimal — image name and port only:

```yaml
version: 1.0
build:
  image: swasthx-backend-service
  dockerfile: Dockerfile
run:
  port: 3000
```

All other App Runner config (scaling, health check, VPC, env vars) lives in the App Runner service configuration — see [App Runner]({{ site.baseurl }}/docs/infra/app-runner.html).

---

## `docker-compose.yml`

Path: `docker-compose.yml`. **Identical on all three branches.** Local development convenience only — not referenced by any CI/CD or production path:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: swasthx-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://host.docker.internal:27017/testingdb
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./logs:/app/logs
```

---

## End-to-end flows

```
                    ┌─────────────────────────────────────────────┐
push → development  │ ci.yml (lint ⚠ / typecheck ✓ / test ✓)      │
                    │            ↓ needs: ci                       │
                    │ build → tag :sha, :semver, :latest → push x3 │
                    │            ↓                                 │
                    │ (workflow ends here)                         │
                    │            ↓ App Runner auto-deploy          │
                    │ dev service pulls :latest, rolls forward     │
                    └─────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
push → QA           │ (no CI)                                      │
                    │ build → tag :sha → push                      │
                    │            ↓                                 │
                    │ describe-service → merge QA_APP_RUNNER_ENV_  │
                    │ JSON as the FULL env → validate → config     │
                    │            ↓                                 │
                    │ update-service (image + env, autodeploy off) │
                    │            ↓                                 │
                    │ poll list-operations, ≤90×20s = 30 min       │
                    │            ↓                                 │
                    │ SUCCEEDED → print URL · FAILED → job fails   │
                    └─────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
push → production   │ (no CI)                                      │
or workflow_dispatch│ build → tag :sha → push  (:latest NOT pushed)│
                    │            ↓                                 │
                    │ wait for Service.Status = RUNNING, ≤10 min   │
                    │            ↓                                 │
                    │ describe-service → swap image only,          │
                    │ env preserved verbatim                       │
                    │            ↓                                 │
                    │ update-service                               │
                    │            ↓                                 │
                    │ poll list-operations, ≤90×20s = 30 min       │
                    │            ↓                                 │
                    │ SUCCEEDED → print URL · FAILED → job fails   │
                    └─────────────────────────────────────────────┘
```

---

## GitHub Secrets used

| Secret | Used by | Purpose |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | all three branches | Static IAM access key for ECR push + App Runner calls |
| `AWS_SECRET_ACCESS_KEY` | all three branches | Static IAM secret key |
| `APP_RUNNER_QA_SERVICE_ARN` | `QA` only | ARN of the QA App Runner service; workflow fails fast if unset |
| `QA_APP_RUNNER_ENV_JSON` | `QA` only | **Complete** QA runtime environment as JSON — see the contract above |

Production's service ARN is **not** a secret — it is hardcoded in the workflow's `env:` block. A `PROD_APP_RUNNER_ENV_JSON` secret is referenced in the workflow comments as phase 2 but does not exist yet.

All three workflows request `id-token: write` permission, but none of them use OIDC — authentication is via the static access keys above. See [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) for rotation, and [Key Management (Website)]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) for the broader secrets flow.

---

## What is NOT implemented

| Ticket AC | Status |
| :--- | :--- |
| Lint failures block PR merge | ❌ `continue-on-error: true` on the lint job |
| Tests block merge when missing | ❌ `--passWithNoTests` flag |
| CI gates the QA deploy | ❌ QA's `deploy.yml` never calls `ci.yml`, and `ci.yml` does not trigger on the `QA` branch |
| CI gates the production deploy | ❌ No `ci.yml` on the `production` branch at all |
| GitHub Environments with required reviewers | ❌ Not configured — production deploys on push with no approval gate |
| Staging deploy workflow (manual, 1 approver) | ⚠️ QA deploy exists and is fully automated, but has no approval step |
| Production deploy workflow (manual, 2 approvers) | ⚠️ `workflow_dispatch` exists, but no approvers and it also fires on every push |
| OIDC authentication with AWS | ❌ Static `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, despite `id-token: write` being granted |
| Production env managed as code | ❌ Phase 1 preserves whatever is on the service; `PROD_APP_RUNNER_ENV_JSON` is planned, not built |
| Blue/green deployment | ❌ App Runner uses rolling deploys; native blue/green is not available |
| One-click rollback workflow | ❌ `workflow_dispatch` on production redeploys the branch HEAD — it cannot target an older image tag |
| Dockerfile non-root user | ❌ Container runs as `root` on all branches |
| Dockerfile `HEALTHCHECK` | ❌ Not present (App Runner has its own external health check on `/api`) |
| `.env` files kept out of the image | ⚠️ Done on `QA`; `development` and `production` still `COPY .env* ./` |
| Build time < 5 min target | ❓ Not measured / not enforced (Chromium install + Puppeteer setup is heavy) |
| ECS deployment | ❌ Repo uses App Runner; "ECS" in the ticket spec is a terminology mismatch |
| Separate `swasthx-worker` ECR repo | ❌ Three repos (`hmis_development`, `hmis_qa`, `hmis_production`); no separate worker image |
| Consistent action versions across branches | ❌ `development` is one major version behind on all four actions |

These are tracked here as gaps; the items can be picked up in follow-up tickets.

---

## Related documentation

- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — the deploy target for all three environments
- [Website Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) — full GitHub Secrets + App Runner env + Secrets Manager flow
- [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — same flow for the PHR repo
- [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — rotating the `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` used by all three workflows
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — the IAM user `s3andsnsAccess` is unrelated to the deploy workflows

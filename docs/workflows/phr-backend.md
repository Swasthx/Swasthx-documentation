---
layout: default
title: PHR Backend
parent: Backend
grand_parent: Workflows & Processes
---

# PHR Backend

The PHR backend (`swasthx_Backend`) deploys through **GitHub Actions** to **AWS App Runner**.

*   **Deployment pipeline**: GitHub Actions
*   **Triggers**: pushing commits to `development`, `QA`, `preprod`, or `production`
*   **Process**:
    1.  GitHub Actions checks out the branch.
    2.  Writes `.env` from the `ENV_FILE_NEW` secret.
    3.  Builds the Docker image and pushes it to **Amazon ECR**.
    4.  Calls `aws apprunner update-service` explicitly, then polls until the service reports `RUNNING`.

> **Full reference:** [CI/CD Pipeline (PHR)]({{ site.baseurl }}/docs/infra/cicd-phr.html) carries the complete YAML for all five workflow files, the branch → environment map, the `PHR_PROD_APP_RUNNER_ENV_JSON` contract, and the current list of gaps.

---

## Which workflow runs on which branch

Every branch carries all five workflow files; each file's own `on.push.branches` filter decides which one actually fires.

| Branch | Workflow | ECR repository | App Runner service |
| :--- | :--- | :--- | :--- |
| `development` | `deploy.yml` *(dev variant)* | `swasthx-backend` | from `APP_RUNNER_SERVICE_ARN_LATEST` |
| `QA` | `deploy_qa.yml` | `phr_qa` | `PHR_QA_DEPLOYMENT` |
| `preprod` | `deploy_preprod.yml` | `swasthx-backend-preprod` | `swasthx-backend-service-preprod` |
| `production` | `deploy.yml` *(prod variant)* | `phr_production` | `PHR_production` |

⚠️ `deploy.yml` is **two different pipelines sharing one filename** — the copy on `development` and the copy on `production` are not versions of each other. A `QA → production` merge overwrites the production pipeline with the dev one unless that file is excluded. See the [CI/CD reference]({{ site.baseurl }}/docs/infra/cicd-phr.html) for details.

---

## Branch policy checks

Two workflows run on pull requests. Neither builds, lints, or tests the code — there is **no CI workflow in this repository**.

*   **`name_enforce_feature_branch_naming.yml`** — PR head branches must match `feature/{short-description}` in kebab-case. `development` and `preprod` are exempt. Multi-segment names like `feature/name/thing`, and prefixes such as `fix/`, `refactor/`, and `docs/`, are rejected.
*   **`restrict-staging-merges.yml`** — enforces the promotion path:

    | Target | Allowed source |
    | :--- | :--- |
    | `development` | anything |
    | `QA` | `development` only |
    | `production` | `QA` only |

    PRs into `preprod` are not covered by this check.

---

## Related documentation

- [CI/CD Pipeline (PHR)]({{ site.baseurl }}/docs/infra/cicd-phr.html) — full workflow YAML and configuration reference
- [Branching Strategy]({{ site.baseurl }}/docs/workflows/branching-strategy.html) — the promotion path these checks enforce
- [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — the deploy target
- [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — secrets flow

Swasthx Branching Strategy & Deployment Policy

This document outlines our Git workflow structure, naming conventions, and CI/CD rules for contributing to the Swasthx API backend repository. All developers must adhere to this standard to maintain a clean, secure, and automated release process.

Branching Model

| Branch | Purpose | Deployment |
| --- | --- | --- |
| main | Reserved for production-ready releases | Manual (if used) |
| preprod | Last-mile testing and approval environment | Auto-deployed |
| development | Integrated working branch for all completed features | Optional QA |
| feature/* | Individual features or bug fixes | N/A (via PRs) |

Feature Branch Naming Policy

All new work must follow this format:

**feature/{short-description}**

Examples:

*   feature/login-api
*   feature/fix-scroll
*   feature/add-appointment-service

 **Not allowed**:

*   feature/1234-login-api
*   bugfix/navbar
*   hotfix/image-issue

PRs with invalid branch names will be blocked by GitHub Actions.

Workflow for Developers

1.  **Create a Feature Branch**

git checkout development git pull origin development git checkout -b feature/login-api

2.  **Push to Remote**

git push origin feature/login-api

3.  **Open a Pull Request (PR)**

*   **Source**: feature/...
*   **Target**: development
*   Ensure CI checks pass and get reviews.

5.  **Merge to development**

*   After successful review and test validation.

7.  **Promote to Preprod**

*   PR from development → preprod.
*   Only development is allowed to merge into preprod.
*   Deployment to AWS App Runner is **automated** on preprod push.

 GitHub Enforcement

Branch Protection

*   preprod and development branches are **protected**.

*   Require pull requests
*   Block direct pushes
*   Require status checks

 Merge Restrictions

*   PRs into preprod are only accepted if the source is development.
*   Enforced via GitHub Actions.

 Branch Name Enforcement

*   PRs must originate from feature/{short-description}
*   Allowed exceptions:

*   development
*   preprod

CI/CD Integration

Triggered On:

*   Push to preprod → Automatically deploy to AWS App Runner

GitHub Actions Workflows Used:

*   restrict-preprod-merges.yml: Ensures only development → preprod merges
*   enforce-branch-name.yml: Validates branch name format for all PRs
*   deploy-to-apprunner.yml: Builds Docker image & deploys to App Runner on preprod push

Contributor Tips

*   Always branch from development
*   Keep branches focused and short-lived
*   Use kebab-case for clarity in branch names
*   Don’t push to preprod or development directly
*   Always use PRs with reviews

Let me know if you'd like this packaged as a Markdown file (README or CONTRIBUTING.md) or converted into an HTML doc for your internal portal. I can also add visual diagrams if team prefers a flowchart version of the branching logic.
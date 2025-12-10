---
layout: default
title: Frontend Workflows
parent: Workflows & Processes
---

# Frontend Workflows

## Website Frontend

The Website Frontend uses **AWS Amplify** for continuous deployment.

*   **Deployment Pipeline**: AWS Amplify
*   **Triggers**: Pushing commits to the following branches:
    *   `development-new` (Dev environment)
    *   `qa` (QA environment)
    *   `production` (Production environment)
*   **Process**:
    1.  Developer pushes code to one of the target branches.
    2.  AWS Amplify automatically detects the new commit.
    3.  It builds the application and deploys the new version to the live URL for that environment.

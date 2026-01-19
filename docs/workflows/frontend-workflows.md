---
layout: default
title: Frontend Workflows
parent: Workflows & Processes
---

# Frontend Workflows

## Website Frontend

The Website Frontend uses **AWS Amplify** for continuous deployment.

- **Deployment Pipeline**: AWS Amplify
- **Triggers**: Pushing commits to the following branches:
  - `development-new` (Dev environment)
  - `qa` (QA environment)
  - `production` (Production environment)
- **Process**:

  1.  Developer pushes code to one of the target branches.
  2.  AWS Amplify automatically detects the new commit.
  3.  It builds the application and deploys the new version to the live URL for that environment.

- **Environment URLs**:
  - Dev: `https://dev-doctor.swasthx.com/`
  - QA: `https://qa-doctor.swasthx.com/`
  - Prod: `https://prod-doctor.swasthx.com`
- **Monitoring**: AWS Amplify provides build logs and deployment status for monitoring the deployment process.

## Developer documentation

- Authentication and Authorization details.
- LocalStorage
- UI canching (MobX and Redux)
- Cookies (Future scope)
- Caching Mechanism
Read More details about the developer access management
<br>
<a href="https://docs.google.com/document/d/1aaZ3_6Y8MxRqFBq_fZsj0IdjGIDuLXlNKGEP65pp74Q/edit?usp=sharing" target="_blank">View Developer Documentation of UI</a>
<hr>

## Roadblocks and Suggestions

- Based on a comprehensive review of the codebase, dependencies, configuration, and architecture, here's an analysis of the Swasthx frontend project—a ReactJS-based healthcare platform integrating with India's Ayushman Bharat Digital Mission (ABDM) for ABHA (Ayushman Bharat Health Account) management, health record linking, data transfer, and doctor appointment functionalities.
<br>
<a href="https://docs.google.com/document/d/1uqwNvndlVze_gKrMAfCbeF_SKsVfEW-DheCWC4gQZY4/edit?usp=sharing" target="_blank">Website UI Roadblocks & Suggestions</a>
<hr>

## UI Naming Convention

This document outlines the naming conventions for the website frontend components, including files, folders, and variables. Adhering to these conventions ensures consistency, clarity, and ease of maintenance across the development team.
<br>
<a href="https://docs.google.com/document/d/1zsHyfjnTWhoqDBEz9xzqAwMfy2aIst4ZCGKcK1WBSeA/edit?usp=sharing" target="_blank">View Website UI Naming Conventions</a>

<hr>

## UI Environment Variables

The Website Frontend uses several environment variables for configuration. These are typically stored in a `.env` file and injected during the deployment process. Below is a list of common environment variables used:

- `REACT_APP_API_BASE_URL`: Base URL for the backend API.
- `REACT_APP_AUTH0_DOMAIN`: Auth0 domain for authentication.
- `REACT_APP_AUTH0_CLIENT_ID`: Auth0 client ID for authentication.
- `REACT_APP_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID.
- `REACT_APP_SENTRY_DSN`: Sentry Data Source Name for error tracking.
- `REACT_APP_ENVIRONMENT`: Current environment (e.g., `development`, `qa`, `production`).
Ensure to keep sensitive information secure and avoid hardcoding them in the source code. Use secret management solutions or environment variable injection during deployment.
<br>
<hr />
<a href="https://docs.google.com/document/d/1A6LnxCiRio1lkdqQi7yUyv45JbtHPdeaMzCT8uP6cY0/edit?usp=sharing" target="_blank">Prod-ENV</a>
<hr />
<a href="https://docs.google.com/document/d/199przNtj5Up8macfNty-Hap57_Z2FB9VVAtUagZ4s0Y/edit?usp=sharing" target="_blank">QA-ENV</a>
<hr />
<a href="https://docs.google.com/document/d/1UfCRkch0e6wJtTGCViIDkrcFV-pYZqu70ZOiiu0IgdA/edit?usp=sharing" target="_blank">Dev-ENV</a>
<hr>

## Package management Dependencies

- The Website Frontend uses **npm** (Node Package Manager) for managing its dependencies.
- **Package.json**: All dependencies and their versions are listed in the `package.json`
  file located at the root of the project.
- **Installing Dependencies**: Developers can install all required dependencies by running the command:
  ```
  npm install
  ```
- **Updating Dependencies**: To update dependencies to their latest versions, developers can use:
  ```
    npm update
  ```
- **Lock File**: The `package-lock.json` file ensures consistent installations across different environments by locking the versions of installed packages.
- **Security Audits**: Regularly run security audits using:
`   npm audit
  `
to identify and fix vulnerabilities in dependencies.
<br><a href="https://docs.google.com/spreadsheets/d/1kBw6-iAr61Y7w2qliqkJRa5pqZ8ZUEb9/edit?usp=sharing&ouid=116326917410947996324&rtpof=true&sd=true" target="_blank">View Website UI Package Management & Dependencies</a>
<hr>

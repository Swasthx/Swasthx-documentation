---
layout: default
title: Frontend Guidelines
parent: Development
---

# Frontend Guidelines

This document outlines the standards and workflows for frontend development at Swasthx.

## 1. Branching Strategy

Our development process follows a strict branching strategy to ensure code quality and stability.

### The Three Branches

| Branch | Environment | Who Uses It? | The Golden Rule |
| :--- | :--- | :--- | :--- |
| **development** | Alpha | Developers | **The Sandbox**. Push daily work here. Builds go to *Internal Testing*. |
| **QA** | Beta | QA Team | **The Filter**. Code is frozen here for testing. *Never push code directly here.* |
| **production** | Live | Real Users | **The Product**. This is what users download/access. |

### The Rules of Pushing Code

1.  **One way merging**: You merge `development` -> `QA` -> `production`.
2.  **PRs only**: Never push directly to `QA` or `production`. You must open a Pull Request.
3.  **No skipping**: You cannot merge `development` straight to `production`. You must go through `QA` first. 

---

## 2. Development Workflow

### Feature Branches
Whenever working on a new feature, always create a sub-branch starting with `feat/*` from the `development` branch.
- Example: `feat/login-page-redesign`, `feat/appointment-booking`
- Once the code is ready, raise a Pull Request (PR) to merge into `development`.

### API Integration
Before integrating any API:
1.  **Verify with Backend**: Ensure the Backend team has tested the API using Postman.
2.  **Check Postman Collection**: All possible scenarios (success/error status codes) must be saved in the team Postman collection.
3.  **Clarify Contracts**: The request and response bodies should be clear and agreed upon before writing any integration code.

### Coding Standards
- **Comments**: Add comments to explain *why* something is done, not just *what*.
  - **Inline Comments**: For complex logic inside functions.
  - **Functional Comments**: Docstrings explaining what a function does, its parameters, and return values.
- **Naming Conventions**: 
  - Variable and function names should be meaningful.
  - Follow **camelCase** for JavaScript/TypeScript variables (e.g., `userProfile`, `fetchAppointments`).

### Pre-Push Checklist
Before pushing your code:
1.  **UI Updates**: Ensure all required UI changes match the design.
2.  **Backend alignment**: updates required by the backend team are also done.
3.  **Clean Code**: Remove any unused imports, variables, and `console.log` statements.
4.  **Local Testing**: Verify that your changes work locally and don't break existing functionality.

## 3. Deployment

The frontend deployment is automated using **AWS Amplify**:
-   **Hosting**: Amplify hosts the React.js application and manages the CI/CD pipeline.
-   **API Integration**: The frontend connects to the backend via **AWS API Gateway**.

For a detailed breakdown of the system flow and infrastructure, refer to the [System Architecture]({{ '/architecture' | relative_url }}) page.

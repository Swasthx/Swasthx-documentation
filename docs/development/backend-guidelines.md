---
layout: default
title: Backend Guidelines
parent: Development
---

# Backend Guidelines

This document outlines the standards and workflows for backend development at Swasthx.

## 1. Branching Strategy

We follow a three-branch strategy for development lifecycle:

| Branch | Description |
| :--- | :--- | :--- |
| **development**  | Development environment. All Feature branches merge here. |
| **QA**  | Quality Assurance environment. Code is stable for testing. |
| **production** | Production environment. Live for end users. |

### Feature Branches
- Whenever working on a new feature, **always** create a sub-branch starting with `feat/*` from the `development` branch.
- Example: `feat/patient-auth`, `feat/upload-health-record`.
- Once coding is complete, raise a Pull Request (PR) to merge into `development`.

---

## 2. Development Workflow

### Requirements Gathering (Before Coding)
Before writing a single line of code, you must have clarity on:
1.  **API Type**: REST, GraphQL, etc.
2.  **Use Case**: What problem is this API solving?
3.  **Frontend Data**: What inputs will the frontend send?
4.  **Database**: What needs to be stored? What is the schema?
5.  **Dependencies**: Are there any third-party APIs (e.g., SMS, Payment)?
6.  **Response**: What data does the frontend expect back?
7.  **Authentication**: Is this a public or protected route?

### Coding Standards
- **Comments**:
  - **Inline Comments**: Explain complex logic.
  - **Functional Comments**: Add examples and explanations for functions.
- **Naming Conventions**:
  - Variables and Functions: Use **camelCase** (e.g., `processPayment`, `userDetails`).
  - Be meaningful: `data` is bad; `patientHealthRecord` is good.

### Postman & Testing
1.  **Test Scenarios**: Check all possible scenarios (Success 200, Bad Request 400, Unauthorized 401, Server Error 500).
2.  **Documentation**:
    - Ensure the **Request Body** is correct and representative.
    - Ensure **Headers** (Authorization, Content-Type) are correct.
    - Add the **Use Case** in the request description.
    - **Save Responses**: Save examples of all possible responses so frontend developers can work in parallel.

### Pre-Push Checklist
Before pushing code to the repository:
1.  **Requirements Fulfilled**: Does the code meet all points from the requirements gathering phase?
2.  **Postman Tested**: Has the API been thoroughly tested in Postman?
3.  **Clean Code**: Remove unused imports, variables, and commented-out code.

## 3. Deployment

The backend infrastructure is built on AWS:
-   **Compute**: **AWS App Runner** hosts the containerized Nest.js application.
-   **Routing**: **AWS API Gateway** handles authentication and routes requests to the backend.
-   **Database**: **AWS DocumentDB** stores application data in a secure, private subnet.

For a detailed breakdown of the system flow and infrastructure, refer to the [System Architecture]({{ '/architecture' | relative_url }}) page.

---
layout: default
title: Branching Strategy
parent: Workflows & Processes
---

# Branching Strategy & Deployment Policy

This document outlines our Git workflow structure, naming conventions, and CI/CD rules for contributing to the Swasthx repositories. All developers must adhere to this standard to maintain a clean, secure, and automated release process.

## 1. Branching Structure

We maintain specific branching structures for our different application components:

### App Frontend
*   **development**: For day-to-day development work.
*   **qa**: For quality assurance testing.
*   **production**: For the live application.

### App Backend
*   **development**: For day-to-day development work.
*   **qa**: For quality assurance testing.
*   **production**: For the live application.

### Website Frontend
*   **development-new**: For day-to-day development work.
*   **qa**: For quality assurance testing.
*   **production**: For the live website.

### Website Backend
*   **development**: For day-to-day development work.
*   **qa**: For quality assurance testing.
*   **production**: For the live application.

---

## 2. The Rules of Pushing Code

1.  **One way merging**: You merge `development` -> `QA` -> `production`.
2.  **PRs only**: Never push directly to `QA` or `production`. You must open a Pull Request.
3.  **No skipping**: You cannot merge `development` straight to `production`. You must go through `QA` first.

---

## 3. Scenarios

### Scenario 1: Bug Found in QA (Bug)

**Context**: The team is testing upcoming features. The users haven't seen this code yet.
**Goal**: Fix it quickly so we can finish the release.
**Branching**: Work off the **QA** branch.

**Steps for Developer**:

1.  **Get the Ticket**: Assign the Jira/Linear ticket to yourself.
2.  **Switch to QA Code**:
    ```bash
    git checkout qa
    git pull origin qa
    # Make sure you have the latest code
    ```
3.  **Create a Fix Branch**:
    *   Create a branch specifically for this bug.
    ```bash
    git checkout -b fix/qa-login-button
    ```
4.  **Fix & Test**:
    *   Fix the bug in your code.
    *   Run the app locally to confirm it works.
5.  **Push**:
    ```bash
    git push origin fix/qa-login-button
    ```
6.  **Open Pull Request (PR)**:
    *   Open a PR from `fix/qa-login-button` -> `qa`.
    *   *Note: Do NOT merge to `dev` yet.*
7.  **Merge & Verify**:
    *   Once approved, merge into `qa`.
    *   Tell the QA team: "Fix is deployed to QA, please verify."

### Scenario 2: Bug Found in Production (Patch)

**Context**: The bug is LIVE. Users are seeing it right now.
**Goal**: Stop the bleeding immediately without releasing half-finished features from Dev/QA.
**Branching**: Work off the **production** branch.

**Steps for Developer**:

1.  **Panic Check**: Confirm with your Lead/Manager: "Is this critical enough for a Hotfix?"
2.  **Switch to Safe Code**:
    ```bash
    git checkout production
    # Go to the live code
    git pull origin production
    ```
3.  **Create Hotfix Branch**:
    ```bash
    git checkout -b hotfix/payment-crash
    ```
4.  **The Surgical Fix**:
    *   Fix only the **bug**. Touch nothing else.
    *   *Do not reformat code. Do not update libraries.*
5.  **Push**:
    ```bash
    git push origin hotfix/payment-crash
    ```
6.  **Open Pull Request (PR)**:
    *   Open a PR from `hotfix/payment-crash` -> `production`.
    *   **Urgent**: Ask a senior developer to review it immediately.
7.  **Release**:
    *   Merge to `production`. (This triggers the release pipeline).
8.  **The Critical Final Step (Sync Back)**:
    *   You must now copy this fix to your other branches so the bug doesn't come back next month.
    ```bash
    git checkout dev
    git cherry-pick <commit-hash-of-your-fix>
    git push origin dev
    ```

---

## 4. Code Commit Standard

We follow a standard way of adding commit messages whenever code is being pushed to any branch.

The syntax: `<type>(<scope>): <subject>`

*   **`<type>`**: Tells the system *what kind* of change this is (feature, fix etc).
*   **`(<scope>)`**: (compulsory) Tells the system *where* the change is (e.g., `(login)`, `(payment-api)`).
*   **`<subject>`**: A short, imperative description of the change.

### Types and Examples

| Type | Meaning | Version Bump | Example |
| :--- | :--- | :--- | :--- |
| **feat** | A new feature for the user. | **Minor** (1.1.0 -> 1.2.0) | `feat(cart): add 'buy now' button` |
| **fix** | A bug fix for the user. | **Patch** (1.1.0 -> 1.1.1) | `fix(login): resolve crash on bad password` |
| **refactor** | Restructuring code without changing behavior. | **None** | `refactor: simplify auth middleware logic` |

For more information regarding versioning, please refer to the [PHR App Release Guidelines]({{ site.baseurl }}/docs/release/phr-app-release.html).

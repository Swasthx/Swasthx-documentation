---
layout: default
title: Branching Strategy
---

# Swasthx Branching Strategy & Deployment Policy

This document outlines our Git workflow structure, naming conventions, and CI/CD rules for contributing to the Swasthx API backend repository. All developers must adhere to this standard to maintain a clean, secure, and automated release process.

## Branching Model

### Workflow Diagram

```mermaid
graph TD
    A[Start: New Feature] --> B[Create feature branch\nfrom development]
    B --> C[Work on feature]
    C --> D[Push to remote]
    D --> E[Create PR to development]
    E --> F[Code Review & CI]
    F --> G[Merge to development]
    G --> H[Create PR to preprod]
    H --> I[QA & Approval]
    I --> J[Merge to preprod]
    J --> K[Auto-deploy to\nAWS App Runner]
    K --> L{Production Release?}
    L -->|Yes| M[Create PR to main]
    M --> N[Manual Release]
    L -->|No| O[Continue Development]
    
    style A fill:#e1f5fe,stroke:#01579b
    style L fill:#fff9c4,stroke:#f57f17
```

### Branching Strategy Table

| Branch | Purpose | Deployment |
|--------|---------|------------|
| `main` | Reserved for production-ready releases | Manual (if used) |
| `preprod` | Last-mile testing and approval environment | Auto-deployed |
| `development` | Integrated working branch for all completed features | Optional QA |
| `feature/*` | Individual features or bug fixes | N/A (via PRs) |

### Feature Branch Naming Policy

All new work must follow this format:
```
feature/{short-description}
```

**Examples:**
- `feature/login-api`
- `feature/fix-scroll`
- `feature/add-appointment-service`

**Not allowed:**
- `feature/1234-login-api`
- `bugfix/navbar`
- `hotfix/image-issue`

PRs with invalid branch names will be blocked by GitHub Actions.

## Workflow for Developers

### 1. Create a Feature Branch
```bash
git checkout development
git pull origin development
git checkout -b feature/login-api
```

### 2. Push to Remote
```bash
git push origin feature/login-api
```

### 3. Open a Pull Request (PR)
- Source: `feature/...`
- Target: `development`
- Ensure CI checks pass and get reviews.

### 4. Merge to development
After successful review and test validation.

### 5. Promote to Preprod
- PR from `development` → `preprod`.
- Only `development` is allowed to merge into `preprod`.
- Deployment to AWS App Runner is automated on `preprod` push.

## GitHub Enforcement

### Branch Protection
- `preprod` and `development` branches are protected.
- Require pull requests
- Block direct pushes
- Require status checks

### Merge Restrictions
- PRs into `preprod` are only accepted if the source is `development`.
- Enforced via GitHub Actions.

### Branch Name Enforcement
- PRs must originate from `feature/{short-description}`
- Allowed exceptions:
  - `development`
  - `preprod`

## CI/CD Integration

**Triggered On:**
- Push to `preprod` → Automatically deploy to AWS App Runner

**GitHub Actions Workflows Used:**
1. `restrict-preprod-merges.yml`: Ensures only `development` → `preprod` merges
2. `enforce-branch-name.yml`: Validates branch name format for all PRs
3. `deploy-to-apprunner.yml`: Builds Docker image & deploys to App Runner on `preprod` push

## Contributor Tips
- Always branch from `development`
- Keep branches focused and short-lived
- Use kebab-case for clarity in branch names
- Don't push to `preprod` or `development` directly
- Always use PRs with reviews

- `main` - Production-ready code
- `develop` - Integration branch for features

## Supporting Branches

- `feature/` - New features being developed
- `bugfix/` - Bug fixes
- `release/` - Release preparation
- `hotfix/` - Critical production fixes

## Workflow

1. Create a feature branch from `develop`
2. Work on your feature
3. Create a pull request to `develop`
4. After review and testing, merge to `develop`
5. When ready for release, create a release branch
6. After final testing, merge to `main` and tag the release

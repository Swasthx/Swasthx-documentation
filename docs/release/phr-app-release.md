---
layout: default
title: PHR App Release Guidelines
parent: Release
---

# PHR App Release Guidelines

This document outlines the standard procedures for releasing updates to the Swasthx PHR Application.

## 1. Deployment Branches
We maintain strict branching strategies to ensure stability across environments:
-   **Main/Production**: Deploys to the live production environment.
-   **Release/Staging**: Deploys to the QA/Staging environment for final testing.
-   **Development**: Deploys to the Dev environment for integration testing.

## 2. Versioning System
We adhere to Semantic Versioning (`MAJOR.MINOR.PATCH`) for each publish:
-   **MAJOR**: Incompatible API changes.
-   **MINOR**: Backwards-compatible functionality additions.
-   **PATCH**: Backwards-compatible bug fixes.

## 3. Automatic Deployment

Our CI/CD pipeline handles auto-deployment for the backend services:

-   **Frontend (React Native)**: The PHR App is a mobile application and is not deployed to a web server.
-   **Backend**: Deployed on **AWS App Runner**.
-   **Trigger**: Pushing code to any deployment branch automatically triggers **GitHub Actions** to build and deploy the latest backend code to the respective environment.

## 4. Code Commit Standards
To maintain a clean history and enable automated changelogs:
-   Use clear, descriptive commit messages.
-   Follow the convention: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
-   Reference issue numbers where applicable.

## 5. Detailed Documentation
For complete information regarding the release process, checklist, and troubleshooting, please refer to our internal document: **<a href="https://docs.google.com/document/d/1d86M6CL884tdL4WgMqCL3pWvD6-bnUYEZWB8a8QqyGU/edit?usp=sharing" target="_blank">Swasthx Release Process - Full Documentation <i class="fas fa-external-link-alt"></i></a>**

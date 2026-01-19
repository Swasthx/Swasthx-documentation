---
layout: default
title: WB More Info
parent: Backend
grand_parent: Workflows & Processes
---

# Website Backend More Info

## Environment Variables Prod, QA, Dev

The Website Backend uses several environment variables for configuration. These are typically stored in a `.env` file and injected during the deployment process. Below is a list of common environment variables used:

- `PORT`: The port on which the backend server listens (e.g., `3000`).
- `MONGODB_URI`: Connection string for the MongoDB database.
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `AWS_REGION`: AWS region for services.
- `ECR_REPOSITORY`: Name of the ECR repository for Docker images.
- `APP_RUNNER_SERVICE_ARN`: ARN of the AWS App Runner service.
- `LOG_LEVEL`: Logging verbosity level (e.g., `info`, `debug`).
- `API_RATE_LIMIT`: Maximum number of API requests allowed per time window.
- `CORS_ORIGINS`: Allowed origins for Cross-Origin Resource Sharing.
- `REDIS_HOST`: Hostname for Redis caching server.
- `REDIS_PORT`: Port for Redis caching server.
- `EMAIL_SERVICE_API_KEY`: API key for the email service provider.
- `PAYMENT_GATEWAY_KEY`: API key for the payment gateway integration.

Ensure to keep sensitive information secure and avoid hardcoding them in the source code. Use secret management solutions or environment variable injection during deployment.

## Env Docs Links

<a href="https://docs.google.com/document/d/1YSntOzR6COoDeE8HpluGJupaU41atZ2np8HMUb7wHrA/edit?usp=sharing" target="_blank">Prod Env</a>

<hr>

<a href="https://docs.google.com/document/d/15JwJ-A72h1-CfoYiu-endCw01btlROFUrMp_9tdllTw/edit?usp=sharing" target="_blank">QA Env</a>

<hr>
<a href="https://docs.google.com/document/d/1YY3tFINNbxIVo2Fenh1-LCTG00RmM3WvunnP7EdBxiI/edit?tab=t.0" target="_blank">Dev Env</a>

## Env, DB Migration Governance

For managing environment variables and database migrations, it is essential to follow governance practices to ensure consistency, security, and reliability across different environments (Prod, QA, Dev). Here are some key governance practices:

<a heref="https://docs.google.com/document/d/1YDMlA9r9FMy5HPeyacTW9O9fbRmiHt40lQHFRYJoUjI/edit?usp=sharing" target="_blank">Env Rules & Governance</a>

## Roadblocks Suggestions

Based on a comprehensive review of the codebase, dependencies, configuration, and architecture, here's an analysis of the Swasthx backend project—a NestJS-based healthcare platform integrating with India's Ayushman Bharat Digital Mission (ABDM) for ABHA (Ayushman Bharat Health Account) management, health record linking, data transfer, and doctor appointment functionalities

<br>
<a href="https://docs.google.com/document/d/1Ka1aBZ2d7r3PdUOUXn7dES79tVPOOgYBG26iJjiHJaI/edit?usp=sharing" target="_blank">Roadblocks & Suggestions</a>
<hr>
## Website Naming Convention

This document outlines the naming conventions for the website backend components, including databases, collections, and environment variables. Adhering to these conventions ensures consistency, clarity, and ease of maintenance across the development team.
Some inconsistencies were found in the current naming conventions. The document provides recommendations to standardize names and improve overall organization.
Inconsistencies Found:

- Variations in database and collection names across different environments (Dev, QA, Prod).
  - Lack of a unified format for environment variable names.
  - Inconsistent use of underscores, camelCase, and hyphens in names.
    Recommendations:
  - Standardize database and collection names to follow a consistent format (e.g., lowercase with underscores).
  - Define a clear format for environment variable names (e.g., uppercase with underscores).
  - Create a centralized naming convention document for reference by all team members.

<br>
<a href="https://docs.google.com/document/d/1iTPRwxOlAtdcGVWwWFyIr0BF_qgab7BtaTRx2y5HpjA/edit?usp=sharing" target="_blank">Read Website Backend Naming Conventions</a>
<hr>

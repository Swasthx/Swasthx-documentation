---
layout: default
title: Website Documentation
permalink: /website
---

# Website Documentation

## 1. What is it?
The Swasthx ecosystem includes two primary web properties:
1.  **Landing Page**: The public-facing marketing website.
2.  **Doctor Portal (HMIS)**: A web-based Hospital Management Information System for healthcare providers.

## 2. Environments & Branching
We maintain distinct environments for both Frontend (Website/Portal) and Backend.

### Backend Environments

| Environment | Branch | Description |
| :--- | :--- | :--- |
| **Development** | `development` | Active development branch. |
| **QA** | `QA` | Stability testing and Quality Assurance. |
| **Production** | `production` | Stable production release live for users. |

### Frontend Environments (Doctor Portal)

| Environment | Branch | Description |
| :--- | :--- | :--- |
| **Development** | `development-new` | For testing new features during development. |
| **QA** | `QA` | For internal testing/QA team verification. |
| **Production** | `production` | Production release branch. |

## 3. Deployment

### Frontend Deployment
Websites are hosted on **AWS Amplify**.
-   **Landing Page**: [https://swasthx.com](https://swasthx.com)
-   **Doctor Portal (Prod)**: [https://prod-doctor.swasthx.com](https://prod-doctor.swasthx.com)
-   **Doctor Portal (QA)**: [https://qa-doctor.swasthx.com](https://qa-doctor.swasthx.com)
-   **Doctor Portal (Dev)**: [https://dev-doctor.swasthx.com](https://dev-doctor.swasthx.com)

### Backend Deployment
Backend services are deployed on **AWS App Runner**.

| Environment | App Runner Service | AWS Resources Link |
| :--- | :--- | :--- |
| **Development** | `website-development-service` | [View Resources]({{ '/aws-resources' | relative_url }}#3-website-development-service) |
| **QA** | `website-qa-service` | [View Resources]({{ '/aws-resources' | relative_url }}#2-website-qa-service) |
| **Production** | `website-production-service` | [View Resources]({{ '/aws-resources' | relative_url }}#1-website-production-service) |

For further details, refer to the [AWS Resources]({{ '/aws-resources' | relative_url }}) page.

## 4. Backend APIs
The website interacts with the core backend services.

-   **[Website API Documentation]({{ '/api-website' | relative_url }})**: Reference for Provider/Admin endpoints.
-   **[Postman Collection Guide]({{ '/postman-collection-guide' | relative_url }})**: Instructions for testing.

### Important URLs
- **website Frontend Repository URLs**:
    - development - [https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/development-new](website frontend dev repo)
    - qa - [https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/QA](website frontend qa repo)
    - production - [https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/production](website frontend production repo)
- **Website Backend Repository URLs**:
    - development - [https://github.com/Swasthx/swasthx_backend_website/tree/development](website backend dev repo)
    - qa - [https://github.com/Swasthx/swasthx_backend_website/tree/QA](website backend qa repo)
    - production - [https://github.com/Swasthx/swasthx_backend_website/tree/production](website backend production repo)
- **APP runner**:
    - `website-production-service` -  prod deployment
    - `website-qa-service` -  QA depoyment
    - `website-development-service` - dev deployment
- **API Gateways**:
    - `website_development` - connected with `website-development-service`
    - `website_production` - connected with `website_production`
    - `website_qa` - connected with `website_qa`
- **AWS Secret manager**:
    - for website development branch - `swasthx_backend_website/development/creds`
    - for website  production branch - `swasthx_backend_website/production/creds`
    - for website QA branch -  `swasthx_backend_website/qa/creds`
---
layout: default
title: PHR App Documentation
permalink: /phr-app
---

# PHR App Documentation

## 1. What is it?
The Swasthx PHR (Personal Health Record) App is a native mobile application designed for patients to manage their health records, book appointments, and interact with healthcare providers. It is built using **React Native** for cross-platform compatibility (iOS/Android) and **Nest.js** for the backend.

## 2. Environments & Branching
We maintain three distinct environments for both Frontend (Mobile App) and Backend to ensure stable releases.

### Backend Environments

| Environment | Branch | Description |
| :--- | :--- | :--- |
| **Development** | `development` | Active development branch. Fast-paced changes. |
| **QA** | `qa` | Stability testing and Quality Assurance. |
| **Production** | `main` / `production` | Stable production release live for users. |

### Frontend Environments

| Environment | Branch | Description |
| :--- | :--- | :--- |
| **Development** | `development` | For testing new features during development. |
| **QA** | `qa` | For internal testing/QA team verification. |
| **Production** | `main` | Published to Play Store/App Store. |

## 3. Deployment
The PHR App backend services are containerized and deployed on **AWS App Runner**.

| Environment | App Runner Service | Infrastructure Details |
| :--- | :--- | :--- |
| **Development** | `swasthx-backend-service` | [View Resources]({{ '/docs/infra/cloud-overview.html' | relative_url }}#6-swasthx-backend-service) |
| **QA** | `PHR_QA_DEPLOYMENT` | [View Resources]({{ '/docs/infra/cloud-overview.html' | relative_url }}#5-phr_qa_deployment) |
| **Production** | `PHR_production` | [View Resources]({{ '/docs/infra/cloud-overview.html' | relative_url }}#4-phr_production) |

For a complete list of cloud resources, refer to the [AWS Resources]({{ '/docs/infra/cloud-overview.html' | relative_url }}) page.

## 4. APIs & Integration
The PHR App consumes the Swasthx Backend APIs.

- **[PHR API Documentation]({{ '/api-phr' | relative_url }})**: Comprehensive reference for all PHR-specific endpoints.
- **[Postman Collection Guide]({{ '/postman-collection-guide' | relative_url }})**: Instructions on how to import and use our API collection for testing.

### Important URLs
- **PHR Backend Repository URLs**:
    - development - [https://github.com/Swasthx/swasthx_backend](phr backedn dev repo)
    - qa - [https://github.com/Swasthx/swasthx_Backend/tree/QA](phr backedn qa repo)
    - production - [https://github.com/Swasthx/swasthx_Backend/tree/production](phr backedn production repo)
- **PHR Frontend Repository URLs**:
    - development - [https://github.com/Swasthx/Swasthx_Software/tree/development](phr frontend dev repo)
    - qa - [https://github.com/Swasthx/Swasthx_Software/tree/QA](phr frontend qa repo)
    - production - [https://github.com/Swasthx/Swasthx_Software/tree/main](phr frontend main repo)
- **APP runner**:
    - `PHR_production` -  prod deployment
    - `PHR_QA_DEPLOYMENT` -  QA depoyment
    - `swasthx-backend-service` - dev deployment
- **API Gateways**:
    - `PHR_development` - connected with `swasthx-backend-service`
    - `PHR_production` - connected with `PHR_production`
    - `PHR_qa` - connected with `PHR_qa`
- **PHR Backend URLs**:
    - development URL - [https://new-swasthxapp.api.swasthx.com](https://new-swasthxapp.api.swasthx.com) - this is connected with API Gateway `PHR_development`
    - production URL - [https://phrproduction.api.swasthx.com](https://phrproduction.api.swasthx.com) - this is connected with API Gateway `PHR_production`
    - qa URL - [https://phrqa.api.swasthx.com](https://phrqa.api.swasthx.com) - this is connected with API Gateway `PHR_qa`

## 5. APK Deployment
APKs are deployed to the Google Play Store via tracks mapping to our environments:
- **Internal Test Track**: mapped to `development` builds.
- **Closed Test Track**: mapped to `QA` builds.
- **Open/production Track**: mapped to `production` builds.

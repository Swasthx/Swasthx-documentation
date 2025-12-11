---
layout: default
title: AWS Amplify
parent: Infrastructure
---

# AWS Amplify

AWS Amplify is a set of tools and services that enables mobile and front-end web developers to build secure, scalable full stack applications, powered by AWS. We use it primarily for hosting and CI/CD of our frontend applications.

## Global Configuration

The following configuration settings apply to all deployed Amplify apps:

### Build Settings
The build process is defined in `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
```

### Firewall
- **Amplify-recommended Firewall protection**: Enabled (WAF)
  - Protects against common vulnerabilities
  - Blocks malicious actors
  - Blocks bad IP addresses
- **IP address protection**: Disabled
- **Country protection**: Disabled

### Rewrites and Redirects
Single Page Application (SPA) routing configuration:

| Source Address | Target Address | Type |
| :--- | :--- | :--- |
| `/<*>` | `/index.html` | 404 (Rewrite) |

## Deployed Services

### 1. Swasthx_LandingPage_Frontend
- **URL**: [https://swasthx.com/](https://swasthx.com/)
- **Branch**: main
- **Type**: Public marketing website
- **Features**:
  - Responsive design
  - CI/CD integration
  - Custom domain with SSL

### 2. Swasthx_HIP_Frontend
- **URL**: [https://qa-doctor.swasthx.com/](QA website for HMIS)
- **Branch**: QA
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

### 3. Swasthx_HIP_Frontend
- **URL**: [https://dev-doctor.swasthx.com/](dev website for HMIS)
- **Branch**: development-new
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

### 4. Swasthx_HIP_Frontend
- **URL**: [https://prod-doctor.swasthx.com/](production website for HMIS)
- **Branch**: production
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

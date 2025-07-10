# 📱 SWASTHX Application Architecture

This document outlines the system architecture for the SWASTHX mobile application, including client interaction, routing, backend services, encryption, database handling, and ABDM integrations.

## 🔹 1. Client Interaction Layer

- **Mobile App**: Developed using React Native.
- **API Invocation**: Initiates HTTPS requests to `https://swasthxapp.api.swasthx.com`.

## 🔹 2. DNS Routing & Gateway

- **Route 53**: AWS DNS service routes API requests.
- **Target Domain**: `swasthxapp.api.swasthx.com` routes to backend hosted in **AWS App Runner**.

## 🔹 3. Backend Services (App Runner)

- **Main API Service**: Handles business logic and serves as the orchestrator.
- **Encryption API**: `Fidelius` Java-based encryption service hosted on the same EC2 instance.
- **MongoDB Database**: Managed on EC2 for CRUD operations and secure data storage.

## 🔹 4. ABDM API Integrations

### 🔑 Session Token
- `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions`

### 🏥 Health Record Exchange (NHPR)
- NHPR v1 APIs:
  - `https://apihspsbx.abdm.gov.in/v4/int/v1`
  - `https://apihspsbx.abdm.gov.in/v4/int/api/v1`
  - `https://apihspsbx.abdm.gov.in/v4/int/apis/v1`
- NHPR v2 APIs:
  - `https://apihspsbx.abdm.gov.in/v4/int/v2`
  - `https://apihspsbx.abdm.gov.in/v4/int/api/v2`

### 🆔 Health ID & ABHA
- `https://healthidsbx.abdm.gov.in/api`
- `https://abhasbx.abdm.gov.in/abha/api`

### 🗂️ Consent & PHR
- Gateway: `https://dev.abdm.gov.in`
- HIE CM: `https://dev.abdm.gov.in`
- PHR APIs: `https://phrsbx.abdm.gov.in/api`

## 🔹 5. Security & Observability

- **Encryption & Token Validation**: Managed by Fidelius API.
- **Signature Management**: Ensures payload integrity.
- **Logs & Monitoring**: Recommended setup via AWS CloudWatch or ELK.

---

![System Architecture Diagram](./image/swatsthxarchitecture.png)
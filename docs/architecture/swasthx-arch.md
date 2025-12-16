---
layout: default
title: System Architecture
permalink: /architecture
---

# Swasthx System Architecture

This document provides a detailed technical overview of the Swasthx platform architecture, covering the PHR Mobile Application, Website, and the underlying cloud infrastructure on AWS.

<div data-context="phr" markdown="1">

## 1. PHR App Architecture

The Personal Health Record (PHR) application enables patients to manage their health data.

### Tech Stack
-   **Frontend**: React Native (Android & iOS).
-   **Backend**: Nest.js Framework.
-   **Cloud Platform**: AWS.
-   **Database**: MongoDB (using AWS DocumentDB).

### System Flow
1.  **Request Entry**: Use specific requests (HTTPS) initiated from the Android/iOS app.
2.  **API Gateway**: All requests first hit the **AWS API Gateway**.
    -   **Authentication**: The gateway validates the JWT token.
    -   **Routing**: Valid requests are routed to the backend service.
3.  **Backend Execution**:
    -   Requests are processed by **AWS App Runner** running the Nest.js application.
    -   **Environment**: Secrets and environment variables are configured directly in AWS App Runner.
4.  **Data Persistence**:
    -   Core data is stored in **AWS DocumentDB** (MongoDB compatible).
    -   Images/Files are stored in **Amazon S3**.
5.  **External Communication**:
    -   SMS notifications are sent using **AWS SNS**.
    -   Deep integration with **ABDM** (Ayushman Bharat Digital Mission).

![PHR System Flow Architecture]({{ site.baseurl }}/docs/images/phr_system_flow_architecture.png)

### Partnership Integration

Swasthx has integrated external APIs to provide additional facilities to the users. We have integrated ABDM APIs to allow users to create ABHA ID and 1MG APIs to allow users to order medicines/book labtest.

#### ABDM Integration Flow
-   **Outbound**: Backend makes calls to ABDM servers for discovery, linking, etc.
-   **Inbound (Callbacks)**: ABDM sends asynchronous responses via webhooks.
    -   **API Gateway** intercepts these callbacks.
    -   Routes them to the specific backend handler in App Runner.

![PHR System Flow]({{ site.baseurl }}/docs/images/phr_system_flow.png)

#### 1MG INTEGRATION

Swasthx phr app is integrated with 1mg APIs to provide facility of ordering medicines and book labtest.

**Ordering medicine flow is like this:**
Search medicine -> Select medicine -> Call drug/otc info based on medicine type -> create/add to cart -> upload prescription -> initiate payment -> confirm order.

![Medicine Ordering Flow]({{ site.baseurl }}/docs/images/medicine_order_flow.png)

**Booking lab test flow is like this:**
Search lab test -> Check lab test is available at user location -> Get the labs providing test and get slots from 1mg API -> initiate payment -> confirm order.

![Lab Test Booking Flow]({{ site.baseurl }}/docs/images/booking_lab_test_flow.png)

### Architecture Diagram

![PHR App Cloud Infrastructure]({{ site.baseurl }}/docs/images/phr-app-cloud-infra.png)

</div>

---

<div data-context="website" markdown="1">

## 1. Website Architecture

The Swasthx Website provides interfaces for patients and providers via web browsers.

### Tech Stack
-   **Frontend**: React.js.
-   **Hosting**: AWS Amplify.
-   **Backend**: Nest.js Framework.
-   **Cloud Platform**: AWS.
-   **Database**: MongoDB (using AWS DocumentDB).

### System Flow
1.  **Frontend Delivery**: The React application is hosted and served via **AWS Amplify**.
2.  **API Routing**: API requests from the browser are directed to **AWS API Gateway** (mapped via Route 53).
3.  **Backend Processing**:
    -   Similar to the PHR app, the backend runs on **AWS App Runner**.
    -   **Configuration**: Environment variables are managed in App Runner + **AWS Secrets Manager** for sensitive credentials.
4.  **Data Persistence**:
    -   Shares the same **AWS DocumentDB** cluster for core data.
    -   Uses **Amazon S3** for file and media storage.
5.  **External Communication**:
    -   Web-triggered SMS/e-mail flows are handled through **AWS SNS** or other notification services.
    -   Maintains the same deep integration with **ABDM** as the PHR app.

![Website System Flow Architecture]({{ site.baseurl }}/docs/images/website_system_flow_architecture.png)

### Partnership Integration

Swasthx has integrated external APIs to provide additional facilities to the users. We have integrated ABDM APIs to allow users to create ABHA ID and 1MG APIs to allow users to order medicines/book labtest.

#### ABDM Integration Flow
-   **Outbound**: Website backend makes calls to ABDM servers for discovery, linking, etc.
-   **Inbound (Callbacks)**: ABDM sends asynchronous responses via webhooks.
    -   **API Gateway** intercepts these callbacks.
    -   Routes them to the specific backend handler in App Runner.

![Website System Flow]({{ site.baseurl }}/docs/images/website_system_flow.png)

### Architecture Diagram

![Website Cloud Infrastructure]({{ site.baseurl }}/docs/images/website-cloud-infra.png)

</div>

---

## 3. Shared Infrastructure & Network Security

### Virtual Private Cloud (VPC)
To ensure security and low latency, critical components are isolated within the same **AWS VPC**:
-   **AWS App Runner** (VPC Connector enabled)
-   **AWS DocumentDB** (Private Subnet)
-   **EC2 Bastion Host** (See below)

### Database Access
**AWS DocumentDB** runs in a private subnet and is not accessible from the public internet. 
-   **Compass Access**: An **EC2 instance** is deployed in the same VPC to act as a jump server/bastion.
-   Developers connect to this EC2 instance via SSH tunnel to access DocumentDB using MongoDB Compass.

### Network Diagram

![Network Diagram]({{ site.baseurl }}/docs/images/network_diagram.png)

---

## 4. Summary of AWS Resources

| Service | Purpose |
| :--- | :--- |
| **AWS Amplify** | Hosting and CI/CD for React Frontend. |
| **AWS API Gateway** | Entry point for APIs, Authentication, Routing, and ABDM Callback handling. |
| **AWS App Runner** | Containerized backend service (Nest.js). Auto-scaling and load balancing. |
| **AWS DocumentDB** | Managed NoSQL database (MongoDB compatible). Secure and scalable. |
| **Amazon S3** | Object storage for images, prescriptions, and static assets. |
| **AWS SNS** | Simple Notification Service for sending SMS. |
| **Route 53** | DNS management and domain registration. |
| **EC2** | Bastion host for secure database access. |
| **Secrets Manager** | Secure storage for website backend credentials. |

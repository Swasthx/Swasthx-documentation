---
layout: default
title: Postman Collection Guide
permalink: /postman-collection-guide
parent: API & Integration
---

# 📦 Postman Collection Guide

This guide details how to use the Swasthx Postman collections for robust API testing and integration.

---

## 📂 Collection Structure

<div data-context="phr" markdown="1">
We have categorized our APIs into a main collection based on the client application: **PHR App**.
</div>

<div data-context="website" markdown="1">
We have categorized our APIs into a main collection based on the client application: **Swasthx HMIS APIs**.
</div>

<div data-context="phr" markdown="1">

## 1. Getting Started

### Workspace Selection
We have a dedicated workspace for PHR Testing.
1.  Open Postman.
2.  Click on **Workspaces** in the top navigation bar.
3.  Select **Swasthx PHR APIs**.

![PHR Workspace Selection]({{ site.baseurl }}/assets/images/postman/phr-workspace-selection.png)

### Environment Selection
Before making any API calls, ensure you have selected the correct environment file (e.g., `Dev env`). This ensures that variables like `baseUrl` are correctly populated.

![PHR Environment Selection]({{ site.baseurl }}/assets/images/postman/phr-environment-selection.png)

### 2. Collection Structure
The workspace is organized into five main collections:
1.  **1 MG APIs for Dev, QA & Prod.**: Main PHR application APIs.
2.  **ABDM PHR endpoints**: APIs related to ABDM integration.
3.  **ABDM session token**: Utilities for token generation.
4.  **Cross APIs PHR <> HMIS**: APIs for cross-platform communication.
5.  **PHR APP**: Core PHR Backend APIs.

![PHR Collections]({{ site.baseurl }}/assets/images/postman/phr-collections.png)

### 3. Detailed Collection Breakdown

#### 3.1 1 MG APIs for Dev, QA & Prod.
This collection contains third-party 1mg APIs used for retrieving medicine and lab test data. To access these APIs, a token is required.

![1mg Collection Root]({{ site.baseurl }}/assets/images/postman/phr-1mg-collection-root.png)

**Medicine**
APIs for fetching medicine data.

![1mg Medicine APIs]({{ site.baseurl }}/assets/images/postman/phr-1mg-medicine.png)

**Lab Tests**
APIs for fetching lab test data.

![1mg Lab Test APIs]({{ site.baseurl }}/assets/images/postman/phr-1mg-lab-tests.png)

**1mg token**
APIs to generate the required tokens for accessing 1mg services.

![1mg Token APIs]({{ site.baseurl }}/assets/images/postman/phr-1mg-token.png)

#### 3.2 ABDM PHR endpoints
This collection contains APIs used to interact directly with ABDM PHR services. It demonstrates the real-world flow of how the PHR backend communicates with ABDM APIs. Similar to other ABDM flows, you must first obtain an `accessToken` before hitting these endpoints.

![ABDM PHR Endpoints]({{ site.baseurl }}/assets/images/postman/phr-abdm-endpoints.png)

**Key Flows:**
- **ABHA ID Creation**: Creating ABHA numbers using Aadhaar.
- **ABHA Address Creation**: Setting up ABHA addresses.
- **PHR Login**: User authentication and profile management.

#### 3.3 ABDM session token
This collection provides utilities for managing ABDM sessions, encryption, and bridge registration.

![ABDM Session Token Collection]({{ site.baseurl }}/assets/images/postman/phr-abdm-session-token.png)

**session token & certificate**
Used to get the `accessToken` required to hit each ABDM API.

![Session Token Details]({{ site.baseurl }}/assets/images/postman/phr-abdm-session-token-details.png)

**registration with bridge**
Used to update and get ABDM callbacks.

![Bridge Registration]({{ site.baseurl }}/assets/images/postman/phr-abdm-bridge-registration.png)

**encrypt data**
Utilities for encrypting data as required by certain ABDM flows.

![Encryption Details]({{ site.baseurl }}/assets/images/postman/phr-abdm-encryption.png)

#### 3.4 Cross APIs PHR <> HMIS
This collection contains Super Admin APIs. The Super Admin uses these APIs to retrieve data from the PHR backend database and manage PHR users, lab tests, and medicines. Communication is secured using an authorized access token.

![Cross APIs PHR <> HMIS]({{ site.baseurl }}/assets/images/postman/phr-cross-apis.png)

#### 3.5 PHR APP
This collection contains all APIs implemented in the PHR Backend. It covers Authentication, ABDM flows, Appointment management, and other core functionalities.

![PHR APP Collection]({{ site.baseurl }}/assets/images/postman/phr-app-collection.png)

## 🚀 How to start testing

### 1. ABDM Flows
To test ABDM flows directly:
1. **Generate Access Token**: Go to `ABDM session token` > `session token & certificate`. Generate an `accessToken`.
2. **Handle Encryption**:
    - Retrieve the **Public Key** from `session token & certificate`.
    - Encrypt data using `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`.

### 2. Swasthx PHR APIs
To test Swasthx PHR APIs:
1. Go to `PHR APP` > `PHR login`.
2. Verify user using any method to generate a **Token**.
3. Use this token in the header for every API call to the Swasthx PHR backend.

## 🔐 How to get access to postman

You can access the Swasthx Postman workspace by:
1.  **Invite Link**: Request an invite link from an admin.
2.  **Swasthx Email**: Sign up using your Swasthx email ID.
3.  **Direct Workspace Link**: <a href="https://swasthx.postman.co/workspace/795520f4-0eb4-49b5-813c-d17781c6fbef" target="_blank">Swasthx PHR APIs Workspace</a> (Requires Swasthx Email).


    > Note: The email ID needs to be obtained from Admin.

## 📖 API Documentation (Swagger)

For detailed API documentation and interactive testing, you can also view our Swagger UI:
<a href="{{ site.baseurl }}/docs/api/phr-api.html" target="_blank">View PHR API Documentation</a>

</div>

---

<div data-context="website" markdown="1">

### 1. Getting Started

Before testing, please ensure you are in the correct workspace and have the local environment configured.

#### Workspace Selection
For website development and testing, use the **Swasthx HMIS APIs** workspace.

![Workspace Selection]({{ site.baseurl }}/assets/images/postman/workspace-selection.png)

#### Environment Selection
Select the applicable environment file (e.g., `wb-local-env`) before making any API calls to ensure variables are correctly populated.

![Environment Selection]({{ site.baseurl }}/assets/images/postman/environment-selection.png)

### 2. Collection Structure

We have four main collections in the website workspace.

![Website Collections]({{ site.baseurl }}/assets/images/postman/website-collections.png)



### 3. Detailed Collection Breakdown

#### 3.1 ABDM
This collection contains ABDM APIs which help in performing core integration tasks.

![ABDM Collection]({{ site.baseurl }}/assets/images/postman/abdm-collection-root.png)

**sessionToken & certificate**
Used to get the `accessToken` required to hit each ABDM API.

![Session Token]({{ site.baseurl }}/assets/images/postman/abdm-session-token.png)

**registrationWithBridge**
Used to update and get ABDM callbacks for M2/M3.

![Callback Registration]({{ site.baseurl }}/assets/images/postman/abdm-registration-bridge.png)

**ABDM HMIS M1/M2/M3/M4**
Contains all the ABDM APIs for the three milestones (M1, M2, M3).

![ABDM Milestones]({{ site.baseurl }}/assets/images/postman/abdm-milestones.png)

#### 3.2 Cross API (WB to PHR)
This collection contains APIs where the Website backend hits the PHR backend (or vice versa) to retrieve or update information. This cross-communication is secured via an auth token checked at the API Gateway level.

![Cross API Collection]({{ site.baseurl }}/assets/images/postman/cross-api-collection.png)

**Key Flows:**
- **Updating Appointment Details**: Syncing appointment changes to the PHR database.
- **Provider Information**: Allowing PHR to retrieve comprehensive doctor/provider information.

#### 3.3 Super Admin
This collection contains APIs exclusively for the Super Admin. It empowers the Super Admin to add, update, and delete other admins via the website. These APIs define the hierarchy, giving admins the authority to manage the doctors added by them.

![Super Admin Collection]({{ site.baseurl }}/assets/images/postman/super-admin-collection.png)

#### 3.4 Swasthx HMIS
This collection houses all the APIs implemented in the Website Backend. It covers the core functionalities including authentication, ABDM flows, and appointment management.

![Swasthx HMIS Collection]({{ site.baseurl }}/assets/images/postman/swasthx-hmis-collection.png)

## 🚀 How to start testing

### 1. ABDM Flows
To test ABDM flows directly:
1. **Generate Access Token**: Use the `ABDM` collection > `sessionToken & certificate` folder to generate an `accessToken`.
2. **Handle Encryption**:
    - Retrieve the **Public Key** from the `sessionToken & certificate` folder.
    - Use an online tool like [Devglan](https://www.devglan.com/online-tools/rsa-encryption-decryption).
    - Select Algorithm: `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`.
    - Encrypt your data and pass it to the API.

### 2. Callback URL Management
To update or verify the callback URL linked to the website backend, use the `ABDM` > `registrationWithBridge` folder.

### 3. Swasthx HMIS APIs
To test Swasthx HMIS APIs:
1. Go to the `Swasthx HMIS` collection > `auth` folder.
2. Verify the mobile number to generate a **Token**.
3. Use this token in the header for every API call to the Swasthx website backend.

## 🔐 How to get access to postman

You can access the Swasthx Postman workspace by:
1.  **Invite Link**: Request an invite link from an admin.
2.  **Swasthx Email**: Sign up using your Swasthx email ID.
3.  **Direct Workspace Link**: <a href="https://swasthx.postman.co/workspace/9ee10cd3-d955-4bc3-b9e2-43b9b7af1259" target="_blank">Swasthx HMIS APIs Workspace</a> (Requires Swasthx Email).


    > Note: The email ID needs to be obtained from Admin.

## 📖 API Documentation (Swagger)

For detailed API documentation and interactive testing, you can also view our Swagger UI:
<a href="{{ site.baseurl }}/docs/api/website-api.html" target="_blank">View Website API Documentation</a>

</div>


<style>
.collection-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #3b82f6;
}

.category-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.category-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.2rem;
}

.category-content p {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.category-content ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #475569;
  font-size: 0.9rem;
}

.category-content li {
  margin-bottom: 0.4rem;
}
</style> 
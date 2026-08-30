---
layout: default
title: Resources
parent: Resources
---

# Resources

This page provides a consolidated list of important links, environment URLs, and repository details for the Swasthx ecosystem.



## 1. Git Repositories & Branches

<div data-context="phr" markdown="1">

### PHR Backend
*   **Repository**: [Swasthx/swasthx_Backend](https://github.com/Swasthx/swasthx_Backend)
*   **Development**: `development` branch (Primary working branch)
*   **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_Backend/tree/QA)
*   **Production**: [`production` branch](https://github.com/Swasthx/swasthx_Backend/tree/production)
    *   *Note: QA and Production branches are created from the development branch.*

</div>

<div data-context="website" markdown="1">

### Website Frontend
*   **Repository**: [Swasthx/Swasthx_HIP_Frontend](https://github.com/Swasthx/Swasthx_HIP_Frontend)
*   **Development**: [`development-new` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/development-new)
*   **QA**: [`QA` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/QA)
*   **Production**: [`production` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/production)

### Website Backend
*   **Repository**: [Swasthx/swasthx_backend_website](https://github.com/Swasthx/swasthx_backend_website)
*   **Development**: [`development` branch](https://github.com/Swasthx/swasthx_backend_website/tree/development)
*   **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_backend_website/tree/QA)
*   **Production**: [`production` branch](https://github.com/Swasthx/swasthx_backend_website/tree/production)

</div>

---

## 2. Application & Environment URLs

<div data-context="website" markdown="1">

### Website Frontend & API Gateways (Doctor Portal / HMIS)

| Environment | Live Frontend URL | API Gateway URL | ABDM Callback URL |
| :--- | :--- | :--- | :--- |
| **Development** | [https://dev-doctor.swasthx.com/](https://dev-doctor.swasthx.com/) | `websitedevelopment.api.swasthx.com` | `websitedevelopment.api.swasthx.com` |
| **QA** | [https://qa-doctor.swasthx.com/login](https://qa-doctor.swasthx.com/login) | `websiteqa.api.swasthx.com` | `websiteqa.api.swasthx.com` |
| **Production** | [https://doctor.swasthx.com/login](https://doctor.swasthx.com/login) | `websiteproduction.api.swasthx.com` | `websiteproduction.api.swasthx.com` |

### App Runner Direct Links
* **Development**: [https://ycatiun3ez.ap-south-1.awsapprunner.com](https://ycatiun3ez.ap-south-1.awsapprunner.com)
* **QA**: [https://98jahxhmj5.ap-south-1.awsapprunner.com](https://98jahxhmj5.ap-south-1.awsapprunner.com)
* **Production**: [https://2vmdwmdstc.ap-south-1.awsapprunner.com](https://2vmdwmdstc.ap-south-1.awsapprunner.com)

</div>

<div data-context="phr" markdown="1">

### PHR Mobile Applications & Backend API

#### Android App
| Environment | Live App URL | Base API URL |
| :--- | :--- | :--- |
| **Development** | *(Pending)* | `https://new-swasthxapp.api.swasthx.com` |
| **QA** | *(Pending)* | `https://phrqa.api.swasthx.com` |
| **Production** | *(Pending)* | `https://phrproduction.api.swasthx.com` |

#### iOS App
| Environment | Live App URL | Base API URL |
| :--- | :--- | :--- |
| **Development** | *(No public link)* | `https://new-swasthxapp.api.swasthx.com` |
| **QA** | [Apple TestFlight](https://testflight.apple.com/join/33chzNj9) | `https://phrqa.api.swasthx.com` |
| **Production** | *(Pending)* | `https://phrproduction.api.swasthx.com` |

### App Runner Direct Links
* **Development**: [https://muwj3h3fcg.ap-south-1.awsapprunner.com](https://muwj3h3fcg.ap-south-1.awsapprunner.com)
* **QA**: [https://xx22sbt2bz.ap-south-1.awsapprunner.com](https://xx22sbt2bz.ap-south-1.awsapprunner.com)
* **Production**: [https://mj2baxemvj.ap-south-1.awsapprunner.com](https://mj2baxemvj.ap-south-1.awsapprunner.com)

</div>

---

## 3. Test Credentials & Login Accounts

<div data-context="website" markdown="1">

> **Universal OTP**: `765432` for all test environments.

| Role | Development (`dev-doctor`) | QA (`qa-doctor`) | Production (`doctor.swasthx.com`) |
| :--- | :--- | :--- | :--- |
| **Admin** | `2222222228` | `2222222228` | `2222222228` |
| **Super Admin** | `5555555555` | `5555555555` | `5555555555` |
| **Reception** | `5555555551` | `5555555551` | `5555555551` |
| **Doctor 1** | `4444444440` | `4444444440` | `4444444440` |
| **Doctor 2** | `4444444441` | `4444444441` | *(Created as needed)* |
| **Doctor 3** | `3333333339` | `3333333339` | *(Created as needed)* |
| **Diagnostic User** | `8888888888` | `8888888888` | *(Contact @Vansh Rana)* |
| **Pharmacy User** | `7777777777` | `7777777777` | *(Contact @Vansh Rana)* |

</div>



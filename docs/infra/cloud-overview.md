---
layout: default
title: AWS Resources
parent: Infrastructure
---

# AWS Services Overview

This document provides a comprehensive overview of all AWS resources used in the Swasthx infrastructure.

## Infrastructure Visuals

<div data-context="phr" markdown="1">

### PHR Mobile App Cloud Architecture
![PHR App Cloud Infrastructure]({{ site.baseurl }}/docs/images/phr-app-cloud-infra.png)

</div>

<div data-context="website" markdown="1">

### Website & Portals Cloud Architecture
![Website Cloud Infrastructure]({{ site.baseurl }}/docs/images/website-cloud-infra.png)

</div>

| Service | Category | Description |
| :--- | :--- | :--- |
| **AWS Amplify** | Frontend / Hosting | Hosts the React.js website and portals; handles CI/CD and domain mapping. |
| **AWS App Runner** | Compute / Container | Managed service for running the Nest.js backend APIs (containerized). |
| **Amazon DocumentDB** | Database | Fully managed NoSQL database service (MongoDB compatible) for storing application data. |
| **Amazon S3** | Storage | Object storage for user-uploaded files, images, and static assets. |
| **Amazon SNS** | Messaging | Simple Notification Service used for sending SMS alerts and notifications. |
| **API Gateway** | Networking | Fully managed service that acts as the "front door" for the backend APIs, handling Auth and Routing. |
| **Route 53** | Networking | scalable DNS and Domain Name System web service. |
| **AWS Secrets Manager** | Security | Securely stores and manages sensitive credentials (e.g., API keys, DB passwords). |
| **EC2** | Compute | [EC2]({{ site.baseurl }}/docs/infra/ec2.html) - Used as a Bastion Host and Snomed Server. |

---

For complete detailed cloud documentation, please see the [Cloud Documentation]({{ site.baseurl }}/docs/infra/documentation.html) page.

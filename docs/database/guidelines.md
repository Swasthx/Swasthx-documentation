---
layout: default
title: Database Guidelines
parent: Database
---

# Database Guidelines

This document outlines the standards, environment details, and access procedures for the Swasthx database layer.

## 1. Technology Stack
We use **AWS DocumentDB**, a fully managed, scalable, and secure document database service that is compatible with **MongoDB**. All guidelines below assume a MongoDB-compatible environment.

## 2. Naming Conventions

### Schema Classes
- **Convention**: **PascalCase**
- **Description**: Class names used when creating schemas must follow PascalCase.
- **Example**:
  ```typescript
  // Correct
  export class UserProfile {}
  export class MedicalRecord {}

  // Incorrect
  export class userProfile {}
  export class user_profile {}
  ```

### Schema Keys (Fields)
- **Convention**: **camelCase**
- **Description**: Keys defined within the schema must be meaningful and follow camelCase. Avoid abbreviations unless standard.
- **Example**:
  ```typescript
  @Schema()
  export class UserProfile {
    // Correct
    @Prop()
    firstName: string;

    @Prop()
    phoneNumber: string;

    // Incorrect
    @Prop()
    First_Name: string; // Wrong case
    @Prop()
    fn: string; // Not meaningful
  }
  ```

## 3. Database Environments & Connection Strings

To ensure isolation and stability, we maintain separate database clusters for our **PHR App** and **Website (HMIS)** applications across Development, QA, and Production environments.

### PHR App Environments

| Environment | Connection String |
| :--- | :--- |
| **Development** | `swasthx-phr-api-dev-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |
| **QA** | `swasthx-phr-api-qa-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |
| **Production** | `swasthx-phr-api-prod-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |

### Website (HMIS) Environments

| Environment | Connection String |
| :--- | :--- |
| **Development** | `swasthx-website-api-dev-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |
| **QA** | `swasthx-website-api-qa-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |
| **Production** | `swasthx-website-api-prod-docdb-cluster.cluster-cfo86268azbn.ap-south-1.docdb.amazonaws.com:27017` |

> [!IMPORTANT]
> These connection strings are for internal use within the VPC. For local access, refer to the "Database Access" section below.

## 4. Database Access

AWS DocumentDB runs in a secure, private subnet within our VPC and is **not directly accessible from the public internet**.

### Accessing via Jump Server
To connect to the database (e.g., using MongoDB Compass) for debugging or verification:
1.  **Jump Server**: We use an EC2 instance deployed in the same VPC as a bastion host.
2.  **Connection Method**: You must establish an **SSH Tunnel** through this EC2 instance.

For detailed steps and diagrams, please refer to the **Database Access** section in the [System Architecture]({{ '/architecture' | relative_url }}#database-access) page.

---
layout: default
title: Amazon EC2
parent: Infrastructure
---

# Amazon EC2 Documentation

This page provides detailed configuration and purpose information for the EC2 instances used in the Swasthx infrastructure.

## Overview

We utilize Amazon EC2 for two primary purposes:
1.  **Jump Server**: Acts as a secure intermediary (bastion host) for connecting to our DocumentDB clusters.
2.  **Snomed Server**: Hosts the Snomed CT terminology service used for medical term searching.

---

## Jump Server

The Jump Server is a critical component for database administration and security. All direct connections to the DocumentDB DocumentDB cluster are routed through this instance via SSH tunneling. This ensures that our database remains in a private subnet and is not directly exposed to the public internet.

### Configuration Details

| Parameter | Value |
| :--- | :--- |
| **Name Tag** | Jump Server |
| **Instance ID** | `i-004d0794a8113aeb7` |
| **Instance Type** | `t2.micro` |
| **AMI ID** | `ami-02b8269d5e85954ef` (Ubuntu 24.04 LTS AMD64) |
| **Public IP** | `65.1.211.10` |
| **Private IP DNS** | `ip-10-10-12-49.ap-south-1.compute.internal` |
| **VPC ID** | `vpc-044cab9e0bd2a8751` (swasthx-website-api-dev-vpc) |
| **Subnet ID** | `subnet-04fc29cea22faf848` |
| **Key Pair** | `swasthxAwsKeyPair` |
| **Root Volume** | `/dev/sda1` (10 GiB, gp3) |

### Security Groups

The Jump Server is associated with the following security groups:
*   `sg-0c0717b440138ffdb` (documentdb_sec_grouy)
*   `sg-0aed5a9c26c6d7cdd` (ec2-docdb-swasthx-website-api-dev-docdb-cluster)

---

<div data-context="website" markdown="1">

## Snomed Server

The Snomed Server is dedicated to the **Website** portal. It powers the prescription module by enabling efficient searching of medical terms using the Snomed CT standard.

### Configuration Details

| Parameter | Value |
| :--- | :--- |
| **Instance ID** | `i-0d3b77e09325d76d8` |
| **Instance Type** | `m7g.xlarge` (Graviton / ARM64) |
| **AMI ID** | `ami-0429d68a1cd41ca80` (Ubuntu 24.04 LTS ARM64) |
| **Public IP** | `13.203.203.166` |
| **Private IP DNS** | `ip-172-31-4-13.ap-south-1.compute.internal` |
| **VPC ID** | `vpc-0b69a09132c5dd5c5` |
| **Subnet ID** | `subnet-0ab5cceff187f7575` |
| **Key Pair** | `swasthxAwsKeyPair` |

> [!NOTE]
> This server uses an ARM64 architecture (`m7g.xlarge`). Ensure any software deployed here is compatible with ARM processors.

</div>

---
layout: default
title: Security Groups
parent: Cloud Documentation
grand_parent: Infrastructure
---

# Security Groups

This page contains documentation for Security Groups used across different services.

## DocumentDB Security Groups
The following security groups are associated with the DocumentDB cluster:

### `docdb-ec2-swathx-website-api-dev-docdb-cluster:i-004d0794a8113aeb7` (sg-0d63aaf0d05c81159)
**Inbound Rules:**
- **Port:** 27017
- **Protocol:** TCP
- **Sources:**
    - `sg-0aed5a9c26c6d7cdd` (ec2-docdb...)
    - `sg-0668f619bcc8d3032` (phr-prod...)
    - `sg-0e0717b440138ffdb` (document...)

![DocumentDB Cluster Inbound Rules](/Swasthx-documentation/docs/images/sg-docdb-cluster-inbound.png)

### `ec2-docdb-swathx-website-api-dev-docdb-cluster:i-0287efd97664a2396` (sg-03911bc69a60b9f47)
**Inbound Rules:**
- **Port:** 27017
- **Protocol:** TCP
- **Source:** `sg-0e0717b440138ffdb` (document...)

![EC2 DocumentDB Inbound Rules](/Swasthx-documentation/docs/images/sg-ec2-docdb-inbound.png)

**Outbound Rules:**
- **Port:** 27017
- **Protocol:** TCP
- **Destination:** `sg-064ff45dea9ce7e63` (docdb-ec2...)

![EC2 DocumentDB Outbound Rules](/Swasthx-documentation/docs/images/sg-ec2-docdb-outbound.png)

### `swathx-website-api-dev-docdb-sg` (sg-0b518fbcc2663d271)
**Inbound Rules:**
- **Port:** 27017
- **Protocol:** TCP
- **Sources:**
    - `sg-0e0717b440138ffdb` (document...)
    - `sg-0df6a17ebee5c9cb0` (swathx-we...)

![Website API DocumentDB SG Inbound Rules](/Swasthx-documentation/docs/images/sg-website-api-docdb-inbound.png)

**Outbound Rules:**
- **Type:** All traffic
- **Port:** All
- **Destination:** `0.0.0.0/0`

![Website API DocumentDB SG Outbound Rules](/Swasthx-documentation/docs/images/sg-website-api-docdb-outbound.png)

## App Runner Security Groups
The App Runner service utilizes the following security groups:
- `default` (sg-0f448f0b7d8cf17a0)
- `swathx-website-api-dev-apprunner-sg` (sg-0df6a17ebee5c9cb0)

![App Runner Security Groups](/Swasthx-documentation/docs/images/security-groups-apprunner.png)

## EC2 Jump Server Security Groups
The EC2 Jump Server is configured with these security groups:
- `documentdb_sec_group` (sg-0e0717b440138ffdb)
- `ec2-docdb-swathx-website-api-dev-docdb-cluster:i-004d0794a8113aeb7` (sg-0aed5a9c26c6d7cdd)

### `ec2-docdb-swathx-website-api-dev-docdb-cluster:i-004d0794a8113aeb7` (sg-0aed5a9c26c6d7cdd)
**Inbound Rules:**
- **Port:** 22 (SSH)
- **Protocol:** TCP
- **Sources:**
    - `223.233.73.0/24`
    - `223.233.0.0/16`
- **Port:** 27017
- **Protocol:** TCP
- **Sources:**
    - `sg-0668f619bcc8d3032` (phr-prod...)
    - `sg-0e0717b440138ffdb` (document...)

![EC2 Jump Server SG Inbound Rules](/Swasthx-documentation/docs/images/sg-ec2-jump-inbound.png)

**Outbound Rules:**
- **Port:** 27017
- **Protocol:** TCP
- **Destination:** `sg-0d63aaf0d05c81159` (docdb-ec2...)

![EC2 Jump Server SG Outbound Rules](/Swasthx-documentation/docs/images/sg-ec2-jump-outbound.png)

![EC2 Jump Server Security Groups](/Swasthx-documentation/docs/images/security-groups-jump-server.png)

## Snomed Server Security Groups
The Snomed Server uses the following security group:
- `TestSecurityGroup` (sg-01a6330220fc29492)

### `TestSecurityGroup` (sg-01a6330220fc29492)
**Inbound Rules:**
- **Port:** 80
- **Protocol:** TCP (HTTP)
- **Source:** `0.0.0.0/0`
- **Port:** 22
- **Protocol:** TCP (SSH)
- **Source:** `49.43.230.0/24`
- **Port:** 8080
- **Protocol:** TCP
- **Source:** `10.0.1.16/28`
- **Port:** 8090
- **Protocol:** TCP
- **Source:** `10.0.1.16/28`
- **Port:** 8091
- **Protocol:** TCP
- **Source:** `0.0.0.0/0`
- **Port:** 27017
- **Protocol:** TCP
- **Sources:**
    - `0.0.0.0/0`
    - `sg-0ca0b24345fad0d73` (default)
- **Port:** 0
- **Protocol:** TCP
- **Source:** `27.6.45.207/32`

![TestSecurityGroup Inbound Rules](/Swasthx-documentation/docs/images/sg-test-sg-inbound.png)

**Outbound Rules:**
- **Type:** All traffic
- **Port:** All
- **Destination:** `0.0.0.0/0`

![TestSecurityGroup Outbound Rules](/Swasthx-documentation/docs/images/sg-test-sg-outbound.png)

![Snomed Server Security Groups](/Swasthx-documentation/docs/images/security-groups-snomed-server.png)




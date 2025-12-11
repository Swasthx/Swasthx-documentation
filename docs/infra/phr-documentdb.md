---
layout: default
title: Amazon DocumentDB
parent: Infrastructure
---

# Amazon DocumentDB

Amazon DocumentDB (with MongoDB compatibility) is a scalable, highly durable, and fully managed database service for operating mission-critical MongoDB workloads.

## Configuration Details
- **Region**: ap-south-1
- **Engine Version**: 5.0.0
- **Status**: Available

## Clusters

### PHR Clusters
The following clusters are used for the PHR (Patient Health Record) application:

1. **Production**
   - **Cluster Identifier**: `swasthx-phr-api-prod-docdb-cluster`
   - **Role**: Regional cluster

2. **Quality Assurance (QA)**
   - **Cluster Identifier**: `swasthx-phr-api-qa-docdb-cluster`
   - **Role**: Regional cluster

3. **Development**
   - **Cluster Identifier**: `swasthx-phr-api-dev-docdb-cluster`
   - **Role**: Regional cluster





## Cluster Configuration

### General Settings
- **Port**: `27017`
- **Master Username**: `appuser`
- **Instance Class**: `db.t4g.medium`
- **TLS Enabled**: Yes
- **Encryption at Rest**: No
- **Network Type**: IPv4 only

### Backup & Maintenance
- **Automated Backups**: Enabled (1 day retention)
- **Backup Window**: 22:04-22:34 UTC
- **Maintenance Window**: Thu:08:25-Thu:08:55 UTC

## Connectivity

### Jump Server (EC2)
A Jump Server (EC2 instance) is used to securely connect to the DocumentDB cluster.
- **Security Group**: `ec2-docdb-swasthx-phr-api-dev-docdb-cluster`
- **Connection Method**: SSH Tunneling / Direct Connection from allowed SG.

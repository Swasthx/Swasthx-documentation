---
layout: default
title: AWS Resources
permalink: /aws-resources
---

# AWS Resources in Use

This document provides a comprehensive overview of all AWS resources used in the Swasthx infrastructure.

## EC2 Graviton Instances

All instances are powered by AWS Graviton processors for optimal price-performance ratio.

### Key Instances

#### 1. swasthxPhrAppGravInst (m7g.large)
- **Purpose**: Hosts backend for Swasthx PHR app
- **Integrations**:
  - Amazon S3 for storage
  - Amazon SNS for notifications
  - AWS Bedrock for AI features
- **Environment**: Production

#### 2. swasthxDocWebsiteGravInst (m7g.large)
- **Purpose**: Hosts backend for Swasthx HMIS platform
- **Integrations**:
  - Amazon S3 for storage
  - Amazon SNS for notifications
- **Environment**: Production

#### 3. swasthxSnomedGravInst (m7g.xlarge)
- **Purpose**: Hosts SNOMED and LIONC servers
- **Usage**: Clinical terminology in HMIS platform
- **Environment**: Production

### Access Management
- Private key-based SSH access
- IAM roles for service communication
- Security groups for network isolation
- Resource tagging for cost allocation

## Amazon S3

### Bucket: swasthx-bucket

**Purpose:**
- Central storage for all application assets
- Document and image repository

**Features:**
- Versioning enabled
- Server-side encryption
- Lifecycle policies for cost optimization
- CORS configuration for web access

**Access Control:**
- IAM policies for service access
- Public read access for specific assets
- S3 bucket policies for cross-account access

## AWS Amplify

### 1. Swasthx_LandingPage_Frontend
- **URL**: [https://swasthx.com/](https://swasthx.com/)
- **Type**: Public marketing website
- **Features**:
  - Responsive design
  - CI/CD integration
  - Custom domain with SSL

### 2. Swasthx_HIP_Frontend
- **URL**: [https://doctor.swasthx.com](https://doctor.swasthx.com)
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

## AWS App Runner

### Overview
AWS App Runner is used to deploy and scale containerized web applications and APIs with minimal configuration.

### Services Deployed

#### 1. API Services
- **Containerized Backend APIs**
  - Auto-scaling based on traffic
  - Automatic load balancing
  - Built-in monitoring and logging

#### 2. Authentication Service
  - JWT token validation
  - Role-based access control
  - Integration with IAM for service authentication

### Configuration
- **Source**: Container registry (ECR)
- **Runtime**: Custom Docker containers
- **Scaling**: Automatic (1-25 instances)
- **Health Checks**: 
  - Path: `/health`
  - Protocol: HTTP
  - Interval: 5 seconds
  - Timeout: 2 seconds
  - Healthy threshold: 3
  - Unhealthy threshold: 5

### Integration
- **Route 53**: Custom domain routing
- **CloudWatch**: Logs and metrics
- **VPC**: Secure network configuration
- **Secrets Manager**: Secure configuration management

## AWS Bedrock

### AI/ML Models

#### Primary Model
- **Claude 3.5 Sonnet**
  - Used for Q&A chatbot in PHR app
  - Optimized for healthcare domain

#### Additional Models
- Claude 3 Sonnet
- Claude 3 Haiku

### Integration
- Secure API access via IAM roles
- Rate limiting and monitoring
- Usage analytics

## Amazon Simple Notification Service (SNS)

### Use Cases
1. **Appointment Management**
   - Confirmation messages
   - Reminder notifications
   - Schedule updates

2. **Record Updates**
   - New test results
   - Prescription updates
   - Health record changes

3. **System Alerts**
   - Security notifications
   - System maintenance alerts
   - Usage reports

### Configuration
- SMS delivery preferences
- Email notifications
- Mobile push notifications
- Webhook integrations

## Amazon Route 53

### Domain Management
- **Primary Domain**: swasthx.com
- **Subdomains**:
  - doctor.swasthx.com (HMIS platform)
  - api.swasthx.com (API endpoints)
  - app.swasthx.com (PHR application)

### DNS Features
- A records for service endpoints
- CNAME records for aliases
- MX records for email services
- TXT records for verification

## Resource Organization

### Tagging Strategy
- **Environment** (Production/Staging/Development)
- **Owner** (Team/Department)
- **Cost Center** (Billing allocation)
- **Compliance** (Data classification)

### Cost Management
- Monthly budget alerts
- Resource utilization reports
- Cost allocation tags
- Reserved Instance planning

## Security & Compliance

### IAM Best Practices
- Least privilege access
- Role-based access control
- Regular access reviews
- Multi-factor authentication

### Monitoring & Logging
- CloudTrail for API logging
- Config for resource tracking
- GuardDuty for threat detection
- Security Hub for compliance

## Backup & Recovery

### Data Protection
- Automated EBS snapshots
- S3 versioning
- Cross-region replication
- Point-in-time recovery

### Disaster Recovery
- Backup retention policies
- Recovery time objectives
- Failover procedures
- Regular testing schedule

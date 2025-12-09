---
layout: default
title: Cloud Documentation
parent: Infrastructure
---

# Cloud Documentation

This page contains detailed documentation of the cloud infrastructure, including architecture diagrams, resource configurations, and service details.

## Infrastructure Visuals

### PHR Mobile App Cloud Architecture
![PHR App Cloud Infrastructure]({{ site.baseurl }}/docs/images/phr-app-cloud-infra.png)

### Website & Portals Cloud Architecture
![Website Cloud Infrastructure]({{ site.baseurl }}/docs/images/website-cloud-infra.png)

---

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
- **Branch**: main
- **Type**: Public marketing website
- **Features**:
  - Responsive design
  - CI/CD integration
  - Custom domain with SSL

### 2. Swasthx_HIP_Frontend
- **URL**: [https://qa-doctor.swasthx.com/](QA website for HMIS)
- **Branch**: QA
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

### 3. Swasthx_HIP_Frontend
- **URL**: [https://dev-doctor.swasthx.com/](dev website for HMIS)
- **Branch**: development-new
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

### 4. Swasthx_HIP_Frontend
- **URL**: [https://prod-doctor.swasthx.com/](production website for HMIS)
- **Branch**: production
- **Type**: Healthcare provider portal (HMIS)
- **Features**:
  - Secure authentication
  - Real-time data updates
  - Role-based access control

## AWS App Runner

### Overview
AWS App Runner is used to deploy and scale containerized web applications and APIs with minimal configuration.

### Deployed Services

#### 1. website-production-service
- **Connected API Gateway**: `website_production`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - Secrets Manager for credentials
  - CloudWatch Logs

#### 2. website-qa-service
- **Connected API Gateway**: `website_qa`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - Secrets Manager for credentials
  - CloudWatch Logs

#### 3. website-development-service
- **Connected API Gateway**: `website_development`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - Secrets Manager for credentials
  - CloudWatch Logs

#### 4. PHR_production
- **Connected API Gateway**: `PHR_production`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

#### 5. PHR_QA_DEPLOYMENT
- **Connected API Gateway**: `PHR_qa`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

#### 6. swasthx-backend-service
- **Connected API Gateway**: `PHR_development`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

## Google gemini

### AI/ML Models

#### Primary Model
- **gemini-2.0-flash**
  - Used for Q&A chatbot in PHR app
  - Optimized for healthcare domain

### Integration
- Secure API access via IAM roles

## Amazon Simple Notification Service (SNS)

### Use Cases
1. **Appointment Management**
   - Confirmation messages
   - Schedule updates

2. **Record Updates**
   - Health record changes

### Configuration
- SMS delivery preferences
- Mobile push notifications

## Amazon Route 53

### Domain Management
- **Primary Domain**: swasthx.com
- **Subdomains**:
  - **Website Frontend Subdomains**
    - prod-website.swasthx.com (Website production branch)
    - qa-website.swasthx.com (Website qa branch)
    - dev-website.swasthx.com (Website development branch)
  - **Website Backend Subdomains**
    - websitedevelopment.api.swasthx.com (HMIS development branch backend) 
    - websiteproduction.api.swasthx.com (HMIS production branch backend) 
    - websiteqa.api.swasthx.com (HMIS qa branch backend) 
  - **PHR Backend Subdomains**
    - new-swasthxapp.api.swasthx.com (PHR development branch backend) 
    - phrproduction.api.swasthx.com (PHR production branch backend) 
    - phrqa.api.swasthx.com (PHR qa branch backend)

### DNS Features
- A records for service endpoints
- CNAME records for aliases
- MX records for email services
- TXT records for verification

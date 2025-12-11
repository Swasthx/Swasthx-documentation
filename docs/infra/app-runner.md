---
layout: default
title: AWS App Runner
parent: Infrastructure
---

# AWS App Runner

## Overview
AWS App Runner is used to deploy and scale containerized web applications and APIs with minimal configuration.

## Global Configuration

The following configuration settings apply to all deployed App Runner services:

**Service Configuration**
- **Port**: `3000`
- **Compute**: 1 vCPU & 2 GB Memory

**Auto Scaling**
- **Configuration**: `DefaultConfiguration`
- **Concurrency**: 100 requests per instance
- **Instances**: Min 1, Max 25

**Health Check**
- **Protocol**: HTTP
- **Path**: `/api`
- **Interval**: 10 seconds
- **Timeout**: 5 seconds
- **Thresholds**: Unhealthy (5), Healthy (1)

**Security**
- **Instance Role**: `arn:aws:iam::515966508772:role/AppRunnerInstanceRole`
- **Encryption**: AWS KMS encryption key (AWS managed)

**Networking**
- **Incoming**: Public endpoint (IPv4)
- **Outgoing**: Custom VPC
- **VPC**: `vpc-044cab9c0bd2a8751` (10.10.0.0/16)
- **Subnets**: `subnet-0d5e3b3fdf01302b6` (ap-south-1a)
- **Security Groups**:
  - `sg-0f448f0b7d8cf17a0` (default)
  - `sg-0df6a17ebee5c9cb0` (swasthx-website-api-dev-apprunner-sg)

## Deployed Services

### 1. website-production-service

**Overview**
- **Connected API Gateway**: `website_production`
- **Description**: Containerized Backend APIs (Nest.js)

**Source & Deployment**
- **Repository**: Amazon ECR
- **Image URI**: `515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_production:latest`
- **Deployment Method**: Automatic
- **ECR Access Role**: `arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole`

### 2. website-qa-service
- **Connected API Gateway**: `website_qa`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: *See Global Configuration*
  - **Health Checks**: *See Global Configuration*
- **Integration**:
  - VPC Connector for DB access
  - Secrets Manager for credentials
  - CloudWatch Logs

### 3. website-development-service
- **Connected API Gateway**: `website_development`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: *See Global Configuration*
  - **Health Checks**: *See Global Configuration*
- **Integration**:
  - VPC Connector for DB access
  - Secrets Manager for credentials
  - CloudWatch Logs

### 4. PHR_production
- **Connected API Gateway**: `PHR_production`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: *See Global Configuration*
  - **Health Checks**: *See Global Configuration*
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

### 5. PHR_QA_DEPLOYMENT
- **Connected API Gateway**: `PHR_qa`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: *See Global Configuration*
  - **Health Checks**: *See Global Configuration*
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

### 6. swasthx-backend-service
- **Connected API Gateway**: `PHR_development`
- **API Services**:
  - Containerized Backend APIs (Nest.js)
  - Auto-scaling and Load Balancing enabled
- **Authentication**:
  - JWT token validation
  - IAM integration
- **Configuration**:
  - **Source**: ECR Container Registry
  - **Scaling**: *See Global Configuration*
  - **Health Checks**: *See Global Configuration*
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

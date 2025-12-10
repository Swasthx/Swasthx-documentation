---
layout: default
title: AWS App Runner
parent: Infrastructure
---

# AWS App Runner

## Overview
AWS App Runner is used to deploy and scale containerized web applications and APIs with minimal configuration.

## Deployed Services

### 1. website-production-service
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
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
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
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
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
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
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
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
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
  - **Scaling**: Automatic (1-25 instances)
  - **Health Checks**: HTTP `/health` (Interval: 5s, Timeout: 2s)
- **Integration**:
  - VPC Connector for DB access
  - CloudWatch Logs

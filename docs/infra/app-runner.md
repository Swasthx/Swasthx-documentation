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

## Monitoring & Alerting

All 6 App Runner services above are monitored for **lifecycle state changes** via an event-driven pipeline that posts Slack alerts the moment a service transitions out of `RUNNING` (e.g., `RUNNING → OPERATION_IN_PROGRESS`, `RUNNING → CREATE_FAILED`, `RUNNING → PAUSED`).

The pipeline:

```
App Runner Service
        │
        │ state-change event
        ▼
Amazon EventBridge   (rule: source = aws.apprunner)
        │
        ▼
AWS Lambda           (AppRunnerStateChangeAlerts)
        │
        │ HTTPS POST
        ▼
Slack #alerts channel
```

A single Lambda + single EventBridge rule covers every service in the account — new App Runner services are automatically monitored without rule changes.

For full configuration detail (event pattern, sample payload, Lambda code, IAM, severity mapping per state):

- [Amazon EventBridge → AppRunnerStateChangeRule]({{ site.baseurl }}/docs/infra/eventbridge.html#1-apprunnerstatechangerule)
- [AWS Lambda → AppRunnerStateChangeAlerts]({{ site.baseurl }}/docs/infra/lambda.html#2-apprunnerstatechangealerts)

### Why EventBridge instead of a CloudWatch alarm

App Runner does not publish a "container crashed" CloudWatch metric. Lifecycle state changes are emitted as EventBridge events (`source: "aws.apprunner"`, `detail-type: "App Runner Service Status Change"`) instead. The event-driven pattern is the correct architecture for this monitoring use case.

## Scaling beyond a single instance

Today every App Runner service runs at `min: 1` instance in steady state. The backend's WebSocket layer already has the Socket.IO + Valkey adapter wired in code — it activates automatically the moment a `REDIS_URL` env var is provided. See [Amazon ElastiCache (Valkey/Redis)]({{ site.baseurl }}/docs/infra/elasticache.html) for the application-side wiring details and the env vars that control it.

Before raising `min` beyond 1, provision an ElastiCache for Valkey cluster + set `REDIS_URL` on the App Runner service. Until then, cross-instance WebSocket broadcast won't work (each instance only delivers to its locally-connected sockets).

## Related documentation

- [Amazon EventBridge]({{ site.baseurl }}/docs/infra/eventbridge.html) — App Runner state-change rule
- [AWS Lambda]({{ site.baseurl }}/docs/infra/lambda.html) — `AppRunnerStateChangeAlerts` function detail
- [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html) — backend async job queue (diagnostic ABDM publish) the App Runner backends produce to + consume from
- [Amazon ElastiCache (Valkey/Redis)]({{ site.baseurl }}/docs/infra/elasticache.html) — Socket.IO pub/sub adapter for multi-instance WebSocket broadcast
- [Security Groups]({{ site.baseurl }}/docs/infra/security-groups.html) — `swasthx-website-api-dev-apprunner-sg`
- [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — `AppRunnerInstanceRole` permissions
- [Website Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) — how secrets reach App Runner containers
- [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — same flow for PHR services

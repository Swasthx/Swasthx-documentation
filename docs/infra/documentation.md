---
layout: default
title: Cloud Documentation
parent: Infrastructure
---

# Cloud Documentation

This section contains detailed documentation of the cloud infrastructure, including architecture diagrams, resource configurations, and service details.

## Compute

*   [AWS App Runner]({{ site.baseurl }}/docs/infra/app-runner.html) — containerized NestJS backends (6 services across dev/qa/prod for Website + PHR)
*   [Amazon EC2]({{ site.baseurl }}/docs/infra/ec2.html) — Jump Server (bastion to DocumentDB) + Snomed Server (medical-term search)
*   [AWS Lambda]({{ site.baseurl }}/docs/infra/lambda.html) — serverless functions (currently `SlackABDMdlqNotification`)
*   [AWS Amplify]({{ site.baseurl }}/docs/infra/amplify.html) — React frontends hosting + CI/CD

## Storage

*   [Amazon S3]({{ site.baseurl }}/docs/infra/s3.html) — `swasthx-bucket` for user uploads, reports, images

## Database

*   [Website DocumentDB]({{ site.baseurl }}/docs/infra/website-documentdb.html) — MongoDB-compatible clusters for the HMIS app
*   [PHR DocumentDB]({{ site.baseurl }}/docs/infra/phr-documentdb.html) — MongoDB-compatible clusters for the PHR app

## Cache / Pub-Sub

*   [Amazon ElastiCache (Valkey/Redis)]({{ site.baseurl }}/docs/infra/elasticache.html) — Socket.IO pub/sub adapter for cross-instance WebSocket broadcast (code wired, cluster not yet provisioned)

## Messaging, Queuing & Events

*   [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html) — diagnostic ABDM publish queue + DLQ (SWX-INFRA-009)
*   [Amazon SNS]({{ site.baseurl }}/docs/infra/sns.html) — SMS notifications via `sendSmsToPatient` topic
*   [Amazon EventBridge]({{ site.baseurl }}/docs/infra/eventbridge.html) — App Runner state-change events → Lambda → Slack

## Networking

*   [Amazon Route 53]({{ site.baseurl }}/docs/infra/route53.html) — DNS for `swasthx.com` and subdomains
*   [Security Groups]({{ site.baseurl }}/docs/infra/security-groups.html) — VPC SG rules for App Runner, EC2, DocumentDB, Snomed

## Security & Identity

*   [IAM Roles]({{ site.baseurl }}/docs/infra/iam-roles.html) — user groups (`developer`, `swasthxAwsFullAccess`) and programmatic-access users
*   [Update AWS Keys]({{ site.baseurl }}/docs/infra/update-aws-keys.html) — step-by-step for rotating IAM access keys

## Key Management

*   [Website Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-website.html) — how secrets flow from GitHub Actions → App Runner config → Secrets Manager → runtime env (Website)
*   [PHR Key Management Overview]({{ site.baseurl }}/docs/infra/key-management-overview-phr.html) — same flow for PHR

## Third-party AI / ML

*   [Google Gemini]({{ site.baseurl }}/docs/infra/gemini.html) — `gemini-2.0-flash` for the PHR Q&A chatbot

## Account-level facts

| | |
| :--- | :--- |
| **AWS Account ID** | `515966508772` |
| **Primary Region** | `ap-south-1` (Mumbai) |
| **Container Registry** | Amazon ECR (`515966508772.dkr.ecr.ap-south-1.amazonaws.com/hmis_production`) |
| **Primary Domain** | `swasthx.com` |

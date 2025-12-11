---
layout: default
title: Amazon SNS
parent: Infrastructure
---

# Amazon Simple Notification Service (SNS)

Amazon SNS is a fully managed messaging service for both application-to-application (A2A) and application-to-person (A2P) communication.

## Use Cases
1. **Appointment Management**
   - Confirmation messages
   - Schedule updates

2. **Record Updates**
   - Health record changes

## Configuration

### SMS Preferences
- **Default message type**: `Transactional`
- **Account spend limit**: $50
- **Default sender ID**: `SWASTHX`
- **Success sample rate**: 100
- **IAM role for logging**: `arn:aws:iam::515966508772:role/SNSDeliveryLoggingRole`

### Topics

#### 1. sendSmsToPatient
- **Name**: `sendSmsToPatient`
- **Display Name**: `swasthxHIMS`
- **ARN**: `arn:aws:sns:ap-south-1:515966508772:sendSmsToPatient`
- **Type**: Standard
- **Topic Owner**: `515966508772`

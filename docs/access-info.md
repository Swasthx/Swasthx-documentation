---
layout: default
title: Access Information
permalink: /access-info
---

# Access Information

## 1. Source Code Access
All repositories are hosted on GitHub under the `Swasthx` organization.
- **Frontend Repos**: `Swasthx-documentation`, `Swasthx_LandingPage_Frontend`
- **Backend Repos**: `Swasthx-Backend`

Request access from the Engineering Manager or DevOps lead.

## 2. AWS Access
AWS access is managed via IAM.
- **Console URL**: `https://swasthx.awsapps.com/start`
- **Request Access**: Submit a ticket to IT support for IAM user creation.
- **CLI Access**: Configure `~/.aws/credentials` with your Access Key and Secret Key.

## 3. Database Access
### MongoDB (Production)
- **Connection String**: Provided via secure vault or environment variables.
- **Access Control**: IP whitelisting required. VPN connection may be necessary.
- **Tools**: Use MongoDB Compass or CLI.

### MongoDB (Staging)
- **Connection String**: `mongodb://staging-db.swasthx.local:27017/swasthx`
- **Credentials**: Available in the team password manager.

## 4. Server Access (SSH)
- **Key Pair**: You need the `swasthx-prod.pem` key file.
- **User**: `ec2-user` or `ubuntu`
- **Command**:
  ```bash
  ssh -i "path/to/key.pem" ec2-user@<instance-ip>
  ```
- **Instances**:
    - PHR App Backend: `swasthxPhrAppGravInst`
    - Doctor Website Backend: `swasthxDocWebsiteGravInst`

## 5. Third-Party Services
- **Razorpay**: Dashboard access for finance/admin roles.
- **Twilio**: Dashboard access for dev/ops roles.
- **Sentry**: Error tracking dashboard access.

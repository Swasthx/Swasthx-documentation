---
layout: default
title: Amazon Route 53
parent: Infrastructure
---

# Amazon Route 53

Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.

## Hosted Zone Details

### swasthx.com
- **Hosted Zone ID**: `Z0268486170B5RZ06J016`
- **Type**: Public Hosted Zone
- **Record Count**: 52
- **Name Servers**:
  - `ns-1485.awsdns-57.org`
  - `ns-699.awsdns-23.net`
  - `ns-1835.awsdns-37.co.uk`
  - `ns-204.awsdns-25.com`

## Domain Management
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

## DNS Features
- A records for service endpoints
- CNAME records for aliases
- MX records for email services
- TXT records for verification

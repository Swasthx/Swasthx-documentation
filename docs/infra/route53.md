---
layout: default
title: Amazon Route 53
parent: Infrastructure
---

# Amazon Route 53

Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.

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

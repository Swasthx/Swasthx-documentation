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
  - **Website & Doctor Portal Frontend Subdomains**
    - `doctor.swasthx.com` / `prod-doctor.swasthx.com` (Doctor/HMIS portal production)
    - `qa-doctor.swasthx.com` (Doctor/HMIS portal QA)
    - `dev-doctor.swasthx.com` (Doctor/HMIS portal development)
    - `www.swasthx.com` (Public marketing website)
  - **Website / HMIS Backend Subdomains**
    - `swasthxhmis.api.swasthx.com` (HMIS API gateway endpoint)
    - `websiteproduction.api.swasthx.com` (HMIS production branch backend)
    - `websiteqa.api.swasthx.com` (HMIS QA branch backend)
    - `websitedevelopment.api.swasthx.com` (HMIS development branch backend)
    - `new-swasthxhmis.api.swasthx.com` (New HMIS backend endpoint)
  - **PHR App Backend Subdomains**
    - `swasthxapp.api.swasthx.com` (PHR main API gateway endpoint)
    - `phrproduction.api.swasthx.com` (PHR production branch backend)
    - `phrqa.api.swasthx.com` (PHR QA branch backend)
    - `phrdevelopment.api.swasthx.com` / `new-swasthxapp.api.swasthx.com` (PHR development branch backend)
    - `swasthxapp.api.preprod.swasthx.com` (PHR pre-production endpoint)

## DNS Features
- A records for service endpoints
- CNAME records for aliases
- MX records for email services (Hostinger Mail)
- TXT records for verification (SPF, DKIM)

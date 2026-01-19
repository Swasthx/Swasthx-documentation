---
layout: default
title: Cross API Documentation
parent: Architecture & Design
---

# Cross API Documentation

This document outlines the API communication flow between the Website Backend and the PHR Backend, specifically detailing the Cross API calls initiated from the Website side.

## Overview

There are specific scenarios where the Website Portals need to access data or perform actions that reside on the PHR Backend. In these cases, the Website Backend acts as an intermediary, forwarding the request to the PHR Backend.

## System Flow

The cross-api communication follows this sequence:

1.  **Website Request**: The Website initiates a request to the Website Backend.
2.  **Website Backend Processing**: The Website Backend receives the request and identifies the need to call the PHR Backend.
3.  **Forwarding**: The Website Backend makes an HTTP request to the PHR Backend API.
    - **Authentication**: The session token is passed in the request `headers`.
4.  **PHR Gateway Auth**: The PHR Gateway intercepts the request and uses a Lambda function to authenticate the call (verifying the session token).
5.  **PHR Backend**: On successful authentication, the request reaches the PHR Backend logic.
6.  **Response**: The PHR Backend processes the request and sends the response back to the Website Backend, which then relays it to the Website.

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/phr-cross-api-arch.png)

### website backend cross-api sequence diagram

The sequence diagram below details the interaction flow initiated by the Website. It shows how the Website Backend acts as a client to the PHR Backend, passing a session token which is verified by a Lambda function at the PHR Gateway before the request is allowed to reach the PHR Backend services.

![Website backend cross-api sequence diagram]({{ site.baseurl }}/docs/images/website-cross-api-sequence.png)

## Involved Collections

The following collections in the **PHR Database** are involved in these API interactions:

- `UserProfile`
- `Advertisement`
- `LabTestCreate`
- `MedicineCategory`
- `ProviderOrder`
- `RewardsFaq`
- `RewardConfig`

## List of Cross APIs

The following APIs are called from the Website Backend to the PHR Backend:

- `userprofile/getAllUserDetails`
- `advertisement/getAll`
- `lab-test/fetch`
- `/medicines`
- `admin/pricing`
- `admin/order`
- `/rewards-admin/config`
- `/rewards-admin`
- `/rewards-faq`
- `/coupons`

## module to module cross api communication diagram

<!-- *tech team will add the diagrams soon....* -->

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/doctor-profile.png)
![Website Cross API Architecture]({{ site.baseurl }}/docs/images/doctor-appointment.png)

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/scan-share.png)

## Super admin module (PHR to Websiste UI) cross api communication diagram

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/super-admin.png)

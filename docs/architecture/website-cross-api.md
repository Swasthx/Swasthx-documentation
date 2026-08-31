---
layout: default
title: Website Cross API Documentation
parent: Architecture & Design
---

# Website Cross API Documentation

This document outlines the API communication flow between the **Website Backend (HIMS)** and the **PHR Backend**, specifically detailing the Cross API calls and integration routes initiated for user health records, pharmacy ordering, and diagnostic lab testing.

---

## Overview

There are specific operational workflows where Website & HMIS Portals need to interface directly with the PHR Application or handle cross-system patient requests via HTTPS. In these scenarios, the Website Backend acts as a secure intermediary or provider, serving requests to and from the PHR Backend.

---

## System Flow

The cross-api communication follows this sequence:

1. **Website Request**: The Website initiates a request to the Website Backend.
2. **Website Backend Processing**: The Website Backend receives the request and identifies the need to call the PHR Backend.
3. **Forwarding**: The Website Backend makes an HTTP request to the PHR Backend API.
   - **Authentication**: The session token is passed in the request `headers`.
4. **PHR Gateway Auth**: The PHR Gateway intercepts the request and uses a Lambda function to authenticate the call (verifying the session token).
5. **PHR Backend**: On successful authentication, the request reaches the PHR Backend logic.
6. **Response**: The PHR Backend processes the request and sends the response back to the Website Backend, which then relays it to the Website.

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/phr-cross-api-arch.png)

### Sequence Diagram

The sequence diagram below details the interaction flow initiated by the Website. It shows how the Website Backend acts as a client to the PHR Backend, passing a session token verified by a Lambda function at the PHR Gateway before the request reaches PHR Backend services.

![Website backend cross-api sequence diagram]({{ site.baseurl }}/docs/images/website-cross-api-sequence.png)

---

## Involved Collections

The following collections in the **PHR Database** are involved in these API interactions:

- `UserProfile`
- `Advertisement`
- `LabTestCreate`
- `MedicineCategory`
- `ProviderOrder`
- `RewardsFaq`
- `RewardConfig`

---

## Standard Website to PHR Cross APIs

The following core APIs are called from the Website Backend to the PHR Backend:

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

---

## Diagnostic Lab Test PHR Cross APIs

> [!NOTE]
> **Diagnostic Controller:** `labtest_phr_cross_api.controller.ts`  
> **Base Route:** `/diagnostic/phr`  
> **Protocol:** HTTPS REST communication connecting PHR mobile requests to the Hospital Diagnostic Management System.

These endpoints facilitate lab test discovery, slot availability checks, cart quotation, booking creation, report retrieval, and refund confirmations.

| HTTP Method | Route Endpoint | Description / Functionality |
| :--- | :--- | :--- |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/quote` | Quote a lab-test cart (authoritative price calculation) |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/bookings` | Submit a new patient lab-test booking |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/bookings` | List a patient's lab-test bookings (filtered by `hospitalId` & `phone`) |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/bookings/:id` | Get status for a specific lab-test booking |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/bookings/:id/results` | Get diagnostic report results for a completed lab test |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/bookings/:id/report` | Get full uploaded report document for a booking |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/bookings/:id/cancel` | Cancel an existing lab-test booking |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/bookings/:id/reschedule` | Reschedule a lab-test booking time slot |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/callbacks/refund-confirm` | Callback: Confirm a PHR-paid lab-test refund |
| <span class="badge badge-patch">PATCH</span> | `/diagnostic/phr/bookings/:id/payment-status` | Mark a lab-test booking as `PAID` (by booking `_id`) |
| <span class="badge badge-post">POST</span> | `/diagnostic/phr/tests-and-bookings` | **QR Landing:** Fetch hospital lab catalogue + patient's active lab bookings |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/categories` | List global lab-test categories |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/tests` | Browse global lab-test catalog (with filters & pagination) |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/tests/:id/available-slots` | Fetch available slots for a test (`hospitalId`, `date`, `durationMinutes`, `mode`) |
| <span class="badge badge-get">GET</span> | `/diagnostic/phr/tests/:id` | Get comprehensive details for a single lab test |

---

## Pharmacy to PHR App Cross APIs

> [!NOTE]
> **Pharmacy Controller:** `pharma_to_phr_app.controller.ts`  
> **Base Route:** `/pharmacy/phr`  
> **Protocol:** HTTPS REST communication connecting PHR mobile pharmacy orders to the Hospital Pharmacy System.

These endpoints handle hospital pharmacy medicine browsing, price quoting, order submission (Prepaid or Pay at Counter), order cancellation, line-item returns, and refund callbacks.

| HTTP Method | Route Endpoint | Description / Functionality |
| :--- | :--- | :--- |
| <span class="badge badge-post">POST</span> | `/pharmacy/phr/quote` | Quote a cart (authoritative bill & tax calculation without order creation) |
| <span class="badge badge-get">GET</span> | `/pharmacy/phr/orders` | List a patient's PHR pharmacy orders (`hospitalId`, `patientId` / `phone`) |
| <span class="badge badge-get">GET</span> | `/pharmacy/phr/orders/:id` | Get status for a specific PHR pharmacy order |
| <span class="badge badge-get">GET</span> | `/pharmacy/phr/categories` | List global pharmacy medicine categories |
| <span class="badge badge-get">GET</span> | `/pharmacy/phr/medicines` | Browse a hospital's pharmacy medicine catalog |
| <span class="badge badge-get">GET</span> | `/pharmacy/phr/medicines/:id` | Get details for a single medicine (hospital-scoped) |
| <span class="badge badge-post">POST</span> | `/pharmacy/phr/orders` | Submit a patient pharmacy order (`PREPAID` or `PAY_AT_COUNTER`) |
| <span class="badge badge-post">POST</span> | `/pharmacy/phr/orders/:id/cancel` | Cancel an active patient pharmacy order |
| <span class="badge badge-post">POST</span> | `/pharmacy/phr/orders/:id/return` | Initiate line-item returns on a delivered pharmacy order |
| <span class="badge badge-post">POST</span> | `/pharmacy/phr/callbacks/refund-confirm` | Callback: Confirm a PHR-executed pharmacy refund |

---

## Module to Module Cross API Communication Diagrams

### Data Flowing from Web Module to PHR Module for Doctor Profile
![Website Cross API Architecture]({{ site.baseurl }}/docs/images/doctor-profile.png){: .thumbnail-zoom}

### Data Flowing from Web Module to PHR Module for Appointment
![Website Cross API Architecture]({{ site.baseurl }}/docs/images/doctor-appointment.png){: .thumbnail-zoom}

### Data Flowing from Web Module to PHR Module for Scan and Share
![Website Cross API Architecture]({{ site.baseurl }}/docs/images/scan-share.png){: .thumbnail-zoom}

---

## Super Admin Module (PHR to Website UI) Cross API Communication Diagram

![Website Cross API Architecture]({{ site.baseurl }}/docs/images/super-admin.png){: .thumbnail-zoom}

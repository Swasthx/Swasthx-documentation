---
layout: default
title: PHR API Documentation
permalink: /api-phr
---

# SwasthX PHR API Documentation

This document provides a reference for the PHR (Personal Health Record) Mobile App APIs.

---

## Authentication

### Get OTP for Login
- **POST** `{{baseUrl}}/auth/login/otp`
- **Body:** `{ "hashString": "...", "mobileNum": "..." }`

### Verify OTP for Login
- **POST** `{{baseUrl}}/auth/verify/login/otp`
- **Body:** `{ "mobileNum": "...", "otp": "..." }`

### Get Token for App
- **POST** `{{baseUrl}}/auth/token/app`

---

## PHR Cart & Orders

### Add Item to Cart
- **POST** `{{baseUrl}}/phr/cart`
- **Body:** `{ "abhaAddress": "...", "type": "MEDICINE", "medicines": { ... } }`

### Get Cart
- **GET** `{{baseUrl}}/phr/cart/{{abhaAddress}}`

### Create Order
- **POST** `{{baseUrl}}/phr/order`
- **Body:** `{ "abhaAddress": "...", "cartId": "...", "deliveryAddress": { ... } }`

### Doctor-Prescribed Medicine Proposals
- **POST** `{{baseUrl}}/phr/order/proposal/consent`
  - *Accept or reject doctor-prescribed medicine order proposals with patient consent.*

### Get Order History
- **GET** `{{baseUrl}}/phr/order/{{abhaAddress}}`

---

## Health Documents

### Upload Document
- **POST** `{{baseUrl}}/upload/document/any`

### Get Documents
- **GET** `{{baseUrl}}/upload/get-document?patient={{mobileNum}}`

---

## AI Assistant & Other PHR Services

### AI Chatbot Assistant
- **POST** `{{baseUrl}}/ai/chat`
  - *Powered by Gemini 2.5 Flash for direct doctor, lab, and health recommendations.*

### UHI Blood Bank Search
- **POST** `{{baseUrl}}/uhi/blood-bank/search`
  - *Search nearby blood banks holding specific blood group & component via UHI/Beckn protocol.*

### Rewards & Coupons
- **GET** `{{baseUrl}}/rewards/balance/{{abhaAddress}}`
  - *Fetch user reward points balance & summary.*
- **GET** `{{baseUrl}}/rewards/history/{{abhaAddress}}`
  - *Fetch labeled reward transactions & redemption ledger history.*
- **POST** `{{baseUrl}}/rewards/redeem`
  - *Redeem reward points against checkout orders.*
- **POST** `{{baseUrl}}/rewards/config`
  - *Upsert reward configuration rules & boot-time validation.*

### Search Medicines
- **GET** `{{baseUrl}}/phr/search?query=...`
  - *HIMS catalog search with category, single item, and price quote support.*

### Notifications
- **GET** `{{baseUrl}}/phr/notifications/{{abhaAddress}}`
- **PATCH** `{{baseUrl}}/phr/notifications/{{abhaAddress}}/seen-all`

### Delivery Addresses
- **GET** `{{baseUrl}}/delivery-address/{{abhaAddress}}`
- **POST** `{{baseUrl}}/delivery-address`

### Doctor Booking
- **POST** `{{baseUrl}}/doctor-appointment/book`
  - *Supports both online payment and Pay-at-Reception / Pay-at-Counter booking.*
- **GET** `{{baseUrl}}/doctor-appointment/doctor/{{doctorId}}`
- **GET** `{{baseUrl}}/doctor-profile/getSlots`
  - *Query slots by doctor ID, hospital ID, and date.*
- **POST** `{{baseUrl}}/cancelUserSlot`
  - *Idempotent appointment cancellation endpoint.*

### Lab Tests & Diagnostics
- **POST** `{{baseUrl}}/phr/lab-test/book`
  - *Book diagnostic test with Pay-at-Reception or online payment; passes ABHA identity & idempotency key.*
- **POST** `{{baseUrl}}/phr/lab-test/1mg/book`
  - *Cart-less 1MG online lab test booking.*
- **POST** `{{baseUrl}}/phr/lab-test/pay-later`
  - *Pay-later endpoint for unpaid / Pay-at-Reception HIMS lab bookings.*
- **GET** `{{baseUrl}}/phr/lab-test/catalog`
  - *Fetch HIMS diagnostic categories, tests, and pricing catalog.*
- **GET** `{{baseUrl}}/phr/lab-test/bookings/{{abhaAddress}}`
  - *Fetch lab test bookings list with per-test status tracking.*
- **GET** `{{baseUrl}}/phr/lab-test/report/{{bookingId}}`
  - *Fetch Report Ready status and PDF URL.*

### QR Code & Scan & Share
- **POST** `{{baseUrl}}/phr/scan-share/scan`
  - *Scan hospital QR code to fetch facility doctor list and today's confirmed/rescheduled appointments.*
- **POST** `{{baseUrl}}/phr/scan-share/check-in`
  - *Perform instant appointment check-in via QR scan; forwards patient appointment ID in ABDM Scan & Share context metadata and syncs Pay-Later payment status for unpaid/pay-at-reception bookings.*
- **POST** `{{baseUrl}}/phr/scan-share/share-profile`
  - *Share patient ABHA profile with HIP/HIU storing hipId in token notification metadata.*

---

## ABDM / PHR Core

### Enroll
- **POST** `{{baseUrl}}/phr/m1/enrollment/abha-number`
- **POST** `{{baseUrl}}/phr/m1/enrollment/mobile`
- **POST** `{{baseUrl}}/phr/m1/enrollment/aadhaar/generate-otp`
  - *Forwards real Aadhaar OTP errors directly from ABDM.*

### Consent
- **POST** `{{baseUrl}}/phr/m3/consent/init`
  - *Deduplicates per care-context and auto-categorizes active, expired, and revoked consents.*

### Health Locker & Subscription
- **POST** `{{baseUrl}}/phr/m3/subscription/request/init`
  - *Initialize Health Locker subscription request.*
- **POST** `{{baseUrl}}/phr/m3/subscription/enable/:id`
  - *Enable Health Locker (auto-enabled on user account creation).*
- **POST** `{{baseUrl}}/phr/m3/subscription/disable/:id`
  - *Disable Health Locker.*
- **POST** `{{baseUrl}}/phr/m3/auto-approval/toggle`
  - *Toggle split auto-approval permissions for Health Locker independently from subscription status.*

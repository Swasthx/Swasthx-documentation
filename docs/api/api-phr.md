---
layout: default
title: PHR API Documentation
permalink: /api-phr
---

# SwasthX PHR API Documentation

This document provides a comprehensive reference for all PHR (Personal Health Record) Mobile App APIs.

---

## 1. Authentication & Session Management

### Get OTP for Login
- **POST** `{{baseUrl}}/auth/login/otp`
- **Body:** `{ "hashString": "...", "mobileNum": "..." }`

### Verify OTP for Login
- **POST** `{{baseUrl}}/auth/verify/login/otp`
- **Body:** `{ "mobileNum": "...", "otp": "..." }`

### Get Session Token for App
- **POST** `{{baseUrl}}/auth/token/app`

---

## 2. ABDM Milestone 1 — ABHA Enrollment & Login

### Enroll via Mobile Number
- **POST** `{{baseUrl}}/phr/m1/enrollment/mobile`
  - *Initiate ABHA enrollment using mobile number OTP verification.*

### Enroll via ABHA Number
- **POST** `{{baseUrl}}/phr/m1/enrollment/abha-number`
  - *Enroll using existing government-issued ABHA number.*

### Generate Aadhaar OTP for Enrollment
- **POST** `{{baseUrl}}/phr/m1/enrollment/aadhaar/generate-otp`
  - *Triggers Aadhaar OTP generation; surfaces real Aadhaar OTP errors directly from ABDM.*

### Login via Mobile Number
- **POST** `{{baseUrl}}/login/mobile/generate-otp` & `POST {{baseUrl}}/login/mobile/verify-otp`

### Login via ABHA Address
- **POST** `{{baseUrl}}/login/abha-address/generate-otp` & `POST {{baseUrl}}/login/abha-address/verify-otp`

### Login via Password
- **POST** `{{baseUrl}}/login/password`

---

## 3. ABDM Milestone 2 — Care Context Discovery & Linking

### Discover Care Contexts
- **POST** `{{baseUrl}}/phr/m2/discovery/discover`
  - *Discover patient care contexts across connected healthcare facilities (HIPs).*

### Initiate Record Linking
- **POST** `{{baseUrl}}/phr/m2/linking/init`
  - *Initiate OTP-based record linking to patient's ABHA account.*

### Confirm Record Linking
- **POST** `{{baseUrl}}/phr/m2/linking/confirm`
  - *Confirm OTP to link facility health records with ABHA account.*

### HIP-Initiated Record Linking
- **POST** `{{baseUrl}}/phr/m2/hip/linking/init` & `POST {{baseUrl}}/phr/m2/hip/linking/confirm`
  - *Handle HIP-initiated patient record linking flows.*

---

## 4. ABDM Milestone 3 — Consent Management & Data Fetch

### Initiate Consent Request
- **POST** `{{baseUrl}}/phr/m3/consent/init`
  - *Create consent request; deduplicates per care-context and tracks active, expired, and revoked consents.*

### Fetch Consent List
- **GET** `{{baseUrl}}/phr/m3/consent/list?abhaAddress=...`

### Request Health Data Fetch
- **POST** `{{baseUrl}}/phr/m3/fetch/request`
  - *Request encrypted health data fetch from linked HIP.*

### Retrieve Decrypted Health Data
- **GET** `{{baseUrl}}/phr/m3/fetch/data/:consentId`
  - *Retrieve decrypted FHIR health records bundle for viewing in app.*

---

## 5. ABDM Milestone 3 — Health Locker, Subscriptions & Auto-Approval

### Setup Health Locker
- **POST** `{{baseUrl}}/phr/subscription/setup-locker`
  - *Setup Health Locker for ABHA account (auto-enabled on user account creation).*

### Initialize Subscription Request
- **POST** `{{baseUrl}}/phr/subscription/request/init`
  - *Initialize Health Locker subscription request.*

### Enable / Disable Health Locker Subscription
- **POST** `{{baseUrl}}/phr/subscription/enable/:id` & `POST {{baseUrl}}/phr/subscription/disable/:id`
  - *Enable or disable Health Locker subscription status.*

### Toggle Auto-Approval Permission
- **POST** `{{baseUrl}}/phr/auto-approval/enable/:id` & `POST {{baseUrl}}/phr/auto-approval/disable/:id`
  - *Enable or disable Auto-Approval permission toggle for Health Locker (separate UI button from subscription status).*

### Fetch Auto-Approval Status
- **GET** `{{baseUrl}}/phr/auto-approval?abhaAddress=...`
  - *Fetch current auto-approval setup and permission status.*

---

## 6. Doctor Appointments & Profiles

### Book Doctor Appointment
- **POST** `{{baseUrl}}/doctor-appointment/book`
  - *Book doctor consultation (supports both Online Payment and Pay-at-Reception / Pay-at-Counter booking).*

### Fetch Doctor Profile Details
- **GET** `{{baseUrl}}/doctor-appointment/doctor/{{doctorId}}`

### Query Available Consultation Slots
- **GET** `{{baseUrl}}/doctor-profile/getSlots`
  - *Query slots by doctor ID, hospital ID, and date.*

### Cancel Doctor Appointment
- **POST** `{{baseUrl}}/cancelUserSlot`
  - *Idempotent appointment cancellation endpoint.*

---

## 7. Diagnostics & Lab Tests (1MG & HIMS Aggregation)

### Book Lab Test
- **POST** `{{baseUrl}}/phr/lab-test/book`
  - *Book diagnostic test with Pay-at-Reception or online payment; passes patient ABHA identity & idempotency key.*

### 1MG Online Lab Booking
- **POST** `{{baseUrl}}/phr/lab-test/1mg/book`
  - *Cart-less 1MG online lab test booking.*

### Pay-Later Lab Booking
- **POST** `{{baseUrl}}/phr/lab-test/pay-later`
  - *Pay-later endpoint for unpaid / Pay-at-Reception HIMS lab bookings.*

### Diagnostic Catalog & Categories
- **GET** `{{baseUrl}}/phr/lab-test/catalog` & `GET {{baseUrl}}/diagnostic/lab-test/categories`
  - *Fetch diagnostic categories, tests, catalog filters, and pricing quotes.*

### Patient Bookings & Status Tracking
- **GET** `{{baseUrl}}/phr/lab-test/bookings/{{abhaAddress}}`
  - *Fetch lab test bookings list with per-test status tracking.*

### Lab Test Report & PDF Download
- **GET** `{{baseUrl}}/phr/lab-test/report/{{bookingId}}`
  - *Fetch Report Ready status and PDF URL.*

---

## 8. Pharmacy & Medicine Catalog / Ordering

### Search Medicines
- **GET** `{{baseUrl}}/phr/search?query=...` & `GET {{baseUrl}}/one-mg/medicines/search`
  - *Catalog search across 1MG and HIMS pharmacy catalogs with single item & price quotes.*

### Medicine Categories & Details
- **GET** `{{baseUrl}}/phr/medicines/categories` & `GET {{baseUrl}}/phr/medicines/:id`

---

## 9. Cart, Orders & Prescriptions

### Add Item to Cart
- **POST** `{{baseUrl}}/phr/cart`
  - **Body:** `{ "abhaAddress": "...", "type": "MEDICINE", "medicines": { ... } }`

### Get Cart
- **GET** `{{baseUrl}}/phr/cart/{{abhaAddress}}`

### Create Checkout Order
- **POST** `{{baseUrl}}/phr/order`
  - **Body:** `{ "abhaAddress": "...", "cartId": "...", "deliveryAddress": { ... } }`

### Doctor-Prescribed Medicine Proposals
- **POST** `{{baseUrl}}/phr/order/proposal/consent`
  - *Accept or reject doctor-prescribed medicine order proposals with patient consent.*

### Get Order History
- **GET** `{{baseUrl}}/phr/order/{{abhaAddress}}`

---

## 10. Patient Health Profile & Vitals Tracker

### Fetch Health Profile
- **GET** `{{baseUrl}}/healthprofile`
  - *Fetch comprehensive patient health profile, vital sign history, and water intake stats.*

### Record Vital Signs
- **POST** `{{baseUrl}}/healthprofile/vitals`
  - *Log vital measurements (Blood Pressure, Pulse, Blood Sugar, Temperature, SPO2, Height, Weight, BMI).*

### Log Water Intake
- **POST** `{{baseUrl}}/healthprofile/water-intake`
  - *Track daily water consumption.*

### Historical Lab Trends
- **GET** `{{baseUrl}}/healthprofile/labs`
  - *Retrieve historical lab parameter trends over time.*

---

## 11. AI Assistant & Health Record Summaries

### AI Chatbot Assistant
- **POST** `{{baseUrl}}/chatSearch/sendMessageToLLM`
  - *Powered by Gemini 2.5 Flash for direct doctor specialization recommendations without user interrogation, matching real HMIS doctor profiles.*

### Health Record Summarization
- **POST** `{{baseUrl}}/phr/ai-summary`
  - *Generates 1–2 sentence plain-English summaries for uploaded health records using Gemini multimodal models with SHA-256 caching.*

---

## 12. QR Code Check-In & Scan & Share

### Scan Hospital QR Code
- **POST** `{{baseUrl}}/phr/scan-share/scan`
  - *Scan hospital QR code to fetch facility doctor list and today's confirmed/rescheduled appointments.*

### Instant Appointment Check-In
- **POST** `{{baseUrl}}/phr/scan-share/check-in`
  - *Perform instant appointment check-in via QR scan; forwards patient appointment ID in ABDM Scan & Share context metadata and syncs Pay-Later payment status for unpaid/pay-at-reception bookings.*

### Share ABHA Profile
- **POST** `{{baseUrl}}/phr/scan-share/share-profile`
  - *Share patient ABHA profile with HIP/HIU storing hipId in token notification metadata.*

---

## 13. UHI Blood Bank & Network Search

### Search Blood Banks
- **POST** `{{baseUrl}}/uhi/blood-bank/search`
  - *Search nearby blood banks holding specific blood group & component via UHI/Beckn protocol.*

---

## 14. SwasthX Rewards, Coupons & Dynamic Pricing

### Reward Balance & History
- **GET** `{{baseUrl}}/rewards/balance/{{abhaAddress}}` & `GET {{baseUrl}}/rewards/history/{{abhaAddress}}`

### Redeem Reward Points
- **POST** `{{baseUrl}}/rewards/redeem`

### Rewards Config
- **POST** `{{baseUrl}}/rewards/config`

### Checkout Coupons
- **GET** `{{baseUrl}}/coupons`

### Dynamic Pricing Quotes
- **GET** `{{baseUrl}}/pricing?type=TEST`

---

## 15. Patient Profile, Notifications & Delivery Addresses

### Full Profile Info
- **GET** `{{baseUrl}}/phr/profile/info`

### Update Mobile Number
- **PATCH** `{{baseUrl}}/phr/profile/update-mobile`

### Update Email Address
- **PATCH** `{{baseUrl}}/phr/profile/update-email`

### Update Profile Details
- **PATCH** `{{baseUrl}}/phr/profile/update-profile`

### Notifications
- **GET** `{{baseUrl}}/phr/notifications/{{abhaAddress}}` & **PATCH** `{{baseUrl}}/phr/notifications/{{abhaAddress}}/seen-all`

### Delivery Addresses
- **GET** `{{baseUrl}}/delivery-address/{{abhaAddress}}` & **POST** `{{baseUrl}}/delivery-address`

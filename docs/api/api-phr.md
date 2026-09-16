---
layout: default
title: PHR API Documentation
permalink: /api-phr
---

# SwasthX PHR API Documentation

This document provides a comprehensive reference for all PHR (Personal Health Record) Mobile App APIs.

---

## 1. Authentication & Session Management

### Get OTP for Mobile Login
- **POST** `{{baseUrl}}/auth/login/otp`
  - **Body:** `{ "hashString": "...", "mobileNum": "..." }`

### Verify OTP for Mobile Login
- **POST** `{{baseUrl}}/auth/verify/login/otp`
  - **Body:** `{ "mobileNum": "...", "otp": "..." }`

### Get Session Token for App
- **POST** `{{baseUrl}}/auth/token/app`

### Push Notification Token Registration
- **POST** `{{baseUrl}}/firebase/register/token`
  - **Body:** `{ "abhaAddress": "...", "token": "...", "deviceType": "..." }`

### Encrypt Client Data
- **POST** `{{baseUrl}}/auth/encrypt/data`

> **Session Security:** Protected `/phr/*` endpoints require the `abhaaddress` header. Expiry of the refresh token returns HTTP 440.

---

## 2. ABDM Milestone 1 — ABHA Enrollment, Login & Profile

### ABHA Enrollment via Mobile OTP
- **POST** `{{baseUrl}}/enroll/mobile/generate/otp` & **POST** `{{baseUrl}}/enroll/mobile/verify/otp`
- **POST** `{{baseUrl}}/enroll/mobile/verify/user` & **POST** `{{baseUrl}}/enroll/mobile/suggestion` & **POST** `{{baseUrl}}/enroll/mobile/abha-address`

### ABHA Enrollment via ABHA Number & Aadhaar OTP
- **POST** `{{baseUrl}}/enroll/abha-number/generate/otp` & **POST** `{{baseUrl}}/enroll/abha-number/verify/otp`
- **POST** `{{baseUrl}}/enroll/abha-number/aadhar/generate/otp` & **POST** `{{baseUrl}}/enroll/abha-number/aadhar/verify/otp`

### ABHA v3 Creation & Profile Verification (`/abha-profile/*`)
- **POST** `{{baseUrl}}/abha-profile/generate/otp` & **POST** `{{baseUrl}}/abha-profile/verify/otp`
- **POST** `{{baseUrl}}/abha-profile/alternate-mobile/generate/otp` & **POST** `{{baseUrl}}/abha-profile/mobile/verify/otp`
- **POST** `{{baseUrl}}/abha-profile/fetchAbhaAddressSuggestionsForABHAprofile`
- **POST** `{{baseUrl}}/abha-profile/addUserAbhaAddressForABHAprofile`
- **POST** `{{baseUrl}}/abha-profile/verify/user` (requires `T-token` header)
- **POST** `{{baseUrl}}/abha-profile/switch-profile` & **POST** `{{baseUrl}}/abha-profile/verify/switch-profile/user`

### Login via Mobile OTP
- **POST** `{{baseUrl}}/login/mobile/generate/otp` & **POST** `{{baseUrl}}/login/mobile/verify/otp` & **POST** `{{baseUrl}}/login/mobile/verify/user`

### Login via ABHA Address OTP
- **POST** `{{baseUrl}}/login/abha-address/mobile/otp` & **POST** `{{baseUrl}}/login/abha-address/mobile/verify/otp`

### Login via ABHA Number & Aadhaar OTP
- **POST** `{{baseUrl}}/login/abha-number/generate/otp` & **POST** `{{baseUrl}}/login/abha-number/verify/otp` & **POST** `{{baseUrl}}/login/abha-number/verify/user`
- **POST** `{{baseUrl}}/login/abha-number/aadhar/generate/otp` & **POST** `{{baseUrl}}/login/abha-number/aadhar/verify/otp` & **POST** `{{baseUrl}}/login/abha-number/aadhar/verify/user`
- **POST** `{{baseUrl}}/login/aadhaar-number/generate/otp` & **POST** `{{baseUrl}}/login/aadhaar-number/verify/otp` & **POST** `{{baseUrl}}/login/aadhaar-number/verify/user`

### Login via Password
- **POST** `{{baseUrl}}/login/password/search/user` & **POST** `{{baseUrl}}/login/password/verify/user`

### Profile Info & Cards (`/profile/info/*`)
- **GET** `{{baseUrl}}/profile/info/find` — *Find user profile*
- **GET** `{{baseUrl}}/profile/info/get?abhaAddress=...` — *Get profile details*
- **GET** `{{baseUrl}}/profile/info/qr-code` — *Generate ABHA QR code image*
- **GET** `{{baseUrl}}/profile/info/phr/card` — *Download PHR card PDF*
- **GET** `{{baseUrl}}/profile/info/logout` — *User logout*

### Update Profile & Link ABHA Number (`/phr/profile/*`)
- **POST** `{{baseUrl}}/phr/profile/update` & **POST** `{{baseUrl}}/phr/profile/resetPassword`
- **POST** `{{baseUrl}}/phr/profile/update-mobile/generate/otp` & **POST** `{{baseUrl}}/phr/profile/update-mobile/verify/otp`
- **POST** `{{baseUrl}}/phr/profile/link/abha-number/mobile/generate/otp` & **POST** `{{baseUrl}}/phr/profile/link/abha-number/mobile/verify/otp` & **POST** `{{baseUrl}}/phr/profile/link/abha-number/mobile/request/linking`
- **POST** `{{baseUrl}}/phr/profile/link/abha-number/aadhaar/generate/otp` & **POST** `{{baseUrl}}/phr/profile/link/abha-number/aadhaar/verify/otp` & **POST** `{{baseUrl}}/phr/profile/link/abha-number/aadhaar/request/linking`

---

## 3. ABDM Milestone 2 — Care Context Discovery, Linking & Uploads

### Search ABDM Providers (HIPs)
- **POST** `{{baseUrl}}/phr/providers`
- **GET** `{{baseUrl}}/phr/providers/:hipId`
- **GET** `{{baseUrl}}/phr/providers/govt-programs`

### Discover Patient Care Contexts
- **POST** `{{baseUrl}}/phr/discovery/discover`
  - *Discovers patient care contexts across connected healthcare facilities (HIPs).*

### Poll Discovered Records
- **POST** `{{baseUrl}}/phr/discovery/discover/records`

### Initiate Care Context Linking (HIU-Initiated)
- **POST** `{{baseUrl}}/phr/linking/link/carecontext` & **POST** `{{baseUrl}}/phr/linking/link/response`

### Confirm Care Context Linking
- **POST** `{{baseUrl}}/phr/linking/link/confirm` & **POST** `{{baseUrl}}/phr/linking/link/confirm/response`

### Verify Demographic (HIP-Initiated Linking)
- **POST** `{{baseUrl}}/phr/linking/verify/demographic`

### Fetch Patient Linked Care Contexts
- **POST** `{{baseUrl}}/phr/patient/care-contexts`

### Notify Linking Context & SMS Notification
- **POST** `{{baseUrl}}/phr/linking/hip/context/notify` & **POST** `{{baseUrl}}/phr/linking/sms/notify`

### Upload Document Media to S3
- **POST** `{{baseUrl}}/doctor-profile/unauth/uploadMedia`

### Link Uploaded Document as Care Context
- **POST** `{{baseUrl}}/upload/document`

---

## 4. ABDM Milestone 3 — Consent Management & Data Fetch

### Fetch Consent Requests Inbox
- **GET** `{{baseUrl}}/phr/consent/requests?abhaAddress=...`

### Fetch Consent Details
- **GET** `{{baseUrl}}/phr/consent/detail/:id`

### Approve Consent Request
- **POST** `{{baseUrl}}/phr/consent/approve`

### Deny Consent Request
- **POST** `{{baseUrl}}/phr/consent/request/deny/:id`

### Revoke Granted Consent
- **POST** `{{baseUrl}}/phr/consent/revoke`

### Fetch Consent Artefact
- **GET** `{{baseUrl}}/phr/consent/artefact/:artefactId`

### Fetch Linked Care Contexts for Consent
- **GET** `{{baseUrl}}/phr/consent/linked-care-context`

### Health Information Display Call (App Main Record View)
- **POST** `{{baseUrl}}/phr/health-information/display`
  - *Returns decrypted health records, or consentRequired status, or 202 while fetch is in progress.*

### Health Records List & Document Detail
- **GET** `{{baseUrl}}/phr/health-records/list`
- **GET** `{{baseUrl}}/phr/health-records/document/:id`
- **GET** `{{baseUrl}}/phr/health-records/summary`

### Incoming HIP Data Push
- **POST** `{{baseUrl}}/phr/data/push`
  - *Decrypts data bundle, runs FHIR flattener, and feeds vitals into Health Profile.*

---

## 5. ABDM Milestone 3 — Health Locker, Subscriptions & Auto-Approval

### Setup Health Locker
- **POST** `{{baseUrl}}/phr/subscription/setup-locker`

### Initialize Subscription Request
- **POST** `{{baseUrl}}/phr/subscription/request/init`

### List Subscriptions & Subscription Detail
- **POST** `{{baseUrl}}/phr/subscription/list` & **POST** `{{baseUrl}}/phr/subscription/detail/:id`

### Approve / Deny / Edit Subscription
- **POST** `{{baseUrl}}/phr/subscription/approve` & **POST** `{{baseUrl}}/phr/subscription/deny` & **POST** `{{baseUrl}}/phr/subscription/edit`

### Enable / Disable Subscription
- **POST** `{{baseUrl}}/phr/subscription/enable/:id` & **POST** `{{baseUrl}}/phr/subscription/disable/:id`

### Toggle Auto-Approval Permission
- **POST** `{{baseUrl}}/phr/auto-approval/enable/:id` & **POST** `{{baseUrl}}/phr/auto-approval/disable/:id`

### Fetch Auto-Approval Status
- **GET** `{{baseUrl}}/phr/auto-approval?abhaAddress=...`

---

## 6. Doctor Appointments & Profiles

### Fetch All Doctor Profiles & Nearby Doctors
- **GET** `{{baseUrl}}/provider-order/doctors/all`
- **GET** `{{baseUrl}}/provider-order/doctors/nearby`
- **GET** `{{baseUrl}}/provider-order/doctors/popular`

### Fetch Specific Doctor Profile Details
- **POST** `{{baseUrl}}/provider-order/doctors/getProfile`

### Query Doctor Schedule & Available Slots
- **GET** `{{baseUrl}}/provider-order/doctors/schedule`
- **GET** `{{baseUrl}}/provider-order/doctors/slots`

### Fetch Previously Booked Doctors
- **GET** `{{baseUrl}}/provider-order/doctors/previously-booked`

### Fetch Hospital Doctor Details & Appointments (QR Flow)
- **POST** `{{baseUrl}}/provider-order/doctors/appointments`

### Initiate Doctor Appointment Booking & Payment
- **POST** `{{baseUrl}}/provider-order/initiate-payment`
  - *Supports PREPAID (Razorpay online payment) and UNPAID (Pay-at-Reception / Pay-at-Counter).*

### Confirm Doctor Appointment Order
- **POST** `{{baseUrl}}/provider-order/confirm-order`

### Reschedule Doctor Appointment
- **PATCH** `{{baseUrl}}/provider-order/:id`

### Cancel Doctor Appointment
- **DELETE** `{{baseUrl}}/provider-order/:id`
  - *Cancels consultation, initiates Razorpay refund, and reverses earned rewards.*

---

## 7. Diagnostics & Lab Tests (1MG & HIMS Aggregation)

### Diagnostic Lab Test Categories & Catalog Filters
- **GET** `{{baseUrl}}/diagnostic/lab-test/categories`
- **GET** `{{baseUrl}}/diagnostic/lab-test/filters`

### Search Diagnostic Lab Tests
- **GET** `{{baseUrl}}/diagnostic/lab-test/search`

### Check Lab Serviceability & Available Slots
- **GET** `{{baseUrl}}/diagnostic/lab-test/serviceability`
- **GET** `{{baseUrl}}/diagnostic/lab-test/slots`

### Request Diagnostic Lab Test Price Quote
- **POST** `{{baseUrl}}/diagnostic/lab-test/quote`

### Book Diagnostic Lab Test
- **POST** `{{baseUrl}}/diagnostic/lab-test/book`

### Fetch Lab Test Booking Status & Detail
- **GET** `{{baseUrl}}/diagnostic/lab-test/booking-status/:id`
- **GET** `{{baseUrl}}/diagnostic/lab-test/detail/:id`

### Reschedule / Cancel Lab Test Booking
- **POST** `{{baseUrl}}/diagnostic/lab-test/reschedule`
- **POST** `{{baseUrl}}/diagnostic/lab-test/cancel`

### Fetch Patient Lab Bookings List
- **GET** `{{baseUrl}}/diagnostic/lab-test/patient-bookings`

### Fetch Lab Test Report PDF / FHIR Record
- **GET** `{{baseUrl}}/diagnostic/lab-test/report/:id`

### Initiate Pay-Later Online Payment for Unpaid HIMS Lab Booking
- **POST** `{{baseUrl}}/provider-order/lab-bookings/:id/pay-later/initiate`
- **POST** `{{baseUrl}}/provider-order/lab-bookings/:id/pay-later/confirm`

---

## 8. Discoverability & Global Search

### Global Search Aggregation (Doctors, Labs, Pharmacy)
- **GET** `{{baseUrl}}/discoverability?search=...&city=...&pincode=...`
  - *Fans out parallel searches across HIMS doctors, 1MG and HIMS lab catalogs, and 1MG and HIMS pharmacy catalogs.*

### Popular Doctors & Diagnostic Tests
- **GET** `{{baseUrl}}/provider-order/popular`

---

## 9. Pharmacy Catalog, Cart & Orders

### 1MG Pharmacy Catalog & Search
- **GET** `{{baseUrl}}/one-mg/medicines/search`
- **GET** `{{baseUrl}}/one-mg/medicines/categories`
- **GET** `{{baseUrl}}/one-mg/medicines/detail/:id`
- **GET** `{{baseUrl}}/one-mg/medicines/inventory`
- **POST** `{{baseUrl}}/one-mg/medicines/serviceability`

### HIMS Hospital Pharmacy Catalog & Search
- **GET** `{{baseUrl}}/phr/medicines/hims/search`
- **GET** `{{baseUrl}}/phr/medicines/hims/categories`
- **GET** `{{baseUrl}}/phr/medicines/hims/detail/:id`

### Provider Cart Management (`/provider-cart/*`)
- **POST** `{{baseUrl}}/provider-cart/add`
- **GET** `{{baseUrl}}/provider-cart/:abhaAddress`
- **PATCH** `{{baseUrl}}/provider-cart/update-quantity`
- **DELETE** `{{baseUrl}}/provider-cart/item`
- **DELETE** `{{baseUrl}}/provider-cart/clear`
- **POST** `{{baseUrl}}/provider-cart/apply-coupon`
- **DELETE** `{{baseUrl}}/provider-cart/remove-coupon`

### Combined Order Checkout & Management (`/provider-order/*`)
- **POST** `{{baseUrl}}/provider-order/initiate-combined`
- **POST** `{{baseUrl}}/provider-order/confirm-combined`
- **GET** `{{baseUrl}}/provider-order/user/:abhaAddress`
- **GET** `{{baseUrl}}/provider-order/detail/:id`
- **POST** `{{baseUrl}}/provider-order/cancel`
- **POST** `{{baseUrl}}/provider-order/return`

### Doctor Prescription Proposals
- **GET** `{{baseUrl}}/provider-order/prescription-proposals`
- **POST** `{{baseUrl}}/provider-order/prescription-proposals/:id/accept`
- **POST** `{{baseUrl}}/provider-order/prescription-proposals/:id/reject`

---

## 10. Patient Health Profile & Vitals Tracker

### Fetch Comprehensive Health Profile
- **GET** `{{baseUrl}}/healthprofile/:abhaAddress`
  - *Fetches health metrics, vital trends, and daily water consumption (resets water intake daily on read).*

### Historical Lab Trends
- **GET** `{{baseUrl}}/healthprofile/:abhaAddress/labs`

### Ingest Vital Measurements
- **POST** `{{baseUrl}}/healthprofile/:abhaAddress/vitals`
  - *Logs vital measurements (Blood Pressure, Pulse, Blood Sugar, Body Temperature, SPO2, Height, Weight, BMI).*

### Ingest Activity & Fitness Data
- **POST** `{{baseUrl}}/healthprofile/:abhaAddress/activity`

### Log Daily Water Consumption
- **POST** `{{baseUrl}}/healthprofile/:abhaAddress/water-intake`
  - *Tracks water consumption (capped at 2400 ml / 13 glasses per day).*

---

## 11. AI Assistant & Health Record Summaries

### AI Chatbot Assistant
- **POST** `{{baseUrl}}/chatSearch/sendMessageToLLM`
  - *Powered by Gemini 2.5 Flash. Collects symptoms via follow-up questions and matches recommended specialities against HMIS doctor profiles.*

### Health Record Summarization
- **POST** `{{baseUrl}}/phr/ai-summary`
  - *Generates plain-English record summaries using Gemini multimodal model with SHA-256 result caching.*

### Fetch Cached Record Summary
- **GET** `{{baseUrl}}/phr/health-records/summary`

---

## 12. QR Code Check-In & Profile Share

### Fetch Scanned HIP Details & Available Services
- **POST** `{{baseUrl}}/provider-order/doctors/appointments`
  - *Reads scanned QR code (`hipId`, `counterId`) to list hospital doctors, today's appointments, and diagnostic tests.*

### Share ABHA Profile with Scanned HIP
- **POST** `{{baseUrl}}/phr/profile/share/hip`
  - *Initiates ABDM Patient Share v3 with share code segment (`<id>-<doctorId>-<hipId>`).*

### Poll Share Confirmation Token
- **GET** `{{baseUrl}}/phr/profile/share/data`

### Fetch Active Share Token
- **GET** `{{baseUrl}}/phr/profile/share/token`

---

## 13. UHI Blood Bank & Network Search

### Search Blood Banks via UHI
- **POST** `{{baseUrl}}/uhi/blood-bank/search`
  - *Broadcasts Beckn protocol search request for blood group & component availability.*

---

## 14. SwasthX Rewards, Coupons & Dynamic Pricing

### Reward Balance & Summary
- **GET** `{{baseUrl}}/rewards?mobile=...` & **GET** `{{baseUrl}}/rewards/balance?mobile=...`

### Rewards Conversion Setting
- **GET** `{{baseUrl}}/rewards/setting`

### Rewards FAQ
- **GET** `{{baseUrl}}/rewards/faq`

### Checkout Coupons
- **GET** `{{baseUrl}}/coupons`

### Dynamic Pricing Quotes
- **GET** `{{baseUrl}}/pricing?type=TEST`

### Reward Rule Configuration (Admin)
- **GET** `{{baseUrl}}/rewards-admin/config`
- **POST** `{{baseUrl}}/rewards-admin/add`
- **POST** `{{baseUrl}}/rewards-admin/update-setting`

---

## 15. Patient Profile, Delivery Addresses & Notifications

### User Notifications
- **GET** `{{baseUrl}}/phr/notifications/:abhaAddress`
- **PATCH** `{{baseUrl}}/phr/notifications/:abhaAddress/seen-all`

### Delivery Addresses Management
- **GET** `{{baseUrl}}/delivery-address?abhaAddress=...`
- **POST** `{{baseUrl}}/delivery-address`
- **PUT** `{{baseUrl}}/delivery-address/:id`
- **DELETE** `{{baseUrl}}/delivery-address/:id`

---

## 16. Gateway Callbacks & Integration Webhooks

### ABDM Gateway Callbacks (`/api/v3/*`)
- **POST** `/api/v3/hiu/patient/care-context/on-discover`
- **POST** `/api/v3/hiu/patient/care-context/on-init`
- **POST** `/api/v3/hiu/patient/care-context/on-confirm`
- **POST** `/api/v3/hip/patient/care-context/on-notify`
- **POST** `/api/v3/hip/patient/care-context/on-sms-notify`
- **POST** `/api/v3/hiu/consent-requests/on-init`
- **POST** `/api/v3/hiu/consent-requests/on-status`
- **POST** `/api/v3/hiu/consents/on-fetch`
- **POST** `/api/v3/hiu/consents/hiu/notify`
- **POST** `/api/v3/hiu/health-information/on-request`
- **POST** `/api/v3/hiu/health-information/on-transfer`
- **POST** `/api/v3/hiu/subscriptions/on-init`
- **POST** `/api/v3/hiu/subscriptions/on-confirm`
- **POST** `/api/v3/hiu/subscriptions/hiu/notify`
- **POST** `/api/v3/hiu/patient/on-share`

### HIMS Pharmacy Webhooks
- **POST** `/pharmacy/prescription-orders` — *Doctor-prescribed medicine proposal pushed from HIMS to PHR*
- **POST** `/pharmacy/orders/status` — *Real-time pharmacy order status update for pay-at-counter orders*
- **POST** `/pharmacy/refunds/execute` — *Refund execution trigger for prepaid orders*

### UHI Beckn Protocol Callbacks
- **POST** `/uhi/on_search`
- **POST** `/uhi/on_select`
- **POST** `/uhi/on_init`
- **POST** `/uhi/on_confirm`
- **POST** `/uhi/on_status`
- **POST** `/uhi/on_track`
- **POST** `/uhi/on_cancel`

---

## 17. Super Admin & Platform Management Surface

### Order Administration (`/admin/order/*`)
- **GET** `{{baseUrl}}/admin/order` — *List and filter all pharmacy & lab orders.*
- **GET** `{{baseUrl}}/admin/order/:id` — *Fetch specific order details for admin review.*
- **POST** `{{baseUrl}}/admin/order` — *Create manual order entry.*
- **PATCH** `{{baseUrl}}/admin/order/:id/status` — *Update order delivery/fulfilment status.*
- **POST** `{{baseUrl}}/admin/order/:id/cancel` — *Admin force-cancel order and trigger refund.*
- **POST** `{{baseUrl}}/admin/order/:id/confirm-payment` — *Manually confirm offline or delayed payment.*
- **POST** `{{baseUrl}}/admin/order/:id/confirm-order` — *Confirm order execution with vendor.*
- **GET** `{{baseUrl}}/admin/order/:id/1mg-status` — *Resync status directly from Tata 1MG.*

### Customer Support Issue Tickets (`/admin/order/issues/*`)
- **GET** `{{baseUrl}}/admin/order/issues` — *List open customer support issue tickets raised for order/payment saga failures.*
- **GET** `{{baseUrl}}/admin/order/issues/:ticketId` — *Get ticket details and diagnostic log.*
- **POST** `{{baseUrl}}/admin/order/issues/:ticketId/resend` — *Retry failed vendor request or re-trigger refund.*

### Partner & Vendor Integration Management (`/admin/manage-partners/*`)
- **GET** `{{baseUrl}}/admin/manage-partners` — *Fetch third-party vendor configurations (Tata 1MG base URLs, API keys).*
- **POST** `{{baseUrl}}/admin/manage-partners` — *Add new integration partner.*
- **PUT** `{{baseUrl}}/admin/manage-partners/:id` — *Update partner credentials or endpoints.*
- **DELETE** `{{baseUrl}}/admin/manage-partners/:id` — *Disable or remove partner integration.*

### Rewards & Rules Administration (`/rewards-admin/*`)
- **GET** `{{baseUrl}}/rewards-admin/config` — *Get reward percentage/points rules per transaction type (MEDICINE, LAB_TEST, DOC_APPOINTMENT).*
- **POST** `{{baseUrl}}/rewards-admin/add` — *Add or update reward configuration rule.*
- **POST** `{{baseUrl}}/rewards-admin/update-setting` — *Update global point-to-rupee ratio and daily reward caps.*
- **GET** `{{baseUrl}}/rewards-admin/date` & `GET {{baseUrl}}/rewards-admin/month` & `GET {{baseUrl}}/rewards-admin/year` — *Reward issuance and redemption analytics.*

### Dynamic Pricing Administration (`/admin/pricing/*`)
- **GET** `{{baseUrl}}/admin/pricing` & **POST** `{{baseUrl}}/admin/pricing` — *Manage dynamic test and medicine pricing overlays.*

### Banner Advertisements (`/advertisement/*`)
- **GET** `{{baseUrl}}/advertisement/getAll` & **POST** `{{baseUrl}}/advertisement` & **DELETE** `{{baseUrl}}/advertisement/:id` — *Manage home screen promotional banners.*

### User Profile Admin & Audit Logs
- **GET** `{{baseUrl}}/userprofile/getAllUserDetails/search` — *Search patient profiles across the system.*
- **GET** `{{baseUrl}}/super-admin/audit-logs` — *Retrieve system audit trail for super-admin actions.*



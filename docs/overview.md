---
layout: default
title: Swasthx Platform Overview
permalink: /overview
---

<div data-context="phr" markdown="1">

# Swasthx PHR App

### PHR App (Personal Health Record)

**Swasthx PHR app** is an all-in-one digital health companion—designed to make hospital visits and healthcare needs as smooth as air travel with Digi Yatra. From check-ins to lab tests, medicines, and health records, everything is just a tap away.

**Key Features:**

- **Smart QR Check-In**: Scan hospital QR codes to fetch facility doctors, auto-detect today's confirmed/rescheduled appointments for instant QR check-in (via ABDM Scan & Share context metadata), handle Pay-Later payment status sync for unpaid/pay-at-reception bookings, or book a new appointment on the spot.
- **Doctor Appointments**: Search by symptoms, view profiles, book instantly (with Online Payment or Pay-at-Reception options), check live slot availability, manage consultation modes, and track current appointments directly on the Home Screen card (hiding cancelled/no-show).
- **Lab Tests Anywhere**: Book at home, diagnostic center, or hospital with real-time slot availability, 1MG online lab booking, Pay-at-Reception & Pay Later options for HIMS lab bookings, and HIMS diagnostic catalog lookup.
- **Instant Lab Reports**: Real-time per-test status tracking, Report Ready notifications, and PDF report downloads directly on your phone.
- **Medicine Ordering**: HIMS catalog search, doctor-prescribed order proposals with patient consent, pharmacy check-in tracking, and combined checkout rewards.
- **Personal Health Records (PHR)**: Securely store prescriptions, reports, and health history with ABDM Health Locker integration, automatic health locker enablement on account creation, and Health Locker record tagging.
- **ABHA/NDHM Integration**: Dynamic `@abdm`/`@sbx` environment suffixes, real Aadhaar OTP error handling, pincode on ABHA cards, consent lifecycle (active, expired, revoked), and split Health Locker subscription & auto-approval permission toggles.
- **AI-Powered Assistance**: Smart assistant powered by Gemini 2.5 Flash for direct doctor & specialization recommendations without interrogation, plus automated 1–2 sentence health record summarization.
- **UHI Blood Bank Search**: Search nearby blood banks by blood group, component, and location (GPS radius or district) via UHI network.
- **SwasthX Rewards System**: Earn points on checkout (appointments, lab tests, medicines), auto-reverse reward points on cancellations, track redemption ledger history, and apply coupons.
- **Live Updates**: Track appointments, deliveries, and test results in real-time.
- **Privacy First**: 100% consent-driven and ABDM-compliant.

---

- **PHR Frontend Repository**: [Swasthx/Swasthx_Software](https://github.com/Swasthx/Swasthx_Software)
  - **Development**: [`development` branch](https://github.com/Swasthx/Swasthx_Software/tree/development)
  - **QA**: [`QA` branch](https://github.com/Swasthx/Swasthx_Software/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/Swasthx_Software/tree/production)
- **PHR Backend Repository**: [Swasthx/swasthx_Backend](https://github.com/Swasthx/swasthx_Backend)
  - **Development**: [`development` branch](https://github.com/Swasthx/swasthx_Backend/tree/development) (primary working branch)
  - **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_Backend/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/swasthx_Backend/tree/production)

---

### Application & Environment URLs

#### 1. PHR Android Application

| Environment | Build Status / Live Link | Base API URL |
| :--- | :--- | :--- |
| **Development** (Internal Testing) | [Google Play Internal Test](https://play.google.com/store/apps/details?id=com.swasthx) | `https://new-swasthxapp.api.swasthx.com` |
| **QA** (Closed Testing) | [Google Play Closed Test](https://play.google.com/store/apps/details?id=com.swasthx) | `https://phrqa.api.swasthx.com` |
| **Production** (Google Play Store) | [SwasthX on Google Play](https://play.google.com/store/apps/details?id=com.swasthx) | `https://phrproduction.api.swasthx.com` |

#### 2. PHR iOS Application

| Environment | Build Status / TestFlight Link | Base API URL |
| :--- | :--- | :--- |
| **Development** (Internal TestFlight) | _No public link_ | `https://new-swasthxapp.api.swasthx.com` |
| **QA** (External TestFlight) | [Join QA TestFlight](https://testflight.apple.com/join/33chzNj9) | `https://phrqa.api.swasthx.com` |
| **Production** (Apple App Store) | [SwasthX on App Store](https://apps.apple.com/us/app/swasthx/id6752235273) | `https://phrproduction.api.swasthx.com` |

</div>

<div data-context="website" markdown="1">

# Swasthx Website

### Website

**Swasthx Website** is a full-stack platform for efficient patient and clinic management, streamlined hospital workflows, and instant access to authorized medical information. Hospital administrators onboard the clinical staff, who then manage appointments and capture health records directly within the system. Patients benefit from ABHA ID creation, smart queue-less booking via QR scans, and the ability to view generated records in any compliant PHR app using their government-issued ABHA identity.

**Key Capabilities**

- **Doctor Workspace**: Admin-provisioned doctors configure professional profiles, manage availability, and create patient health records.
- **ABHA/NDHM Integration**: Create and link patient ABHA IDs to attach every clinical interaction to a unified national health account.
- **Consent-Based Medical History**: Doctors can fetch longitudinal records with patient consent using ABHA credentials.
- **Smart Queue Management**: Patients scan hospital or doctor QR codes to book appointments, dramatically reducing waiting times.
- **Cross-Platform Records**: Every generated summary is accessible from the Swasthx PHR app (or any ABHA-compatible PHR) for continuity of care.

---

### Access Roles & Multi-Tenant SaaS Hierarchy

SwasthX operates on a multi-tenant SaaS architecture where authority cascades from the **Super Admin** down to specialized operational hospital roles:

```
                            ┌─────────────────────────────────────────┐
                            │               Super Admin               │
                            └────────────────────┬────────────────────┘
                                                 │ Onboards Hospitals
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │         Hospital Admin (Admin)          │
                            └────────────────────┬────────────────────┘
                                                 │ Provisions Staff Roles
         ┌───────────────────────────┬───────────┴───────────┬───────────────────────────┐
         ▼                           ▼                       ▼                           ▼
  ┌──────────────┐            ┌──────────────┐        ┌──────────────┐            ┌──────────────┐
  │  Reception   │            │   Doctors    │        │  Diagnostic  │            │   Pharmacy   │
  └──────────────┘            └──────────────┘        └──────────────┘            └──────────────┘
```

#### 1. Super Admin

- **Role Scope:** Platform-wide SaaS Administration.
- **Key Responsibilities:** Onboard new Hospital organizations, provision primary **Hospital Admin** accounts, and manage facility subscriptions.

#### 2. Hospital Admin (Admin)

- **Role Scope:** Facility-wide Administration & Governance.
- **Key Responsibilities:** Provision staff accounts (**Reception**, **Doctors**, **Diagnostic**, **Pharmacy**), fix doctor fee schedules, hold exclusive pharmacy payment override rights, and monitor analytics.

#### 3. Reception Desk

- **Role Scope:** Patient Registration, Queue Management & Counter Payments.
- **Key Responsibilities:** Direct walk-in patient registration, doctor/lab bookings, cash/online payment collection, counter check-ins, and payment status overrides.

#### 4. Doctors

- **Role Scope:** Clinical Consultations & Diagnostic Ordering.
- **Key Responsibilities:** Configure clinical profile/schedule, conduct consultations, access ABHA longitudinal records, issue e-prescriptions, and generate recommended diagnostic lab orders.

#### 5. Diagnostic Staff / Operators

- **Role Scope:** Sample Collection & Diagnostic Test Processing.
- **Key Responsibilities:** Manage sample collection, section desk routing, test processing, and report uploading. _(Payment processing is handled exclusively at Reception or via the PHR app)._

#### 6. Pharmacy Staff / Pharmacists

- **Role Scope:** Medicine Fulfillment & Counter Billing.
- **Key Responsibilities:** Dispense internal/external prescriptions, collect counter payments, process line-item returns, and initiate automatic refunds to patient accounts. _(Overrides require Hospital Admin approval)._

---

### Git Repositories & Branches

- **Website Frontend Repository**: [Swasthx/Swasthx_HIP_Frontend](https://github.com/Swasthx/Swasthx_HIP_Frontend)
  - **Development**: [`development-new` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/development-new)
  - **QA**: [`QA` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/production)
- **Website Backend Repository**: [Swasthx/swasthx_backend_website](https://github.com/Swasthx/swasthx_backend_website)
  - **Development**: [`development` branch](https://github.com/Swasthx/swasthx_backend_website/tree/development)
  - **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_backend_website/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/swasthx_backend_website/tree/production)

---

### Application Environments & Gateway Architecture

| Environment     | Website Frontend Portal                                            | Connected API Gateway URL            | ABDM Callback URL                                     |
| :-------------- | :----------------------------------------------------------------- | :----------------------------------- | :---------------------------------------------------- |
| **Development** | [dev-doctor.swasthx.com](https://dev-doctor.swasthx.com/)          | `websitedevelopment.api.swasthx.com` | `websitedevelopment.api.swasthx.com`                  |
| **QA**          | [qa-doctor.swasthx.com/login](https://qa-doctor.swasthx.com/login) | `websiteqa.api.swasthx.com`          | `websiteqa.api.swasthx.com` _(when required)_         |
| **Production**  | [doctor.swasthx.com/login](https://doctor.swasthx.com/login)       | `websiteproduction.api.swasthx.com`  | `websiteproduction.api.swasthx.com` _(when required)_ |

---

### Test Logins & Credentials

> [KEY]
> **Universal Test OTP:** `765432` _(Valid for all test accounts across Dev, QA, and Production environments)_

| User Role           | Development (`dev-doctor`) | QA (`qa-doctor`) | Production (`doctor`)         |
| :------------------ | :------------------------- | :--------------- | :---------------------------- |
| **Super Admin**     | `5555555555`               | `5555555555`     | `5555555555`                  |
| **Hospital Admin**  | `2222222228`               | `2222222228`     | `2222222228`                  |
| **Reception**       | `5555555551`               | `5555555551`     | `5555555551`                  |
| **Doctor 1**        | `4444444440`               | `4444444440`     | `4444444440`                  |
| **Doctor 2**        | `4444444441`               | `4444444441`     | _(Created on demand)_         |
| **Doctor 3**        | `3333333339`               | `3333333339`     | _(Created on demand)_         |
| **Diagnostic User** | `8888888888`               | `8888888888`     | _(Provisioned by Vansh Rana)_ |
| **Pharmacy User**   | `7777777777`               | `7777777777`     | _(Provisioned by Vansh Rana)_ |

</div>

<h2 class="quick-links-heading">Quick Links</h2>
- [Images used in documentation](https://drive.google.com/drive/folders/19i4ozSjlAETX0RRa4cT0-dQDQsWYaF2O?usp=sharing)

---
*Last Updated: August 2026*

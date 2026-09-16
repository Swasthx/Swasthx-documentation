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
- **Multi-Mode Payments**: Reception and pharmacy counters accept **Cash, Card, UPI and Online (Razorpay)**. Online bills are settled through an **SMS pay-link** — the patient pays on their phone and the dashboard flips to *Paid* automatically. Hospital Admins can **override** a payment for exceptional cases, and a **return & refund** engine handles cancellations and pharmacy line-item returns. _(See [Payment Flow](#payment-flow).)_
- **Patient & Staff Notifications**: The patient gets an SMS when a **record is created**, a **service is booked**, a **token number is issued**, a payment link is sent or confirmed, and a refund is processed. Doctors and staff get in-app bell-icon alerts for work that needs their attention. _(See [Notifications](#notifications).)_

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

### Payment Flow

Every consult, lab booking and pharmacy order carries a `paymentStatus` that starts at `UNPAID`. Check-in and dispensing are **gated** on that status — a patient cannot be checked in for a consultation, and a pharmacy order cannot be handed over, until the bill is `PAID` or an admin has marked it `OVERRIDDEN`.

#### Payment Modes

| Mode                  | Collected by                           | How the bill is cleared                                                                                                                        |
| :-------------------- | :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cash**              | Reception / Pharmacy counter           | Staff clicks **Mark Paid** → `paymentStatus: PAID`, `paymentMode: cash`.                                                                       |
| **Card / UPI**        | Reception / Pharmacy counter (POS)     | Same **Mark Paid** path; the method (`CARD`, `UPI`, `BANK`) is recorded in the payment ledger for reconciliation.                              |
| **Online (Razorpay)** | Patient, on their own phone            | Staff sends an **SMS pay-link**; the Razorpay webhook flips the bill to `PAID`, `paymentMode: online` — no staff action needed.                |
| **Override**          | Hospital Admin only                    | `paymentStatus: OVERRIDDEN` with a mandatory reason, the admin's identity and a timestamp. Terminal — cannot be reverted and is never refunded. |

#### Online Payment via SMS Pay-Link

```
  Reception / Pharmacy UI          HIMS Backend                        Razorpay                       Patient's Phone
  ───────────────────────          ────────────                        ────────                       ───────────────
  Bill generated
  (paymentStatus: UNPAID)
           │
  "Send payment link" ──────────►  POST …/payment-link
                                   cancel any old link,
                                   create a fresh one ───────────────► Payment link created
                                                                       notify.sms = true ───────────► SMS with pay-link
                                                                                                      on registered mobile
                                                                                                              │
                                                                       Hosted checkout ◄─────────────  Pays via UPI / card /
                                                                              │                        net-banking
                                   Webhook handler  ◄───────────────── payment_link.paid
                                   (signature-verified, idempotent)    (server-to-server)
                                   paymentStatus = PAID
                                   paymentMode   = online
                                           │
  Status flips to PAID ◄────────── queue event → dashboard re-fetch
  automatically — no refresh;      + payment-confirmed alerts
  check-in / dispense gate opens
```

1. **Bill created** — the consult fee, lab cart or pharmacy bill is generated with `paymentStatus: UNPAID` and an invoice number.
2. **Send payment link** — reception or the pharmacist clicks *Send payment link*. The backend cancels any earlier link for that bill and creates a fresh Razorpay payment link, so a "resend" always triggers a new SMS.
3. **Patient receives the SMS** — Razorpay delivers the pay-link to the patient's registered mobile number.
4. **Patient pays** — UPI, card or net-banking on Razorpay's hosted checkout page. Nothing is entered on the hospital desk.
5. **Automatic confirmation** — Razorpay calls the HIMS webhook (signature-verified and idempotent). The backend stamps `PAID` + `paymentMode: online`, writes the ledger row, and emits a queue event so the reception / pharmacy dashboard re-fetches. The bill shows **Paid** on screen without anyone refreshing, and the check-in gate opens.
6. **Missed-webhook fallback** — if the webhook never arrives, staff can hit *Verify payment status*, which reconciles the bill against Razorpay on demand.

#### Payment Override

- Only a **Hospital Admin** (`ADMIN_PAYMENT` permission) can override; reception and pharmacy staff cannot.
- Intended for compassionate care, hospital error, staff / family consults and similar exceptions.
- Requires a reason (minimum 5 characters) and stamps `paymentOverrideBy`, `paymentOverrideReason` and `paymentOverrideAt` on the record for audit.
- The override is terminal: there is no revert endpoint and an overridden bill can never be refunded.
- Diagnostic and pharmacy staff receive a `PAYMENT_OVERRIDE_APPLIED` alert in their in-app inbox.

#### Refunds & Returns

| Scenario                              | What happens                                                                                                                                                                                                    |
| :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Booking cancelled** (paid online)   | The cancellation engine calls the Razorpay refund API. Status moves `REFUND_INITIATED` → `REFUND_PROCESSED` when Razorpay's refund webhook lands; the patient gets an SMS at each step.                       |
| **Booking cancelled** (paid at counter) | The refund is handed over in cash at reception and confirmed by staff; the patient gets a cash-refund SMS.                                                                                                     |
| **Pharmacy line-item return**         | On a `DELIVERED` order the pharmacist initiates a return for specific lines. Online payments are refunded through Razorpay (stock is restored when the webhook confirms); cash payments are refunded at the counter and confirmed by the pharmacist. The bill shows `REFUNDED` or `PARTIALLY_REFUNDED`. |
| **Paid from the PHR app**             | Refunds for HIMS bookings paid inside the PHR app are executed by the PHR backend and confirmed back to HIMS through the `refund-confirm` callback. See [Website Cross API]({{ '/docs/architecture/website-cross-api.html' | relative_url }}). |
| **Overridden bill**                   | Never refundable — nothing was collected.                                                                                                                                                                       |

#### Endpoint Quick Reference

| Action                       | Consult (Reception)                                     | Pharmacy Order                                       |
| :--------------------------- | :------------------------------------------------------ | :--------------------------------------------------- |
| Mark paid at counter         | `POST /reception/payment/consult/:appointmentId/mark-paid` | `POST /pharmacy/orders/:id/mark-paid`             |
| Send Razorpay pay-link       | `POST /pharmacy/payment/createPaymentLink`              | `POST /pharmacy/orders/:id/payment-link`             |
| Razorpay payment webhook     | `POST /pharmacy/payment/paymentLinkCallbackWebhook`     | `POST /pharmacy/orders/webhooks/razorpay-payment-link` |
| Verify status (fallback)     | —                                                       | `POST /pharmacy/orders/:id/verify-payment-status`    |
| Admin override               | `POST /reception/payment/consult/:appointmentId/override-payment` | `POST /pharmacy/orders/:id/override-payment` |
| Return / refund              | Cancellation engine                                     | `POST /pharmacy/orders/:id/return` · `POST /pharmacy/orders/webhooks/razorpay-refund` |

---

### Notifications

Notifications run on two independent rails, so a single business event can reach both the patient and the staff who need to act on it:

- **Patient SMS** — producers enqueue an event on SQS; a worker renders the hospital's template in the patient's language and sends it through AWS SNS, logging every attempt to `notifications_log`. Razorpay sends the pay-link SMS itself.
- **In-app inbox** — doctors and staff see alerts under the bell icon on the web dashboard (`/notifications/doctor/me` and `/notifications/staff/me`). No SMS is involved.

#### Patient SMS Triggers

| When                          | What the patient receives                                                                                                                                                     |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A record is created**       | SMS when a prescription, lab report or invoice is generated for them, with a link to view it in the PHR app. Records linked to their ABHA also trigger the ABDM deep-link SMS. |
| **A new service is booked**   | Booking confirmation for a doctor appointment, lab test or pharmacy order — facility, date and slot.                                                                          |
| **A token number is issued**  | Check-in SMS carrying the queue token (`T-NNNN`) and the visit token (`V-YYYYMMDD-NNNN`). A follow-up SMS is sent whenever the expected wait time shifts by 10 minutes or more. |
| Payment link sent             | Razorpay SMS with the pay-link (see [Payment Flow](#payment-flow)).                                                                                                            |
| Payment confirmed / failed    | Razorpay sends the patient a payment receipt on success; the SwasthX `PAYMENT_CONFIRMED` / `PAYMENT_FAILED` SMS templates are provisioned in the notification engine.       |
| Refund                        | `REFUND_INITIATED` when the refund is raised, `REFUND_PROCESSED` when the money is returned; cash-refund SMS for counter handovers.                                            |
| Appointment reminder          | Sent 2 hours before the slot (cron runs every 15 minutes; skipped for cancelled, checked-in, completed and no-show bookings).                                                 |
| Lab progress                  | Sample collected, result published, critical result flagged.                                                                                                                 |
| Pharmacy order progress       | Ready for collection, out for delivery, delivered, on hold / hold released, partial dispense, out of stock, cancelled, uncollected.                                             |
| Login OTP                     | Sent synchronously (bypasses the queue so the login screen gets an immediate error if delivery fails).                                                                        |

#### Doctor & Staff In-App Alerts

| Audience                              | Events                                                                                                                                                                                                              |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Doctors**                           | Results ready, critical result, emergency patient assigned, escalation alert, follow-up patient checked in, prescription finalised.                                                                                  |
| **Diagnostic / Pharmacy / Admin staff** | Diagnostic payment confirmed, pharmacy payment confirmed, payment override applied, diagnostic section unavailable, section coverage gap, ABDM publication failed, HPR verification failed, HFR sync warning. |

#### Delivery Rules

- **Priority-based retry** — critical SMS retries after 30 s, important after 5 min; informational messages are not retried. Undelivered important messages surface on the admin KPI endpoint.
- **Patient opt-out** — patients can opt out of SMS per hospital or per event type; critical messages (OTP, critical results) always go through.
- **Hospital templates & languages** — every message is a template row that a hospital can customise per language; the language resolves from the payload, then the doctor's preferred consultation language, then English.
- **Audit** — every SMS attempt is logged with its gateway message id and final status (`SENT`, `FAILED`, `UNDELIVERED`).

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

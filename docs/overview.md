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
- **AI-Powered Assistance**: Smart assistant powered by Gemini 2.5 Flash for direct doctor & specialization recommendations without interrogation.
- **UHI Blood Bank Search**: Search nearby blood banks by blood group, component, and location (GPS radius or district) via UHI network.
- **SwasthX Rewards System**: Earn points on checkout (appointments, lab tests, medicines), auto-reverse reward points on cancellations, track redemption ledger history, and apply coupons.
- **Live Updates**: Track appointments, deliveries, and test results in real-time.
- **Privacy First**: 100% consent-driven and ABDM-compliant.

### Git Repositories & Branches
- **Repository**: [Swasthx/swasthx_Backend](https://github.com/Swasthx/swasthx_Backend)
- **Development**: [`development` branch](https://github.com/Swasthx/swasthx_Backend/tree/development) (primary working branch)
- **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_Backend/tree/QA)
- **Production**: [`production` branch](https://github.com/Swasthx/swasthx_Backend/tree/production)

### Application URLs
- **Development**: `new-swasthxapp.api.swasthx.com` (App Runner: [https://muwj3h3fcg.ap-south-1.awsapprunner.com](https://muwj3h3fcg.ap-south-1.awsapprunner.com))
- **QA**: `phrqa.api.swasthx.com` (App Runner: [https://xx22sbt2bz.ap-south-1.awsapprunner.com](https://xx22sbt2bz.ap-south-1.awsapprunner.com))
  - **iOS QA TestFlight**: [https://testflight.apple.com/join/33chzNj9](https://testflight.apple.com/join/33chzNj9)
- **Production**: `phrproduction.api.swasthx.com` (App Runner: [https://mj2baxemvj.ap-south-1.awsapprunner.com](https://mj2baxemvj.ap-south-1.awsapprunner.com))

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

**Access Roles**
- **Super Admin**
  - Add, update, or remove hospital administrators.
  - After onboarding a hospital admin, the super admin delegates staff management to that admin.
- **Hospital Admin**
  - Add, update, or remove doctors, nurses, and supporting staff for their facility.
  - Monitor hospital-wide patient counts, appointments, and operational stats in real time.

### Git Repositories & Branches
- **Website Frontend Repository**: [Swasthx/Swasthx_HIP_Frontend](https://github.com/Swasthx/Swasthx_HIP_Frontend)
  - **Development**: [`development-new` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/development-new)
  - **QA**: [`QA` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/Swasthx_HIP_Frontend/tree/production)
- **Website Backend Repository**: [Swasthx/swasthx_backend_website](https://github.com/Swasthx/swasthx_backend_website)
  - **Development**: [`development` branch](https://github.com/Swasthx/swasthx_backend_website/tree/development)
  - **QA**: [`QA` branch](https://github.com/Swasthx/swasthx_backend_website/tree/QA)
  - **Production**: [`production` branch](https://github.com/Swasthx/swasthx_backend_website/tree/production)

### Application & Environment URLs
- **Website Frontend (Doctor Portal)**
  - **Development**: [https://dev-doctor.swasthx.com/](https://dev-doctor.swasthx.com/)
  - **QA**: [https://qa-doctor.swasthx.com/login](https://qa-doctor.swasthx.com/login)
  - **Production**: [https://doctor.swasthx.com/login](https://doctor.swasthx.com/login)
- **Website Backend API & Gateways**
  - **Development**: `websitedevelopment.api.swasthx.com` (App Runner: [https://ycatiun3ez.ap-south-1.awsapprunner.com](https://ycatiun3ez.ap-south-1.awsapprunner.com))
  - **QA**: `websiteqa.api.swasthx.com` (App Runner: [https://98jahxhmj5.ap-south-1.awsapprunner.com](https://98jahxhmj5.ap-south-1.awsapprunner.com))
  - **Production**: `websiteproduction.api.swasthx.com` (App Runner: [https://2vmdwmdstc.ap-south-1.awsapprunner.com](https://2vmdwmdstc.ap-south-1.awsapprunner.com))

### Test Logins (Universal OTP: `765432`)
- **Admin**: `2222222228`
- **Super Admin**: `5555555555`
- **Reception**: `5555555551`
- **Doctor 1**: `4444444440`
- **Doctor 2 / 3**: `4444444441` / `3333333339`
- **Diagnostic User**: `8888888888`
- **Pharmacy User**: `7777777777`

</div>

<h2 class="quick-links-heading">Quick Links</h2>
- [Images used in documentation](https://drive.google.com/drive/folders/19i4ozSjlAETX0RRa4cT0-dQDQsWYaF2O?usp=sharing)

---
*Last Updated: August 2026*

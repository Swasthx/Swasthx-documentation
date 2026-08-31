---
layout: default
title: QR Automation Flow
parent: Architecture & Design
---

# SwasthX Hospital QR Automation Flow

The **SwasthX QR Automation System** provides a seamless, queue-less hospital visit experience by enabling instant self-check-in, doctor appointment booking, diagnostic lab ordering, and ABDM health record linking via QR code scanning. 

This document details the communication architecture between the **Hospital Information Management System (HIMS) Backend** and the **Personal Health Record (PHR) Backend**, the three entry modes for patients, and the fallback procedures.

---

## Architecture Overview & Flow Diagram

The QR Automation framework leverages secure HTTPS APIs to sync real-time queue states, appointment tokens, payment receipts, and prescription documents between the HIMS web backend, the PHR mobile backend, and ABDM national health gateways.

![QR Automation Flow]({{ site.baseurl }}/docs/images/qrautomation.jpg)

---

## 1. Patient Access Modes (3 QR Scanning Options)

Patients visiting a hospital or clinic can initiate their journey through one of three scanning methods depending on their preferred application or phone capabilities:

```
                               ┌─────────────────────────────────────────┐
                               │       Hospital Reception / QR Code       │
                               └────────────────────┬────────────────────┘
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
         │                                          │                                          │
         ▼                                          ▼                                          ▼
 ┌───────────────┐                          ┌───────────────┐                          ┌───────────────┐
 │   Option 1    │                          │   Option 2    │                          │   Option 3    │
 │  SwasthX PHR  │                          │ Phone Camera  │                          │ ABDM App /    │
 │      App      │                          │ (Deep Link)   │                          │ Gov Approved  │
 └───────┬───────┘                          └───────┬───────┘                          └───────┬───────┘
         │                                          │                                          │
         │ Direct Scan                              │ Dynamic Redirect                         │ Consent & Token
         ▼                                          ▼                                          ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                              Secure HTTPS Communication to HIMS Backend                              │
 └──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Option 1: Direct Scan via SwasthX PHR App (Recommended)
- **Workflow:** The patient opens the SwasthX PHR App and scans the QR code displayed at the hospital reception or kiosk.
- **Actions:** 
  1. Patient selects service type: **Doctor Appointment** or **Diagnostic/Lab Test**.
  2. The PHR app sends a secure HTTPS request to the **HIMS Backend** to fetch real-time doctor availability and lab slots.
  3. Patient completes payment directly within the app (via Razorpay integration).
  4. HIMS generates a **Digital Token** linked with the patient's **ABDM ABHA ID**.
  5. Patient is automatically checked into the live queue for consultation or lab test.

### Option 2: Smartphone Camera Scan (Deep Link / Dynamic App Install)
- **Workflow:** The patient scans the hospital QR code using their smartphone's native camera app.
- **Actions:** 
  1. The QR code resolves to a dynamic universal URL (`https://swasthx.com/qr/...`).
  2. **If PHR App is installed:** The deep link opens the SwasthX PHR app directly into the hospital's booking context.
  3. **If PHR App is NOT installed:** The link redirects the patient to the Google Play Store or Apple App Store to download the application. Upon launching after installation, the app seamlessly restores the hospital booking context.

### Option 3: External ABDM / Government Approved Apps (Scan & Share)
- **Workflow:** Patients using ABDM-compliant national apps (e.g., ABHA App, Aarogya Setu, Paytm, DigiLocker) scan the official hospital ABDM QR code.
- **Actions:** 
  1. The external app initiates the **ABDM Scan & Share** protocol with patient consent.
  2. Patient profile metadata (ABHA number, address, demographics) is securely transmitted via ABDM gateways to the HIMS backend.
  3. HIMS creates/links the patient profile and issues an appointment token, enabling queue entry.

---

## 2. End-to-End Self-Service Patient Journey

Once a patient scans the QR code and completes booking, the automated workflow progresses through the following steps:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. Scan & Book  │ ──► │ 2. Pay & Token  │ ──► │ 3. Queue Check  │ ──► │ 4. Consult /    │ ──► │ 5. Pharmacy /   │
│   (Option 1-3)  │     │   Generation    │     │   (Self In)     │     │    Diagnostic   │     │   Self Checkout │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Self Check-In & Live Queueing:**
   - After payment or ABDM consent verification, the patient receives a live token on their mobile app.
   - The PHR app displays live queue position updates (e.g., *"3 patients ahead of you"*), allowing patients to wait comfortably without standing in lines.

2. **Doctor Consultation & Diagnostic Testing:**
   - When called, the patient visits the doctor or diagnostic chamber.
   - The doctor accesses patient history via the HIMS Doctor Portal and logs clinical notes, vital assessments, and e-prescriptions.

3. **E-Prescription & Pharmacy Integration:**
   - E-prescriptions generated by doctors are instantly synced to the patient's SwasthX PHR app.
   - If medicines are prescribed, the patient can choose to collect and pay at the hospital pharmacy counter or order delivery via integrated pharmacy modules.

4. **Self Check-Out:**
   - Once all consultations, lab tests, and prescription retrievals are complete, the patient completes a self check-out directly on the PHR app. All clinical records and invoice summaries are auto-synced to their unified ABHA health record.

---

## 3. Fallback & Exception Handling (Reception Desk Support)

To ensure zero service disruption during unforeseen technical or connectivity issues, the QR Automation system provides built-in fallback protocols to hospital reception staff:

| Scenario / Issue | Automated Detection | Reception Fallback Action |
| :--- | :--- | :--- |
| **Payment Gateway Failure / Timeout** | Transaction status remains `PENDING` or returns `FAILED`. | Receptionist looks up patient phone/token in HIMS Admin Portal and manually collects payment or retries checkout. |
| **ABDM Consent Exchange Timeout** | ABDM gateway callback exceeds timeout threshold. | Receptionist initiates manual ABHA demographic search or issues a temporary offline hospital token. |
| **Device / Smartphone Malfunction** | Patient phone battery dies or camera fails to scan. | Receptionist scans the hospital kiosk QR code on behalf of the patient or generates token via Doctor Portal counter. |
| **Queue Position Dispute / No-Show** | Patient misses call window due to delay. | HIMS allows receptionist or doctor staff to re-queue or override token position with a single click. |

> [!IMPORTANT]
> **Reception Desk Assistance**
> Whenever a patient encounters an error or requires manual assistance, hospital receptionists have administrative access via the **SwasthX Website / HMIS Portal** to override, verify, or expedite any step in the QR flow.

---

## 4. Key System Benefits

- **Queue Elimination:** Reduces hospital lobby overcrowding by converting physical waiting lines into digital queues.
- **ABDM Compliance:** Fully aligned with M1, M2, and M3 ABDM milestones for ABHA creation, Scan & Share, and health record linking.
- **Interoperability:** Native PHR App, Deep Link URL, and ABDM Scan & Share support ensure accessibility for all patients.
- **Unified Health Records:** Instant digital sync of prescriptions, lab reports, and billing receipts.

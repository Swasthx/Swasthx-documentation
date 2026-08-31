---
layout: default
title: Website Database
parent: Database
---

# Website Database

## Overview

This database serves the Website and HMIS portals, managing doctor profiles, appointments, facility registrations, diagnostic labs, and pharmacy operations.

## Database Name

In all environments (Dev, QA, Prod), the database name is consistent:

- `website-dev` for Development
- `website-qa` for QA
- `website-prod` for Production

## Database Diagram

<a href="https://drive.google.com/file/d/15h5ZTn9r5croaOG1JWdIsKgp-1HzZiqY/view?usp=sharing" target="_blank">View Website Database Diagrams</a>

## DB Naming Convention

<a href="https://docs.google.com/document/d/1iTPRwxOlAtdcGVWwWFyIr0BF_qgab7BtaTRx2y5HpjA/edit?usp=sharing" target="_blank">View Website Database Naming Conventions</a>

## Website backend DB Caching and Auth Management

The Website backend uses Redis for caching and session management. Authentication tokens and frequently accessed data are stored in Redis to enhance performance and reduce database load.
To read about the current implementation and future plans, refer to the document below: <br>
<a href="https://docs.google.com/document/d/1QgoNI3E8LG9fevq7WY7UzYscN4hIxnkU936hV-yWhQY/edit?usp=sharing" target="_blank">View Website Backend DB Caching and Auth Management</a>

<hr>

## Collections

The Website DB contains core operational collections as well as specialized collections for **Diagnostic Labs** and **Pharmacy Operations**:

### General Website Collections

| Collection Name                      | Description                                                                    |
| :----------------------------------- | :----------------------------------------------------------------------------- |
| **`abdmtxnidstorages`**              | Store ABDM transaction IDs                                                     |
| **`accesstokens`**                   | Store ABDM session tokens                                                      |
| **`adminauditlogs`**                 | Store admin audit logs for operations and administrative actions               |
| **`advertisements`**                 | Store advertisements created for the app by admins                             |
| **`authinitdbs`**                    | Used as initial storage in user scan and share flow                            |
| **`billpaymentreceipts`**            | Store bill receipts                                                            |
| **`bookedslots`**                    | Store already booked slots                                                     |
| **`doctorbankaccounts`**             | Store doctor bank accounts data                                                |
| **`doctorfaqdatas`**                 | Store doctor FAQs                                                              |
| **`doctorhealthpackagedatas`**       | Store health packages data                                                     |
| **`doctorprofiles`**                 | Store complete doctor profiles data                                            |
| **`doctorschedules`**                | Store doctor day-to-day schedules                                              |
| **`doctorservicesdatas`**            | Store services given by doctor clinic                                          |
| **`doctoruserprescriptions`**        | Store prescription data created by doctor for a patient against an appointment |
| **`followups`**                      | Store follow-ups that doctor has scheduled                                     |
| **`generateverifyotps`**             | All OTP generation/verify flows use this collection to store and get OTP       |
| **`hipconsents`**                    | All approved consents are stored in this                                       |
| **`hipnotlinkedhealthrecords`**      | All not linked ABDM records are stored                                         |
| **`hiptxns`**                        | All encryption keys and data push URL data are stored                          |
| **`hiuconsents`**                    | All created consents are stored                                                |
| **`hiuhealthdatafetches`**           | Store HIU health data fetches                                                  |
| **`hiukeys`**                        | Store encryption/decryption data                                               |
| **`hiuonfetches`**                   | Store carecontext granted by user shared by ABDM                               |
| **`hiutxns`**                        | Store the encryption, data push URL, and transaction shared with HIP           |
| **`invoicefhirs`**                   | Store invoices in FHIR format                                                  |
| **`linktokens`**                     | Store user-specific link token used for record linking                         |
| **`medicinelist`**                   | Store the master list of medicines available for pharmacy orders               |
| **`patientinfos`**                   | Store patient info for appointment                                             |
| **`patientregistrations`**           | Store user registration details                                                |
| **`payments`**                       | Store Razorpay payment data                                                    |
| **`pharmacyoperator`**               | Store pharmacy operator profiles and access details                            |
| **`pharmacyorders`**                 | Store pharmacy orders placed by users                                          |
| **`pharmacypayments`**               | Store pharmacy order payment transactions                                      |
| **`scansharetrails`**                | Store scan and share data if token expires                                     |
| **`sessionschemas`**                 | Store user session data when user logs in                                      |
| **`storefacilityregistrationdatas`** | Store HFR registration data                                                    |
| **`storenhprtxns`**                  | Store txnid data                                                               |
| **`storeuserregistrationdatas`**     | Store NHPR doctor data                                                         |
| **`userpaymentdbs`**                 | Store user payment data initiated in Razorpay                                  |
| **`userprofiles`**                   | Store complete user profile data                                               |
| **`userprofileshares`**              | Store user scan and share data token number                                    |
| **`users`**                          | Store logged-in user data (phone number, doctor ID, etc.)                      |
| **`uservitalassessments`**           | Store user vital assessment data                                               |
| **`uservitalquestions`**             | Store user vital assessment questions                                          |

> [!NOTE]
> **Common Collections**  
> In both Website and PHR databases, `abdmtxnidstorages` and `accesstokens` serve the same critical purpose: storing the ABDM Transaction ID during flows and the ABDM Authorization Token respectively.

---

### Diagnostic Level Collections

| Collection Name                  | Purpose / Description                                                        |
| :------------------------------- | :--------------------------------------------------------------------------- |
| **`diagnostictestlist`**         | Master catalog of lab tests (pinned singular name)                           |
| **`diagnosticcategory`**         | Categories for diagnostic lab tests (pinned singular name)                   |
| **`diagnostic_section_configs`** | Section & desk routing configuration for diagnostic labs                     |
| **`shift_assignments`**          | Staff/operator shift assignments and duty roster calendar                    |
| **`diagnosticoperators`**        | Diagnostic operator details, counter assignments, and schedules              |
| **`diagnosticdoctorprofiles`**   | Diagnostic operator profile, sections served, and schedules                  |
| **`diagnosticpayments`**         | Completed diagnostic payment transactions                                    |
| **`diagnosticuserpaymentdbs`**   | Pending payment initiation records for diagnostic bookings                   |
| **`doctoruserprescriptions`**    | Patient lab test reports & structured lab test results _(shared collection)_ |
| **`patientappointments`**        | Diagnostic bookings & appointment records _(shared collection)_              |
| **`patientinfos`**               | Patient demographic information _(shared collection)_                        |

---

### Pharmacy Level Collections

| Collection Name                     | Purpose / Description                                                  |
| :---------------------------------- | :--------------------------------------------------------------------- |
| **`pharmacymedicine`**              | Master inventory & medicine catalog (pinned singular name)             |
| **`pharmacycategory`**              | Categories for medicines (pinned singular name)                        |
| **`pharmacyorders`**                | Pharmacy orders (Patient App, Walk-in, Counter, Doctor Prescriptions)  |
| **`pharmacymedicinemap`**           | Salt-to-brand and medicine mappings                                    |
| **`pharmacyoperators`**             | Pharmacist counter, shift, and weekly schedule settings                |
| **`pharmacyprescriptionproposals`** | Staff/Doctor proposals for pharmacy fulfillment                        |
| **`pharmacyinvoicecounters`**       | Atomic counter for generating pharmacy invoice numbers                 |
| **`pharmacyordercounters`**         | Atomic counter for generating pharmacy order codes                     |
| **`pharmacywalkincounters`**        | Atomic counter for generating walk-in token numbers                    |
| **`invoicefhirs`**                  | FHIR-formatted invoice records                                         |
| **`pharmacypayments`**              | Completed pharmacy payment transactions                                |
| **`pharmacyuserpaymentdbs`**        | Pending payment initiation records for pharmacy orders                 |
| **`doctorprofiles`**                | Pharmacy staff user identity and access profiles _(shared collection)_ |
| **`doctoruserprescriptions`**       | Prescriptions linked to pharmacy orders _(shared collection)_          |
| **`patientappointments`**           | Pharmacy customer bookings _(shared collection)_                       |
| **`patientinfos`**                  | Patient demographic information _(shared collection)_                  |

---

## Data Flow Diagrams

### 1. Website Login Flow

![Website Login Flow]({{ site.baseurl }}/assets/images/website_login.png)

### 2. ABHA Creation Flow

![ABHA Creation Flow]({{ site.baseurl }}/assets/images/abha_creation.png)

### 3. Record Creation

![Record Creation]({{ site.baseurl }}/assets/images/record_creation.png)

### 4. Health Record Data Transfer

![Health Record Data Transfer]({{ site.baseurl }}/assets/images/health_record_transfer.png)

### 5. Doctor Appointment

![Doctor Appointment]({{ site.baseurl }}/assets/images/doctor_appointment.png)

### 6. Pharmacy Order

![Pharmacy Order]({{ site.baseurl }}/docs/images/pharmacyFlow.png)

### 7. Diagnostic Order Flow

![Diagnostic Order Flow]({{ site.baseurl }}/docs/images/diagnostiFlow.png)

**Reference Documents:**

- <a href="https://drive.google.com/file/d/1jMRnBd9L_CLqWoBw31cMQddlM7Alb8PG/view?usp=sharing" target="_blank">Pharmacy Order - Collection Details</a>

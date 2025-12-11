---
layout: default
title: Website Database
parent: Database
---

# Website Database

## Overview
This database serves the Website and HMIS portals, managing doctor profiles, appointments, and facility registrations.

## Database Name
In all environments (Dev, QA, Prod), the database name is consistent:
*   `testingdb`

## Database Diagram
<a href="https://drive.google.com/file/d/15h5ZTn9r5croaOG1JWdIsKgp-1HzZiqY/view?usp=sharing" target="_blank">View Website Database Diagram</a>

## Collections
The Website DB contains the following collections:

| Collection Name | Description |
| :--- | :--- |
| **abdmtxnidstorages** | Store ABDM transaction IDs |
| **accesstokens** | Store ABDM session tokens |
| **advertisements** | Store advertisements created for the app by admins |
| **authinitdbs** | Used as initial storage in user scan and share flow |
| **billpaymentreceipts** | Store bill receipts |
| **bookedslots** | Store already booked slots |
| **doctorbankaccounts** | Store doctor bank accounts data |
| **doctorfaqdatas** | Store doctor FAQs |
| **doctorhealthpackagedatas** | Store health packages data |
| **doctorprofiles** | Store complete doctor profiles data |
| **doctorschedules** | Store doctor day-to-day schedules |
| **doctorservicesdatas** | Store services given by doctor clinic |
| **doctoruserprescriptions** | Store prescription data created by doctor for a patient against an appointment |
| **followups** | Store follow-ups that doctor has scheduled |
| **generateverifyotps** | All OTP generation/verify flows use this collection to store and get OTP |
| **hipconsents** | All approved consents are stored in this |
| **hipnotlinkedhealthrecords** | All not linked ABDM records are stored |
| **hiptxns** | All encryption keys and data push URL data are stored |
| **hiuconsents** | All created consents are stored |
| **hiuhealthdatafetches** | Store HIU health data fetches |
| **hiukeys** | Store encryption/decryption data |
| **hiuonfetches** | Store carecontext granted by user shared by ABDM |
| **hiutxns** | Store the encryption, data push URL, and transaction shared with HIP |
| **invoicefhirs** | Store invoices in FHIR format |
| **linktokens** | Store user-specific link token used for record linking |
| **patientinfos** | Store patient info for appointment |
| **patientregistrations** | Store user registration details |
| **payments** | Store Razorpay payment data |
| **scansharetrails** | Store scan and share data if token expires |
| **sessionschemas** | Store user session data when user logs in |
| **storefacilityregistrationdatas** | Store HFR registration data |
| **storenhprtxns** | Store txnid data |
| **storeuserregistrationdatas** | Store NHPR doctor data |
| **userpaymentdbs** | Store user payment data initiated in Razorpay |
| **userprofiles** | Store complete user profile data |
| **userprofileshares** | Store user scan and share data token number |
| **users** | Store logged-in user data (phone number, doctor ID, etc.) |
| **uservitalassessments** | Store user vital assessment data |
| **uservitalquestions** | Store user vital assessment questions |


> [!NOTE]
> **Common Collections**
> In both Website and PHR databases, `abdmtxnidstorages` and `accesstokens` serve the same critical purpose: storing the ABDM Transaction ID during flows and the ABDM Authorization Token respectively.

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

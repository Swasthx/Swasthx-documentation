---
layout: default
title: Database Documentation
parent: Database
---

# Database Documentation

## Overview

We have two primary types of databases in our ecosystem:
1.  **PHR Database**: For the Personal Health Record application.
2.  **Website Database**: For the Website and HMIS portals.

Both databases are **MongoDB-based** and hosted using **AWS DocumentDB**.

For complete information on database connection strings, environments, and access guidelines, please refer to the [Database Guidelines]({{ site.baseurl }}/docs/database/guidelines.html) page.

## Database Name

In all environments (Dev, QA, Prod), the database name is consistent:
*   `testingdb`

## Website Database Collections

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

## PHR Database Collections

The PHR DB contains the following collections:

| Collection Name | Description |
| :--- | :--- |
| **abdmtxnidstorages** | For storing the txn IDs used in ABDM flows |
| **accesstokens** | Store ABDM session tokens |
| **appusers** | Store the users' login data (phone number, etc.) |
| **carts** | Store user carts (once medicine or lab tests are added) |
| **chatmessages** | Store AI chat messages |
| **coupons** | Store coupons details |
| **deliveryaddresses** | Store user delivery addresses |
| **discoverlinkingdatastorages** | Store data used in ABDM discovery flows |
| **fcmtokens** | Stores used FCM tokens for Firebase notifications |
| **fhirdocumenpoints** | Store points when user uploads any documents |
| **generateverifyotps** | Store info related to OTPs |
| **healthprofile** | Store user health profile |
| **hiuconsents** | Store consents which PHR initiates |
| **hiuhealthdatas** | Store user health data received from HIP |
| **hiukeys** | Store encryption/decryption keys |
| **linktokenphrs** | Store user linking token used in ABDM record linking |
| **myhealths** | Store user complete health data fetched from Health Connect/Apple Kit |
| **newcarts** | Store user-specific carts |
| **neworders** | Store user-specific new orders |
| **notifications** | Store user-specific notifications |
| **pricings** | Store lab test pricing |
| **providercarts** | Store cart data for providers |
| **providerorders** | Store order data for providers |
| **rewardbalances** | Store reward points for each user |
| **rewardconfigs** | Store reward configuration |
| **rewards** | Store reward transactions |
| **rewardsettings** | Store reward settings |
| **rewardsfaqs** | Store reward FAQs |
| **storescanshares** | Scan and share data |
| **userautoapprovals** | Store auto approvals which user creates while creating consent |
| **userbooklabtests** | Store booked lab test data |
| **userprofiles** | Store all user profiles who log in to app |
| **usersubscriptions** | Store user subscription data |
| **useruploadrecordphrs** | Store uploaded health data by user |
| **uservitalassessments** | Store vital assessment shared by user |

> [!NOTE]
> **Common Collections**
> In both Website and PHR databases, `abdmtxnidstorages` and `accesstokens` serve the same critical purpose: storing the ABDM Transaction ID during flows and the ABDM Authorization Token respectively.
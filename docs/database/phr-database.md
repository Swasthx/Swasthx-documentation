---
layout: default
title: PHR Database
parent: Database
---

# PHR Database

## Overview
This database stores all data focused on the Personal Health Record (PHR) application, including user health profiles, orders, and subscriptions.

## Database Name
In all environments (Dev, QA, Prod), the database name is consistent:
*   `testingdb`

## Collections
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

## Data Flow Diagrams

### 1. PHR App Login
![PHR App Login]({{ site.baseurl }}/assets/images/phr_app_login.png)

### 2. Doctor Appointment in PHR App
![Doctor Appointment]({{ site.baseurl }}/assets/images/phr_doctor_appointment.png)

---
layout: default
title: Cross API Documentation
parent: Architecture & Design
---

# Cross API Documentation

This document outlines the API communication flow between the PHR Backend and the Website Backend, specifically detailing the Cross API calls initiated from the PHR side.

## Overview

There are specific scenarios where the PHR App needs to access data or perform actions that reside on the Website Backend. In these cases, the PHR Backend acts as an intermediary, forwarding the request to the Website Backend.

## System Flow

The cross-api communication follows this sequence:

1.  **PHR App Request**: The PHR App initiates a request to the PHR Backend.
2.  **PHR Backend Processing**: The PHR Backend receives the request and identifies the need to call the Website Backend.
3.  **Forwarding**: The PHR Backend makes an HTTP request to the Website Backend API.
    *   **Authentication**: The session token is passed in the request `headers`.
4.  **Website Gateway Auth**: The Website Gateway intercepts the request and uses a Lambda function to authenticate the call (verifying the session token).
5.  **Website Backend**: On successful authentication, the request reaches the Website Backend logic.
6.  **Response**: The Website Backend processes the request and sends the response back to the PHR Backend, which then relays it to the PHR App.

![PHR Cross API Architecture]({{ site.baseurl }}/docs/images/website-cross-api-arch.png)

### PHR backend cross-api sequence diagram

The sequence diagram below details the interaction flow initiated by the PHR App. It shows how the PHR Backend acts as a client to the Website Backend, passing a session token which is verified by a Lambda function at the Website Gateway before the request is allowed to reach the Website Backend services.

![PHR backend cross-api sequence diagram]({{ site.baseurl }}/docs/images/phr-cross-api-sequence.png)

## Involved Collections

The following collections in the **Website Database** are involved in these API interactions:

*   `PatientInfoModel`
*   `PatientAppointmentModel`
*   `DoctorProfile`
*   `DoctorSlot`
*   `userVitalAssessment`
*   `BookedSlot`

## List of Cross APIs

The following APIs are called from the PHR Backend to the Website (HIMS) Backend:

### 1. Doctor & Appointment Cross APIs
*   `/cancelUserSlot`
*   `/rescheduleAppointment`
*   `/doctor-profile/getProfile`
*   `/submitUserVitalAssessment`
*   `/userSlotBook`
*   `/getAppointmentsByIds`
*   `/doctor-profile/cancelAppointment/`
*   `/getAllDoctorsByIds`
*   `/doctor-profile/popularDoctors`
*   `/doctor-profile/getSchedule/`
*   `/doctor-profile/getBookedSlots`
*   `/doctor-profile/getSlots`
*   `/doctor-profile/fethcAllProfile?`
*   `/doctor-profile/nearbyDoctors`
*   `/doctor-profile/newFilters`
*   `/doctor-profile/searchDocName`
*   `/doctor-profile/getDoctorFaq`
*   `/doctor-profile/getAllDoctor?speciality=...` *(AI Chatbot Doctor Lookup)*
*   `/getAllAppointments`

### 2. HIMS Diagnostic / Lab Test Cross APIs (`/diagnostic/phr/*`)
*   `GET /diagnostic/phr/categories` *(Lab test categories)*
*   `GET /diagnostic/phr/catalog/filters` *(Catalog filters)*
*   `POST /diagnostic/phr/tests-and-bookings` *(Combined test catalog + categories + patient bookings lookup)*
*   `GET /diagnostic/phr/tests/:testId` *(Single test details)*
*   `GET /diagnostic/phr/tests?q=...` *(Catalog search)*
*   `GET /diagnostic/phr/tests/:testId/available-slots` *(Available slots)*
*   `POST /diagnostic/phr/quote` *(Booking quote price confirmation)*
*   `POST /diagnostic/phr/booking/submit-unpaid` *(Pay-Later / Pay-at-Reception HIMS lab test booking)*
*   `POST /diagnostic/phr/booking/submit-paid` *(Submit paid lab booking)*
*   `POST /diagnostic/phr/booking/submit-home-paid` *(Submit home collection paid booking)*
*   `POST /diagnostic/phr/bookings` *(Create lab booking)*
*   `GET /diagnostic/phr/bookings` *(Fetch patient booking list with per-test status tracking)*
*   `PATCH /diagnostic/phr/bookings/:bookingId/payment-status` *(Pay-Later payment status sync for unpaid/pay-at-reception HIMS lab bookings)*
*   `GET /diagnostic/phr/bookings/:bookingId` *(Fetch single booking status)*
*   `GET /diagnostic/phr/booking/:bookingId/report` *(Fetch report ready status & PDF URL)*
*   `GET /diagnostic/phr/report/:reportId/view` *(Report stream view)*
*   `POST /diagnostic/phr/bookings/:bookingId/cancel` *(Cancel lab booking)*
*   `POST /diagnostic/phr/bookings/:bookingId/reschedule` *(Reschedule lab slot)*
*   `POST /diagnostic/phr/callbacks/refund-confirm` *(Confirm lab refund execution)*

### 3. HIMS Pharmacy / Medicine Cross APIs (`/pharmacy/phr/*`)
*   `GET /pharmacy/phr/medicines` *(Pharmacy catalog search, popular & deals lookup)*
*   `GET /pharmacy/phr/medicines/:medicineId` *(Single medicine detail)*
*   `GET /pharmacy/phr/categories` *(Pharmacy categories)*
*   `POST /pharmacy/phr/quote` *(Authoritative price & stock quote for cart)*
*   `POST /pharmacy/phr/orders` *(Submit PREPAID or PAY_AT_COUNTER medicine order)*
*   `GET /pharmacy/phr/orders` *(Fetch patient medicine order history)*
*   `GET /pharmacy/phr/orders/:orderId` *(Fetch single medicine order details)*
*   `POST /pharmacy/phr/orders/:orderId/cancel` *(Cancel medicine order)*
*   `POST /pharmacy/phr/orders/:orderId/return` *(Request return on delivered order lines)*
*   `POST /pharmacy/phr/callbacks/refund-confirm` *(Confirm pharmacy refund execution)*

### 4. Support & Ticket Resolution Cross APIs (`/support/phr/*`)
*   `POST /support/phr/issues` *(Raise automated support issue ticket on website when paid order fails)*

## Module to Module Cross API Communication Diagram

*Tech team will add the diagrams soon....*

---
layout: default
title: PHR API Documentation
permalink: /api-phr
---

# SwasthX PHR API Documentation

This document provides a reference for the PHR (Personal Health Record) Mobile App APIs.

---

## Authentication

### Get OTP for Login
- **POST** `{{baseUrl}}/auth/login/otp`
- **Body:** `{ "hashString": "...", "mobileNum": "..." }`

### Verify OTP for Login
- **POST** `{{baseUrl}}/auth/verify/login/otp`
- **Body:** `{ "mobileNum": "...", "otp": "..." }`

### Get Token for App
- **POST** `{{baseUrl}}/auth/token/app`

---

## PHR Cart & Orders

### Add Item to Cart
- **POST** `{{baseUrl}}/phr/cart`
- **Body:** `{ "abhaAddress": "...", "type": "MEDICINE", "medicines": { ... } }`

### Get Cart
- **GET** `{{baseUrl}}/phr/cart/{{abhaAddress}}`

### Create Order
- **POST** `{{baseUrl}}/phr/order`
- **Body:** `{ "abhaAddress": "...", "cartId": "...", "deliveryAddress": { ... } }`

### Get Order History
- **GET** `{{baseUrl}}/phr/order/{{abhaAddress}}`

---

## Health Documents

### Upload Document
- **POST** `{{baseUrl}}/upload/document/any`

### Get Documents
- **GET** `{{baseUrl}}/upload/get-document?patient={{mobileNum}}`

---

## Other PHR Services

### Search Medicines
- **GET** `{{baseUrl}}/phr/search?query=...`

### Notifications
- **GET** `{{baseUrl}}/phr/notifications/{{abhaAddress}}`
- **PATCH** `{{baseUrl}}/phr/notifications/{{abhaAddress}}/seen-all`

### Delivery Addresses
- **GET** `{{baseUrl}}/delivery-address/{{abhaAddress}}`
- **POST** `{{baseUrl}}/delivery-address`

### Doctor Booking
- **POST** `{{baseUrl}}/doctor-appointment/book`
- **GET** `{{baseUrl}}/doctor-appointment/doctor/{{doctorId}}`

---

## ABDM / PHR Core

### Enroll
- **POST** `{{baseUrl}}/phr/m1/enrollment/abha-number`
- **POST** `{{baseUrl}}/phr/m1/enrollment/mobile`

### Consent
- **POST** `{{baseUrl}}/phr/m3/consent/init`

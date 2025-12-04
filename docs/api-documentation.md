---
layout: default
title: API Documentation
permalink: /api-documentation
---

# SwasthX API Documentation

This document provides a comprehensive reference for all SwasthX API endpoints, based on the official Postman collection.

---

## Authentication

### Get OTP for Login
- **POST** `{{baseUrl}}/auth/login/otp`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{ "hashString": "abc123", "mobileNum": "{{mobileNum}}" }
```

### Verify OTP for Login
- **POST** `{{baseUrl}}/auth/verify/login/otp`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{ "mobileNum": "{{mobileNum}}", "otp": "123456" }
```

### Get Token for App
- **POST** `{{baseUrl}}/auth/token/app`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{ "mobNum": "{{mobileNum}}", "tag": "mobile_app" }
```

---

## Cart Management

### Add Item to Cart
- **POST** `{{baseUrl}}/phr/cart`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{authToken}}`
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "type": "MEDICINE",
  "medicines": {
    "items": [
      { "medicineId": "medicine_id_here", "quantity": 2 }
    ],
    "prescriptionDocs": ["doc_url_1", "doc_url_2"]
  }
}
```

### Add Item to New Cart
- **POST** `{{baseUrl}}/phr/cart/new`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "type": "MEDICINE",
  "medicines": {
    "items": [
      { "medicineId": "medicine_id_here", "quantity": 2 }
    ]
  },
  "forceClear": false
}
```

### Get Cart
- **GET** `{{baseUrl}}/phr/cart/{{abhaAddress}}`
- **Headers:** `Authorization: Bearer {{authToken}}`

### Get New Cart
- **GET** `{{baseUrl}}/phr/cart/new/{{abhaAddress}}?type=MEDICINE`
- **Headers:** as above

### Update Cart Item
- **PATCH** `{{baseUrl}}/phr/cart`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "medicineId": "medicine_id_here",
  "quantity": 3
}
```

### Remove from Cart
- **DELETE** `{{baseUrl}}/phr/cart`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "medicineId": "medicine_id_here"
}
```

### Upload Prescription
- **POST** `{{baseUrl}}/phr/cart/upload-prescription`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "cartId": "cart_id_here",
  "prescriptionDocs": ["doc_url_1", "doc_url_2"]
}
```

---

## Order Management

### Create Order
- **POST** `{{baseUrl}}/phr/order`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "cartId": "cart_id_here",
  "deliveryAddress": {
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "ONLINE"
}
```

### Create New Order
- **POST** `{{baseUrl}}/phr/order/new`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "type": "MEDICINE",
  "items": [],
  "deliveryAddress": {
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "ONLINE"
}
```

### Get Order History
- **GET** `{{baseUrl}}/phr/order/{{abhaAddress}}?dateFilter=last30days&deliveryStatus=PENDING`
- **Headers:** as above

### Get Order by ID
- **GET** `{{baseUrl}}/phr/order/id/order_id_here`
- **Headers:** as above

### Update Order Status
- **PATCH** `{{baseUrl}}/phr/order/update`
- **Headers:** as above
- **Body:**
```json
{
  "orderId": "order_id_here",
  "deliveryStatus": "CONFIRMED"
}
```

---

## Health Documents

### Upload Health Document
- **POST** `{{baseUrl}}/upload/document/any`
- **Headers:** as above
- **Body:**
```json
{
  "patient": "{{mobileNum}}",
  "data": {
    "resourceType": "DocumentReference",
    "content": [],
    "context": {}
  },
  "careContext": {}
}
```

### Get Documents
- **GET** `{{baseUrl}}/upload/get-document?patient={{mobileNum}}`
- **Headers:** as above

### Filter Documents
- **GET** `{{baseUrl}}/upload/getFilterDocs?patient={{mobileNum}}&timeline=last30days&documenttype=prescription&doctorname=Dr. Smith`
- **Headers:** as above

### Get Health Points
- **GET** `{{baseUrl}}/upload/get-points?patient={{mobileNum}}`
- **Headers:** as above

### Get Health Data
- **GET** `{{baseUrl}}/upload/health-data?patient={{mobileNum}}`
- **Headers:** as above

### Update Health Data
- **PUT** `{{baseUrl}}/upload/health-data`
- **Headers:** as above
- **Body:**
```json
{
  "patient": "{{mobileNum}}",
  "healthData": {
    "bloodPressure": "120/80",
    "weight": "70kg",
    "height": "170cm"
  }
}
```

---

## Search

### Search
- **GET** `{{baseUrl}}/phr/search?query=medicine_name`
- **Headers:** as above

---

## Notifications

### Create Notification
- **POST** `{{baseUrl}}/phr/notifications`
- **Headers:** as above
- **Body:**
```json
{
  "abhaaddress": "{{abhaAddress}}",
  "title": "Order Update",
  "message": "Your order has been confirmed",
  "type": "ORDER_UPDATE"
}
```

### Get User Notifications
- **GET** `{{baseUrl}}/phr/notifications/{{abhaAddress}}?seen=false`
- **Headers:** as above

### Mark Notification as Seen
- **PATCH** `{{baseUrl}}/phr/notifications/notification_id_here/seen`
- **Headers:** as above

### Mark All Notifications as Seen
- **PATCH** `{{baseUrl}}/phr/notifications/{{abhaAddress}}/seen-all`
- **Headers:** as above

---

## Delivery Address

### Add Delivery Address
- **POST** `{{baseUrl}}/delivery-address`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

### Get Delivery Addresses
- **GET** `{{baseUrl}}/delivery-address/{{abhaAddress}}`
- **Headers:** as above

---

## Services

### Get Medicines
- **GET** `{{baseUrl}}/medicine?category=antibiotics&search=paracetamol`
- **Headers:** as above

### Get Medicine Categories
- **GET** `{{baseUrl}}/medicine/categories`
- **Headers:** as above

### Get Lab Test Slots
- **GET** `{{baseUrl}}/lab-test/slots/lab_test_id_here`
- **Headers:** as above

### Book Lab Test
- **POST** `{{baseUrl}}/lab-test/book`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "labTestId": "test_id_here",
  "slot": {
    "startTime": "09:00",
    "endTime": "10:00",
    "date": "2024-01-01"
  }
}
```

### Get Doctor Profile
- **GET** `{{baseUrl}}/doctor-appointment/doctor/doctor_id_here`
- **Headers:** as above

### Book Doctor Appointment
- **POST** `{{baseUrl}}/doctor-appointment/book`
- **Headers:** as above
- **Body:**
```json
{
  "abhaAddress": "{{abhaAddress}}",
  "doctorId": "doctor_id_here",
  "slot": {
    "startTime": "09:00",
    "endTime": "10:00",
    "date": "2024-01-01"
  },
  "symptoms": "Fever and cough"
}
```

---

## PHR APIs

### Enroll using ABHA Number
- **POST** `{{baseUrl}}/phr/m1/enrollment/abha-number`
- **Headers:** as above
- **Body:**
```json
{ "abhaNumber": "1234567890123456" }
```

### Enroll using Mobile Number
- **POST** `{{baseUrl}}/phr/m1/enrollment/mobile`
- **Headers:** as above
- **Body:**
```json
{ "mobileNumber": "{{mobileNum}}" }
```

### Discover and Link User
- **POST** `{{baseUrl}}/phr/m2/discovery/link`
- **Headers:** as above
- **Body:**
```json
{ "abhaAddress": "{{abhaAddress}}" }
```

### Consent Management
- **POST** `{{baseUrl}}/phr/m3/consent/init`
- **Headers:** as above
- **Body:**
```json
{ "abhaAddress": "{{abhaAddress}}", "hipId": "hip_id_here" }
```

---

**Usage Notes:**
- Replace variables like `{{baseUrl}}`, `{{authToken}}`, `{{abhaAddress}}`, `{{mobileNum}}` with actual values.
- All endpoints requiring authentication must include the `Authorization: Bearer {{authToken}}` header.
- For POST/PATCH/PUT requests, refer to the Postman collection for full request body examples. 
---
layout: default
title: Website/Backend API Documentation
permalink: /api-website
---

# SwasthX Website & Backend API Documentation

This document provides a reference for the Backend APIs used by the Web Portals (Admin, Doctor Portal).

---

## Authentication (Standard)

### Login
- **POST** `{{baseUrl}}/auth/login`
- **Body:**
```json
{
  "email": "doctor@swasthx.com",
  "password": "hashed_password"
}
```

### Register (Admin)
- **POST** `{{baseUrl}}/auth/register`

### Refresh Token
- **POST** `{{baseUrl}}/auth/refresh`

---

## Appointments (Provider View)

### List Appointments
- **GET** `{{baseUrl}}/appointments?doctorId={{doctorId}}&date={{date}}`

### Update Appointment Status
- **PUT** `{{baseUrl}}/appointments/{{appointmentId}}`
- **Body:** `{ "status": "COMPLETED", "notes": "..." }`

---

## Health Records (Provider View)

### List Patient Records
- **GET** `{{baseUrl}}/health-records?patientId={{patientId}}`

### Create Record
- **POST** `{{baseUrl}}/health-records`

---

## Admin Operations

### User Management
- **GET** `{{baseUrl}}/users`
- **PATCH** `{{baseUrl}}/users/{{userId}}/role`

### System Metrics
- **GET** `{{baseUrl}}/metrics`
- **GET** `{{baseUrl}}/health`

---

## Integration Endpoints

### ABDM Callbacks
- **POST** `{{baseUrl}}/webhooks/abdm/callback`

### Payment Webhooks
- **POST** `{{baseUrl}}/webhooks/razorpay`

# SwasthX Backend API Documentation

> **Tip:** For hands-on testing, download the [Swasthx Postman Collection](/docs/postman-collection.json) and follow the [Postman Guide](/docs/postman-collection-guide) for setup and usage.

## 🚀 How to Use This Documentation with Postman

1. **Download the Postman Collection:** [postman-collection.json](/docs/postman-collection.json)
2. **Import into Postman:** Open Postman → Import → File → Select the JSON file.
3. **Set Up Environment:**
   - Create a new environment (see [Environment Setup](/docs/postman-collection-guide#environment-setup))
   - Add variables: `baseUrl`, `authToken`, `abhaAddress`, `mobileNum`, etc.
4. **Authenticate:**
   - Use the `Authentication` folder in the collection to get your token.
   - Save the token as `authToken` in your environment.
5. **Test Endpoints:**
   - Each API group below references the corresponding Postman folder/request.
   - Use the collection to send requests and view responses.

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [PHR (Personal Health Record) APIs](#phr-apis)
4. [Cart Management](#cart-management)
5. [Order Management](#order-management)
6. [Health Document Management](#health-document-management)
7. [Search APIs](#search-apis)
8. [Notification APIs](#notification-apis)
9. [Services APIs](#services-apis)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)
12. [Step-by-Step Example Workflow](#step-by-step-example-workflow)

---

## Overview

SwasthX is a comprehensive healthcare platform that provides Personal Health Record (PHR) management, medicine ordering, lab test booking, and doctor appointment services. This API documentation covers all the major endpoints available in the backend system.

**Base URL**: `https://api.swasthx.com` (Replace with your actual base URL)

---

## Authentication

> **Test with Postman:**
> - Folder: `Authentication`
> - Requests: `Get OTP for Login`, `Verify OTP for Login`, `Get Token for App`

### Login Flow

#### 1. Get OTP for Login
**Postman Request:** `Authentication → Get OTP for Login`
```http
POST /auth/login/otp
```

**Request Body:**
```json
{
  "hashString": "string",
  "mobileNum": "7351077069"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "status": 201
}
```

#### 2. Verify OTP for Login
**Postman Request:** `Authentication → Verify OTP for Login`
```http
POST /auth/verify/login/otp
```

**Request Body:**
```json
{
  "mobileNum": "7351077069",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "status": 201
}
```

#### 3. Get Token for App
**Postman Request:** `Authentication → Get Token for App`
```http
POST /auth/token/app
```

**Request Body:**
```json
{
  "mobNum": "7351077069",
  "tag": "app_tag"
}
```

**Response:**
```json
{
  "token": "session_token_here",
  "status": 201
}
```

---

## PHR (Personal Health Record) APIs

> **Test with Postman:**
> - Folder: `Cart Management`

### Cart Management

#### Add Item to Cart
**Postman Request:** `Cart Management → Add Item to Cart`
```http
POST /phr/cart
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "type": "MEDICINE",
  "medicines": {
    "items": [
      {
        "medicineId": "medicine_id_here",
        "quantity": 2
      }
    ],
    "prescriptionDocs": ["doc_url_1", "doc_url_2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cartId": "cart_id_here",
    "items": [...]
  }
}
```

#### Add Item to New Cart
**Postman Request:** `Cart Management → Add Item to New Cart`
```http
POST /phr/cart/new
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "type": "MEDICINE",
  "medicines": {
    "items": [
      {
        "medicineId": "medicine_id_here",
        "quantity": 2
      }
    ]
  },
  "forceClear": false
}
```

#### Upload Prescription
**Postman Request:** `Cart Management → Upload Prescription`
```http
POST /phr/cart/upload-prescription
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "cartId": "cart_id_here",
  "prescriptionDocs": ["doc_url_1", "doc_url_2"]
}
```

#### Get Cart
**Postman Request:** `Cart Management → Get Cart`
```http
GET /phr/cart/{abhaAddress}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cartId": "cart_id_here",
    "items": [
      {
        "medicineId": "medicine_id",
        "name": "Medicine Name",
        "quantity": 2,
        "price": 100
      }
    ],
    "total": 200
  }
}
```

#### Update Cart Item
**Postman Request:** `Cart Management → Update Cart Item`
```http
PATCH /phr/cart
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "medicineId": "medicine_id_here",
  "quantity": 3
}
```

---

## Order Management

> **Test with Postman:**
> - Folder: `Order Management`

#### Create Order
**Postman Request:** `Order Management → Create Order`
```http
POST /phr/orders
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "cartId": "cart_id_here",
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "ONLINE"
}
```

**Response:**
```json
{
  "orderId": "order_123",
  "status": "CONFIRMED",
  ...
}
```

#### Get User Orders
**Postman Request:** `Order Management → Get User Orders`
```http
GET /phr/orders/{abhaAddress}`
```

---

## Health Document Management

> **Test with Postman:**
> - Folder: `Health Documents`

#### Upload Health Document
**Postman Request:** `Health Documents → Upload Health Document`
```http
POST /phr/documents
```

**Form Data:**
- abhaAddress: `{{abhaAddress}}`
- documentType: `LAB_REPORT`
- file: [Select file]
- description: `Blood test report from January 2024`

#### Get Health Documents
**Postman Request:** `Health Documents → Get Health Documents`
```http
GET /phr/documents/{abhaAddress}`
```

---

## Search APIs

> **Test with Postman:**
> - Folder: `Search APIs`

#### Search Medicines
**Postman Request:** `Search APIs → Search Medicines`
```http
GET /search/medicines?q=paracetamol
```

---

## Error Handling

All error responses follow this format:
```json
{
  "error": "ErrorType",
  "message": "Error message",
  "status": 400
}
```

---

## Rate Limiting

- **100 requests per minute** per IP
- **1000 requests per hour** per user
- **Burst limit:** 50 requests per 10 seconds

---

## Step-by-Step Example Workflow

### Example: Place a Medicine Order Using Postman

1. **Authenticate**
   - Use `Authentication → Get OTP for Login` and `Verify OTP for Login` to get your token
   - Set the `authToken` variable in your environment
2. **Search for a Medicine**
   - Use `Search APIs → Search Medicines` to find the medicine you want
3. **Add to Cart**
   - Use `Cart Management → Add Item to Cart` with the medicine ID
   - Save the `cartId` from the response
4. **Upload Prescription (if required)**
   - Use `Cart Management → Upload Prescription` with your prescription file
5. **Create Order**
   - Use `Order Management → Create Order` with the `cartId` and shipping details
6. **Track Order**
   - Use `Order Management → Get User Orders` to view your order status

---

> For more details, see the [Postman Collection Guide](/docs/postman-collection-guide) and [Postman Quick Reference](/docs/postman-quick-reference). 
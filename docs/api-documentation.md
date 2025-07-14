# SwasthX Backend API Documentation

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

## Overview

SwasthX is a comprehensive healthcare platform that provides Personal Health Record (PHR) management, medicine ordering, lab test booking, and doctor appointment services. This API documentation covers all the major endpoints available in the backend system.

**Base URL**: `https://api.swasthx.com` (Replace with your actual base URL)

## Authentication

### Login Flow

#### 1. Get OTP for Login
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

## PHR (Personal Health Record) APIs

### Cart Management

#### Add Item to Cart
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

#### Remove from Cart
```http
DELETE /phr/cart
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "medicineId": "medicine_id_here"
}
```

### Order Management

#### Create Order
```http
POST /phr/order
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
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

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "order_id_here",
    "status": "PENDING",
    "total": 200
  }
}
```

#### Create New Order
```http
POST /phr/order/new
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "type": "MEDICINE",
  "items": [...],
  "deliveryAddress": {...},
  "paymentMethod": "ONLINE"
}
```

#### Get Order History
```http
GET /phr/order/{abhaAddress}?dateFilter=last30days&deliveryStatus=PENDING
```

**Query Parameters:**
- `dateFilter`: last7days, last30days, last90days
- `deliveryStatus`: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

**Response:**
```json
{
  "success": true,
  "message": "Order history retrieved successfully",
  "data": [
    {
      "orderId": "order_id_here",
      "status": "PENDING",
      "total": 200,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Order by ID
```http
GET /phr/order/id/{orderId}
```

#### Update Order Status
```http
PATCH /phr/order/update
```

**Request Body:**
```json
{
  "orderId": "order_id_here",
  "deliveryStatus": "CONFIRMED"
}
```

### Delivery Address Management

#### Add Delivery Address
```http
POST /delivery-address
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

#### Get Delivery Addresses
```http
GET /delivery-address/{abhaAddress}
```

## Health Document Management

### Upload Health Document
```http
POST /upload/document/any
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "patient": "7351077069",
  "data": {
    "resourceType": "DocumentReference",
    "content": [...],
    "context": {...}
  },
  "careContext": {...}
}
```

**Response:**
```json
{
  "message": "Document Added Successfully",
  "DocumentId": "document_id_here"
}
```

### Get Documents
```http
GET /upload/get-document?patient=7351077069
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Filter Documents
```http
GET /upload/getFilterDocs?patient=7351077069&timeline=last30days&documenttype=prescription&doctorname=Dr. Smith
```

**Query Parameters:**
- `patient`: Mobile number
- `timeline`: last7days, last30days, last90days, all
- `documenttype`: prescription, lab_report, etc.
- `doctorname`: Doctor name filter

### Upload Document from Doctor
```http
POST /upload/doctor/document
```

**Request Body:**
```json
{
  "patient": "7351077069",
  "data": {
    "resourceType": "DocumentReference",
    "content": [...]
  }
}
```

### Get Health Points
```http
GET /upload/get-points?patient=7351077069
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Label Document
```http
POST /upload/label
```

**Request Body:**
```json
{
  "url": "document_url_here"
}
```

### Get Health Data
```http
GET /upload/health-data?patient=7351077069
```

### Update Health Data
```http
PUT /upload/health-data
```

**Request Body:**
```json
{
  "patient": "7351077069",
  "healthData": {
    "bloodPressure": "120/80",
    "weight": "70kg",
    "height": "170cm"
  }
}
```

## Search APIs

### Search
```http
GET /phr/search?query=medicine_name
```

**Query Parameters:**
- `query`: Search term

**Response:**
```json
{
  "results": [
    {
      "id": "item_id",
      "name": "Medicine Name",
      "type": "MEDICINE",
      "description": "Description"
    }
  ]
}
```

## Notification APIs

### Create Notification
```http
POST /phr/notifications
```

**Request Body:**
```json
{
  "abhaaddress": "user@abdm",
  "title": "Order Update",
  "message": "Your order has been confirmed",
  "type": "ORDER_UPDATE"
}
```

### Get User Notifications
```http
GET /phr/notifications/{abhaaddress}?seen=false
```

**Query Parameters:**
- `seen`: true/false to filter seen/unseen notifications

### Mark Notification as Seen
```http
PATCH /phr/notifications/{notificationId}/seen
```

### Mark All Notifications as Seen
```http
PATCH /phr/notifications/{abhaaddress}/seen-all
```

## Services APIs

### Lab Test Services

#### Book Lab Test
```http
POST /lab-test/book
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "labTestId": "test_id_here",
  "slot": {
    "startTime": "09:00",
    "endTime": "10:00",
    "date": "2024-01-01"
  }
}
```

#### Get Lab Test Slots
```http
GET /lab-test/slots/{labTestId}
```

### Medicine Services

#### Get Medicines
```http
GET /medicine
```

**Query Parameters:**
- `category`: Medicine category
- `search`: Search term

#### Get Medicine Categories
```http
GET /medicine/categories
```

### Doctor Appointment Services

#### Book Doctor Appointment
```http
POST /doctor-appointment/book
```

**Request Body:**
```json
{
  "abhaAddress": "user@abdm",
  "doctorId": "doctor_id_here",
  "slot": {
    "startTime": "09:00",
    "endTime": "10:00",
    "date": "2024-01-01"
  },
  "symptoms": "Fever and cough"
}
```

#### Get Doctor Profile
```http
GET /doctor-appointment/doctor/{doctorId}
```

## PHR API (ABDM Integration)

### M1 - PHR Enrollment

#### Enroll using ABHA Number
```http
POST /phr/m1/enrollment/abha-number
```

#### Enroll using Mobile Number
```http
POST /phr/m1/enrollment/mobile
```

#### Enroll using Email
```http
POST /phr/m1/enrollment/email
```

### M2 - Discovery and Linking

#### Discover and Link User
```http
POST /phr/m2/discovery/link
```

#### HIP Initiated Linking
```http
POST /phr/m2/hip-initiated/link
```

### M3 - Data Transfer

#### Consent Management
```http
POST /phr/m3/consent/init
```

#### Fetch Health Data
```http
POST /phr/m3/fetch/data
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "error": "Validation error details"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default Rate Limit**: 10 requests per minute
- **Document Upload**: 10 requests per minute
- **Document Fetch**: 200 requests per minute
- **Authentication**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1640995200
```

## Authentication Headers

Most APIs require authentication using JWT tokens:

```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Data Types

### Common Data Types

- **abhaAddress**: String (format: user@abdm)
- **mobileNum**: String (10 digits)
- **orderId**: String (UUID)
- **cartId**: String (UUID)
- **medicineId**: String (UUID)
- **timestamp**: ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)

### Enums

#### Cart Type
- `MEDICINE`
- `LAB_TEST`

#### Order Status
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

#### Payment Method
- `ONLINE`
- `COD`
- `WALLET`

## Testing

### Postman Collection
We provide a comprehensive Postman collection that includes all API endpoints with pre-configured requests, variables, and examples. You can download the collection and import it into Postman for easy testing.

**Download Postman Collection**: [SwasthX API Collection]({{ site.baseurl }}/postman-collection.json)

**Features of the Collection:**
- Pre-configured environment variables
- Organized by API categories
- Sample request bodies and parameters
- Authentication headers setup
- Ready-to-use examples

### Health Check
```http
GET /ping
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Sitemap
```http
GET /sitemap.xml
```

## Support

For API support and questions:
- Email: support@swasthx.com
- Documentation: https://docs.swasthx.com
- Status Page: https://status.swasthx.com

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained by**: SwasthX Development Team 
---
layout: default
title: Postman Collection Guide
---

# 📦 Swasthx Postman Collection Guide

This comprehensive guide will help you set up and use the Swasthx Postman collection for testing and integrating with our APIs.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Collection Overview](#collection-overview)
3. [Environment Setup](#environment-setup)
4. [Authentication Flow](#authentication-flow)
5. [API Categories](#api-categories)
6. [Testing Workflows](#testing-workflows)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

## 🚀 Quick Start

### Step 1: Download the Collection
1. Click [Postman Collection](/docs/postman-collection.json) to download the JSON file
2. Save it to your local machine

### Step 2: Import to Postman
1. Open Postman
2. Click **Import** → **File**
3. Select the downloaded `postman-collection.json` file
4. The collection will be imported with all requests organized by category

### Step 3: Set Up Environment
1. Create a new environment in Postman
2. Add the required variables (see [Environment Setup](#environment-setup))
3. Select the environment for testing

## 📊 Collection Overview

The Swasthx Postman collection is organized into the following categories:

<div class="collection-overview">
  <div class="category-card">
    <div class="category-icon"><i class="fas fa-shield-alt"></i></div>
    <div class="category-content">
      <h3>Authentication</h3>
      <p>3 requests for OTP-based login and token management</p>
      <ul>
        <li>Get OTP for Login</li>
        <li>Verify OTP for Login</li>
        <li>Get Token for App</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-shopping-cart"></i></div>
    <div class="category-content">
      <h3>Cart Management</h3>
      <p>6 requests for shopping cart operations</p>
      <ul>
        <li>Add Item to Cart</li>
        <li>Add Item to New Cart</li>
        <li>Get Cart</li>
        <li>Get New Cart</li>
        <li>Update Cart Item</li>
        <li>Upload Prescription</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-box"></i></div>
    <div class="category-content">
      <h3>Order Management</h3>
      <p>2 requests for order operations</p>
      <ul>
        <li>Create Order</li>
        <li>Get User Orders</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-file-medical"></i></div>
    <div class="category-content">
      <h3>Health Documents</h3>
      <p>2 requests for document management</p>
      <ul>
        <li>Upload Health Document</li>
        <li>Get Health Documents</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-search"></i></div>
    <div class="category-content">
      <h3>Search APIs</h3>
      <p>1 request for medicine search</p>
      <ul>
        <li>Search Medicines</li>
      </ul>
    </div>
  </div>
</div>

## ⚙️ Environment Setup

### Required Environment Variables

Create a new environment in Postman and add the following variables:

| Variable | Type | Description | Example Value |
|----------|------|-------------|---------------|
| `baseUrl` | string | API base URL | `https://swasthxapp.api.swasthx.com` |
| `authToken` | string | JWT authentication token | (will be set after login) |
| `abhaAddress` | string | User's ABHA address | `user@abdm` |
| `mobileNum` | string | User's mobile number | `7351077069` |
| `cartId` | string | Cart identifier | (will be set after cart operations) |
| `orderId` | string | Order identifier | (will be set after order creation) |

### Environment Configuration Steps

1. **Create Environment**:
   - Click the gear icon (⚙️) in the top right
   - Click **"Add"** to create a new environment
   - Name it "Swasthx API"

2. **Add Variables**:
   ```
   VARIABLE: baseUrl
   INITIAL VALUE: https://swasthxapp.api.swasthx.com
   CURRENT VALUE: https://swasthxapp.api.swasthx.com
   
   VARIABLE: authToken
   INITIAL VALUE: (leave empty)
   CURRENT VALUE: (leave empty)
   
   VARIABLE: abhaAddress
   INITIAL VALUE: user@abdm
   CURRENT VALUE: user@abdm
   
   VARIABLE: mobileNum
   INITIAL VALUE: 7351077069
   CURRENT VALUE: 7351077069
   ```

3. **Select Environment**:
   - Choose "Swasthx API" from the environment dropdown
   - All requests will now use these variables

## 🔐 Authentication Flow

### Step 1: Get OTP for Login

1. **Open Request**: `Authentication → Get OTP for Login`
2. **Verify Body**:
   ```json
   {
     "hashString": "abc123",
     "mobileNum": "{{mobileNum}}"
   }
   ```
3. **Send Request**: Click **Send**
4. **Expected Response**:
   ```json
   {
     "message": "OTP sent successfully",
     "status": 201
   }
   ```

### Step 2: Verify OTP for Login

1. **Open Request**: `Authentication → Verify OTP for Login`
2. **Update Body**: Replace `"123456"` with the actual OTP received
   ```json
   {
     "mobileNum": "{{mobileNum}}",
     "otp": "123456"
   }
   ```
3. **Send Request**: Click **Send**
4. **Save Token**: Copy the `token` from the response and set it as `authToken` in your environment

### Step 3: Get Token for App (Optional)

1. **Open Request**: `Authentication → Get Token for App`
2. **Verify Body**:
   ```json
   {
     "mobNum": "{{mobileNum}}",
     "tag": "mobile_app"
   }
   ```
3. **Send Request**: Click **Send**

## 📱 API Categories Deep Dive

### 🛒 Cart Management

#### Add Item to Cart
```json
POST {{baseUrl}}/phr/cart
Authorization: Bearer {{authToken}}

{
  "abhaAddress": "{{abhaAddress}}",
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

**Response Handling**:
- Save the `cartId` from the response to your environment
- Use this `cartId` for subsequent cart operations

#### Get Cart
```json
GET {{baseUrl}}/phr/cart/{{abhaAddress}}
Authorization: Bearer {{authToken}}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "cartId": "cart_123",
    "items": [
      {
        "medicineId": "med_123",
        "name": "Paracetamol 500mg",
        "quantity": 2,
        "price": 100
      }
    ],
    "total": 200
  }
}
```

### 📦 Order Management

#### Create Order
```json
POST {{baseUrl}}/phr/orders
Authorization: Bearer {{authToken}}

{
  "abhaAddress": "{{abhaAddress}}",
  "cartId": "{{cartId}}",
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "ONLINE"
}
```

**Response Handling**:
- Save the `orderId` from the response to your environment
- Use this `orderId` for order tracking

### 📄 Health Documents

#### Upload Health Document
```json
POST {{baseUrl}}/phr/documents
Authorization: Bearer {{authToken}}
Content-Type: multipart/form-data

Form Data:
- abhaAddress: {{abhaAddress}}
- documentType: LAB_REPORT
- file: [Select file]
- description: Blood test report from January 2024
```

**File Upload Tips**:
- Use the **Body** tab → **form-data**
- Set the file field type to **File**
- Select your document file

## 🔄 Testing Workflows

### Complete E-commerce Flow

#### Workflow 1: Medicine Purchase
1. **Authentication**: Complete the OTP login flow
2. **Search**: Use "Search Medicines" to find products
3. **Add to Cart**: Add selected medicines to cart
4. **Upload Prescription**: Upload prescription if required
5. **Create Order**: Create order from cart
6. **Track Order**: Check order status

#### Workflow 2: Health Document Management
1. **Authentication**: Complete the OTP login flow
2. **Upload Document**: Upload health documents
3. **View Documents**: Retrieve and view uploaded documents
4. **Search Documents**: Filter documents by type

### Automated Testing

#### Pre-request Scripts
Add this script to automatically set the auth token:

```javascript
// Pre-request Script for authenticated requests
if (pm.environment.get("authToken")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("authToken")
    });
}
```

#### Test Scripts
Add this script to validate responses:

```javascript
// Test Script for API responses
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Auto-save cartId if present
if (pm.response.json().data && pm.response.json().data.cartId) {
    pm.environment.set("cartId", pm.response.json().data.cartId);
}
```

## 🛠️ Advanced Features

### Collection Variables

The collection includes these pre-configured variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `baseUrl` | `https://swasthxapp.api.swasthx.com` | Production API URL |
| `authToken` | (empty) | JWT token for authentication |
| `abhaAddress` | `user@abdm` | Default ABHA address |
| `mobileNum` | `7351077069` | Default mobile number |

### Request Chaining

#### Example: Login → Add to Cart → Create Order

1. **Login Request**: Add this test script to auto-save the token
   ```javascript
   if (pm.response.json().token) {
       pm.environment.set("authToken", pm.response.json().token);
   }
   ```

2. **Add to Cart Request**: Add this test script to auto-save cartId
   ```javascript
   if (pm.response.json().data && pm.response.json().data.cartId) {
       pm.environment.set("cartId", pm.response.json().data.cartId);
   }
   ```

3. **Create Order Request**: Will automatically use the saved cartId

### Environment Switching

Create multiple environments for different stages:

#### Development Environment
```
baseUrl: https://dev-api.swasthx.com
mobileNum: 7351077069
abhaAddress: test@abdm
```

#### Production Environment
```
baseUrl: https://swasthxapp.api.swasthx.com
mobileNum: (your production number)
abhaAddress: (your production ABHA)
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Errors
**Problem**: `401 Unauthorized` responses
**Solution**: 
- Verify the `authToken` is set in your environment
- Check if the token has expired (tokens expire after 24 hours)
- Re-authenticate using the OTP flow

#### 2. Missing Variables
**Problem**: `{{variableName}}` not being replaced
**Solution**:
- Ensure the environment is selected
- Check that all required variables are set
- Verify variable names match exactly (case-sensitive)

#### 3. File Upload Issues
**Problem**: File upload requests failing
**Solution**:
- Use `form-data` instead of `raw` JSON
- Set the file field type to **File**
- Ensure file size is within limits (usually 10MB)

#### 4. Rate Limiting
**Problem**: `429 Too Many Requests` responses
**Solution**:
- Implement delays between requests
- Use the collection's built-in delays
- Check rate limiting documentation

### Debug Tips

#### Enable Console Logging
Add this to your test scripts:
```javascript
console.log("Response:", pm.response.json());
console.log("Environment:", pm.environment.toObject());
```

#### Check Request Details
- Use the **Console** tab to see request/response details
- Check the **Network** tab for timing information
- Verify headers and body in the **Request** tab

## 📚 Best Practices

### 1. Environment Management
- **Never commit tokens** to version control
- **Use different environments** for dev/staging/prod
- **Regularly rotate** authentication tokens

### 2. Request Organization
- **Group related requests** in folders
- **Use descriptive names** for requests
- **Add comments** to complex requests

### 3. Testing Strategy
- **Start with authentication** before testing other APIs
- **Test error scenarios** (invalid inputs, expired tokens)
- **Validate responses** using test scripts

### 4. Performance Testing
- **Use Postman's built-in** performance testing
- **Monitor response times** for optimization
- **Test rate limiting** scenarios

## 📞 Support

### Getting Help
1. **Check this guide** for common issues
2. **Review the API documentation** for endpoint details
3. **Use Postman's built-in** help and documentation
4. **Contact support** at dev@swasthx.com

### Useful Resources
- [Postman Learning Center](https://learning.postman.com/)
- [Swasthx API Documentation](/docs/api-documentation)
- [Swagger Specification](/docs/swagger-api-documentation.yaml)

---

<div class="postman-footer">
  <div class="postman-tips">
    <h4>💡 Pro Tips</h4>
    <ul>
      <li>Use the <strong>Runner</strong> to execute multiple requests in sequence</li>
      <li>Create <strong>Monitors</strong> to automatically test your APIs</li>
      <li>Use <strong>Pre-request Scripts</strong> to set up dynamic data</li>
      <li>Leverage <strong>Test Scripts</strong> for automated validation</li>
    </ul>
  </div>
  
  <div class="postman-download">
    <h4>📥 Download Collection</h4>
    <p>Get the latest version of the Swasthx Postman collection</p>
    <a href="{{ '/docs/postman-collection.json' | relative_url }}" class="btn-primary" download>
      <i class="fas fa-download"></i> Download Collection
    </a>
  </div>
</div>

<style>
.collection-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.category-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.category-content h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.category-content p {
  color: var(--light-text);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.category-content ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--light-text);
  font-size: 0.85rem;
}

.category-content li {
  margin-bottom: 0.25rem;
}

.postman-footer {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ff6c37 0%, #ff8c42 100%);
  border-radius: 1rem;
  color: white;
}

.postman-footer h4 {
  color: white;
  margin-bottom: 1rem;
}

.postman-tips ul {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  padding-left: 1.5rem;
}

.postman-tips li {
  margin-bottom: 0.5rem;
}

.postman-download {
  margin-top: 1.5rem;
}

.postman-download p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #ff6c37;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .collection-overview {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    flex-direction: column;
    text-align: center;
  }
  
  .category-icon {
    align-self: center;
  }
}
</style> 
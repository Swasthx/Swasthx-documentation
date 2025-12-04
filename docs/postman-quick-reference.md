---
layout: default
title: Postman Quick Reference
permalink: /postman-quick-reference
---

# ⚡ Postman Collection Quick Reference

Quick reference guide for using the Swasthx Postman collection efficiently.

## 🚀 Essential Commands

### Environment Variables
```bash
# Set environment variable
pm.environment.set("authToken", "your_token_here");

# Get environment variable
pm.environment.get("authToken");

# Clear environment variable
pm.environment.unset("authToken");
```

### Request Headers
```javascript
// Add Authorization header
pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("authToken")
});

// Add Content-Type header
pm.request.headers.add({
    key: "Content-Type",
    value: "application/json"
});
```

### Response Validation
```javascript
// Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Validate response structure
pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Check response time
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
```

## 📋 Common Workflows

### 1. Authentication Flow
```javascript
// Step 1: Get OTP
// Send: POST /auth/login/otp
// Body: {"hashString": "abc123", "mobileNum": "{{mobileNum}}"}

// Step 2: Verify OTP (add this test script)
if (pm.response.json().token) {
    pm.environment.set("authToken", pm.response.json().token);
    console.log("Token saved:", pm.response.json().token);
}

// Step 3: Use token in subsequent requests
```

### 2. Cart Operations
```javascript
// Add to cart (add this test script)
if (pm.response.json().data && pm.response.json().data.cartId) {
    pm.environment.set("cartId", pm.response.json().data.cartId);
    console.log("Cart ID saved:", pm.response.json().data.cartId);
}

// Get cart items
// GET {{baseUrl}}/phr/cart/{{abhaAddress}}
```

### 3. Order Creation
```javascript
// Create order (add this test script)
if (pm.response.json().data && pm.response.json().data.orderId) {
    pm.environment.set("orderId", pm.response.json().data.orderId);
    console.log("Order ID saved:", pm.response.json().data.orderId);
}
```

## 🔧 Pre-request Scripts

### Auto-set Authorization Header
```javascript
// Add to all authenticated requests
if (pm.environment.get("authToken")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("authToken")
    });
}
```

### Generate Dynamic Data
```javascript
// Generate timestamp
pm.environment.set("timestamp", new Date().toISOString());

// Generate random ID
pm.environment.set("randomId", Math.random().toString(36).substr(2, 9));
```

### Set Default Headers
```javascript
// Set common headers
pm.request.headers.add({
    key: "Content-Type",
    value: "application/json"
});

pm.request.headers.add({
    key: "Accept",
    value: "application/json"
});
```

## 🧪 Test Scripts

### Basic Response Tests
```javascript
// Status code test
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response time test
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// JSON response test
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});
```

### Data Validation Tests
```javascript
// Check required fields
pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});

// Validate data types
pm.test("Data types are correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.a('boolean');
    pm.expect(jsonData.data).to.be.an('object');
});
```

### Auto-save Variables
```javascript
// Save token from login response
if (pm.response.json().token) {
    pm.environment.set("authToken", pm.response.json().token);
}

// Save cart ID from cart response
if (pm.response.json().data && pm.response.json().data.cartId) {
    pm.environment.set("cartId", pm.response.json().data.cartId);
}

// Save order ID from order response
if (pm.response.json().data && pm.response.json().data.orderId) {
    pm.environment.set("orderId", pm.response.json().data.orderId);
}
```

## 📊 Environment Templates

### Development Environment
```json
{
  "name": "Swasthx Development",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://dev-api.swasthx.com",
      "enabled": true
    },
    {
      "key": "mobileNum",
      "value": "7351077069",
      "enabled": true
    },
    {
      "key": "abhaAddress",
      "value": "test@abdm",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Production Environment
```json
{
  "name": "Swasthx Production",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://swasthxapp.api.swasthx.com",
      "enabled": true
    },
    {
      "key": "mobileNum",
      "value": "YOUR_PRODUCTION_NUMBER",
      "enabled": true
    },
    {
      "key": "abhaAddress",
      "value": "YOUR_PRODUCTION_ABHA",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

## 🎯 Request Templates

### Authentication Request
```json
POST {{baseUrl}}/auth/login/otp
Content-Type: application/json

{
  "hashString": "abc123",
  "mobileNum": "{{mobileNum}}"
}
```

### Cart Request
```json
POST {{baseUrl}}/phr/cart
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "abhaAddress": "{{abhaAddress}}",
  "type": "MEDICINE",
  "medicines": {
    "items": [
      {
        "medicineId": "med_123",
        "quantity": 2
      }
    ]
  }
}
```

### Order Request
```json
POST {{baseUrl}}/phr/orders
Authorization: Bearer {{authToken}}
Content-Type: application/json

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

## 🔍 Debugging Commands

### Console Logging
```javascript
// Log response data
console.log("Response:", pm.response.json());

// Log environment variables
console.log("Environment:", pm.environment.toObject());

// Log request details
console.log("Request URL:", pm.request.url.toString());
console.log("Request Headers:", pm.request.headers.toObject());
```

### Error Handling
```javascript
// Check for errors
pm.test("No errors in response", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.not.have.property('error');
});

// Log errors if present
if (pm.response.json().error) {
    console.error("API Error:", pm.response.json().error);
}
```

## ⚡ Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Send Request | Ctrl + Enter | Cmd + Enter |
| Save Request | Ctrl + S | Cmd + S |
| Duplicate Request | Ctrl + D | Cmd + D |
| Delete Request | Delete | Delete |
| Open Console | Ctrl + Alt + C | Cmd + Alt + C |
| Open Settings | Ctrl + , | Cmd + , |

## 🚨 Common Error Codes

| Status Code | Meaning | Solution |
|-------------|---------|----------|
| 400 | Bad Request | Check request body and parameters |
| 401 | Unauthorized | Verify authToken is set and valid |
| 403 | Forbidden | Check user permissions |
| 404 | Not Found | Verify endpoint URL is correct |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Internal Server Error | Contact support |

## 📈 Performance Tips

### Response Time Monitoring
```javascript
// Monitor response times
pm.test("Response time tracking", function () {
    console.log("Response time:", pm.response.responseTime + "ms");
    
    if (pm.response.responseTime > 1000) {
        console.warn("Slow response detected!");
    }
});
```

### Batch Testing
```javascript
// Test multiple endpoints
pm.test("Batch API test", function () {
    // Test 1: Authentication
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
    
    // Test 2: Response structure
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    
    // Test 3: Data validation
    if (jsonData.data) {
        pm.expect(jsonData.data).to.be.an('object');
    }
});
```

---

<div class="quick-ref-footer">
  <div class="quick-ref-section">
    <h4>📚 Related Documentation</h4>
    <ul>
      <li><a href="{{ '/docs/postman-collection-guide' | relative_url }}">Complete Postman Guide</a></li>
      <li><a href="{{ '/docs/api-documentation' | relative_url }}">API Documentation</a></li>
      <li><a href="{{ '/docs/swagger-api-documentation.yaml' | relative_url }}">Swagger Spec</a></li>
    </ul>
  </div>
  
  <div class="quick-ref-section">
    <h4>🔗 Useful Links</h4>
    <ul>
      <li><a href="https://learning.postman.com/" target="_blank">Postman Learning Center</a></li>
      <li><a href="https://www.postman.com/downloads/" target="_blank">Download Postman</a></li>
      <li><a href="https://www.postman.com/collection/" target="_blank">Postman Collections</a></li>
    </ul>
  </div>
</div>

<style>
.quick-ref-footer {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.quick-ref-section {
  margin-bottom: 1.5rem;
}

.quick-ref-section h4 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.quick-ref-section ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--light-text);
}

.quick-ref-section li {
  margin-bottom: 0.5rem;
}

.quick-ref-section a {
  color: var(--primary-color);
  text-decoration: none;
}

.quick-ref-section a:hover {
  text-decoration: underline;
}
</style> 
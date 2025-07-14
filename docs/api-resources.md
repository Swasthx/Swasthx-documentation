---
layout: default
title: API Resources & Documentation
---

# 🔌 API Resources & Documentation

Welcome to the comprehensive API resources hub for the SwasthX healthcare platform. Here you'll find all the tools and documentation needed to integrate with our APIs.

## 📋 Quick Navigation

<div class="api-resources-grid">
  <div class="api-card primary">
    <div class="api-icon"><i class="fas fa-book"></i></div>
    <div class="api-content">
      <h3><a href="{{ '/docs/api-documentation' | relative_url }}">API Documentation</a></h3>
      <p>Complete API reference with endpoints, parameters, and examples for all SwasthX services.</p>
      <div class="api-features">
        <span class="feature">📖 Detailed Guides</span>
        <span class="feature">🔍 Code Examples</span>
        <span class="feature">⚡ Quick Start</span>
      </div>
    </div>
  </div>

  <div class="api-card swagger">
    <div class="api-icon"><i class="fas fa-file-code"></i></div>
    <div class="api-content">
      <h3><a href="{{ '/docs/swagger-api-documentation.yaml' | relative_url }}">Swagger/OpenAPI Spec</a></h3>
      <p>Machine-readable API specification in OpenAPI 3.0 format for code generation and testing.</p>
      <div class="api-features">
        <span class="feature">🤖 Auto-Generated</span>
        <span class="feature">🔧 Code Generation</span>
        <span class="feature">🧪 Testing Tools</span>
      </div>
    </div>
  </div>

  <div class="api-card postman">
    <div class="api-icon"><i class="fas fa-file-export"></i></div>
    <div class="api-content">
      <h3><a href="{{ '/docs/postman-collection.json' | relative_url }}">Postman Collection</a></h3>
      <p>Ready-to-use Postman collection with pre-configured requests and environments.</p>
      <div class="api-features">
        <span class="feature">🚀 Ready to Use</span>
        <span class="feature">🔐 Pre-configured Auth</span>
        <span class="feature">📦 Environment Variables</span>
      </div>
    </div>
  </div>

  <div class="api-card guidelines">
    <div class="api-icon"><i class="fas fa-ruler"></i></div>
    <div class="api-content">
      <h3><a href="{{ '/docs/api-guidelines' | relative_url }}">API Guidelines</a></h3>
      <p>Best practices, standards, and guidelines for API development and integration.</p>
      <div class="api-features">
        <span class="feature">📋 Standards</span>
        <span class="feature">🎯 Best Practices</span>
        <span class="feature">🔒 Security</span>
      </div>
    </div>
  </div>
</div>

## 🚀 Getting Started with APIs

### 1. Choose Your Integration Method

#### **For Developers & Testing**
- **Postman Collection**: Download and import the collection for immediate testing
- **Swagger Spec**: Use with Swagger UI or code generation tools
- **API Documentation**: Read detailed guides and examples

#### **For Production Integration**
- **API Guidelines**: Follow our standards and best practices
- **Authentication**: Implement proper token-based authentication
- **Rate Limiting**: Understand and respect API limits

### 2. Authentication Setup

All SwasthX APIs require authentication using Bearer tokens:

```bash
# Example API call with authentication
curl -X GET "https://swasthxapp.api.swasthx.com/phr/cart/user@abdm" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Base URLs

| Environment | Base URL | Description |
|-------------|----------|-------------|
| **Production** | `https://swasthxapp.api.swasthx.com` | Live production environment |
| **Development** | `https://dev-api.swasthx.com` | Development and testing environment |

## 📊 API Categories

### 🔐 Authentication APIs
- **OTP-based Login**: Secure mobile number verification
- **Token Management**: JWT and session token handling
- **App Authentication**: Mobile app specific authentication

### 🛒 Cart Management APIs
- **Add to Cart**: Add medicines and services to cart
- **Cart Operations**: View, update, and manage cart items
- **Prescription Upload**: Upload prescription documents

### 📦 Order Management APIs
- **Order Creation**: Create orders from cart items
- **Order Tracking**: Track order status and updates
- **Order History**: Retrieve user order history

### 📄 Health Document APIs
- **Document Upload**: Upload health records and documents
- **Document Management**: Organize and retrieve health documents
- **PHR Integration**: Personal Health Record management

### 🔍 Search APIs
- **Medicine Search**: Search medicines by name, composition
- **Service Search**: Find lab tests and appointments
- **Advanced Filters**: Filter by price, availability, etc.

## 🛠️ Integration Tools

### Swagger UI Integration

You can view the interactive Swagger documentation by:

1. **Online Swagger Editor**: 
   - Go to [Swagger Editor](https://editor.swagger.io/)
   - Paste the contents of `swagger-api-documentation.yaml`
   - View interactive documentation

2. **Local Swagger UI**:
   ```bash
   # Install swagger-ui-express (Node.js)
   npm install swagger-ui-express
   
   # Serve the YAML file
   const swaggerUi = require('swagger-ui-express');
   const YAML = require('yamljs');
   const swaggerDocument = YAML.load('./docs/swagger-api-documentation.yaml');
   
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   ```

### Postman Collection Setup

1. **Download Collection**:
   - Click the Postman Collection link above
   - Save the JSON file locally

2. **Import to Postman**:
   - Open Postman
   - Click "Import" → "File" → Select the downloaded JSON
   - The collection will be imported with all requests

3. **Configure Environment**:
   - Create a new environment in Postman
   - Set the following variables:
     - `baseUrl`: `https://swasthxapp.api.swasthx.com`
     - `authToken`: Your JWT token
     - `abhaAddress`: User's ABHA address
     - `mobileNum`: User's mobile number

4. **Start Testing**:
   - Select the environment
   - Start with authentication endpoints
   - Test other endpoints using the generated token

## 📈 API Performance & Limits

### Rate Limiting
- **100 requests per minute** per IP address
- **1000 requests per hour** per authenticated user
- **Burst limit**: 50 requests per 10 seconds

### Response Times
- **Average**: < 200ms for most endpoints
- **Search APIs**: < 500ms for complex queries
- **File Upload**: Varies based on file size

### Availability
- **Uptime**: 99.9% SLA
- **Maintenance**: Scheduled during low-traffic hours
- **Status Page**: Available at status.swasthx.com

## 🔒 Security & Compliance

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Expiry**: 24 hours for regular tokens, 7 days for app tokens
- **Refresh Tokens**: Available for seamless re-authentication

### Data Protection
- **HTTPS Only**: All API communications are encrypted
- **HIPAA Compliance**: Healthcare data protection standards
- **Data Encryption**: At rest and in transit

### API Security
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing

## 🆘 Support & Troubleshooting

### Common Issues

#### **Authentication Errors**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "status": 401
}
```
**Solution**: Refresh your authentication token

#### **Rate Limit Exceeded**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "status": 429
}
```
**Solution**: Implement exponential backoff in your requests

#### **Validation Errors**
```json
{
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "status": 400,
  "details": ["mobileNum must be 10 digits"]
}
```
**Solution**: Check the API documentation for required parameters

### Getting Help

1. **Documentation**: Check the detailed API documentation first
2. **Postman Collection**: Use the pre-configured collection for testing
3. **Swagger Spec**: Validate your requests against the OpenAPI specification
4. **Support Team**: Contact dev@swasthx.com for technical support

## 📚 Additional Resources

### Code Examples

#### **JavaScript/Node.js**
```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://swasthxapp.api.swasthx.com',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get user cart
const getCart = async (abhaAddress) => {
  try {
    const response = await apiClient.get(`/phr/cart/${abhaAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error.response.data);
  }
};
```

#### **Python**
```python
import requests

class SwasthxAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_cart(self, abha_address):
        response = requests.get(
            f"{self.base_url}/phr/cart/{abha_address}",
            headers=self.headers
        )
        return response.json()
```

#### **cURL Examples**
```bash
# Get OTP for login
curl -X POST "https://swasthxapp.api.swasthx.com/auth/login/otp" \
  -H "Content-Type: application/json" \
  -d '{"hashString": "abc123", "mobileNum": "7351077069"}'

# Get user cart
curl -X GET "https://swasthxapp.api.swasthx.com/phr/cart/user@abdm" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

<div class="api-footer">
  <div class="api-footer-content">
    <div class="api-footer-section">
      <h4>📞 Need Help?</h4>
      <p>Contact our development team for technical support and integration assistance.</p>
      <a href="mailto:dev@swasthx.com" class="btn-primary">Contact Support</a>
    </div>
    
    <div class="api-footer-section">
      <h4>📈 API Status</h4>
      <p>Check the current status of our APIs and services.</p>
      <a href="https://status.swasthx.com" class="btn-secondary" target="_blank">View Status</a>
    </div>
  </div>
</div>

<style>
.api-resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.api-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  background: white;
}

.api-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.api-card.primary {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.api-card.swagger {
  border-color: #85ea2d;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.api-card.postman {
  border-color: #ff6c37;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}

.api-card.guidelines {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%);
}

.api-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.api-card.primary .api-icon {
  background: var(--primary-color);
}

.api-card.swagger .api-icon {
  background: #85ea2d;
}

.api-card.postman .api-icon {
  background: #ff6c37;
}

.api-card.guidelines .api-icon {
  background: #8b5cf6;
}

.api-content h3 {
  margin-bottom: 0.75rem;
}

.api-content h3 a {
  color: var(--text-color);
  text-decoration: none;
}

.api-content h3 a:hover {
  color: var(--primary-color);
}

.api-content p {
  color: var(--light-text);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.api-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature {
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.api-footer {
  margin-top: 4rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.api-footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.api-footer-section h4 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.api-footer-section p {
  color: var(--light-text);
  margin-bottom: 1.5rem;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .api-resources-grid {
    grid-template-columns: 1fr;
  }
  
  .api-card {
    flex-direction: column;
    text-align: center;
  }
  
  .api-icon {
    align-self: center;
  }
  
  .api-footer-content {
    grid-template-columns: 1fr;
  }
}
</style> 
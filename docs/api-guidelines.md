# SwasthX API Design Guidelines

## Table of Contents
1. [General Principles](#general-principles)
2. [RESTful Standards](#restful-standards)
3. [Request & Response Format](#request--response-format)
4. [Error Handling](#error-handling)
5. [Versioning](#versioning)
6. [Pagination](#pagination)
7. [Filtering, Sorting & Searching](#filtering-sorting--searching)
8. [Rate Limiting](#rate-limiting)
9. [Authentication & Authorization](#authentication--authorization)
10. [Documentation](#documentation)

## General Principles

1. **Consistency** - Follow consistent patterns across all endpoints
2. **Simplicity** - Keep the API simple and intuitive
3. **Predictability** - Follow REST conventions and common practices
4. **Performance** - Optimize for network efficiency
5. **Security** - Implement proper security measures
6. **Documentation** - Keep documentation up-to-date

## RESTful Standards

### Resource Naming
- Use **nouns** (not verbs) to represent resources
- Use **plural** nouns for collections
- Use **kebab-case** for resource names
- Use **nested resources** for relationships

### HTTP Methods
| Method  | Description | Idempotent |
|---------|-------------|------------|
| `GET`    | Retrieve a resource or collection | Yes |
| `POST`   | Create a new resource | No |
| `PUT`    | Replace a resource (full update) | Yes |
| `PATCH`  | Partially update a resource | No |
| `DELETE` | Remove a resource | Yes |

### Status Codes
| Status Code | Description |
|-------------|-------------|
| 200 OK | Successful GET, PUT, PATCH, or DELETE |
| 201 Created | Resource created successfully |
| 204 No Content | Successful DELETE with no response body |
| 400 Bad Request | Invalid request format |
| 401 Unauthorized | Authentication required |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource not found |
| 409 Conflict | Resource conflict (e.g., duplicate) |
| 422 Unprocessable Entity | Validation errors |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server error |

## Request & Response Format

### Request Headers
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <unique-request-id>
```

### Response Headers
```
Content-Type: application/json
X-Request-ID: <same-as-request>
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1614556800
```

### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "status": "error",
  "error": {
    "code": "validation_error",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Common Error Codes
| Code | Description |
|------|-------------|
| `invalid_request` | Request is missing required parameters |
| `invalid_token` | Access token is invalid or expired |
| `insufficient_scope` | Token doesn't have required permissions |
| `not_found` | Requested resource doesn't exist |
| `validation_error` | Request validation failed |
| `rate_limit_exceeded` | Too many requests |
| `internal_error` | Internal server error |

## Versioning

### URL Versioning
```
https://swasthxapp.api.swasthx.com/users
```

### Accept Header Versioning
```
Accept: application/vnd.swasthx.v1+json
```

## Pagination

### Request
```
GET /users?page=1&limit=10
```

### Response
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "name": "User 1"
    },
    {
      "id": "2",
      "name": "User 2"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Filtering, Sorting & Searching

### Filtering
```
GET /users?status=active&role=doctor
```

### Sorting
```
GET /users?sort=-createdAt,name
```

### Searching
```
GET /users?q=john
```

## Rate Limiting
- 100 requests per minute per IP by default
- Authenticated users: 1000 requests per minute
- Special limits may apply to specific endpoints

## Authentication & Authorization

### Authentication
- JWT-based authentication
- Token in `Authorization` header
- Refresh tokens for long-lived sessions

### Authorization
- Role-based access control (RBAC)
- Scopes for fine-grained permissions
- Roles: `admin`, `doctor`, `patient`, `staff`

## Documentation

### OpenAPI/Swagger
- Interactive API documentation at `/api-docs`
- JSON schema at `/api-json`

### Endpoint Documentation
```typescript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
```

## Best Practices

### Idempotency
- Make `PUT`, `DELETE`, and `GET` requests idempotent
- Use `Idempotency-Key` header for non-idempotent operations

### Caching
- Use `Cache-Control` headers
- Support `ETag` and `Last-Modified` for conditional requests

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Performance
- Use field selection to reduce payload size
- Implement proper pagination
- Support compression (gzip, deflate)
- Use HTTP/2 or HTTP/3

### Versioning Strategy
- Maintain backward compatibility when possible
- Deprecate old versions with `Sunset` header
- Provide migration guides for breaking changes

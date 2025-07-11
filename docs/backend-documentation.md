# SwasthX Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Environment Configuration](#environment-configuration)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [Authentication & Security](#authentication--security)
6. [Third-party Integrations](#third-party-integrations)
7. [Deployment](#deployment)
8. [Monitoring & Logging](#monitoring--logging)
9. [Testing](#testing)
10. [Development Workflow](#development-workflow)

## Overview

The SwasthX Backend is built using NestJS (Node.js/TypeScript) and provides a robust healthcare platform with features including:
- ABDM (Ayushman Bharat Digital Mission) integration
- Doctor and patient management
- Appointment scheduling
- Health record management
- Secure payment processing
- Real-time notifications

## Environment Configuration

### Required Environment Variables

#### Server Configuration
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

#### Database
```env
MONGODB_URI=mongodb://localhost:27017/swasthx
```

#### JWT Authentication
```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRATION=2592000
```

#### AWS Services
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket
AWS_SNS_TOPIC_ARN=your_sns_arn
```

#### Google Cloud
```env
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

## API Documentation

### Base URL
```
https://api.swasthx.in/v1
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

#### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Book appointment
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

#### Health Records
- `GET /health-records` - List health records
- `POST /health-records` - Upload record
- `GET /health-records/:id` - Get record
- `DELETE /health-records/:id` - Delete record

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  role: String, // 'patient', 'doctor', 'admin'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments Collection
```typescript
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  date: Date,
  status: String, // 'scheduled', 'completed', 'cancelled'
  reason: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Security

### JWT Authentication
- Access tokens expire in 1 hour
- Refresh tokens expire in 30 days
- Password hashing using bcrypt

### Rate Limiting
- 100 requests per minute per IP
- 10 authentication attempts per minute per IP

### CORS
- Configured to allow specific origins
- Only necessary HTTP methods enabled

## Third-party Integrations

### ABDM Integration
- Base URL: `https://dev.abdm.gov.in`
- Required Headers:
  - `X-CM-ID`: Your CM ID
  - `X-Session-ID`: Session ID

### Razorpay Payment
- Test Mode: `https://api.razorpay.com/v1`
- Production Mode: `https://api.razorpay.com/v1`

### Twilio (SMS/WhatsApp)
- Base URL: `https://api.twilio.com/2010-04-01`
- Required Headers:
  - `Authorization`: Basic Auth with Account SID and Auth Token

## Deployment

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- Redis (for caching)

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Docker
```bash
# Build image
docker build -t swasthx-backend .

# Run container
docker run -p 3000:3000 --env-file .env swasthx-backend
```

## Monitoring & Logging

### Logging
- Winston logger implementation
- Log levels: error, warn, info, debug
- Logs stored in `logs/` directory

### Health Check
```
GET /health
```

### Metrics
```
GET /metrics
```

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Development Workflow

### Branching Strategy
- `main` - Production code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Commit Message Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Pull Requests
- Reference related issues
- Include test coverage
- Update documentation if needed
- Get at least one approval before merging

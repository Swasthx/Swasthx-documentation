---
layout: default
title: API Guidelines
parent: API & Integration
---

# API Guidelines

This document outlines the standards for API development within the Swasthx platform.

## 1. Technology Stack
- **Architecture**: REST-based APIs.
- **Framework**: **NestJS** (Node.js framework).
- **Format**: JSON for Request/Response bodies.

## 2. Pre-requisites
Before creating any API endpoint, ensure you have completed the **Requirements Gathering** phase as outlined in the [Backend Guidelines]({{ '/docs/development/backend-guidelines.html' | relative_url }}). You must clearly define:
1.  **Use Case**: What is this API for?
2.  **Contracts**: Request inputs and expected response structure.
3.  **Dependencies**: External services or Database requirements.

## 3. Coding Standards & Implementation

### Structure
Since we use NestJS, every API endpoint must follow the framework's architecture:
- **Decorators**: Ensure all required Swagger/OpenAPI decorators (`@ApiOperation`, `@ApiResponse`) are present to generate auto-documentation.
- **Guards**: Apply necessary **Guards** (e.g., `JwtAuthGuard`, `RolesGuard`) to protect endpoints. **Never** leave a private route unprotected.

### Comments
Code documentation is crucial for maintainability:
- **Functional Comments**: Add JSDoc/Block comments above the controller method explaining what it does.
- **Inline Comments**: Explain complex logic inside the method.

```typescript
/**
 * Retrieves the patient's health record summary.
 * @param id - Patient ID
 */
@Get(':id/summary')
async getSummary(@Param('id') id: string) {
    // Check if user has permission to view this record
    // ... logic ...
}
```

## 4. Testing & Postman

### Importance of Postman
Testing via Postman is mandatory, not optional. It serves two critical purposes:
1.  **Validation**: Ensures the API handles all scenarios (Success, Error, Invalid Input) correctly.
2.  **Collaboration**: Saving the **Response Body** in the Postman Collection helps Frontend developers build the UI without waiting for the backend code to be merged or deployed.

**Rule**: All APIs must have their successful and error responses saved in the team Postman Collection.

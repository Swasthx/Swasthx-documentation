---
layout: default
title: Coding Standards
permalink: /coding-standards
---

# SwasthX Coding Standards

## Table of Contents
1. [General Principles](#general-principles)
2. [TypeScript/JavaScript](#typescript-javascript)
3. [Naming Conventions](#naming-conventions)
4. [File Structure](#file-structure)
5. [Error Handling](#error-handling)
6. [Documentation](#documentation)
7. [Testing](#testing)

## General Principles

- Follow the **Single Responsibility Principle** (SRP)
- **KISS** (Keep It Simple, Stupid)
- **DRY** (Don't Repeat Yourself)
- **YAGNI** (You Aren't Gonna Need It)
- Write self-documenting code
- Follow the **Principle of Least Surprise**

## TypeScript/JavaScript

### Type Annotations
- Always declare return types
- Use interfaces for object shapes
- Use `type` for unions, intersections, and complex types
- Avoid `any` type; use `unknown` when type is uncertain

### Code Style
- Use 2 spaces for indentation
- Use single quotes (`'`) for strings
- Always use semicolons
- Max line length: 100 characters
- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and interfaces
- Use `UPPER_CASE` for constants

### Imports
- Group imports in the following order:
  1. Node.js built-in modules
  2. Third-party modules
  3. Local modules
- Use absolute imports for local modules

## Naming Conventions

### General Rules
- Use meaningful, self-documenting names
- Avoid abbreviations unless they are widely known in the domain
- Be consistent with naming patterns across the codebase

### Variables and Functions
- **camelCase** for variables and functions
  ```typescript
  // Good
  const userProfile = {};
  function fetchUserData() {}
  
  // Bad
  const user_profile = {};
  function FetchUserData() {}
  ```
- **Boolean** variables should be questions/conditions:
  ```typescript
  // Good
  const isActive = true;
  const hasPermission = false;
  const canEdit = true;
  
  // Bad
  const active = true;
  const permission = false;
  ```
- **Functions** should be verbs/actions:
  ```typescript
  // Good
  function calculateTotal() {}
  async function fetchUserById(id: string) {}
  
  // Bad
  function total() {}
  async function user(id: string) {}
  ```

### Files and Directories
- **kebab-case** for all file and directory names
  ```
  // Good
  src/
    user-profile/
      user-profile.component.ts
      user-profile.service.ts
      user-profile.spec.ts
    
  // Bad
  src/
    userProfile/
      userProfile.component.ts
      UserProfileService.ts
  ```
- **File Naming Pattern**: `[name].[type].ts`
  - Component: `user-profile.component.ts`
  - Service: `user.service.ts`
  - Test: `user.service.spec.ts`
  - Interface: `user.interface.ts`
  - DTO: `create-user.dto.ts`

### Classes and Interfaces
- **PascalCase** for classes and interfaces
  ```typescript
  // Good
  class UserService {}
  interface UserProfile {}
  
  // Bad
  class userService {}
  interface IUserProfile {}
  ```
- **Specific over generic names**:
  ```typescript
  // Good
  class UserRepository {}
  class PaymentProcessor {}
  
  // Avoid
  class Manager {}
  class Handler {}
  ```

### Constants and Enums
- **UPPER_SNAKE_CASE** for constants and enums
  ```typescript
  // Good
  const MAX_RETRY_COUNT = 3;
  enum UserRole {
    ADMIN = 'ADMIN',
    DOCTOR = 'DOCTOR',
    PATIENT = 'PATIENT'
  }
  
  // Bad
  const maxRetryCount = 3;
  enum userRole {}
  ```

### TypeScript Specific
- No `I` prefix for interfaces
- Suffix type names with their purpose:
  ```typescript
  // Good
  interface User {}
  type UserResponse = {};
  class UserDto {}
  
  // Avoid
  interface IUser {}
  type TUser = {};
  ```

## File Structure

### Recommended Structure
```
src/
├── common/               # Shared utilities and constants
├── config/              # Configuration files
├── modules/             # Feature modules
│   ├── users/
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── entities/    # Database entities
│   │   ├── interfaces/  # TypeScript interfaces
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── users.controller.ts
│   └── ...
├── app.module.ts
└── main.ts
```

## Error Handling

- Use custom error classes that extend `Error`
- Handle errors at the appropriate level
- Log all errors with sufficient context
- Return user-friendly error messages
- Use HTTP status codes appropriately

## Documentation

### JSDoc
- Document all public methods and properties
- Include parameter and return types
- Add examples for complex functions

### API Documentation
- Use decorators for Swagger documentation
- Document all endpoints with `@ApiOperation`, `@ApiResponse`, etc.
- Include example requests and responses

## Testing

### Unit Tests
- Test one thing per test case
- Follow the Arrange-Act-Assert pattern
- Use descriptive test names (e.g., `should return 404 when user not found`)
- Mock external dependencies

### E2E Tests
- Test critical user flows
- Clean up test data after tests
- Use factory functions to create test data

### Test Coverage
- Aim for at least 80% test coverage
- Focus on business logic, not implementation details
- Test edge cases and error conditions

## Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples
```
feat(users): add user registration endpoint

Add POST /api/users endpoint for user registration with email and password validation.

Closes #123
```

```
fix(auth): handle invalid token error

- Return 401 status for invalid tokens
- Add proper error message

Fixes #456
```

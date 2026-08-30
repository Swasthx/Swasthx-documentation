---
layout: default
title: Frontend Guidelines
parent: Development
---

# Frontend Guidelines

This document outlines the standards and workflows for frontend development at Swasthx.

## 1. Branching Strategy

Our development process follows a strict branching strategy to ensure code quality and stability.

### The Three Branches

| Branch | Environment | Who Uses It? | The Golden Rule |
| :--- | :--- | :--- | :--- |
| **development** | Alpha | Developers | **The Sandbox**. Push daily work here. Builds go to *Internal Testing*. |
| **QA** | Beta | QA Team | **The Filter**. Code is frozen here for testing. *Never push code directly here.* |
| **production** | Live | Real Users | **The Product**. This is what users download/access. |

### The Rules of Pushing Code

1.  **One way merging**: You merge `development` -> `QA` -> `production`.
2.  **PRs only**: Never push directly to `QA` or `production`. You must open a Pull Request.
3.  **No skipping**: You cannot merge `development` straight to `production`. You must go through `QA` first. 

---

## 2. Development Workflow

### Feature Branches
Whenever working on a new feature, always create a sub-branch starting with `feat/*` from the `development` branch.
- Example: `feat/login-page-redesign`, `feat/appointment-booking`
- Once the code is ready, raise a Pull Request (PR) to merge into `development`.

### API Integration
Before integrating any API:
1.  **Verify with Backend**: Ensure the Backend team has tested the API using Postman.
2.  **Check Postman Collection**: All possible scenarios (success/error status codes) must be saved in the team Postman collection.
3.  **Clarify Contracts**: The request and response bodies should be clear and agreed upon before writing any integration code.

### Coding Standards
- **Comments**: Add comments to explain *why* something is done, not just *what*.
  - **Inline Comments**: For complex logic inside functions.
  - **Functional Comments**: Docstrings explaining what a function does, its parameters, and return values.
- **Naming Conventions**: 
  - Variable and function names should be meaningful.
  - Follow **camelCase** for JavaScript/TypeScript variables (e.g., `userProfile`, `fetchAppointments`).

### Pre-Push Checklist
Before pushing your code:
1.  **UI Updates**: Ensure all required UI changes match the design.
2.  **Backend alignment**: updates required by the backend team are also done.
3.  **Clean Code**: Remove any unused imports, variables, and `console.log` statements.
4.  **Local Testing**: Verify that your changes work locally and don't break existing functionality.

<div data-context="website" markdown="1">

## 3. Website Frontend Architecture (`Swasthx_HIP_Frontend`)

The Doctor Portal / HMIS Frontend is built with modern web technologies:

- **Build Tool / Bundler**: [Vite](https://vitejs.dev/) (React SWC plugin)
- **UI Framework**: React 18
- **UI Component Libraries**: [Ant Design 5](https://ant.design/), [Tailwind CSS 3](https://tailwindcss.com/), DaisyUI
- **State & Session Storage**: Redux Toolkit, MobX, and **`sessionStorage`** (for auth tokens, user context & session caching)
- **Integrations**: ABDM (HIP M1, M2, M3), Axios, Leaflet maps, PDF Viewers (`@react-pdf-viewer`), Recharts

### Local Setup & Execution Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server (Dev API)**:
   ```bash
   npm run dev
   ```
   *Connects to `websitedevelopment.api.swasthx.com`*.

3. **Run Local Development Server against QA API**:
   ```bash
   npm run dev:qa
   ```
   *Connects to `websiteqa.api.swasthx.com`*.

4. **Build Production Bundles**:
   ```bash
   npm run build      # Build for Dev / Production
   npm run build:qa   # Build for QA
   ```

5. **Linting & Fixing**:
   ```bash
   npm run lint
   npm run lint:fix
   ```

### Environment Configuration (`.env`)

Vite requires environment variables prefixed with `VITE_`:

| Environment Variable | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_BASE_URL` | `https://websitedevelopment.api.swasthx.com` | API Gateway base endpoint |
| `VITE_BASE_APP_URL` | `https://new-swasthxapp.api.swasthx.com` | PHR App backend URL |
| `VITE_HIU_ID` | `IN3610001058` | ABDM HIU Identifier |
| `VITE_HIP_ID` | `IN3610001058` | ABDM HIP Identifier |
| `VITE_BASE_AI_URL` | `https://api-insurance.aarogyaid.com` | AI Insurance gateway |
| `VITE_S3_BUCKET_NAME` | `https://swasthx-bucket.s3.ap-south-1.amazonaws.com` | S3 Media Asset Bucket |

### Core Application Modules & Role Workflows

The `Swasthx_HIP_Frontend` application enforces strict **Role-Based Access Control (RBAC)** across 6 core portals:

1. **Super Admin (`/src/pages/SuperAdmin/`)**:
   - Onboarding hospitals, facility administration, and staff delegation.
   - HPR / NHPR Healthcare Professional registry verification.
   - Facility-wide analytics, billing management, and ABDM credential setup.

2. **Hospital Admin (`/src/pages/Admin/`)**:
   - Facility profile management, department configuration, and staff onboarding.
   - Doctor schedule provision and appointment overrides.

3. **Receptionist Portal (`/src/pages/Receptionist/`)**:
   - Patient registration & ABHA Health ID creation/verification (Aadhaar & Mobile OTP flows).
   - Smart QR check-in & OPD live queue management.
   - Appointment booking, billing modals, and payment collection.

4. **Doctor Workspace (`/src/pages/Doctor/`)**:
   - Clinical consultation queue, patient longitudinal medical history access.
   - Digital e-prescription generator (medicines, dosage, diagnostic test orders).
   - ABDM consent request & health record fetch (HIP M1, M2, M3).

5. **Diagnostic Portal (`/src/pages/Diagnostic/`)**:
   - Diagnostic test queue management & lab report upload (PDF viewer & image crop).
   - ABDM diagnostic record linking & publish pipeline.

6. **Pharmacy Portal (`/src/pages/Pharmacy/`)**:
   - E-prescription verification, medicine dispensing queue, and order fulfillment.

### Real-Time Live Queue & WebSockets (`socket.io-client`)

The application integrates WebSockets (`/src/socket.js`) for real-time OPD queue updates and instant notifications across Receptionist, Doctor, and Diagnostic portals without page reloads.

### Security & Authentication Wrappers

- **`RequireAuth.jsx` & `RequireNHPRAuth.jsx`**: Guarded routes enforcing valid active session in `sessionStorage`.
- **`RequireNHPRRole.jsx` & `RoleBasedAccess.jsx`**: Dynamic role verification protecting clinical and administrative modules.

## 4. Deployment

The frontend deployment is automated using **AWS Amplify**:
- **Hosting**: Amplify hosts the React.js Single Page Application (SPA) and handles CI/CD.
- **API Integration**: The frontend connects to backend App Runner instances via **AWS API Gateway**.
- **Deployment Branches**:
  - `development-new` ➔ [https://dev-doctor.swasthx.com/](https://dev-doctor.swasthx.com/)
  - `QA` ➔ [https://qa-doctor.swasthx.com/login](https://qa-doctor.swasthx.com/login)
  - `production` ➔ [https://doctor.swasthx.com/login](https://doctor.swasthx.com/login)

</div>

For a detailed breakdown of the system flow and infrastructure, refer to the [System Architecture]({{ '/architecture' | relative_url }}) page.


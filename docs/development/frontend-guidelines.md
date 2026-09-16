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
- **Integrations**: ABDM (M1 ABHA, M2 HIP linking, M3 HIU consent, M4 HPR/HFR registries — see [ABDM Milestones]({{ site.baseurl }}/docs/architecture/abdm-milestones.html)), Axios, Leaflet maps, PDF Viewers (`@react-pdf-viewer`), Recharts

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
| `VITE_ABDM_SOFTWARE_BRIDGE_ID` | `SBX_003041` (sandbox) | SwasthX software bridge id sent in **Register HIP** (`POST /HFR/linkMultipleHRP`); set the prod bridge id at deploy |
| `VITE_ABHA_ADDRESS_SUFFIX` | `@sbx` (sandbox) / `@abdm` (prod) | Suffix used when minting the default ABHA address in the Create-ABHA flow |
| `VITE_BASE_AI_URL` | `https://api-insurance.aarogyaid.com` | AI Insurance gateway |
| `VITE_S3_BUCKET_NAME` | `https://swasthx-bucket.s3.ap-south-1.amazonaws.com` | S3 Media Asset Bucket |

### Core Application Modules & Role Workflows

The `Swasthx_HIP_Frontend` application enforces strict **Role-Based Access Control (RBAC)** across 6 core portals:

1. **Super Admin (`/src/pages/SuperAdmin/`)**:
   - Onboarding hospitals, facility administration, and staff delegation.
   - Facility-wide analytics, billing management, and ABDM credential setup.

2. **Hospital Admin (`/src/pages/Admin/`)**:
   - Facility profile management, department configuration, and staff onboarding.
   - Doctor schedule provision and appointment overrides.
   - **ABDM M4 — NHPR module (`/nhpr/*`, `src/pages/Admin/pages/NHPR/`)**: HPR registration wizard (ABDM-hosted Aadhaar consent), HPR login, profile edit, re-KYC, change password, role update, nurse flow; HFR facility wizard with local drafts, transfer requests, bulk upload; **Register HIP / Software Linkage** (`SoftwareLinkagePage.jsx`).
   - **HPR onboarding & verification**: "HPR ID" action on a doctor row starts a `trackingId` session (`hprVerifyService.js`), badge (`HPRBadge.jsx`), pending banner (`HPRPendingBanner.jsx`) and the `403 HPR_NOT_VERIFIED` gate modal when `HospitalPolicy.abdmEnabled` is on.
   - **Facility QR** (`/admin/facility-qr`, `FacilityQRList`) — generate / preview / regenerate the Scan & Share QR for an HFR-registered facility.

3. **Receptionist Portal (`/src/pages/Receptionist/`)**:
   - Patient registration & ABHA Health ID creation/verification (Aadhaar & Mobile OTP flows).
   - Smart QR check-in & OPD live queue management.
   - Appointment booking, billing modals, and payment collection.

4. **Doctor Workspace (`/src/pages/Doctor/`)**:
   - Clinical consultation queue, patient longitudinal medical history access.
   - Digital e-prescription generator (medicines, dosage, diagnostic test orders).
   - ABDM record publishing (M2: prescription / OP / discharge / diagnostic / immunization / wellness / document / invoice) and consent request & health record fetch as HIU (M3).

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

<div data-context="phr" markdown="1">

## 3. PHR Mobile App Frontend Architecture (`Swasthx_Software`)

The Swasthx PHR Mobile App is a cross-platform mobile application developed with **React Native (v0.80+)** for patients to manage health records, doctor appointments, ABHA accounts, lab tests, and digital prescriptions.

- **Framework**: React Native 0.80.1 (React 19)
- **Architecture**: Modular feature-based structure with Redux Toolkit, Context API, and React Query
- **Navigation**: React Navigation 7 (Native Stack, Bottom Tabs, Drawer, Material Top Tabs)
- **Native Bridges & Integrations**:
  - Apple HealthKit (`react-native-health`) & Health Connect (`react-native-health-connect`)
  - Camera & Document Scanning (`react-native-vision-camera`, `@react-native-documents/picker`)
  - Push Notifications (`@react-native-firebase/messaging`, `react-native-onesignal`)
  - Authentication: Google Sign-in (`@react-native-google-signin/google-signin`), OTP verification
  - Payments: Razorpay (`react-native-razorpay`)
  - Realtime: Socket.IO Client (`socket.io-client`)
  - Security: SSL Pinning (`react-native-ssl-pinning`), Jail Monkey (`jail-monkey`), CryptoJS

---

## 4. iOS Setup & Development Guidelines (macOS)

This guide provides step-by-step instructions for cloning, setting up, building, and running the iOS application on macOS, as well as distributing pre-release builds via TestFlight.

### 4.1 Prerequisites (macOS Only)

iOS development requires **macOS** (Apple Silicon M1/M2/M3/M4 or Intel). Before starting, ensure the following tools are installed:

1. **Homebrew** (macOS Package Manager):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Node.js (LTS v18 or v20)**:
   Node version `>= 18` is required. Using [nvm](https://github.com/nvm-sh/nvm) is strongly recommended:
   ```bash
   brew install nvm
   nvm install 20
   nvm use 20
   ```

3. **Watchman**:
   ```bash
   brew install watchman
   ```

4. **Xcode & Command Line Tools**:
   - Install **Xcode 15 or 16** from the [Mac App Store](https://apps.apple.com/app/xcode/id497799835).
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```
   - Accept the Xcode license:
     ```bash
     sudo xcodebuild -license accept
     ```

5. **Ruby & Bundler (for CocoaPods)**:
   The project uses a pinned `Gemfile` to manage CocoaPods and avoid version incompatibilities:
   ```bash
   gem install bundler
   ```

---

### 4.2 Step 1: Git Clone the Repository

Clone the mobile application repository:

```bash
# Clone the repository
git clone https://github.com/Swasthx/Swasthx_Software.git

# Move into the project root directory
cd Swasthx_Software
```

#### iOS Environment Branches
The iOS application uses dedicated branches for development, QA, and production releases:

| iOS Branch | Environment | Purpose |
| :--- | :--- | :--- |
| **`IOS_Dev`** | Development (Alpha) | Active daily development for iOS features and updates. |
| **`IOS_QA`** | QA (Beta) | Quality Assurance testing and pre-release TestFlight builds. |
| **`IOS_MAIN`** | Production | Stable production release deployed to App Store Connect / App Store. |

Switch to your target iOS branch:
```bash
# For active daily iOS development:
git checkout IOS_Dev

# For QA testing and TestFlight builds:
git checkout IOS_QA

# For production App Store releases:
git checkout IOS_MAIN
```

When creating a new feature or fix for iOS, always branch off `IOS_Dev`:
```bash
git checkout IOS_Dev
git pull origin IOS_Dev
git checkout -b feat/ios-your-feature-name
```

---

### 4.3 Step 2: Install JavaScript Dependencies

Install the project npm dependencies:

```bash
npm install
# or
yarn install
```

---

### 4.4 Step 3: Configure Environment Variables (`.env`)

Copy the template `.env.example` into a local `.env` file:

```bash
cp .env.example .env
```

Populate the required environment variables:

| Variable | Description | Example / Environment |
| :--- | :--- | :--- |
| `BASE_URL` | PHR API Gateway endpoint | Dev: `https://new-swasthxapp.api.swasthx.com`<br>QA: `https://phrqa.api.swasthx.com`<br>Prod: `https://phrproduction.api.swasthx.com` |
| `HMIS_URL` | Doctor / HMIS portal base URL | Dev: `https://dev-doctor.swasthx.com`<br>QA: `https://qa-doctor.swasthx.com` |
| `GOOGLE_API_KEY` | Google Maps & Services API Key | Project specific API Key |
| `DATA_SECRET_KEY` | Data encryption / decryption key | Consult team lead |
| `HIU_ID` | ABDM Health Information User ID | `IN3610001058` |
| `GMAIL_WEB_CLIENT_ID` | OAuth Web Client ID for Google Auth | Project specific client ID |
| `GMAIL_WEB_CLIENT_SECRET` | OAuth Web Client Secret | Project specific client secret |

> [!CAUTION]
> Never commit `.env` or sensitive production API keys to Git.

---

### 4.5 Step 4: Configure Node Path for Xcode (`.xcode.env.local`)

Xcode build phases require locating your `node` binary. When using NVM or Homebrew on macOS, create `ios/.xcode.env.local` to prevent `Command PhaseScriptExecution failed` errors:

```bash
# Locate your node binary
which node

# Automatically write it to ios/.xcode.env.local
echo "export NODE_BINARY=$(which node)" > ios/.xcode.env.local
```

---

### 4.6 Step 5: Install iOS Pods via Bundler

Navigate to the `ios/` folder and install the CocoaPods dependencies. Use `bundle exec` to ensure the exact CocoaPods version specified in the project's `Gemfile` is used:

```bash
cd ios

# Install Ruby gems (cocoapods, xcodeproj, etc.)
bundle install

# Install native iOS CocoaPods dependencies
bundle exec pod install

# Return to root directory
cd ..
```

> [!TIP]
> **Apple Silicon (M1/M2/M3/M4) Users**: If you encounter architecture mismatch errors during `pod install`, prefix the command with Rosetta:
> ```bash
> arch -x86_64 bundle exec pod install
> ```

---

### 4.7 Step 6: Open Project in Xcode & Configure Signing

> [!IMPORTANT]
> Always open **`swasthx.xcworkspace`**, **NEVER** `swasthx.xcodeproj`. Opening `.xcodeproj` directly will cause library linking errors because CocoaPods dependencies are managed in the workspace.

Open the workspace from the terminal:
```bash
open ios/swasthx.xcworkspace
```

#### Configure Signing & Capabilities:
1. In Xcode's left Project Navigator, click the top **`swasthx`** project.
2. Under **Targets**, select **`swasthx`**.
3. Select the **Signing & Capabilities** tab.
4. Check **Automatically manage signing**.
5. Under **Team**, select the **Swasthx Apple Developer Team** (request access from your administrator if not listed).
6. Ensure the **Bundle Identifier** is properly set.

---

### 4.8 Step 7: Running the App on iOS

#### Option A: Running via Terminal (CLI)

1. Start Metro bundler in one terminal tab:
   ```bash
   npm start -- --reset-cache
   # or
   yarn start --reset-cache
   ```

2. In another terminal tab, launch the iOS build:
   ```bash
   npm run ios
   ```

   To launch a specific simulator (e.g., iPhone 15 Pro):
   ```bash
   npx react-native run-ios --simulator="iPhone 15 Pro"
   ```

#### Option B: Running via Xcode

1. In the top toolbar, select the active scheme: **`swasthx`**.
2. Select your target device: choose an **iOS Simulator** (e.g., *iPhone 16 Pro*) or your **Connected Physical iPhone**.
3. Press **Cmd + R** (or click the **Play** button) to build and run.

---

### 4.9 Step 8: Build Sharing & TestFlight Distribution Links

Swasthx distributes pre-release iOS builds via **Apple TestFlight** and shared storage for testing without requiring Xcode:

| Resource / Channel | Access Link | Description |
| :--- | :--- | :--- |
| **iOS QA TestFlight (Public Link)** | [**Join QA TestFlight**](https://testflight.apple.com/join/33chzNj9) | Direct share link for internal and external testers to install the latest QA iOS build on an iPhone/iPad. |
| **App Store Connect Portal** | [**App Store Connect**](https://appstoreconnect.apple.com/login) | Apple portal for managing TestFlight tester groups, release builds, metadata, and App Store submission. |
| **iOS Pre-Release Builds Storage** | [**Google Drive iOS Builds**](https://drive.google.com/drive/folders/1oGzG5uIjLnLmychI1TL9gduKEPltpGvP?usp=sharing) | Archive of pre-built development builds and artifacts. |

#### Creating a New TestFlight Release Build:
1. In Xcode, set the build destination to **Any iOS Device (arm64)**.
2. Increment the `Build Number` in target settings.
3. From the menu bar, choose **Product** ➔ **Archive**.
4. When the Organizer window opens, select the build and click **Distribute App**.
5. Select **App Store Connect** ➔ **Upload**.
6. Once Apple finishes processing the build (typically 10-15 minutes), open [App Store Connect](https://appstoreconnect.apple.com/login), navigate to **TestFlight**, and share the build with the QA / Internal Testing groups.

---

### 4.10 Troubleshooting Common iOS Issues

#### 1. Pods Out of Sync / Linking Failures
If you encounter missing header errors or pod conflicts after pulling new code:
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install --repo-update
cd ..
```

#### 2. Metro Bundler Cache Stale
If old JavaScript code is loading or bundle resolution fails:
```bash
npm start -- --reset-cache
```

#### 3. Clear Xcode DerivedData & Clean Build
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```
In Xcode, press **Cmd + Shift + K** to clean the build folder, then rebuild.

#### 4. Node Binary Not Found (`PhaseScriptExecution` Error)
Ensure your `.xcode.env.local` contains the valid Node binary path:
```bash
echo "export NODE_BINARY=$(which node)" > ios/.xcode.env.local
```

#### 5. CocoaPods Gem Version Incompatibility
If you see gem conflicts or warnings about CocoaPods versions, always run pod commands via Bundler:
```bash
bundle exec pod install
```

</div>

For a detailed breakdown of the system flow and infrastructure, refer to the [System Architecture]({{ '/architecture' | relative_url }}) page.



---
layout: default
title: Website/Backend API Documentation
permalink: /api-website
---

# SwasthX Website & Backend API Documentation

This document is the reference for the **Website Backend (HMIS)** APIs used by the Web Portals (Admin, Doctor, Reception, Pharmacy, Diagnostic, Super Admin), organised by **ABDM milestone (M1 → M4)**.

> **Verified against code on 2026-09-16** — backend `swasthx_backend_website` @ `b7d4834c` (development), frontend `Swasthx_HIP_Frontend` @ `c3db4bb4` (development-new).
>
> Interactive Swagger for the same routes: [Website API (Swagger)]({{ site.baseurl }}/docs/api/website-api.html). Postman usage: [Postman Guide]({{ site.baseurl }}/postman-collection-guide).

**Conventions**

- All paths are relative to the **website backend base URL** (per environment — see [WB More Info]({{ site.baseurl }}/docs/workflows/website-backend-more.html)); in Postman this is `{{ "{{" }}baseUrl}}`.
- 🔒 = `AuthGuard('jwt')` (SwasthX portal JWT in `Authorization: Bearer`). Most routes are also rate-limited per token (`throttleWithToken` + `@Throttle`; HPR/HFR routes 10 req/min, `generateLink`/re-KYC OTP 5/min, `isAuthenticated` poll 30/min).
- 📥 = **ABDM gateway callback** — called by the NHA gateway, not by the portal. No JWT; registered via the bridge callback URL.
- Bodies are shown as the DTO shape. Optional fields are marked `?`.

---

## 1. Authentication & Session (SwasthX portal)

### Login / Session
- **POST** `/auth/login` — **Body:** `loginDto` → session token
- **POST** `/auth/refresh` — **Body:** `{ refreshToken }` → new access + refresh pair
- **PUT** `/auth/logout` 🔒
- **POST** `/auth/signUp` — register portal user
- **POST** `/auth/confirmMobileNumber` & **POST** `/auth/verifyMobileOTP` — mobile OTP login
- **POST** `/auth/getTokenForApp` — token for mobile app usage
- **GET** `/auth/checkMobileNumber | checkUserMobileNumber | checkDoctorId | checkEmailId | checkHospitalId` — availability checks

### Hospital policy (ABDM switch)
- **GET / PATCH** `/admin/hospital-policy` 🔒 (admin)
  - `abdmEnabled: boolean` — when `true`, the **HPR gate** ([§5.1.6](#hpr-onboarding-gate)) is enforced hospital-wide.

---

## 2. ABDM Milestone 1 — ABHA Creation, Verification & Profile

Module: `src/abha_number_services/`. All routes 🔒 (reception / doctor / super-admin JWT). The ABHA gateway calls use `V3_API_URL` (`/abha/api/v3/...`) and, for the "phr/web" login APIs, `PHR_WEB_API_URL` (path order differs sandbox vs prod).

### 2.1 Create ABHA (Aadhaar OTP)
- **POST** `/generateOTPforABHAprofile` — **Body:** `{ aadhaarNum, MobileNum, Consent_approve: true }`
- **POST** `/verifyABHAprofileOtp` — **Body:** `{ aadhaar, otp, mobileNumber }`
- **POST** `/getOTPonCommunicationMobileForABHAprofile` — **Body:** `{ aadhaar?, communicationMobileNumber }`
  - *Sends OTP to a communication mobile that differs from the Aadhaar-linked one (added Aug 2026, "M1 improvements").*
- **POST** `/verifyOTPonCommunicationMobileForABHAprofile` — **Body:** `{ aadhaar?, oldMobileNumber, otp, verificationId? }`
- **POST** `/fetchAbhaAddressSuggestionsForABHAprofile` — **Body:** `{ aadhaar }`
- **POST** `/addUserAbhaAddressForABHAprofile` — **Body:** `{ aadhaar, abhaAddress }`
  - *Frontend mints the default address as `<ABHA number>` + `VITE_ABHA_ADDRESS_SUFFIX` (`@sbx` sandbox, `@abdm` prod).*

### 2.2 Verify existing ABHA (web)
Prefix `/verifyAbhaWeb`:
- **POST** `usingaadhaarotp` / **POST** `usingaadhaarotpforMobile` — **Body:** `{ type, abhaID }` → OTP on Aadhaar-linked / ABHA-linked mobile
- **POST** `verifyaadhaarotp` / **POST** `verifyMobileotp` — **Body:** `{ abhaID, type, otp }`
- **POST** `searchAbhaAddress` — **Body:** `{ abhaAddress }`
- **POST** `registerWithVerifyAbhaNumber` / **POST** `registerWithVerifyAbhaAddress` — **Body:** `{ abhaNumber, token, refreshtoken, doctorID }` → creates/links the local patient profile
- **POST** `getAbhaCard` / **POST** `getUserAbhaProfile` — **Body:** `{ abhaNumber, mobileNumber }`

### 2.3 Access by mobile / Aadhaar (find ABHA accounts)
- **POST** `/accessbymobile/searchAbhaProfile` — **Body:** `{ mobileNumber }`
- **POST** `/accessbymobile/generateOTP` — **Body:** `{ mobileNumber, index, txnID }`
- **POST** `/accessbymobile/verifySearchMobileOTP` — **Body:** `{ txnID, otp, mobileNumber }`
- **POST** `/accessbymobile/finalizeProfileLinkage` — **Body:** `{ verificationId, action: 'use_existing'|'update_profile'|'create_profile', selectedProfileId?, selectedProfileSource?: 'userprofile'|'patient_registration'|'patient_info', makeAbhaAddressPreferred?, confirmDemographicMismatch? }`
  - *Explicit local-profile choice after a mobile ABHA verification (new — "new ABHA address sync with existing credentials", Aug 2026).*
- **POST** `/generateLoginOtpUsingAadhaar` — **Body:** `{ aadhaarNumber }`
- **POST** `/verifyLoginOtpUsingAadhaar` — **Body:** `{ aadhaar?, otp }`

### 2.4 ABHA profile maintenance
- **POST** `/abhaReKYC/reKYC` — **Body:** `{ abhaNumber, mobileNumber }` & **POST** `/abhaReKYC/verifyReKYC` — **Body:** `{ abhaNumber, mobileNumber, OTP }`
- **POST** `/updateABHAmobile/getOTPonNewMobileNumber` — **Body:** `{ oldNumber?, abhaNumber?, mobileNumber }` & **POST** `/updateABHAmobile/verifyOTPonNewMobileNumber` — **Body:** `{ oldMobileNumber, abhaNumber, otp }`
- **POST** `/updateABHAemail/updateEmail` — **Body:** `{ email, abhaNumber, mobileNumber }`

### 2.5 Deactivate / Delete ABHA
| Flow | Step 1 (OTP) | Step 2 (verify) | Body |
|---|---|---|---|
| Deactivate via Aadhaar | `POST /deactivateUsingAadhaar/getOTPonAadhaar` | `POST /deactivateUsingAadhaar/verifydeactivateABHAOTP` | `{ abhaNumber, mobileNumber }` → `{ OTP, abhaNumber, mobileNumber }` |
| Deactivate via ABHA no. | `POST /deactivateUsingABHA/getOTPonABHAno` | `POST /deactivateUsingABHA/verifydeactivateABHAOTP` | same |
| Deactivate via password | — | `POST /deactivateUsingPass/deactivateUsingPass` | `{ abhaNumber?, mobileNumber, abhaPass }` |
| Delete via Aadhaar | `POST /deleteUsingAadhaar/getOTPonAadhaar` | `POST /deleteUsingAadhaar/verifyDeleteABHAOTP` | as above |
| Delete via ABHA no. | `POST /deleteusingABHA/getOTPonABHAno` | `POST /deleteusingABHA/verifyDeleteABHAOTP` | as above |
| Delete via password | — | `POST /deleteusingPass/deleteUsingPass` | `{ abhaNumber?, mobileNumber, abhaPass }` |

### 2.6 Local patient registration (with ABHA details)
- **POST** `/patient/register` — **Body:** `{ patientID?, patientInfo, patientGuardian, patientAddress, patientParentsInfo, patientAbhaDetails, doctorName }`
- **GET** `/patient/getAllDetails` · **GET** `/patient/:patientId`
- **PATCH** `/patient/update/:patientId` · **DELETE** `/patient/delete/:patientId`

---

## 3. ABDM Milestone 2 — Care Context Linking & Record Publishing (HIP)

Module: `src/m2_m3_implementation/` + record builders in `doctor_profile` / `diagnostic` / `payments`. SwasthX acts as **HIP**.

### 3.1 HIP-initiated linking (link token)
- **POST** `/verifyDemographic` 🔒 — **Body:** `{ abhaAddress, abhaNumber, name, gender, yearOfBirth, requestID? }`
  - *Demographic auth → gateway `POST {GATEWAY_URL}/api/hiecm/v3/token/generate-token`. The **link token arrives asynchronously** on the callback below and is stored in `linktokens` keyed by **ABHA address** (not ABHA number). Every new address needs its own token.*
- **GET** `/getHipVerificationStatus?requestID=` 🔒 — poll the token/verification status
- 📥 **POST** `/api/v3/hip/token/on-generate-token` — **Body:** `{ abhaAddress, linkToken, response: { requestId } }`
- 📥 **POST** `/api/v3/link/on_carecontext` — **Body:** `{ abhaAddress, status, error, response: { requestId } }` — ack for a care-context link

**Where the link token is warmed (Sep 2026 changes):**
1. **Scan & Share** (`/api/v3/hip/patient/share`) now calls `requestLinkTokenSilently` immediately, so a token is ready by the time a record is created.
2. Diagnostic **sample collection** (`collectSample`) warms the token for the booked ABHA address (see `docs/DIAGNOSTIC_ABDM_LINK_FIX.md` in the backend).
3. The clinical publish path requests a token itself when missing; a record is **never failed** on a missing token — it is stored in `hipnotlinkedhealthrecords` and linked when the token callback lands (`SKIPPED_NO_TOKEN`).
4. `performCareContextLink` sends `abhaNumber` **without dashes** — the v3 gateway validates it against `X-LINK-TOKEN` and returns `400` for the dashed `userprofiles` format.

### 3.2 Record creation → ABDM publish (care-context link) {#record-publish}
All 🔒 (doctor JWT). Each stores the FHIR bundle locally, then links a care context (`POST {GATEWAY_URL}/api/hiecm/hip/v3/link/carecontext`) when the patient has an ABHA, or sends a deep-link SMS (`.../link/patient/links/sms/notify2`) when not.

| Record type | Endpoint |
|---|---|
| Prescription (legacy) | `POST /doctor-profile/submitUserPrescription` |
| Prescription (FHIR) | `POST /doctor-profile/submitPrescriptionRecord` |
| OP Consultation | `POST /doctor-profile/submitOPRecord` |
| Discharge Summary | `POST /doctor-profile/submitDischargeSummary` |
| Diagnostic Report | `POST /doctor-profile/submitDiagnosticReport` |
| Immunization | `POST /doctor-profile/submitImmunizationRecord` |
| Wellness | `POST /doctor-profile/submitWellnessRecord` |
| Health Document (artifact) | `POST /doctor-profile/submitRecordArtifact` |
| Invoice / Bill | `POST /doctor-profile/createInvoiceRecord`, `POST /payment/createPaymentLink` (reception), `POST /diagnostic/createInvoiceRecord` |
| Diagnostic-side clinical records | `POST /diagnostic/submitPrescriptionRecord`, `/submitOPRecord`, `/submitDischargeSummary`, `/submitWellnessRecord`, `/submitImmunizationRecord` |

Notes (verified in code):
- **Invoice bundles** use the NRCES `InvoiceRecord` profile with type codes `00 Consultation / 01 Pharmacy / 04 Pathology`; an invoice is **not published until the appointment is `PAID`/`OVERRIDDEN`** (`publishInvoicesOnPayment`). Legacy stored invoices are sanitised at HIP data-transfer time (`sanitize_invoice_bundle.util.ts`).
- The doctor's **HPR ID** (`doctorprofiles.hpr.hprIdNumber`) is injected into `Practitioner.identifier` in the FHIR bundles when present.
- **Async publish (SQS)** — three flag-gated queues; when a flag is off the publish runs inline as before:

| Flow | Flag | Queue URL env | Status tracked on |
|---|---|---|---|
| Diagnostic reports | `DIAGNOSTIC_ABDM_USE_QUEUE` | `SQS_DIAGNOSTIC_ABDM_URL` | `doctoruserprescriptions.abdmPublicationStatus` |
| Invoices (reception + doctor) | `PAYMENT_ABDM_USE_QUEUE` | `SQS_PAYMENT_ABDM_URL` | `invoicefhirs.abdmPublicationStatus` |
| Doctor clinical writes (8 call sites) | `DOCTOR_ABDM_USE_QUEUE` | `SQS_DOCTOR_ABDM_URL` | `clinical_abdm_publishes` (tracking doc) |

State machine: `PENDING → IN_FLIGHT → PUBLISHED | PUBLICATION_FAILED`; retry 30s → 2m → 10m → 30m → 1h → hourly → ~24h terminal. Worker needs `WORKER_ENABLED=true`. See [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html).

### 3.3 Linked records & patient notify
- **POST** `/showLinkedRecord` 🔒 — records linked for a patient
- **POST** `/notifyPatient` 🔒 — **Body:** `{ mobileNumber, HIPname, HIPId }` → ABDM deep-link SMS to a patient without ABHA
- 📥 **POST** `/api/v3/patients/sms/on-notify` — SMS notify callback (tolerates all gateway shapes; ignores `TxnID: undefined`)

### 3.4 User-initiated discovery & linking (patient app → HIP)
- 📥 **POST** `/api/v3/hip/patient/care-context/discover` — **Body:** `{ transactionId, patient: { id, verifiedIdentifiers[], unverifiedIdentifiers[], name, gender, yearOfBirth } }`
- 📥 **POST** `/api/v3/hip/link/care-context/init` — **Body:** `{ requestId, timestamp, transactionId, patient }`
- 📥 **POST** `/api/v3/hip/link/care-context/confirm` — **Body:** `{ requestId, timestamp, confirmation }` (OTP)

### 3.5 Scan & Share (facility QR → profile share) {#scan-and-share}
- 📥 **POST** `/api/v3/hip/patient/share` — **Body:** `{ patient: { abhaNumber, abhaAddress, name, gender, dayOfBirth, monthOfBirth, yearOfBirth, address, phoneNumber }, ... }` — profile shared by the ABHA app after scanning the facility QR. Stores the share in `authinitdbs` / `scansharetrails` and **requests the link token silently**.
- **GET** `/getShareProfileUserData` 🔒 — list shared profiles (reception/doctor queue)
- **PUT** `/verifyUsershareDemographics?healthID=` 🔒 — verify demographics of a shared profile
- **PUT** `/completeScanShareVerification?healthID=` 🔒 — mark the scan-share as verified/checked-in (Aug 2026)
- **DELETE** `/deletePatientData?healthID=` 🔒

### 3.6 Patient lookup (HMIS)
- **GET** `/getPatientInfoByUHID?name=&mobile=&did=` 🔒 · **GET** `/getAllPatientInfo` 🔒
- **GET** `/receptionist/getAllPatientsInfo` · `/pharmacy/getAllPatientsInfo` · `/diagnostic/getAllPatientsInfo` · `/receptionist/getAllDoctorPatients?id=` 🔒
- **GET** `/admin/getAllPatientsInfoRecords` · **GET** `/admin/getSinglePatientInfoRecords/:patientID` · **PATCH** `/admin/updatePatientInfos/:patientID` · **DELETE** `/admin/deletePatient/:patientID`

---

## 4. ABDM Milestone 3 — Consent Management & Health Data Exchange

SwasthX acts as **HIU** (requests records from other HIPs) **and** as **HIP** (serves its own records on consent).

### 4.1 HIU — consent request
- **POST** `/hiuinitiateconsent` 🔒 — **Body:** `HIUconsentInitiateDto` `{ doctorID?, consent: { purpose{text,code,refUri}, patient{id}, hiu{id}, requester{name, identifier}, hiTypes[], permission{ accessMode, dateRange{from,to}, dataEraseAt, frequency{unit,value,repeats} } } }`
- **POST** `/checkConsentStatus` 🔒 — **Body:** `{ consentRequestId }`
- **GET** `/getConsentsHIU` 🔒 — all consents raised by this HIU
- **GET** `/fetchStatus?requestID=` 🔒
- **POST** `/findPatient` 🔒 — **Body:** `{ healthID, uid }` → gateway patient find
- 📥 **POST** `/api/v3/hiu/consent/request/on-init` — `{ consentRequest: { id }, error, response: { requestId } }`
- 📥 **POST** `/api/v3/hiu/consent/request/on-status` — `{ consentRequest: { id, status, consentArtefacts[] }, ... }`
- 📥 **POST** `/api/v3/hiu/consent/request/notify` — `{ notification: { consentRequestId, status, consentArtefacts[] } }` (GRANTED / DENIED / REVOKED / EXPIRED)
- 📥 **POST** `/v0.5/patients/on-find` — patient-find callback

### 4.2 HIU — artefact fetch & health-information request
- **POST** `/fetchConsentArtefact` 🔒 — **Body:** `{ requestID }` → gateway `consent/fetch`
- 📥 **POST** `/api/v3/hiu/consent/on-fetch` — artefact (with signed consent detail)
- **GET** `/getHIUConsentArtefactData?requestID=` 🔒
- **POST** `/sendRecordRequest` 🔒 — **Body:** `{ requestID }` → `data-flow/health-information/request` (creates HIU key material — see Fidelius note)
- 📥 **POST** `/api/v3/hiu/health-information/on-request` — `{ hiRequest: { transactionId, sessionStatus }, error, response }`
- **POST** `/datapushdone` — **Body:** `HIUdataReceiveDto` `{ pageNumber, pageCount, transactionId, entries[{ content, media, checksum, careContextReference }], keyMaterial{ cryptoAlg, curve, dhPublicKey{expiry, parameters, keyValue}, nonce } }` — the HIP pushes encrypted bundles to `HIU_DATA_PUSH_URL`; the backend decrypts and then notifies the gateway (`health-information/notify`)
- **GET** `/getCarecontextStatus?requestID=&consentID=`
- **PATCH** `/getHIUfetchData` 🔒 — **Body:** `{ requestID, paientABHAaddress }` → decrypted FHIR bundles for the consent (parsed per hiType)
- **PATCH** `/checkStatusHIUfetchData` 🔒 — same body; status only
- **GET** `/getRegisteredABHA` 🔒 · **GET** `/getRegisteredABHAdetails?abhaAddress=` 🔒 — ABHA addresses/demographics known to this doctor (for the "New consent" modal)
- **POST** `/test-parse-fhir-bundle` — **Body:** `{ bundleString, hiTypes[] }` — dev/test parser (no auth; do not expose publicly)

### 4.3 HIP — serve records on consent (data transfer)
- 📥 **POST** `/api/v3/consent/request/hip/notify` — **Body:** `{ requestId, timestamp, notification }` — consent granted/revoked for our care contexts
- 📥 **POST** `/api/v3/hip/health-information/request` — **Body:** `{ requestId, timestamp, transactionId, hiRequest{ consent, dateRange, dataPushUrl, keyMaterial } }` — the backend rebuilds each HI-type bundle (`create_bundle_folder/*`), encrypts (ECDH/Fidelius) and pushes to `dataPushUrl`. **Invoice is the only type served as-stored** (hence the sanitizer).

### 4.4 Encryption — Fidelius key material (Sep 2026)
`KeyMaterialService` switches on `USE_FIDELIUS_KEYS`:
- `true` → key generation / encrypt / decrypt via the **Fidelius Lambda** at `LAMBDA_KEY_GENERATION_URL` (production since "Redeploy: use Fidelius key-material server for M2 encryption", 2026-09-11).
- `false` → legacy key-material server at `KEY_MATERIAL_URL` (default `http://localhost:8090`).

---

## 5. ABDM Milestone 4 — HPR / HFR Registries, Register HIP & Facility QR

"M4" in SwasthX = the **NHA registry** integrations: **HPR** (Healthcare Professional Registry — doctors, nurses, pharmacists), **HFR** (Health Facility Registry), registering the facility's **HIP service on the software bridge**, and the **Facility QR** that patients scan. Backend modules: `src/hpr_api/`, `src/hfr_api/`, `src/facility_qr/`. Frontend: `/nhpr/*` (`NhprRoutes.jsx`, guarded by `RequireNHPRAccess` + `RequireNHPRAuth`) and `/admin/facility-qr`.

All HPR/HFR routes are 🔒 + `throttleWithToken` unless noted. The NHA-side calls go to `NHPR_URL_V1_*` / `NHPR_URL_V2_*` / `NHPR_URL_ONLY_V4` / `NHPR_URL_ONLY_V4_HFR` / `NHPR_AADHAAR_INTEGRATOR_URL` with `X_API_KEY`; the HPR session token is stored per doctor and refreshed by `cron_service`.

### 5.1 HPR — Healthcare Professional Registry

#### 5.1.1 Registration wizard (Aadhaar, ABDM-hosted consent page)
Prefix `/HPR/register`. The doctor-side user is **always the admin** (HPR IDs are admin-created; see 5.1.6).

| Step | Endpoint | Body / Query |
|---|---|---|
| 1. Open Aadhaar consent | `POST /aadhaar/generateLink` (5/min) | `{ scopes?: string[], source? }` → `{ txnId, authUrl }` (opens the NDHM consent page) |
| 2. Poll consent | `POST /aadhaar/isAuthenticated` (30/min) | `{ txnId }` → `{ authenticated: boolean }` |
| 3. Fetch Aadhaar demographic | `POST /aadhaar/verifyOtp` | `{ txnId }` — **no OTP in the body** (v2 flow; name kept for FE compat) |
| 4. Mobile demographic auth | `POST /aadhaar/verifyMobile` | `{ txnId, mobileNumber }` |
| 5. Mobile OTP | `POST /aadhaar/verifyMobileOTP` | `{ otp, txnId }` |
| 6. Email | `POST /aadhaar/verifyEmail` | `{ email, txnID }` |
| 7. Mint HPR ID | `POST /aadhaar/createHprid` | `{ txnId, hprId, password, firstName, middleName?, lastName?, email?, profilePhoto?, hpCategoryCode, hpSubCategoryCode, stateCode?, districtCode?, role }` |
| 8. Save HPR form draft | `POST /aadhaar/savehpridform?txnID=` | free-form form data |
| 9. Save doctor form slice | `POST /aadhaar/saveDoctorForm?hprIdNumber=&type=` | `type ∈ personal \| educationDetails \| workDetails \| preview` — saves one slice of the local draft |
| 10. Register as professional | `POST /professional/register` | `{ hprToken?, hprID?, practitioner: PractitionerDto }` (personal + qualification + work details → NHA `register-professional-new`) |
| 11. Required documents | `POST /professional/documents-list` | `{ hprid }` |
| 12. Upload documents | `POST /professional/upload-documents` | `{ hpr_token, document: CreateDocumentDto[] }` |
| Facility lookup for work details | `POST /facility/search` | `SearchFacilityDto` `{ ownershipCode, stateLGDCode, districtLGDCode?, subDistrictLGDCode?, pincode?, facilityId?, facilityName, page?, resultsPerPage? }` |


#### 5.1.2 HPR login (NHA session for an existing HPR ID)
Prefix `/HPR/login`:
- **POST** `checkHPRidpresent?hipID=` — does this HPR ID already exist (locally / NHA)
- **POST** `login-password` — **Body:** `{ hprId (must end with @hpr.abdm), password }`
- **POST** `loginViaMobileSendOTP` — `{ mobile }` → **POST** `loginViaMobileVerifyOTP` — `{ mobileNumber, otp, txnId }` → **POST** `loginViaMobileGetUserToken` — `{ hprId, mobileNumber, txnId }`
- **POST** `hprIDsendOTP` — `{ hprId, type }` → **POST** `hprIDverifyOTP` — `{ otp, hprId, txnId }`
- **POST** `getAccountInfo` — `{ hprID }` → NHA account info (also triggers onboarding `complete`, see 5.1.6)
- **POST** `getUserIdCard` — `{ hprID }` → HPR ID card

#### 5.1.3 Profile update (post-registration)
Prefix `/HPR/professional`:
- **POST** `fetch-details` — `{ id?, name?, contactNumber?, state?, registrationNumber?, stateCouncilName? }` → NHA `fetch-professional-info`
- **POST** `updateProfessionalDetails` — `RegisterProfessionalDto` (same shape as register) → NHA `update-professional-new`. *FE holds step edits in memory and writes `saveDoctorForm` only after this succeeds ("fix sync of abdm", 2026-09-14).*
- **GET** `getCompleteFormData?hprIdNumber=&type=` — local draft slices (`personalInformation`, `educationInformation`, `workInformation`)
- **POST** `fetchProfessionalDocumentList` — `{ hprid }` · **POST** `updateProfessionalDocument` — `{ hprID, documentList[] }`
- **POST** `updateProfessionalMobileNumber` / `updateProfessionalMobileRegenerate` — `{ hprID, mobileNumber }` → **POST** `updateProfessionalMobileVerifyOTP` — `{ hprID, mobileNumber, txnId, otp }`
- **POST** `updateProfessionalEmail` / `updateProfessionalEmailRegenerate` — `{ hprID?, email }` → **POST** `updateProfessionalEmailVerifyOTP` — `{ hprID, mail, otp }`

#### 5.1.4 Re-KYC, role change & password (M4, Sep 2026)
- **POST** `/HPR/reKyc/generateOtp` (5/min) — **Body:** `{ hprID }` → OTP to the Aadhaar-linked mobile (uses the stored HPR token; `401` if none)
- **POST** `/HPR/reKyc/verifyOtp` — **Body:** `{ otp, hprId, txnId }`
- **POST** `/HPR/profile/updateRole` — **Body:** `{ hprId, role }` — NHA allows `1 → 3` and `2 → 3` only (`400` otherwise)
- Password — prefix `/updatePassword`:
  - via old password: **POST** `usingOldPassword` — `{ hprId?, oldPassword, newPassword }`
  - via Aadhaar OTP: **POST** `getAadhaarOtp` `{ hprId }` → **POST** `verifyAadhaarOtp` `{ hprId, otp }` → **POST** `setPasswordUsingAadhaarOtp` `{ hprId, password }`
  - via mobile OTP: **POST** `getMobileOtp` `{ hprId }` → **POST** `vefifyMobileOtp` *(sic)* `{ hprId, otp }` → **POST** `setPasswordUsingMobileOtp` `{ hprId, password }`
  - *`otp` / `password` are sent RSA-encrypted with `RSA_PUBLIC_KEY_NHPR`.*

#### 5.1.5 Master data (`/HPR/masterAPI`, all GET unless noted) {#hpr-master-data}
`system-of-medicines` · `medical-councils` · `languages?language_id=` · `universities?college_id=` · **POST** `colleges?state_id=&system_of_medicine=` · **POST** `courses?hpr_type=&system_of_medicine=` · `countries?country_id=` · `states?state_id=` · `districts?state_id=` · `sub-districts?district_id=` · `affiliatedBoardByStates?state_id=` · `getAllMinistry?state_id=&hprId=` · `hpid/categories?role=` · `hpid/sub-categories?role=&categoryCode=`

**Nurse flow (M4):** `getNurseCouncils` · `nurse-colleges?state_id=` · `nurse-affiliated-boards?state_id=` · `affiliated-board?board_id=`. For `role = nurse` the qualification's `college` field carries the **nursing board ID** and must be sourced from these endpoints, not the medical-college lookup.

#### 5.1.6 HPR onboarding, verification & gate {#hpr-onboarding-gate}
Because the NHPR wizard runs under the **admin's** JWT, a `trackingId` ties the HPR being created/fetched to a specific doctor row.

- **POST** `/HPR/onboarding/start` 🔒 (role `admin`) — **Body:** `{ targetDoctorID, targetDoctorName? }` → `{ trackingId, targetDoctorID, status: 'IN_PROGRESS' }`. FE navigates to `/nhpr/login?flow=professional&trackingId=…`.
- **POST** `/HPR/onboarding/complete` 🔒 (admin) — **Body:** `{ trackingId, hprIdNumber }` → `{ ok, status, targetDoctorID, linked, message }`. Fired after `createHprid` **or** after `getAccountInfo` (login path). Idempotent; branch on `linked`.
- **GET** `/HPR/onboarding/pending` 🔒 (admin) → `{ count, sessions[] }` · **GET** `/HPR/onboarding/:trackingId`
- **GET** `/HPR/verify/status/:doctorID?hospitalId=` 🔒 → `{ hpr: { createdHprIdDetailsPresent, hprId, hprIdNumber } | null }` (the badge read-model — binary, no status enum)
- **GET** `/HPR/verify/banner?hospitalId=` 🔒 (admin of that hospital) → `{ hospitalId, unverifiedCount, unverifiedDoctors[] }`

**Gate (`HprGuardService.check`)** — when `HospitalPolicy.abdmEnabled === true` and the doctor's `hpr.createdHprIdDetailsPresent !== true`, these endpoints return `403 { status:false, code:'HPR_NOT_VERIFIED', doctorID, hprStatus }`:
`POST /doctor-profile/doctorBookUserSlot`, `POST /diagnostic/submitPrescriptionRecord`, `/diagnostic/submitOPRecord`, `/diagnostic/submitDischargeSummary`, `/diagnostic/submitWellnessRecord`, `/diagnostic/submitImmunizationRecord`.
The FE axios interceptor (`src/services/hprGate.js` + `HPRGateModal.jsx`) catches this contract.

Collections: `storenhprtxns`, `storeuserregistrationdatas` (+ `linkedDoctorID`), `hpr_onboarding_sessions` (TTL 24h abandoned / 30d completed), read-model `doctorprofiles.hpr`.

### 5.2 HFR — Health Facility Registry

#### 5.2.1 Facility registration wizard (4 chained steps, `trackId`)
Prefix `/HFR`:

| Step | Endpoint | Body |
|---|---|---|
| 1 | `POST /basicFacilityInformation` | `{ hprID, trackingId?, facilityInformation }` → `{ trackId }` |
| 2 | `POST /additionalFacilityInformation?trackId=` | `{ hprID, generalInformation, linkedProgramIds }` |
| 3 | `POST /detailedFacilityInformation?trackId=` | `{ hprID, specialities?[], medicalInfrastructure?, pharmacyDetails?, bloodBankDetails?, imagingServices?[], diagnosticServices?[] }` |
| 4 | `POST /submitFacilityDetails?trackId=` | `{ hprID, sourceOfInformation?, sourceUniqueID? }` → facility `submitted`, HFR facility ID (`IN…`) stored |

Contact verification (inside step 1/2): **POST** `/HFR/facility/sendOtpToContact` — `{ facilityId }` → **POST** `/HFR/facility/validateOtp` — `{ facilityId, sourceId, otp, source, transactionId }`.

#### 5.2.2 Drafts & reads
- **GET** `/HFR/facility/getCompleteFormData?hprID=&type=basicDetails&facilityId=` — hydrate a submitted facility
- **DELETE** `/HFR/facility/deleteDraft?trackId=&hprID=` — server-side ABDM draft
- **POST** `/HFR/facility/saveDraft` — `{ hprID, localDraftId, payload }` (local-only draft, not sent to ABDM; unique per `{doctorID, hprID, localDraftId}`) · **GET** `/HFR/facility/localDrafts?hprID=` · **GET / DELETE** `/HFR/facility/localDraft?id=`
- **GET** `/HFR/facility/getLinkedFacilities?hprID=` — facilities linked to this professional (drives "My Dashboard")

#### 5.2.3 Master / LGD lookups (`/HFR`)
`POST facility/search` (`SearchFacilityDto`) · `GET getMasterTypes` · `GET getMasterData?type=` · `GET LGDStates` · `GET LGDDistrict?stateCode=` · `GET LGDSubDistrict?districtCode=` · `POST fetchFacilityType` `{ ownershipCode, systemOfMedicineCode? }` · `POST getOwnerSubtypes` `{ ownershipCode, ownerSubtypeCode? }` · `POST getSpecialities` `{ systemOfMedicineCode }` · `POST getFacilitySubtype` `{ facilityTypeCode }` / `GET getFacilitySubtype?FacilityTypeCode=` · `GET getABDMCompliantSoftware`
(`getMasterTypes`, `getMasterData`, `LGD*`, `getABDMCompliantSoftware` have **no JWT guard**.)

#### 5.2.4 Register HIP / Software Linkage (M4)
A submitted facility can only exchange records once its **HIP service is registered on SwasthX's software bridge**.
- **POST** `/HFR/getHrpBridgeDetails` — **Body:** `{ facilityID (^IN\d+$), facilityName, bridgeId }` → `{ id, name, url, bridgeId }` — "Get Details" (NHA `facility/getHrpBridgeDtls`, header `apikey`)
- **POST** `/HFR/linkMultipleHRP` — **Body:** `{ facilityId: "IN…", facilityName, HRP: [{ bridgeId, hipName (≤15 chars, no % $ * # @ ( ~ & ! ), active: true }] }` → NHA `v1/bridges/MutipleHRPAddUpdateServices`; success returns `data[].servicesLinked`.
- `bridgeId` is **SwasthX's** software bridge ID — one per environment: backend `ABDM_SOFTWARE_BRIDGE_ID` (default `SBX_003041`), frontend `VITE_ABDM_SOFTWARE_BRIDGE_ID`. FE screen: `/nhpr/profileDetails/softwarelinkage` (`SoftwareLinkagePage.jsx`); `hipName` is derived from the facility name.

Collections: `storefacilityregistrationdatas`, `facilitylocaldrafts`.

### 5.3 Facility QR (admin) — `/admin/facility-qr` 🔒 (admin)
- **GET** `/facilities` — facilities under the admin's hospital (from HFR data)
- **POST** `/generate` — **Body:** `{ facilityId: "IN…" }` → active QR. The QR encodes the deep-link **URL** `{SWASTHX_APP_BASE_URL}/scan/{facilityId}?hospital={hospitalId}` (no signing); the PNG is uploaded to S3 and a presigned `qrCodeUrl` is returned; row in `facility_qrs` (`facilityId, hospitalId, payloadUrl, s3Key, registeredByEntityID, registeredByHprIdNumber, generatedAt`)
- **GET** `/:facilityId` — active QR record · **GET** `/:facilityId/preview` — PNG stream
- **POST** `/:facilityId/regenerate` — new QR supersedes the current active one
- Patient side: ABHA app scans → ABDM **Scan & Share** → callback `POST /api/v3/hip/patient/share` ([§3.5](#scan-and-share)). See [QR Automation]({{ site.baseurl }}/docs/architecture/qr-automation.html).

---

## 6. ABDM Gateway → SwasthX callbacks (summary) {#gateway-callbacks}

Registered against the bridge via the Postman `registrationWithBridge` folder (`/api/hiecm/gateway/v3/bridge/url`, `bridge-services`). All are **POST**, unauthenticated, must return `202` fast.

| Milestone | Callback path |
|---|---|
| M2 link token | `/api/v3/hip/token/on-generate-token` |
| M2 care-context link ack | `/api/v3/link/on_carecontext` |
| M2 SMS notify ack | `/api/v3/patients/sms/on-notify` |
| M2 user-initiated | `/api/v3/hip/patient/care-context/discover`, `/api/v3/hip/link/care-context/init`, `/api/v3/hip/link/care-context/confirm` |
| M2 Scan & Share | `/api/v3/hip/patient/share` |
| M3 HIU | `/api/v3/hiu/consent/request/on-init`, `/on-status`, `/notify`, `/api/v3/hiu/consent/on-fetch`, `/api/v3/hiu/health-information/on-request`, `/v0.5/patients/on-find`, data push → `HIU_DATA_PUSH_URL` (`/datapushdone`) |
| M3 HIP | `/api/v3/consent/request/hip/notify`, `/api/v3/hip/health-information/request` |


---

## 7. ABDM environment variables (website backend) {#abdm-env-vars}

| Variable | Purpose |
|---|---|
| `V3_API_URL`, `GATEWAY_URL` | ABHA v3 API base, HIECM gateway base |
| `PHR_WEB_API_URL` | Full prefix for the ABHA "phr/web" login APIs (sandbox `…/abha/api/v3/phr/web`, prod `…/api/phr/web/v3`) |
| `CLIENT_ID`, `CLIENT_SECRET`, `X_CM_ID` | Gateway session credentials, consent-manager id (`sbx` / `abdm`) |
| `X_API_KEY`, `NHPR_URL_V1_W_API`, `NHPR_URL_V1_WO_API`, `NHPR_URL_V2_W_API`, `NHPR_URL_V2_WO_API`, `NHPR_URL_ONLY_V4`, `NHPR_URL_ONLY_V4_HFR`, `NHPR_AADHAAR_INTEGRATOR_URL` | HPR / HFR (NHA) endpoints |
| `ABDM_SOFTWARE_BRIDGE_ID` | Software bridge ID for Register HIP / HPR registration (default `SBX_003041`) |
| `ABDM_TLS_REJECT_UNAUTHORIZED` | `true` in prod; sandbox certs are sometimes invalid |
| `RSA_PUBLIC_KEY`, `RSA_PUBLIC_KEY_NHPR` | RSA public keys for ABHA / NHPR payload encryption |
| `USE_FIDELIUS_KEYS`, `LAMBDA_KEY_GENERATION_URL`, `KEY_MATERIAL_URL` | M2/M3 ECDH key material — Fidelius Lambda vs legacy server |
| `HIU_DATA_PUSH_URL`, `HIU_PUSH_URL`, `PHR_APP_PUSH_URL` | Where HIPs push data to us / where we push to the PHR app |
| `LIVE_TEST_HIP_ID` | Test HIP id |
| `DIAGNOSTIC_ABDM_USE_QUEUE`, `PAYMENT_ABDM_USE_QUEUE`, `DOCTOR_ABDM_USE_QUEUE`, `SQS_DIAGNOSTIC_ABDM_URL`, `SQS_PAYMENT_ABDM_URL`, `SQS_DOCTOR_ABDM_URL`, `WORKER_ENABLED` | Async ABDM publish (SQS) |

Frontend: `VITE_HIP_ID`, `VITE_HIU_ID`, `VITE_ABDM_SOFTWARE_BRIDGE_ID`, `VITE_ABHA_ADDRESS_SUFFIX` (`@sbx` / `@abdm`).

---

## 8. Integration endpoints (non-ABDM)

### Payment webhooks
- **GET** `/payment/paymentLinkCallback` (Razorpay redirect) · **POST** `/payment/paymentLinkCallbackWebhook` (Razorpay webhook) — same pair under `/diagnostic/…` and `/pharmacy/…`. Settling an appointment to `PAID` triggers `publishInvoicesOnPayment` (invoice → ABDM, [§3.2](#record-publish)).

### Cross API (WB ↔ PHR)
See [Cross API Documentation]({{ site.baseurl }}/docs/architecture/website-cross-api.html).

---

## 9. Milestone status matrix

| Milestone | Scope | Code status (2026-09-16) |
|---|---|---|
| M1 | ABHA create / verify / access-by-mobile / re-KYC / update / deactivate / delete | ✅ Live. Communication-mobile OTP + `finalizeProfileLinkage` added Aug 2026 |
| M2 | Link token, care-context link, 8 clinical record types + invoice, SMS notify, Scan & Share, discovery | ✅ Live. Sep 2026: token requested at scan-and-share, dashless ABHA fix, Fidelius keys, SQS publish (flag-gated, default off for invoice/doctor) |
| M3 | HIU consent lifecycle, artefact fetch, data request/push/decrypt; HIP consent notify + data transfer | ✅ Live. Subscription callbacks removed |
| M4 | HPR wizard (ABDM-hosted Aadhaar), login, profile update, re-KYC, role update, nurse masters, onboarding + gate; HFR wizard, drafts, Register HIP; Facility QR | ✅ Live (PRs #403–#411, #418–#420, Sep 2026). Pending: `POST /abdm/hfr/status` + `/sync` (HFR status sync), server-side master-data cache |


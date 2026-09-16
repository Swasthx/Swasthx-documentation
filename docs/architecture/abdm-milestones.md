---
layout: default
title: ABDM Milestones (M1–M4)
parent: Architecture & Design
---

# ABDM Integration — Milestones M1 to M4 (Website / HMIS)

How the SwasthX **website backend** (`swasthx_backend_website`, NestJS) and **HIP frontend** (`Swasthx_HIP_Frontend`, React) implement the four ABDM milestones. This page is the *flow* view; the per-endpoint reference is the [Website API Documentation]({{ site.baseurl }}/api-website) and the [Swagger spec]({{ site.baseurl }}/docs/api/website-api.html).

> Verified against code on **2026-09-16** (backend `b7d4834c` — development, frontend `c3db4bb4` — development-new).

| Milestone | ABDM meaning | SwasthX scope | Backend module(s) | Frontend |
|---|---|---|---|---|
| **M1** | ABHA creation & verification | Create ABHA (Aadhaar OTP), verify existing ABHA, access-by-mobile/Aadhaar, re-KYC, update mobile/email, deactivate/delete | `src/abha_number_services/` | Reception / Super-admin `CreateAbha`, `VerifyAbha`, `AccessByMobile`, `AccessByAadhaar` |
| **M2** | HIP — link care contexts, publish records | Link token, care-context link for 8 clinical record types + invoices, SMS notify, Scan & Share, user-initiated discovery | `src/m2_m3_implementation/`, `doctor_profile`, `diagnostic`, `services/payments` | Doctor/Diagnostic record modals, Patient tables (`verifyDemographic`), Reception queue |
| **M3** | HIU — consent & data exchange | Consent request lifecycle, artefact fetch, encrypted data request/push/decrypt; HIP-side consent notify & data transfer | `src/m2_m3_implementation/data_request_transfer/` | Doctor `Consent` (ConsentTable, NewConsentModal), Diagnostic `Consents` |
| **M4** | NHA registries | **HPR** (professional) wizard/login/update/re-KYC/role/nurse, onboarding + verification gate; **HFR** (facility) wizard/drafts/Register HIP; **Facility QR** | `src/hpr_api/`, `src/hfr_api/`, `src/facility_qr/` | `/nhpr/*` (`NhprRoutes.jsx`), `/admin/facility-qr` |

Roles: SwasthX is registered on the ABDM gateway as **HIP** (`VITE_HIP_ID` / facility HFR id) and **HIU** (`VITE_HIU_ID`). Consent manager `X_CM_ID` = `sbx` (sandbox) / `abdm` (prod).

---

## 1. Environment & gateway plumbing

```
Portal (React) ──JWT──▶ Website backend (NestJS, App Runner)
                            │  session token: POST {GATEWAY_URL}/api/hiecm/gateway/v3/sessions  (CLIENT_ID / CLIENT_SECRET)
                            │  ABHA v3:       {V3_API_URL}/abha/api/v3/...        phr/web login: {PHR_WEB_API_URL}/...
                            │  HPR / HFR:     {NHPR_URL_*} + X_API_KEY            Aadhaar page:  {NHPR_AADHAAR_INTEGRATOR_URL}
                            │  RSA:           RSA_PUBLIC_KEY (ABHA), RSA_PUBLIC_KEY_NHPR (HPR passwords/OTPs)
                            ▼
                    NHA ABDM gateway ──callbacks (no JWT)──▶ /api/v3/... on the backend (registered via bridge URL)
```

Production switches introduced in Sep 2026 ("Production ready" commits): `PHR_WEB_API_URL` (sandbox/prod path order differs), `ABDM_SOFTWARE_BRIDGE_ID` (bridge id, default `SBX_003041`), `ABDM_TLS_REJECT_UNAUTHORIZED` (`true` in prod), CORS origins env-driven; frontend `VITE_ABHA_ADDRESS_SUFFIX` (`@sbx` → `@abdm`), `VITE_ABDM_SOFTWARE_BRIDGE_ID`. Full list: [API doc §7]({{ site.baseurl }}/api-website#abdm-env-vars).

---

## 2. M1 — ABHA creation & verification

```
Reception: "Create ABHA"                         Reception: "Verify ABHA" / "Access by mobile"
  POST /generateOTPforABHAprofile                  POST /verifyAbhaWeb/usingaadhaarotp | usingaadhaarotpforMobile
  POST /verifyABHAprofileOtp                       POST /verifyAbhaWeb/verifyaadhaarotp | verifyMobileotp
  (optional) /getOTPonCommunicationMobile…         POST /accessbymobile/searchAbhaProfile → generateOTP → verifySearchMobileOTP
  POST /fetchAbhaAddressSuggestionsForABHAprofile  POST /accessbymobile/finalizeProfileLinkage   ← explicit local-profile choice
  POST /addUserAbhaAddressForABHAprofile             (use_existing | update_profile | create_profile)
  POST /patient/register  (local UHID + ABHA)      POST /verifyAbhaWeb/registerWithVerifyAbhaNumber | …Address
```

What changed recently (verified in git):
- **Communication-mobile OTP** (`/getOTPonCommunicationMobileForABHAprofile`) — "M1 improvements", 2026-08-11.
- **`finalizeProfileLinkage`** — resolves the "new ABHA address vs existing local profile" sync issue (Aug 2026) so a returning patient with a new address does not create a duplicate profile.
- ABHA address suffix is env-driven on the FE (`@sbx` sandbox, `@abdm` prod).

Collections: `userprofiles` (ABHANumber stored **with dashes**, ABHAaddress), `patientinfos`, `abdmtxnidstorages`, `accesstokens`.

---

## 3. M2 — Linking & record publishing (HIP)

### 3.1 Link token lifecycle (the thing that breaks most often)

```
   ABDM link token is per ABHA ADDRESS (linktokens.healthAddress), minted ASYNCHRONOUSLY.

   Warm-up points (any of):                                       Callback
   ─ Scan & Share  POST /api/v3/hip/patient/share ─┐              📥 POST /api/v3/hip/token/on-generate-token
   ─ Patient page  POST /verifyDemographic ────────┼─▶ gateway ──▶    { abhaAddress, linkToken }  → stored in linktokens
   ─ Diagnostic sample collection (collectSample) ─┤   generate-token       │
   ─ Clinical publish path (if no token yet) ──────┘                        ▼
                                                                  anything waiting in hipnotlinkedhealthrecords is linked
   Record publish:
     has token  → POST {GATEWAY_URL}/api/hiecm/hip/v3/link/carecontext  (X-LINK-TOKEN, abhaNumber DASHLESS)
     no token   → record stored + SKIPPED_NO_TOKEN (never fails the record) ; token callback links it later
     no ABHA    → POST .../link/patient/links/sms/notify2  (deep-link SMS)   📥 /api/v3/patients/sms/on-notify
```

Sep 2026 fixes (commits `694263ba`, `9501c764`, `281b3fed`, `f4218494`): request the link token at scan-and-share; never fail a record on a missing token; send `abhaNumber` without dashes to `generate-token` / `carecontext` (the v3 gateway 400s dashed input); token issue while creating records fixed.

### 3.2 Record publish paths

| Record | Endpoint | Builder | Notes |
|---|---|---|---|
| Prescription / OP / Discharge / Diagnostic / Immunization / Wellness / Health document / legacy prescription | `POST /doctor-profile/submit*` (8) | `create_bundle_folder/*` | `DOCTOR_ABDM_USE_QUEUE` → `clinical_abdm_publishes` + SQS (default off → inline) |
| Diagnostic report (operator queue COMPLETED) | `queue_lifecycle.service` | same | `DIAGNOSTIC_ABDM_USE_QUEUE` (on in prod), token warmed at sample collection |
| Invoice / bill | `POST /payment/createPaymentLink`, `POST /doctor-profile/createInvoiceRecord`, `/diagnostic/createInvoiceRecord` | `invoice_bundle/create_invoice_bundle.ts` (NRCES `InvoiceRecord`, `00/01/04` type codes, PDF `DocumentReference`) | **Payment-gated** — published only when appointment is `PAID`/`OVERRIDDEN` (`publishInvoicesOnPayment`); `PAYMENT_ABDM_USE_QUEUE` → SQS |

State machine for every queued publish: `PENDING → IN_FLIGHT → PUBLISHED | PUBLICATION_FAILED`, retries `30s → 2m → 10m → 30m → 1h → hourly → ~24h`. Only the diagnostic queue is provisioned in AWS today; invoice/doctor queues are code-complete, flag off — see [Amazon SQS]({{ site.baseurl }}/docs/infra/sqs.html).

FHIR bundles carry the doctor's **HPR ID** in `Practitioner.identifier` (from `doctorprofiles.hpr.hprIdNumber`) and the facility **HFR ID** in `Organization.identifier`. `dob` stored `DD-MM-YYYY` is normalised to FHIR `date` in all 8 builders (`fhir_date.util.ts`) — a malformed `birthDate` 400s the whole HIP transfer (`HAPI-1821`).

### 3.3 Scan & Share (facility QR)

```
Admin: /admin/facility-qr → POST /admin/facility-qr/generate { facilityId: IN… }   (HFR facility under the admin hospital; QR = URL {SWASTHX_APP_BASE_URL}/scan/{facilityId}?hospital=…; PNG in S3; row in facility_qrs)
Patient: ABHA app scans QR → ABDM gateway → 📥 POST /api/v3/hip/patient/share  (profile + metaData.hipId/counter)
Backend: store share (authinitdbs / scansharetrails) → requestLinkTokenSilently(abhaAddress)
Reception: GET /getShareProfileUserData → PUT /verifyUsershareDemographics?healthID → PUT /completeScanShareVerification?healthID
```
Business flow (self check-in, tokens, queue): [QR Automation]({{ site.baseurl }}/docs/architecture/qr-automation.html).

### 3.4 User-initiated discovery (patient app → HIP)
`📥 /api/v3/hip/patient/care-context/discover` (match by verified/unverified identifiers) → `📥 /api/v3/hip/link/care-context/init` (OTP) → `📥 /api/v3/hip/link/care-context/confirm`. Records not yet linked live in `hipnotlinkedhealthrecords`.

---

## 4. M3 — Consent & health-data exchange

### 4.1 SwasthX as HIU (doctor requests outside records)

```
Doctor "New consent" (NewConsentModal: GET /getRegisteredABHA, /getRegisteredABHAdetails)
  POST /hiuinitiateconsent  ──▶ gateway consent/request/init
     📥 /api/v3/hiu/consent/request/on-init      (consentRequest.id)
     📥 /api/v3/hiu/consent/request/on-status    (GRANTED / DENIED …)      POST /checkConsentStatus, GET /getConsentsHIU
     📥 /api/v3/hiu/consent/request/notify       (artefact ids)
  POST /fetchConsentArtefact { requestID } ──▶ consent/fetch
     📥 /api/v3/hiu/consent/on-fetch             (signed artefact)          GET /getHIUConsentArtefactData
  POST /sendRecordRequest { requestID } ──▶ data-flow/health-information/request  (HIU key material created)
     📥 /api/v3/hiu/health-information/on-request (ACKNOWLEDGED)
     HIP pushes encrypted entries → POST /datapushdone (HIU_DATA_PUSH_URL)  → decrypt → notify gateway
  PATCH /getHIUfetchData { requestID, paientABHAaddress } → parsed bundles per hiType (ConsentTable / HealthRecordStatus)
```

### 4.2 SwasthX as HIP (serving own records)
`📥 /api/v3/consent/request/hip/notify` (consent granted for our care contexts) → `📥 /api/v3/hip/health-information/request` → rebuild every HI-type bundle from source (Invoice is the only type served **as stored**, hence `sanitize_invoice_bundle.util.ts`) → encrypt → push to `hiRequest.dataPushUrl` → `health-information/notify`.

### 4.3 Encryption (ECDH / Fidelius)
`KeyMaterialService` (`data_request_transfer/key_material/`) — `USE_FIDELIUS_KEYS=true` routes key generation, encrypt and decrypt through the **Fidelius Lambda** (`LAMBDA_KEY_GENERATION_URL`); `false` uses the legacy key-material server (`KEY_MATERIAL_URL`). Production moved to Fidelius on 2026-09-11 (`93dd5f85`).

Removed: HIU subscription callbacks (`/api/v3/hiu/subscription*`) — no longer in code.

---

## 5. M4 — HPR, HFR, Register HIP, Facility QR

### 5.1 HPR onboarding (admin-driven) and the verification gate

```
Admin: Manage Users → doctor row → "HPR ID"
   POST /HPR/onboarding/start { targetDoctorID }  → { trackingId }           (hpr_onboarding_sessions, TTL 24h)
   navigate /nhpr/login?flow=professional&trackingId=…   (FE stashes it in sessionStorage['hprOnboardingTrackingId'])
        │
        ├─ REGISTER path (no HPR yet):  /nhpr/registration → … → POST /HPR/register/aadhaar/createHprid  → hprIdNumber
        └─ LOGIN path (has HPR):        /nhpr/login → POST /HPR/login/getAccountInfo                      → hprIdNumber
        │
   POST /HPR/onboarding/complete { trackingId, hprIdNumber } → { linked: true|false }   (idempotent; fires on BOTH paths)
        ▼
   storeuserregistrationdatas.linkedDoctorID = doctor ; doctorprofiles.hpr = { createdHprIdDetailsPresent:true, hprId, hprIdNumber }
        ▼
   Badge 🟢 Verified (GET /HPR/verify/status/:doctorID) ; admin banner (GET /HPR/verify/banner?hospitalId)
```

**Gate.** `HospitalPolicy.abdmEnabled` (`PATCH /admin/hospital-policy`) turns on `HprGuardService`: an unverified doctor gets `403 { code: 'HPR_NOT_VERIFIED' }` on `POST /doctor-profile/doctorBookUserSlot` and the five `POST /diagnostic/submit*Record` routes. FE: `src/services/hprGate.js` + `HPRGateModal.jsx`.

### 5.2 HPR registration wizard (ABDM-hosted Aadhaar consent — Sep 2026)

```
/nhpr/login (LoginNHPR)          POST /HPR/register/aadhaar/generateLink  → authUrl (NDHM consent page opens)
                                 POST /HPR/register/aadhaar/isAuthenticated (poll, 30/min)   ← replaces the old generateOtp
/nhpr/registration               POST …/aadhaar/verifyOtp { txnId }  (v2: no OTP in body)
                                 POST …/aadhaar/verifyMobile → verifyMobileOTP → verifyEmail
/nhpr/details                    POST …/aadhaar/createHprid  (+ savehpridform?txnID)
/nhpr/profileDetails/…           POST …/aadhaar/saveDoctorForm?hprIdNumber&type=personal|educationDetails|workDetails|preview
                                 POST /HPR/register/professional/register  → documents-list → upload-documents
/nhpr/profileDetails/professionalid   POST /HPR/login/getUserIdCard
/nhpr/profileDetails/edit        POST /HPR/professional/fetch-details → updateProfessionalDetails (drafts flushed only after success)
/nhpr/profileDetails/re-kyc      POST /HPR/reKyc/generateOtp → verifyOtp            (M4, PR #408)
/nhpr/profileDetails/changepassword   /updatePassword/* (old password | Aadhaar OTP | mobile OTP)
Role change                      POST /HPR/profile/updateRole { hprId, role }  (1→3, 2→3 only)
```

**Nurse flow (M4):** `role = nurse` uses `getNurseCouncils`, `nurse-colleges`, `nurse-affiliated-boards`, `affiliated-board`; the qualification's `college` field carries the **nursing board id** (do not normalise it through the medical-college lookup). Master lookups: `/HPR/masterAPI/*` ([API doc §5.1.5]({{ site.baseurl }}/api-website#hpr-master-data)).

The NHA session token per HPR is stored server-side and refreshed by `src/cron_service/`; the `hpr-token.util.ts` helper (added `ebdc2908`, reverted `70cd3457`, re-added in the `wasa-updates` PRs) centralises reading it.

### 5.3 HFR facility registration + Register HIP

```
/nhpr/profileDetails/healthfacility/mydashboard   GET /HFR/facility/getLinkedFacilities?hprID   (+ local drafts: /HFR/facility/localDrafts)
/nhpr/profileDetails/healthfacility/addnewfacility
   Step 1  POST /HFR/basicFacilityInformation                → { trackId }      (contact OTP: sendOtpToContact → validateOtp)
   Step 2  POST /HFR/additionalFacilityInformation?trackId
   Step 3  POST /HFR/detailedFacilityInformation?trackId     (specialities, infra, pharmacy/bloodbank/imaging cards by type)
   Step 4  POST /HFR/submitFacilityDetails?trackId           → facility IN… (storefacilityregistrationdatas) ; deleteDraft
Masters:   /HFR/getMasterTypes, getMasterData, LGDStates/LGDDistrict/LGDSubDistrict, fetchFacilityType, getOwnerSubtypes, getSpecialities, getFacilitySubtype

/nhpr/profileDetails/softwarelinkage  (FacilityCard → "Software Linkage")
   POST /HFR/getHrpBridgeDetails { facilityID, facilityName, bridgeId }   → confirm bridge  (bridge id = ABDM_SOFTWARE_BRIDGE_ID)
   POST /HFR/linkMultipleHRP { facilityId, facilityName, HRP:[{ bridgeId, hipName(≤15), active:true }] }  → servicesLinked
```
After Register HIP the facility can exchange records; only then can the admin generate its **Facility QR** (§3.3). Pending backlog: `POST /abdm/hfr/status` + `/abdm/hfr/sync` (HFR status DRAFT/COMPLETED + "Sync with HFR"), server-side master-data cache.

### 5.4 Frontend map (`Swasthx_HIP_Frontend`)

| Area | Routes / files |
|---|---|
| NHPR (HPR + HFR) | `/nhpr/*` — `src/routes/NhprRoutes.jsx`: `login`, `registration`, `accountRetrieved`, `details`, `profileDetails/{profile, professional_registry, edit, changepassword, re-kyc, softwarelinkage, healthcareprofessional[/add], healthfacility/{mydashboard, addnewfacility, addnewbulkfacility[/add], transferrequest}, professionalid, digitalcertificate, medicalCertificate[/create]}`; guards `RequireNHPRAccess`, `RequireNHPRAuth` |
| Legacy | `/hfr` (`HFRPage` + `LoginHFR`) kept for old bookmarks |
| Facility QR | `/admin/facility-qr` (`FacilityQRList`, `services/facilityQrService.js`) |
| HPR verification | `src/services/hprVerifyService.js`, `components/HPRBadge.jsx`, `HPRPendingBanner.jsx`, `HPRGateModal.jsx`, `services/hprGate.js` |
| API hooks | `src/pages/Admin/hooks/useHPRAPI.js` (+ Doctor/Pharmacy/Receptionist/SuperAdmin copies), `useFetchGlobalInfo.js` (masters), `src/services/HPRService.js`, `HFRService.js`, `hfrLocalDrafts.js` |
| Flow docs in repo | `src/pages/Admin/pages/NHPR/HPR_REGISTRATION_FLOW.md`, `HFR_REGISTRATION_FLOW.md` |

---

## 6. Data (website DB) touched by ABDM

| Collection | Milestone | What |
|---|---|---|
| `userprofiles`, `patientinfos`, `abdmtxnidstorages`, `accesstokens` | M1 | ABHA identity (number stored with dashes), txn ids, gateway/ABHA session tokens |
| `linktokens` | M2 | Link token per ABHA **address** + facility |
| `hipnotlinkedhealthrecords`, `healthrecords` | M2 | Records waiting for a token / already linked care contexts |
| `authinitdbs`, `scansharetrails`, `userprofileshares` | M2 | Scan & Share profiles, trail, share tokens |
| `doctoruserprescriptions`, `invoicefhirs` (+ `abdmPublication*` fields), `clinical_abdm_publishes` | M2 | Stored FHIR bundles and async publish state |
| `hiuconsents`, `hiuonfetches`, `hiukeys`, `hiuhealthdatafetches`, `hiutxns`, `storecarecontextstatuses`, `patientonfinds` | M3 (HIU) | Consent lifecycle, key material, received data |
| `hipconsents`, `hiptxns` | M3 (HIP) | Consents granted on our records, transfer keys / push URLs |
| `storenhprtxns`, `storeuserregistrationdatas` (+`linkedDoctorID`), `hpr_onboarding_sessions`, `doctorprofiles.hpr` | M4 (HPR) | Wizard txn state, NHA profile snapshot, onboarding tracking, verification read-model |
| `storefacilityregistrationdatas`, `facilitylocaldrafts` | M4 (HFR) | Facility wizard state, local drafts |
| `facility_qrs` | M4 (QR) | Facility QR per HFR facility — `payloadUrl` (deep link), `s3Key` (PNG), `generatedAt`; regenerate supersedes the current one |
| `hospital-policies.abdmEnabled` | M4 | Gate switch |

Full collection list: [Website Database]({{ site.baseurl }}/docs/database/website-database.html).


---

## 7. Change log (ABDM / M4, Aug–Sep 2026)

| Date | Repo | Commit / PR | Change |
|---|---|---|---|
| 2026-08-02 | BE | `765d9b90` | `PUT /completeScanShareVerification` — improved scan-and-share linking |
| 2026-08-11 | BE | `bbc3880f` | M1: communication-mobile OTP |
| 2026-08-25/26 | BE | PR #390–#398 | Lab-test ABHA address sync, `linkToken` warm at diagnostic check-in / sample collection (`docs/DIAGNOSTIC_ABDM_LINK_FIX.md`) |
| 2026-09-02 → 09-09 | BE/FE | `refactor/m4-backend` #403–#411, `refactor/m4-frontend` #246–#257 | M4: HPR/HFR wizard fixes, pharmacy flow in M4, nurse flow, re-KYC (`/HPR/reKyc/*`), `updateRole`, KYC & change-password fixes, bridge-id bug |
| 2026-09-10 | BE/FE | `9556d705`, `cd2e2091`, `e0dd45b2` | Production readiness: env-driven bridge id / CORS / TLS, `PHR_WEB_API_URL`, `VITE_ABHA_ADDRESS_SUFFIX`, NHA test facility ids |
| 2026-09-11 | BE | `93dd5f85` | Fidelius key-material server for M2 encryption |
| 2026-09-11 | BE | `694263ba`, `9501c764` | Link token requested at scan-and-share; dashless ABHA number to `generate-token` |
| 2026-09-11/14 | BE/FE | `wasa-updates` #418–#420, #268–#270 | WASA fixes, ABHA token issue while creating records, "fix sync of abdm" (profile edit drafts) |
| 2026-09-16 | BE/FE | `b7d4834c`, `c3db4bb4`, `c8164f78` | HPR/HFR flow fixes (facility step-1 validation), new register flow in reception queue |

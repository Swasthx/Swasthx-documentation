# SwasthX MongoDB Database Documentation

## Table of Contents
1. [Overview](#overview)
2. [Database Configuration](#database-configuration)
3. [Collections Overview](#collections-overview)
4. [Authentication & User Management](#authentication--user-management)
5. [PHR (Personal Health Record) Collections](#phr-personal-health-record-collections)
6. [E-commerce Collections](#e-commerce-collections)
7. [Healthcare Services Collections](#healthcare-services-collections)
8. [Document Management Collections](#document-management-collections)
9. [Notification & Communication Collections](#notification--communication-collections)
10. [ABDM Integration Collections](#abdm-integration-collections)
11. [Database Relationships](#database-relationships)
12. [Indexes & Performance](#indexes--performance)
13. [Data Migration & Backup](#data-migration--backup)
14. [Security & Access Control](#security--access-control)

## Overview

SwasthX uses MongoDB as its primary database to store healthcare-related data, user information, orders, and PHR (Personal Health Record) data. The database is designed to handle complex healthcare workflows including ABDM (Ayushman Bharat Digital Mission) integration.

**Database Name**: `testingDb` / `testingdb`
**Connection String**: `mongodb://localhost:27017/testingDb`

## Database Configuration

### Connection Settings
```javascript
// Primary Database Connection
MongooseModule.forRoot("mongodb://localhost:27017/testingDb")

// Alternative Connection (AarogyaAPI Module)
MongooseModule.forRoot('mongodb://127.0.0.1:27017/testingdb')
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/testingDb
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password
```

## Collections Overview

| Collection Category | Collections | Purpose |
|-------------------|-------------|---------|
| **Authentication** | users, appusers, sessions, generateverifyotp | User authentication and session management |
| **PHR** | userprofiles, hiuconsents, hiuhealthdata, hipconsents | Personal Health Record management |
| **E-commerce** | carts, newcarts, orders, neworders, deliveryaddresses | Shopping cart and order management |
| **Healthcare** | medicines, medicinecategories, labtests, doctorprofiles | Healthcare services and products |
| **Documents** | fhirdocuments, fhirdocumentimages, documentpoints | Health document storage |
| **Notifications** | notifications, fcmtokens | User notifications and messaging |
| **ABDM** | abdmtxnidstorage, earlyaccessdata, userautos | ABDM integration data |

## Authentication & User Management

### 1. Users Collection
**Collection Name**: `users`
**Schema**: `UserSchema`

```javascript
{
  _id: ObjectId,
  phoneNumber: String,
  EntityID: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. App Users Collection
**Collection Name**: `appusers`
**Schema**: `appUserSchema`

```javascript
{
  _id: ObjectId,
  mobnum: String,
  token: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Sessions Collection
**Collection Name**: `sessionschemas`
**Schema**: `sessionSchemaSchema`

```javascript
{
  _id: ObjectId,
  mobileNumber: String,
  sessionID: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. OTP Collection
**Collection Name**: `generateverifyotps`
**Schema**: `GenerateVerifyOtpSchema`

```javascript
{
  _id: ObjectId,
  mobileNumber: String,
  otp: String,
  expiresAt: Date,
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## PHR (Personal Health Record) Collections

### 1. User Profiles Collection
**Collection Name**: `userprofiles`
**Schema**: `UserProfileSchema`

```javascript
{
  _id: ObjectId,
  aid: String,                    // ABHA ID
  arid: String,                   // ABHA Registration ID
  email: String,
  demographicDetails: {
    mobile: String,
    profilePhoto: String,
    firstName: String,
    middleName: String,
    lastName: String,
    dob: String,
    dayOfBirth: String,
    monthOfBirth: String,
    yearOfBirth: String,
    age: Number,
    gender: String,
    pinCode: String,
    address: String,
    stateName: String,
    districtName: String,
    stateCode: String,
    districtCode: String
  },
  xToken: String,
  expiresAt: Date,
  refreshToken: String,
  mobileNumber: String,
  abhaNumber: String,
  abhaAddress: String,
  xAuthToken: String,
  abhaLogin: Boolean,
  abhaLogout: Boolean,
  xAuthRefreshToken: String,
  verified: Boolean,
  userId: String
}
```

### 2. HIU Consent Collection
**Collection Name**: `hiuconsents`
**Schema**: `HIUConsentSchema`

```javascript
{
  _id: ObjectId,
  consentId: String,
  abhaAddress: String,
  hipId: String,
  status: String,
  consentRequest: Object,
  consentResponse: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. HIU Health Data Collection
**Collection Name**: `hiuhealthdatas`
**Schema**: `HIUHealthDataSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  consentId: String,
  hipId: String,
  healthData: {
    typeOfDocument: String,
    timestamp: String,
    patientInfo: Object,
    organizationData: Object,
    conditionData: Array,
    observationData: Array,
    medicationRequestData: Array,
    practitionerData: Object,
    encounterData: Object,
    documentReferenceData: Array,
    medicalHistory: Array,
    allergyIntolerance: Array,
    familyMemberHistory: Array,
    procedure: Array,
    diagnosticReport: Array,
    carePlan: Array,
    immunization: Array,
    immunizationRecommendation: Array,
    wellnessVitalSigns: Array,
    wellnessLifestyle: Array,
    invoice: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. HIP Consent Collection
**Collection Name**: `hipconsents`
**Schema**: `HIPConsentSchema`

```javascript
{
  _id: ObjectId,
  consentId: String,
  abhaAddress: String,
  hipId: String,
  status: String,
  consentRequest: Object,
  consentResponse: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## E-commerce Collections

### 1. Cart Collection
**Collection Name**: `carts`
**Schema**: `CartSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  items: [{
    medicineId: ObjectId,         // Reference to Medicine
    quantity: Number
  }],
  prescriptionDocs: [String],     // Array of document URLs
  createdAt: Date,
  updatedAt: Date
}
```

### 2. New Cart Collection
**Collection Name**: `newcarts`
**Schema**: `NewCartSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  mobileNumber: String,
  type: String,                   // MEDICINE_ORDER, LAB_TEST, DOC_APPOINTMENT
  medicines: {
    items: [{
      medicineId: ObjectId,
      quantity: Number
    }],
    prescriptionDocs: [String]
  },
  labTest: {
    labTests: [{
      labTestId: ObjectId,
      labTestSlot: {
        startTime: String,
        endTime: String
      }
    }]
  },
  appointment: {
    doctorWebAppointmentId: String,
    status: String,
    time: String,
    duration: String,
    typeOfSlot: String,
    slot: String,
    day: String,
    doctorId: String,
    tag: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Order Collection
**Collection Name**: `orders`
**Schema**: `OrderSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  orderId: String,
  razorpayOrderId: String,
  deliveryAddressId: ObjectId,   // Reference to DeliveryAddress
  items: [{
    medicineId: ObjectId,
    name: String,
    quantity: Number,
    price: Number
  }],
  orderTotal: Number,
  orderedAt: Date,
  deliveryStatus: String,         // PENDING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  paymentDetails: {
    method: String,
    status: String,
    transactionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. New Order Collection
**Collection Name**: `neworders`
**Schema**: `NewOrderSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  type: String,                   // MEDICINE_ORDER, LAB_TEST, DOC_APPOINTMENT
  mobileNumber: String,
  orderId: String,
  razorpayOrderId: String,
  deliveryAddressId: ObjectId,    // Optional for appointments
  medicines: {
    items: [{
      medicineId: ObjectId,
      name: String,
      quantity: Number,
      price: Number
    }],
    prescriptionDocs: [String]
  },
  labTest: {
    labTests: [{
      labTestId: ObjectId,
      name: String,
      price: Number,
      slot: {
        startTime: String,
        endTime: String,
        date: String
      }
    }]
  },
  appointments: {
    doctorId: String,
    doctorName: String,
    appointmentTime: String,
    appointmentDate: String,
    price: Number
  },
  orderTotal: Number,
  orderedAt: Date,
  deliveryStatus: String,         // PENDING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, COMPLETED
  paymentDetails: {
    method: String,
    status: String,
    transactionId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Delivery Address Collection
**Collection Name**: `deliveryaddresses`
**Schema**: `DeliveryAddressSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  houseFlatBlock: String,
  apartmentRoadArea: String,
  street: String,
  pincode: String,
  addressType: String,            // Home, Work, Other
  createdAt: Date,
  updatedAt: Date
}
```

## Healthcare Services Collections

### 1. Medicine Collection
**Collection Name**: `medicines`
**Schema**: `MedicineSchema`

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  inStock: Boolean,
  composition: String,
  variants: [{
    quantity: Number,
    price: Number
  }],
  similarProducts: [String],
  productDetails: {
    description: String,
    directionForUse: String,
    storage: String,
    aboutMedicine: String,
    medicalBenefits: String
  },
  category: ObjectId,             // Reference to MedicineCategory
  image: String,
  imgGallery: [String],
  noPrescription: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Medicine Category Collection
**Collection Name**: `medicinecategories`
**Schema**: `MedicineCategorySchema`

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Lab Test Collection
**Collection Name**: `labtestcreates`
**Schema**: `LabTestCreateSchema`

```javascript
{
  _id: ObjectId,
  labName: String,
  labIcon: String,
  category: String,
  nameOfTest: String,
  sample: [String],
  numberOfTests: String,
  price: String,
  packageIncludes: [String],
  requirements: [String],
  aboutPackage: String,
  idealFor: [String]
}
```

### 4. Lab Test Slots Collection
**Collection Name**: `labtestslots`
**Schema**: `LabTestSlotsSchema`

```javascript
{
  _id: ObjectId,
  labTestId: ObjectId,            // Reference to LabTestCreate
  date: String,
  slots: [{
    startTime: String,
    endTime: String,
    available: Boolean
  }]
}
```

### 5. User Booked Lab Tests Collection
**Collection Name**: `userbooklabtests`
**Schema**: `UserBookLabTestSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  labTestId: ObjectId,            // Reference to LabTestCreate
  slot: {
    startTime: String,
    endTime: String,
    date: String
  },
  status: String,                 // BOOKED, COMPLETED, CANCELLED
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Doctor Profile Collection
**Collection Name**: `doctorprofiles`
**Schema**: `DoctorProfileSchema`

```javascript
{
  _id: ObjectId,
  username: String,
  doctorID: String,
  mobileNumber: String,
  planName: String,
  expiryOfPlan: Date,
  pinnedComment: Number,
  basicdetails: {
    name: String,
    specialization: String,
    experience: Number,
    qualification: String,
    registrationNumber: String
  },
  experience: [{
    hospital: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    description: String
  }],
  clinicdetails: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  clinicservices: [{
    service: String,
    description: String,
    price: Number
  }],
  testimonial: [{
    patientName: String,
    rating: Number,
    comment: String,
    date: String
  }],
  partners: [{
    name: String,
    type: String,
    description: String
  }],
  award: [{
    title: String,
    year: String,
    description: String
  }],
  publication: [{
    title: String,
    journal: String,
    year: String,
    url: String
  }],
  socialnetwork: [{
    platform: String,
    url: String,
    followers: Number
  }]
}
```

## Document Management Collections

### 1. FHIR Document Collection
**Collection Name**: `fhir.documents`
**Schema**: `FHIRDocSchema`

```javascript
{
  _id: ObjectId,
  resourceType: String,
  id: String,
  identifier: Object,
  description: Object,
  type: String,
  timestamp: String,
  composition: ObjectId,          // Reference to CompositionObject
  medication: [ObjectId],         // References to MedicationObject
  medicationRequest: [ObjectId],  // References to MedicationRequestObject
  encounter: ObjectId,            // Reference to EncounterObject
  patient: ObjectId,              // Reference to Patient
  practitioner: [ObjectId],       // References to PractitionerObject
  allergyIntolerance: [ObjectId], // References to AllergyIntoleranceObject
  appointment: ObjectId,          // Reference to AppointmentObject
  carePlan: ObjectId,             // Reference to CarePlanObject
  condition: [ObjectId],          // References to ConditionObject
  dignosticReport: [ObjectId],    // References to DignosticReportObject
  documentReference: [ObjectId],  // References to DocumentRerferenceObject
  immunization: [ObjectId],       // References to ImmunizationReportObject
  observation: [ObjectId],        // References to ObservationObject
  organization: [ObjectId],       // References to OrganiztionObject
  procedure: [ObjectId]           // References to ProcedureObject
}
```

### 2. FHIR Document Image Collection
**Collection Name**: `fhir.documentimages`
**Schema**: `FHIRDocImageSchema`

```javascript
{
  _id: ObjectId,
  documentId: ObjectId,           // Reference to FHIRDocument
  imageUrl: String,
  imageType: String,
  uploadedAt: Date
}
```

### 3. Document Points Collection
**Collection Name**: `fhir.documenpoints`
**Schema**: `FHIRDocPointsSchema`

```javascript
{
  _id: ObjectId,
  patientId: String,
  points: Number,
  source: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Patient Health Collection
**Collection Name**: `myhealths`
**Schema**: `myHealthSchema`

```javascript
{
  _id: ObjectId,
  patientId: String,
  date: String,
  steps: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Notification & Communication Collections

### 1. Notification Collection
**Collection Name**: `notifications`
**Schema**: `NotificationSchema`

```javascript
{
  _id: ObjectId,
  type: String,                   // INFO, WARNING, ERROR, SUCCESS
  module: String,                 // NEW_CARE_CONTEXT, PROFILE_SHARE_TOKEN, CONSENT_REQUEST, SUBSCRIPTION_REQUEST
  message: String,
  seen: Boolean,
  abhaAddress: String,
  metadata: Object,               // Additional data
  createdAt: Date,
  updatedAt: Date
}
```

### 2. FCM Token Collection
**Collection Name**: `fcmtokens`
**Schema**: `FCMTokenSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  fcmToken: String,
  deviceType: String,             // android, ios, web
  createdAt: Date,
  updatedAt: Date
}
```

## ABDM Integration Collections

### 1. ABDM Transaction ID Storage Collection
**Collection Name**: `abdmtxnidstorages`
**Schema**: `AbdmTxnIDStorageSchema`

```javascript
{
  _id: ObjectId,
  doctorId: String,
  userId: String,
  entityId: String,
  entityType: String,
  txnId: String,
  oldTxnId: String,
  status: String,
  communicationMobileNumber: String,
  abhaNumber: String,
  userToken: String,
  linkRefNumber: String,
  dateOfExpiry: String,
  dateOfConsentInit: String,
  fromDate: String,
  toDate: String,
  hiType: [String],
  patientUhid: String,
  patientName: String,
  patientIdVerified: Boolean,
  requestIdForHipInitiated: String,
  verificationForHipInitiatedStatus: String,
  patientCareContextRefNum: [{
    careContextReferenceNumber: String,
    careContextType: String
  }],
  careContexts: [{
    careContextReferenceNumber: String,
    careContextType: String,
    hipId: String
  }],
  hipId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Early Access Data Collection
**Collection Name**: `earlyaccessdatas`
**Schema**: `EarlyAccessDataSchema`

```javascript
{
  _id: ObjectId,
  clientID: String,
  mobileNumber: String,
  AbhaNumber: String
}
```

### 3. User Auto Approval Collection
**Collection Name**: `userautoapprovals`
**Schema**: `UserAutoApprovalSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  hipId: String,
  autoApproval: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. User Subscription Collection
**Collection Name**: `usersubscriptions`
**Schema**: `UserSubscriptionSchema`

```javascript
{
  _id: ObjectId,
  abhaAddress: String,
  hipId: String,
  subscriptionId: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Database Relationships

### Primary Relationships

1. **User Profile → Orders**
   - `userprofiles.abhaAddress` → `orders.abhaAddress`

2. **User Profile → Cart**
   - `userprofiles.abhaAddress` → `carts.abhaAddress`

3. **Medicine → Cart Items**
   - `medicines._id` → `carts.items.medicineId`

4. **Medicine Category → Medicine**
   - `medicinecategories._id` → `medicines.category`

5. **Lab Test → User Booked Lab Tests**
   - `labtestcreates._id` → `userbooklabtests.labTestId`

6. **Delivery Address → Orders**
   - `deliveryaddresses._id` → `orders.deliveryAddressId`

7. **User Profile → Notifications**
   - `userprofiles.abhaAddress` → `notifications.abhaAddress`

### Referential Integrity

```javascript
// Example: Medicine reference in Cart
{
  medicineId: ObjectId("507f1f77bcf86cd799439011"), // References Medicine
  quantity: 2
}

// Example: User Profile reference in Order
{
  abhaAddress: "user@abdm", // References UserProfile.abhaAddress
  orderId: "ORD123456"
}
```

## Indexes & Performance

### Recommended Indexes

```javascript
// User Profile Indexes
db.userprofiles.createIndex({ "abhaAddress": 1 }, { unique: true })
db.userprofiles.createIndex({ "mobileNumber": 1 })
db.userprofiles.createIndex({ "abhaNumber": 1 })

// Order Indexes
db.orders.createIndex({ "abhaAddress": 1 })
db.orders.createIndex({ "orderId": 1 }, { unique: true })
db.orders.createIndex({ "orderedAt": -1 })

// Cart Indexes
db.carts.createIndex({ "abhaAddress": 1 })
db.newcarts.createIndex({ "abhaAddress": 1, "type": 1 })

// Medicine Indexes
db.medicines.createIndex({ "name": "text" })
db.medicines.createIndex({ "category": 1 })
db.medicines.createIndex({ "inStock": 1 })

// Notification Indexes
db.notifications.createIndex({ "abhaAddress": 1 })
db.notifications.createIndex({ "seen": 1 })
db.notifications.createIndex({ "createdAt": -1 })

// FHIR Document Indexes
db.fhir.documents.createIndex({ "patient": 1 })
db.fhir.documents.createIndex({ "type": 1 })
db.fhir.documents.createIndex({ "timestamp": -1 })

// ABDM Transaction Indexes
db.abdmtxnidstorages.createIndex({ "txnId": 1 })
db.abdmtxnidstorages.createIndex({ "abhaNumber": 1 })
db.abdmtxnidstorages.createIndex({ "status": 1 })
```

### Performance Optimization

1. **Compound Indexes**
```javascript
// For order queries with date filtering
db.orders.createIndex({ "abhaAddress": 1, "orderedAt": -1 })

// For cart queries with type filtering
db.newcarts.createIndex({ "abhaAddress": 1, "type": 1, "createdAt": -1 })
```

2. **Text Search Indexes**
```javascript
// For medicine search
db.medicines.createIndex({ "name": "text", "description": "text" })

// For lab test search
db.labtestcreates.createIndex({ "nameOfTest": "text", "category": "text" })
```

## Data Migration & Backup

### Backup Strategy

```bash
# Daily backup
mongodump --db testingDb --out /backup/daily/$(date +%Y%m%d)

# Weekly backup
mongodump --db testingDb --out /backup/weekly/$(date +%Y%m%d)

# Monthly backup
mongodump --db testingDb --out /backup/monthly/$(date +%Y%m)
```

### Restore Strategy

```bash
# Restore from backup
mongorestore --db testingDb /backup/daily/20240101/testingDb/

# Restore specific collection
mongorestore --db testingDb --collection orders /backup/daily/20240101/testingDb/orders.bson
```

### Data Migration Scripts

```javascript
// Example: Migrate old cart structure to new cart
db.carts.find().forEach(function(cart) {
  var newCart = {
    abhaAddress: cart.abhaAddress,
    type: "MEDICINE_ORDER",
    medicines: {
      items: cart.items,
      prescriptionDocs: cart.prescriptionDocs || []
    }
  };
  db.newcarts.insert(newCart);
});
```

## Security & Access Control

### Database Access Control

```javascript
// Create read-only user
use admin
db.createUser({
  user: "readonly_user",
  pwd: "secure_password",
  roles: [
    { role: "read", db: "testingDb" }
  ]
})

// Create application user
use admin
db.createUser({
  user: "swasthx_app",
  pwd: "secure_app_password",
  roles: [
    { role: "readWrite", db: "testingDb" }
  ]
})
```

### Data Encryption

```javascript
// Enable encryption at rest
mongod --enableEncryption --encryptionKeyFile /path/to/keyfile

// Enable TLS/SSL
mongod --sslMode requireSSL --sslPEMKeyFile /path/to/cert.pem
```

### Field-Level Security

```javascript
// Example: Mask sensitive data in logs
db.userprofiles.find().forEach(function(user) {
  // Mask mobile number in logs
  var maskedMobile = user.mobileNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  print("User: " + user.abhaAddress + ", Mobile: " + maskedMobile);
});
```

## Monitoring & Maintenance

### Health Check Queries

```javascript
// Check database size
db.stats()

// Check collection sizes
db.getCollectionNames().forEach(function(collection) {
  print(collection + ": " + db.getCollection(collection).count() + " documents");
});

// Check index usage
db.orders.aggregate([
  { $indexStats: {} }
])

// Check slow queries
db.getProfilingStatus()
db.setProfilingLevel(1, 100) // Log queries slower than 100ms
```

### Maintenance Tasks

```javascript
// Compact collections
db.runCommand({ compact: "orders" })
db.runCommand({ compact: "carts" })

// Validate collections
db.orders.validate()
db.userprofiles.validate()

// Repair database
db.repairDatabase()
```

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained by**: SwasthX Development Team 
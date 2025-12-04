---
layout: default
title: MongoDB Queries
permalink: /mongodb-queries
---

# MongoDB Query Examples for SwasthX

## Table of Contents
1. [User Management Queries](#user-management-queries)
2. [Cart & Order Queries](#cart--order-queries)
3. [Medicine & Lab Test Queries](#medicine--lab-test-queries)
4. [Health Document Queries](#health-document-queries)
5. [Notification Queries](#notification-queries)
6. [ABDM Integration Queries](#abdm-integration-queries)
7. [Analytics & Reporting Queries](#analytics--reporting-queries)
8. [Data Maintenance Queries](#data-maintenance-queries)

## User Management Queries

### Find User by ABHA Address
```javascript
// Find user profile by ABHA address
db.userprofiles.findOne({ abhaAddress: "user@abdm" })

// Find user with specific fields
db.userprofiles.findOne(
  { abhaAddress: "user@abdm" },
  { demographicDetails: 1, mobileNumber: 1, verified: 1 }
)
```

### Find Users by Mobile Number
```javascript
// Find user by mobile number
db.userprofiles.findOne({ mobileNumber: "7351077069" })

// Find all users with specific mobile pattern
db.userprofiles.find({ mobileNumber: { $regex: "^735" } })
```

### Find Verified Users
```javascript
// Find all verified users
db.userprofiles.find({ verified: true })

// Count verified users
db.userprofiles.countDocuments({ verified: true })
```

### Update User Profile
```javascript
// Update user verification status
db.userprofiles.updateOne(
  { abhaAddress: "user@abdm" },
  { $set: { verified: true } }
)

// Update user demographics
db.userprofiles.updateOne(
  { abhaAddress: "user@abdm" },
  { 
    $set: { 
      "demographicDetails.firstName": "John",
      "demographicDetails.lastName": "Doe"
    } 
  }
)
```

### Find Users by Registration Date
```javascript
// Find users registered in last 30 days
db.userprofiles.find({
  createdAt: { 
    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
  }
})

// Find users registered in specific month
db.userprofiles.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lt: new Date("2024-02-01")
  }
})
```

## Cart & Order Queries

### Find User's Cart
```javascript
// Find cart by ABHA address
db.carts.findOne({ abhaAddress: "user@abdm" })

// Find new cart with specific type
db.newcarts.findOne({ 
  abhaAddress: "user@abdm", 
  type: "MEDICINE_ORDER" 
})
```

### Find Cart with Medicine Details
```javascript
// Find cart with populated medicine details
db.carts.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  { $unwind: "$items" },
  {
    $lookup: {
      from: "medicines",
      localField: "items.medicineId",
      foreignField: "_id",
      as: "medicineDetails"
    }
  },
  { $unwind: "$medicineDetails" },
  {
    $group: {
      _id: "$_id",
      abhaAddress: { $first: "$abhaAddress" },
      items: {
        $push: {
          medicineId: "$items.medicineId",
          quantity: "$items.quantity",
          medicine: "$medicineDetails"
        }
      }
    }
  }
])
```

### Find User's Orders
```javascript
// Find all orders for user
db.orders.find({ abhaAddress: "user@abdm" })

// Find orders with specific status
db.orders.find({ 
  abhaAddress: "user@abdm",
  deliveryStatus: "PENDING"
})

// Find orders in date range
db.orders.find({
  abhaAddress: "user@abdm",
  orderedAt: {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-01-31")
  }
})
```

### Find Orders with Delivery Address
```javascript
// Find orders with populated delivery address
db.orders.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  {
    $lookup: {
      from: "deliveryaddresses",
      localField: "deliveryAddressId",
      foreignField: "_id",
      as: "deliveryAddress"
    }
  },
  { $unwind: "$deliveryAddress" }
])
```

### Calculate Order Statistics
```javascript
// Calculate total order value for user
db.orders.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  {
    $group: {
      _id: null,
      totalOrders: { $sum: 1 },
      totalValue: { $sum: "$orderTotal" },
      averageOrderValue: { $avg: "$orderTotal" }
    }
  }
])

// Calculate orders by status
db.orders.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  {
    $group: {
      _id: "$deliveryStatus",
      count: { $sum: 1 },
      totalValue: { $sum: "$orderTotal" }
    }
  }
])
```

### Find Recent Orders
```javascript
// Find orders from last 7 days
db.orders.find({
  orderedAt: { 
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
  }
}).sort({ orderedAt: -1 })

// Find orders by month
db.orders.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$orderedAt" },
        month: { $month: "$orderedAt" }
      },
      count: { $sum: 1 },
      totalValue: { $sum: "$orderTotal" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])
```

## Medicine & Lab Test Queries

### Find Medicines by Category
```javascript
// Find medicines in specific category
db.medicines.find({ category: ObjectId("category_id_here") })

// Find medicines with category details
db.medicines.aggregate([
  {
    $lookup: {
      from: "medicinecategories",
      localField: "category",
      foreignField: "_id",
      as: "categoryDetails"
    }
  },
  { $unwind: "$categoryDetails" }
])
```

### Search Medicines
```javascript
// Text search for medicines
db.medicines.find({ 
  $text: { $search: "paracetamol" } 
})

// Search by name pattern
db.medicines.find({ 
  name: { $regex: "para", $options: "i" } 
})

// Find medicines in stock
db.medicines.find({ inStock: true })

// Find medicines by price range
db.medicines.find({ 
  price: { $gte: 100, $lte: 500 } 
})
```

### Find Lab Tests
```javascript
// Find lab tests by category
db.labtestcreates.find({ category: "Blood Test" })

// Find lab tests by price range
db.labtestcreates.find({ 
  price: { $gte: "500", $lte: "2000" } 
})

// Search lab tests
db.labtestcreates.find({ 
  nameOfTest: { $regex: "blood", $options: "i" } 
})
```

### Find User's Lab Test Bookings
```javascript
// Find user's lab test bookings
db.userbooklabtests.find({ abhaAddress: "user@abdm" })

// Find lab test bookings with test details
db.userbooklabtests.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  {
    $lookup: {
      from: "labtestcreates",
      localField: "labTestId",
      foreignField: "_id",
      as: "labTestDetails"
    }
  },
  { $unwind: "$labTestDetails" }
])
```

### Find Available Lab Test Slots
```javascript
// Find available slots for specific test
db.labtestslots.find({ 
  labTestId: ObjectId("lab_test_id_here"),
  "slots.available": true 
})
```

## Health Document Queries

### Find User's Health Documents
```javascript
// Find FHIR documents for user
db.fhir.documents.find({ patient: ObjectId("patient_id_here") })

// Find documents by type
db.fhir.documents.find({ 
  patient: ObjectId("patient_id_here"),
  type: "prescription" 
})

// Find documents in date range
db.fhir.documents.find({
  patient: ObjectId("patient_id_here"),
  timestamp: {
    $gte: "2024-01-01",
    $lte: "2024-01-31"
  }
})
```

### Find Documents with Patient Details
```javascript
// Find documents with patient information
db.fhir.documents.aggregate([
  { $match: { patient: ObjectId("patient_id_here") } },
  {
    $lookup: {
      from: "patients",
      localField: "patient",
      foreignField: "_id",
      as: "patientDetails"
    }
  },
  { $unwind: "$patientDetails" }
])
```

### Find Document Images
```javascript
// Find images for specific document
db.fhir.documentimages.find({ 
  documentId: ObjectId("document_id_here") 
})
```

### Find Health Points
```javascript
// Find user's health points
db.fhir.documenpoints.findOne({ patientId: "user@abdm" })

// Find users with high health points
db.fhir.documenpoints.find({ points: { $gte: 1000 } })
```

## Notification Queries

### Find User's Notifications
```javascript
// Find all notifications for user
db.notifications.find({ abhaAddress: "user@abdm" })

// Find unread notifications
db.notifications.find({ 
  abhaAddress: "user@abdm",
  seen: false 
})

// Find notifications by type
db.notifications.find({ 
  abhaAddress: "user@abdm",
  type: "INFO" 
})
```

### Find Recent Notifications
```javascript
// Find notifications from last 24 hours
db.notifications.find({
  abhaAddress: "user@abdm",
  createdAt: { 
    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
  }
}).sort({ createdAt: -1 })
```

### Mark Notifications as Seen
```javascript
// Mark specific notification as seen
db.notifications.updateOne(
  { _id: ObjectId("notification_id_here") },
  { $set: { seen: true } }
)

// Mark all user notifications as seen
db.notifications.updateMany(
  { abhaAddress: "user@abdm", seen: false },
  { $set: { seen: true } }
)
```

### Count Notifications
```javascript
// Count unread notifications
db.notifications.countDocuments({ 
  abhaAddress: "user@abdm",
  seen: false 
})

// Count notifications by type
db.notifications.aggregate([
  { $match: { abhaAddress: "user@abdm" } },
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 }
    }
  }
])
```

## ABDM Integration Queries

### Find ABDM Transactions
```javascript
// Find transactions by ABHA number
db.abdmtxnidstorages.find({ abhaNumber: "1234567890123456" })

// Find transactions by status
db.abdmtxnidstorages.find({ status: "COMPLETED" })

// Find recent transactions
db.abdmtxnidstorages.find({
  createdAt: { 
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
  }
}).sort({ createdAt: -1 })
```

### Find HIU Consents
```javascript
// Find consents for user
db.hiuconsents.find({ abhaAddress: "user@abdm" })

// Find active consents
db.hiuconsents.find({ 
  abhaAddress: "user@abdm",
  status: "ACTIVE" 
})
```

### Find HIU Health Data
```javascript
// Find health data for user
db.hiuhealthdatas.find({ abhaAddress: "user@abdm" })

// Find health data by consent
db.hiuhealthdatas.find({ 
  abhaAddress: "user@abdm",
  consentId: "consent_id_here" 
})
```

### Find User Auto Approvals
```javascript
// Find auto approval settings
db.userautoapprovals.find({ abhaAddress: "user@abdm" })

// Find users with auto approval enabled
db.userautoapprovals.find({ autoApproval: true })
```

## Analytics & Reporting Queries

### User Analytics
```javascript
// User registration trend
db.userprofiles.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } }
])

// User verification rate
db.userprofiles.aggregate([
  {
    $group: {
      _id: null,
      totalUsers: { $sum: 1 },
      verifiedUsers: { $sum: { $cond: ["$verified", 1, 0] } }
    }
  },
  {
    $project: {
      verificationRate: { 
        $multiply: [{ $divide: ["$verifiedUsers", "$totalUsers"] }, 100] 
      }
    }
  }
])
```

### Order Analytics
```javascript
// Daily order statistics
db.orders.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$orderedAt" },
        month: { $month: "$orderedAt" },
        day: { $dayOfMonth: "$orderedAt" }
      },
      orderCount: { $sum: 1 },
      totalRevenue: { $sum: "$orderTotal" },
      averageOrderValue: { $avg: "$orderTotal" }
    }
  },
  { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } }
])

// Order status distribution
db.orders.aggregate([
  {
    $group: {
      _id: "$deliveryStatus",
      count: { $sum: 1 },
      totalValue: { $sum: "$orderTotal" }
    }
  }
])

// Top customers by order value
db.orders.aggregate([
  {
    $group: {
      _id: "$abhaAddress",
      totalOrders: { $sum: 1 },
      totalValue: { $sum: "$orderTotal" },
      averageOrderValue: { $avg: "$orderTotal" }
    }
  },
  { $sort: { totalValue: -1 } },
  { $limit: 10 }
])
```

### Medicine Analytics
```javascript
// Most ordered medicines
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.medicineId",
      totalQuantity: { $sum: "$items.quantity" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "medicines",
      localField: "_id",
      foreignField: "_id",
      as: "medicineDetails"
    }
  },
  { $unwind: "$medicineDetails" },
  { $sort: { totalQuantity: -1 } },
  { $limit: 10 }
])

// Category-wise medicine sales
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "medicines",
      localField: "items.medicineId",
      foreignField: "_id",
      as: "medicineDetails"
    }
  },
  { $unwind: "$medicineDetails" },
  {
    $lookup: {
      from: "medicinecategories",
      localField: "medicineDetails.category",
      foreignField: "_id",
      as: "categoryDetails"
    }
  },
  { $unwind: "$categoryDetails" },
  {
    $group: {
      _id: "$categoryDetails.name",
      totalQuantity: { $sum: "$items.quantity" },
      totalValue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },
  { $sort: { totalValue: -1 } }
])
```

## Data Maintenance Queries

### Clean Up Old Data
```javascript
// Remove old sessions (older than 30 days)
db.sessionschemas.deleteMany({
  createdAt: { 
    $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
  }
})

// Remove old OTP records (older than 1 day)
db.generateverifyotps.deleteMany({
  createdAt: { 
    $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) 
  }
})

// Remove old notifications (older than 90 days)
db.notifications.deleteMany({
  createdAt: { 
    $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) 
  }
})
```

### Data Validation
```javascript
// Find orders without delivery address
db.orders.find({ deliveryAddressId: { $exists: false } })

// Find users without ABHA address
db.userprofiles.find({ abhaAddress: { $exists: false } })

// Find medicines without category
db.medicines.find({ category: { $exists: false } })

// Find duplicate ABHA addresses
db.userprofiles.aggregate([
  {
    $group: {
      _id: "$abhaAddress",
      count: { $sum: 1 }
    }
  },
  { $match: { count: { $gt: 1 } } }
])
```

### Performance Optimization
```javascript
// Create indexes for better performance
db.userprofiles.createIndex({ "abhaAddress": 1 }, { unique: true })
db.orders.createIndex({ "abhaAddress": 1, "orderedAt": -1 })
db.medicines.createIndex({ "name": "text" })
db.notifications.createIndex({ "abhaAddress": 1, "seen": 1 })

// Analyze query performance
db.orders.find({ abhaAddress: "user@abdm" }).explain("executionStats")
```

### Backup and Restore
```javascript
// Export specific collections
// mongodump --db testingDb --collection userprofiles --out /backup/

// Import collections
// mongorestore --db testingDb --collection userprofiles /backup/testingDb/userprofiles.bson

// Export data in JSON format
// mongoexport --db testingDb --collection userprofiles --out userprofiles.json
```

---

**Note**: Replace placeholder values like `"user@abdm"`, `ObjectId("id_here")`, etc. with actual values from your database.

**Security**: Always use proper authentication and authorization when running these queries in production environments. 
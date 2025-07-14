# MongoDB Best Practices & Guidelines

> **📚 Related Documentation**: 
> - [Complete MongoDB Documentation]({{ site.baseurl }}/mongodb-documentation/) - Comprehensive database schema and collections
> - [MongoDB Query Examples]({{ site.baseurl }}/mongodb-queries/) - Practical query examples for all operations
> - [MongoDB Schema JSON]({{ site.baseurl }}/mongodb-schema.json) - Machine-readable schema definition

## Table of Contents
1. [Database Design](#database-design)
2. [Schema Design](#schema-design)
3. [Indexing Strategy](#indexing-strategy)
4. [Performance Optimization](#performance-optimization)
5. [Mongoose Best Practices](#mongoose-best-practices)
6. [Transactions](#transactions)
7. [Data Migration](#data-migration)
8. [Backup & Recovery](#backup--recovery)
9. [Security](#security)
10. [Monitoring & Maintenance](#monitoring--maintenance)

## Database Design

### Naming Conventions
- **Databases**: Use lowercase with hyphens (e.g., `swasthx-prod`, `swasthx-staging`)
- **Collections**: Use lowercase plural nouns (e.g., `users`, `appointments`)
- **Fields**: Use `camelCase` (e.g., `firstName`, `dateOfBirth`)
- **ID Fields**: Use `_id` as the primary key

### Environment Separation
- Use separate databases for development, staging, and production
- Use environment variables for connection strings

## Schema Design

### Document Structure
- **Embedding vs. Referencing**:
  - **Embed** when:
    - Data is frequently accessed together
    - Data has a one-to-one or one-to-few relationship
    - Embedded data changes infrequently
  - **Reference** when:
    - Data is frequently accessed separately
    - Data has a one-to-many or many-to-many relationship
    - Referenced data changes frequently

### Example Schema
```typescript
// User Schema
const userSchema = new Schema({
  // Required fields
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { 
    type: String, 
    required: true,
    select: false 
  },
  
  // Personal info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  
  // Address (embedded document)
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  
  // Roles and permissions
  roles: [{ 
    type: String, 
    enum: ['patient', 'doctor', 'admin'],
    default: ['patient'] 
  }],
  
  // Status
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  
  // Timestamps
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'address.city': 1 });
userSchema.index({ 'address.state': 1 });
```

## Indexing Strategy

### When to Create Indexes
- Fields frequently used in queries
- Fields used in sorting
- Fields used in $lookup operations
- Fields with high selectivity

### Index Types
1. **Single Field**: `{ field: 1 }` (ascending) or `{ field: -1 }` (descending)
2. **Compound**: `{ field1: 1, field2: -1 }`
3. **Multikey**: For arrays `{ tags: 1 }`
4. **Text**: For text search `{ description: "text" }`
5. **Hashed**: For sharding `{ _id: "hashed" }`

### Index Creation Example
```javascript
// Create indexes on application startup
async function createIndexes() {
  await User.createIndexes([
    { email: 1 },
    { 'address.city': 1 },
    { 'address.state': 1 },
    { createdAt: -1 }
  ]);
}
```

## Performance Optimization

### Query Optimization
1. **Use Projection** to return only necessary fields
   ```javascript
   // Good
   User.find({}, 'firstName lastName email');
   
   // Bad
   User.find({});
   ```

2. **Use `lean()`** for read-only operations
   ```javascript
   // Faster, returns plain JavaScript objects
   const users = await User.find({}).lean();
   ```

3. **Use `select()`** to explicitly include/exclude fields
   ```javascript
   // Include only these fields
   User.find().select('name email');
   
   // Exclude password field
   User.find().select('-password');
   ```

4. **Use `limit()` and `skip()`** for pagination
   ```javascript
   const page = 1;
   const limit = 10;
   const users = await User.find()
     .skip((page - 1) * limit)
     .limit(limit);
   ```

### Aggregation Pipeline
```javascript
const stats = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
    _id: '$customerId',
    totalSpent: { $sum: '$amount' },
    orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);
```

## Mongoose Best Practices

### Middleware
```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
```

### Query Middleware
```javascript
// Add soft delete
userSchema.pre('find', function() {
  this.where({ isDeleted: { $ne: true } });
});

userSchema.pre('findOne', function() {
  this.where({ isDeleted: { $ne: true } });
});
```

### Static and Instance Methods
```javascript
// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

## Transactions

### Basic Transaction
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const order = new Order({ items, total });
  await order.save({ session });
  
  await User.findByIdAndUpdate(
    userId,
    { $push: { orders: order._id } },
    { session }
  );
  
  await session.commitTransaction();
  return order;
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Data Migration

### Migration Script Example
```javascript
// migrations/update-user-roles.js
const mongoose = require('mongoose');
const { User } = require('../models');

async function migrateUserRoles() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const result = await User.updateMany(
    { role: 'user' },
    { $set: { roles: ['patient'] } }
  );
  
  console.log(`Updated ${result.nModified} users`);
  await mongoose.disconnect();
}

migrateUserRoles().catch(console.error);
```

## Backup & Recovery

### MongoDB Dump
```bash
# Create backup
mongodump --uri="mongodb://username:password@localhost:27017/dbname" --out=/backup/path

# Restore from backup
mongorestore --uri="mongodb://username:password@localhost:27017/dbname" /backup/path/dbname
```

### Automated Backups
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * /usr/bin/mongodump --uri="mongodb://username:password@localhost:27017/dbname" --out=/backup/`date +\%Y-\%m-\%d`
```

## Security

### Connection Security
```javascript
// Secure MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  ssl: process.env.NODE_ENV === 'production',
  auth: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD
  },
  authSource: 'admin'
});
```

### Security Best Practices
1. Enable authentication
2. Use TLS/SSL for connections
3. Implement field-level encryption for sensitive data
4. Use role-based access control (RBAC)
5. Regularly update MongoDB
6. Disable unused features (e.g., REST API, HTTP interface)

## Monitoring & Maintenance

### MongoDB Atlas Metrics
- Query performance
- Connection statistics
- Operation execution times
- Storage usage

### Performance Monitoring
```javascript
// Log slow queries
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query));
});

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

### Maintenance Tasks
1. **Compact Collections**
   ```javascript
   db.runCommand({ compact: 'collectionName' });
   ```

2. **Reindex Collections**
   ```javascript
   db.collection.reIndex();
   ```

3. **Update Statistics**
   ```javascript
   db.collection.stats();
   ```

## Common Issues & Solutions

### Connection Pooling
```javascript
// Configure connection pool
mongoose.connect(process.env.MONGODB_URI, {
  poolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
});
```

### Handling Large Datasets
- Use cursor for large result sets
- Implement server-side pagination
- Use projection to limit returned fields
- Consider read preferences for read-heavy operations

### Text Search
```javascript
// Create text index
db.collection.createIndex({ title: 'text', description: 'text' });

// Text search query
db.collection.find({ 
  $text: { $search: "search term" } 
}).sort({ score: { $meta: "textScore" } });
```

## Recommended Tools

1. **MongoDB Compass** - GUI for MongoDB
2. **MongoDB Atlas** - Cloud database service
3. **MongoDB Charts** - Data visualization
4. **MongoDB Database Tools** (mongodump, mongorestore, etc.)
5. **MongoDB Ops Manager** - For on-premise monitoring

## Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Blog](https://www.mongodb.com/blog)

---
layout: default
title: Postman Collection Guide
permalink: /postman-collection-guide
parent: API & Integration
---

# 📦 Postman Collection Guide

This guide details how to use the Swasthx Postman collections for robust API testing and integration.

---

## 📂 Collection Structure

We have categorized our APIs into two main collections based on the client application: **PHR App** and **Website (HMIS)**.

### 1. PHR App Collection
Focused on patient-facing features (Mobile App).

<div class="collection-overview">
  <div class="category-card">
    <div class="category-icon"><i class="fas fa-pills"></i></div>
    <div class="category-content">
      <h3>1mg</h3>
      <p>APIs related to <strong>Medicine</strong> and <strong>Lab Test</strong> orders.</p>
      <ul>
        <li>Search Medicines/Tests</li>
        <li>Check Inventory</li>
        <li>Get Test Slots</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-network-wired"></i></div>
    <div class="category-content">
      <h3>ABDM</h3>
      <p>Core ABDM integration flows.</p>
      <ul>
        <li>Access Tokens</li>
        <li>Callback Registrations</li>
        <li>ABDM Bridge APIs</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-file-medical-alt"></i></div>
    <div class="category-content">
      <h3>PHR Collection</h3>
      <p>Central folder for Patient Health Record features.</p>
      <ul>
        <li><strong>Swasthx PHR</strong>: Core Swasthx profile and health data APIs.</li>
        <li><strong>ABDM Docs</strong>: PHR APIs specifically for ABDM documentation standards.</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-shopping-cart"></i></div>
    <div class="category-content">
      <h3>Provider Cart</h3>
      <p>APIs related to the <strong>User Cart</strong> operations.</p>
      <ul>
        <li>Add/Remove Items</li>
        <li>View Cart</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-box-open"></i></div>
    <div class="category-content">
      <h3>Provider Order</h3>
      <p>APIs related to <strong>User Orders</strong>.</p>
      <ul>
        <li>Place Order</li>
        <li>Track Order Status</li>
        <li>Order History</li>
      </ul>
    </div>
  </div>
</div>

---

### 2. Website (HMIS) Collection
Focused on provider and web portal features.

<div class="collection-overview">
  <div class="category-card">
    <div class="category-icon"><i class="fas fa-lock"></i></div>
    <div class="category-content">
      <h3>Auth</h3>
      <p>Authentication flows specific to the Web/HMIS portal.</p>
      <ul>
        <li>Login/Logout</li>
        <li>Token Management</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-project-diagram"></i></div>
    <div class="category-content">
      <h3>ABDM M1</h3>
      <p>Milestone 1 APIs for ABDM integration.</p>
      <ul>
        <li>Discovery & Linking</li>
        <li>User Auth Init</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-project-diagram"></i></div>
    <div class="category-content">
      <h3>ABDM M2 & M3</h3>
      <p>Milestone 2 & 3 APIs for ABDM integration.</p>
      <ul>
        <li>Consent Management</li>
        <li>Data Transfer</li>
      </ul>
    </div>
  </div>

  <div class="category-card">
    <div class="category-icon"><i class="fas fa-id-card-alt"></i></div>
    <div class="category-content">
      <h3>HPR</h3>
      <p>Healthcare Professional Registry integration.</p>
      <ul>
        <li>Doctor Registration</li>
        <li>Professional Verification</li>
      </ul>
    </div>
  </div>
</div>

---

## 🔧 Troubleshooting & Support

- **Missing variables?** Check your Environment configuration.
- **401 Errors?** Refresh your Auth Token using the Login API in the `Auth` folder.
- **Support**: Reach out to the backend team if a response body doesn't match the documentation.

<style>
.collection-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #3b82f6;
}

.category-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.category-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.2rem;
}

.category-content p {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.category-content ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #475569;
  font-size: 0.9rem;
}

.category-content li {
  margin-bottom: 0.4rem;
}
</style> 
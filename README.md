# Nearo — Visibility Platform Backend & API Layer

Nearo is an automated full-stack search engine visibility and marketing autopilot platform designed specifically for Indian small retailers, organic grocers, local pharmacies, and boutique brands. 

This repository contains the complete production-ready backend API layout, Firestore security settings, historical telemetry analytics, background trigger jobs via Cloud Functions, and the client-side API interaction hooks.

---

## 🏗️ Full-Stack System Architecture

```
                  ┌─────────────────────────────────────┐
                  │          React 19 Frontend          │
                  │  (Pages: Home, Pricing, Dashboard)  │
                  └──────────┬──────────────┬───────────┘
                             │              │
                             │ REST API     │ Firestore SDK
                             │ Callouts     │ (Real-Time listeners `onSnapshot`)
                             ▼              ▼
       ┌───────────────────────────┐  ┌───────────────────────────┐
       │   Express Backend API     │  │  Firebase Firestore DB    │
       │   (hosted in `server.ts`) │  │  (waitlist, stores, posts,│
       └─────────────┬─────────────┘  │   analytics, pricing_cfgs)│
                     │                └─────────────▲─────────────┘
                     │ Gemini AI calls              │
                     ▼ (gemini-3.5-flash)           │ Triggers & Crons
       ┌───────────────────────────┐                │ (Firestore / PubSub)
       │  Google Gemini AI Engine  │  ┌─────────────┴─────────────┐
       │ (30-day post formulations)│  │  Firebase Cloud Functions  │
       └───────────────────────────┘  │  (scheduled, onWrite, etc)│
                                      └───────────────────────────┘
```

---

## 🌟 Primary Backend Features & Endpoints

### 1. HTTP REST RESTful Services (`server.ts`)
The server runs co-located with our Vite assets on port `3000` under development and bundles into a lightweight Node.js common-js file under `dist/server.cjs` for production deployments.

* **`GET /api/status/health`**
  * **Access:** Public
  * **Payload:** None
  * **Response:** Returns state checks of all active crawlers (Google Maps, Search, etc.).

* **`POST /api/waitlist`**
  * **Access:** Public
  * **Request Body:** `{ store_name, owner_name, email, phone, city, store_type }`
  * **Response:** Persists the waitlist applicant in Firestore with a strict validation schema and marks status as `pending`.

* **`POST /api/stores`**
  * **Access:** Authenticated Owner
  * **Request Body:** `{ storeName, address, location, products, userId, platforms_active }`
  * **Response:** Registers or syncs physical shop identity coordinates across directories.

* **`GET /api/stores/:storeId/analytics`**
  * **Access:** Authenticated Owner
  * **Query:** Unlocks daily historical telemetry metrics (Impressions, clicks, calls, directions queries). If no collection exists yet, it seamlessly feeds a simulated 7-day initial dataset to prevent empty charts.

* **`POST /api/pricing/calculate`**
  * **Access:** Public
  * **Request Body:** `{ location, crowdDensity, productType, platforms }`
  * **Response:** Generates custom Indian localized pricing matrices using our dynamic margin metrics.

* **`POST /api/posts/generate`**
  * **Access:** Authenticated Owner
  * **Request Body:** `{ storeId, storeName, category, products, tone }`
  * **Response:** Uses the Google Gemini (`gemini-3.5-flash`) pipeline to compose highly contextual social/directory posts for Google Maps, Instagram, and WhatsApp Business. Integrates a robust offline fallback if the API key is not supplied.

* **`POST /api/posts/schedule`**
  * **Access:** Authenticated Owner
  * **Request Body:** `{ storeId, posts }`
  * **Response:** Writes a batch of generated schedules into the `/posts` collection.

---

### 2. Firestore Access Protection (`firestore.rules`)
Lock-tight, zero-trust Attribute-Based Access Control enforcing strict type validations, size gates, and identity verification:
* **`waitlist`**: Anybody can submit, only administrators can query and alter candidate onboarding lifecycles.
* **`stores`**: Standard clients can only read and write their own matching business documents (`userId == request.auth.uid`). Restricts altering system-controlled parameters (like `visibility_score`) using `.affectedKeys().hasOnly()`.
* **`posts`**: Authenticated store owners can curate their schedules, but updates to posted dates or performance indexes are restricted.
* **`analytics`**: Viewable only by the store owner. Insulated from client-side creations to avoid data poisoning. Modifiable only by Cloud Functions.
* **`pricing_configs`**: Public read access to support the fee estimator, but writes are unauthorized except to admins.

---

### 3. Background Cloud Triggers (`functions/index.js`)
Four automated background routines to demonstrate robust scalable telemetry:
1. **`schedulePost`** (`onCreate posts/{postId}`): Validates and logs newly queued marketing drafts from the client.
2. **`publishPost`** (Scheduled every 15 minutes): Polls due posts, simulates directory publication, and injects performance tracking analytics.
3. **`aggregateAnalytics`** (Scheduled daily at 11:59 PM): Aggregates total metrics per client store and outputs structured day records.
4. **`calculateVisibilityScore`** (`onUpdate stores/{storeId}`): Computes a 0–100 visibility index based on platform connectivity shifts and catalog completeness.

---

## 🛠️ Local Sandbox & Deployment Instructions

### Local Execution Setup
1. **Repository Setup & Package Assembly**:
   ```bash
   npm install
   ```
2. **Setup Secrets (`.env`)**:
   Create a local copy of `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API subscription key:
   ```env
   GEMINI_API_KEY="YOUR_API_KEY_HERE"
   ```
3. **Engage Development Hot Reloading**:
   ```bash
   npm run dev
   ```
   The backend Express layer is now actively proxying routes under port `3000`.

---

### Cloud Deployment Step-by-Step

#### Step 1: Set up the Firebase Console Project
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Create a new project named `Nearo` (activate Spark/Free Tier parameters).
3. Access **Build > Firestore Database** and click **Create Database**. Set rules to start in Test Mode.
4. Enable **Build > Authentication** and activate the Google Login provider and Email/Password credentials.

#### Step 2: Push Configurations and Firestore Structures
1. Install the Firebase Command Line Interface:
   ```bash
   npm install -g firebase-tools
   ```
2. Log into your command line context:
   ```bash
   firebase login
   ```
3. Connect your project directory workspace:
   ```bash
   firebase use --add <your-project-id>
   ```
4. Deploy the Firestore Indexes (`firestore.indexes.json`):
   ```bash
   firebase deploy --only firestore:indexes
   ```
5. Push the Zero-Trust Firebase rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

#### Step 3: Deploy background Cloud Functions
1. Configure credentials on the Cloud Functions container (API tokens for platform integrations if any):
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY=your_key_here
   ```
2. Push functions to Cloud Run Infrastructure:
   ```bash
   firebase deploy --only functions
   ```

---

## 🧪 Free Tier Limits Optimization
Designed strictly to fit into the Google Firebase Spark Free tier pipeline:
* **Cloud Firestore**: 50,000 read ops/day, 20,000 write ops/day, 1GB data storage.
* **Cloud Functions**: 125,000 container invocations/month (staggered and scheduled checkouts).
* **Firebase Auth**: 10,000 free monthly active logins.

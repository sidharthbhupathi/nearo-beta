# Nearo Beta Runbook

Operational guide for an honest beta at **https://nearo-beta.onrender.com**.

---

## Before every deploy

```bash
cd "/Users/siddu/Downloads/nearo 2"
npm run build
npm run lint
npm run smoke:test          # against production URL
```

---

## One-time production setup

### 1. Render environment

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |

### 2. Firebase Authentication

1. [Firebase Console](https://console.firebase.google.com) → project **nearo--visibility**
2. **Authentication → Sign-in method** → enable **Google** and **Email/Password**
3. **Authentication → Settings → Authorized domains** → add:
   ```
   nearo-beta.onrender.com
   ```

### 3. Firestore rules

```bash
npx firebase deploy --only firestore:rules
```

### 4. Push and deploy

```bash
git add -A && git commit -m "Beta: honest copy, merchant gate, runbook"
git push origin main
```

Render auto-deploys from `main`. First request after idle may take ~60s (free tier cold start).

---

## Smoke test checklist

Run automated checks:

```bash
npm run smoke:test
# or local prod:
npm run build && NODE_ENV=production npm start
# in another terminal:
npm run smoke:test -- http://localhost:3000
```

| # | Check | How |
|---|--------|-----|
| 1 | Homepage | Cream/gold UI, no "4.9/5 Rating" in hero trust bar |
| 2 | Assets | JS + CSS return 200 |
| 3 | Health API | `curl https://nearo-beta.onrender.com/api/status/health` |
| 4 | Waitlist | Submit form → doc in Firestore `waitlist` with `status: pending` |
| 5 | Demo dashboard | Logged out → Dashboard shows sample data + "Demo Preview" |
| 6 | Blocked login | Random Google account → Dashboard shows pending gate |
| 7 | Admin login | `sidharthbhupathi72@gmail.com` → full dashboard (admin bypass) |

---

## Onboard your first merchant (step by step)

### Phase 1 — Application (merchant)

1. Merchant visits **Join Waitlist** and submits:
   - Store name, owner name, email, phone, city, store type
2. In **Firestore → waitlist**, confirm a new doc with `status: "pending"`.

### Phase 2 — You review (admin)

1. Call/WhatsApp the merchant within 24 hours.
2. Confirm: real shop, Bengaluru service area, willing to do in-person visit.
3. In Firestore, update the waitlist doc:
   ```
   status: "approved"   (or "contacted" while scheduling)
   ```

### Phase 3 — Merchant signs in

1. Merchant uses **Merchant Login** with Google (same email as waitlist).
2. They should see **"Dashboard unlocks after verification"** (pending gate).
3. Copy their **Firebase Auth UID**:
   - Firebase Console → Authentication → Users → click user → copy **User UID**

### Phase 4 — Create merchant account (admin, Firebase Console)

1. Firestore → **Start collection** (if new): `merchant_accounts`
2. Document ID = **merchant's Firebase Auth UID**
3. Fields:

| Field | Type | Example |
|-------|------|---------|
| `userId` | string | same as document ID |
| `email` | string | `merchant@example.com` |
| `storeName` | string | `Prasad Organics` |
| `phone` | string | `9876543210` |
| `city` | string | `Bengaluru` |
| `kybStatus` | string | `approved` |
| `waitlistId` | string | (optional) waitlist doc ID |
| `approvedAt` | string | `2026-06-23T12:00:00.000Z` |

4. Merchant refreshes Dashboard → sees **"Your shop is approved — visit pending"**.

### Phase 5 — In-person KYB visit

At the shop:

- [ ] Verify signage and physical address
- [ ] Photo of storefront (keep for your records)
- [ ] Collect catalog keywords / top products
- [ ] Note Google Maps link if they have one
- [ ] Explain WhatsApp update workflow

### Phase 6 — Activate live dashboard (admin)

After the visit, update `merchant_accounts/{uid}`:

```
kybStatus: "verified"
verifiedAt: "<ISO timestamp>"
```

On next Dashboard load:

- Firestore `stores/{uid}` is auto-created
- Badge shows **KYB Verified Outpost**
- Platform toggles sync live

### Phase 7 — Update public numbers

In `src/lib/beta.ts`:

```ts
export const MERCHANTS_ONBOARDED = 1;
```

Commit, push, redeploy. Stats and hero copy update automatically.

---

## Merchant status reference

| `kybStatus` | Merchant sees | Store created |
|-------------|---------------|---------------|
| *(no doc)* | Pending gate | No |
| `pending` | Pending gate | No |
| `approved` | Approved, visit pending | No |
| `verified` | Full live dashboard | Yes |

**Admin email** (`sidharthbhupathi72@gmail.com`) bypasses all gates for testing.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Plain "Not Found" on first load | Wait 60s, hard refresh (Render cold start) |
| Google sign-in fails | Add domain to Firebase authorized domains |
| Firestore permission denied | Deploy rules: `npx firebase deploy --only firestore:rules` |
| AI posts fail | Set `GEMINI_API_KEY` on Render |
| Merchant stuck on pending after verify | Confirm `merchant_accounts` doc ID = Auth UID and `kybStatus` is `verified` |

---

## Local dev vs production

| Feature | Local (`npm run dev`) | Production |
|---------|----------------------|------------|
| Instant Demo login | Yes | Hidden |
| Self-register shop | Yes | Hidden |
| Auto-register on failed login | Yes | Blocked |
| Dashboard demo (logged out) | Sample data | Sample data |
| Unverified login | Pending gate | Pending gate |

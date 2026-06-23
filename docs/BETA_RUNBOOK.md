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

### Using the in-app Admin page (recommended)

1. Sign in as **sidharthbhupathi72@gmail.com** on the live site.
2. Open **Admin** in the navbar (only visible to you).
3. Click **Refresh** to load waitlist entries (one read per entry — quota-friendly).
4. For each applicant: **Mark contacted** → call/WhatsApp them.
5. Ask merchant to **Merchant Login** with Google (same email as waitlist).
6. Firebase Console → **Authentication → Users** → copy their **UID**.
7. In Admin: click the waitlist row → paste UID → **Approve + create merchant_accounts doc**.
8. After in-person visit: **Verify after visit** on that merchant row.
9. Set `MERCHANTS_ONBOARDED = 1` in `src/lib/beta.ts` and redeploy.

### Manual Firebase Console path (alternative)

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

---

## Staying within Firebase free quota (Spark plan)

Nearo uses **Firestore** and **Authentication**. Render hosting is separate — it does not count against Firebase.

### Spark plan daily limits (check [Firebase usage](https://console.firebase.google.com/project/_/usage) for live numbers)

| Resource | Free tier (typical) | Your beta usage |
|----------|---------------------|-----------------|
| Firestore reads | ~50,000 / day | Dashboard listeners, admin refresh |
| Firestore writes | ~20,000 / day | Waitlist, merchant_accounts, store sync |
| Firestore deletes | ~20,000 / day | Rare |
| Storage | ~1 GiB | Tiny at beta scale |
| Auth sign-ins | Generous on Spark | Per merchant login |

### What costs reads (and how to minimize)

| Action | Reads (approx.) | Tip |
|--------|-----------------|-----|
| Admin **Refresh** | 1 per waitlist doc + 1 per merchant_accounts doc | Open Admin only when reviewing; don't auto-refresh |
| Dashboard **live sync** (`onSnapshot`) | 1 initial + 1 per change per listener | 2 listeners (store + analytics) while page is open |
| Merchant opens Dashboard | ~2–10 on load | Normal for 1–2 merchants |
| Waitlist form submit | 1 write | Negligible |
| Homepage visitor (no login) | **0** Firestore | Marketing pages don't touch Firestore |

### Rules of thumb for beta (0–10 merchants)

1. **Don't leave Dashboard open overnight** — each tab with live sync holds listeners.
2. **Use Admin → Refresh** instead of real-time waitlist listeners (already built this way).
3. **Avoid polling** — never `setInterval` Firestore fetches.
4. **One store doc per merchant** (`stores/{uid}`) — don't duplicate data.
5. **Check usage weekly**: Firebase Console → **Build → Firestore → Usage**.
6. **Set a budget alert** if you ever switch to Blaze (pay-as-you-go): Google Cloud Console → Billing → Budgets.

### Rough daily estimate (2 merchants + you testing)

| Activity | Reads/day |
|----------|-----------|
| You test dashboard 30 min | ~50–200 |
| 2 merchants check dashboard 10 min each | ~40–100 |
| Admin refresh 5× with 10 waitlist rows | ~50 |
| **Total** | **~200–400** — well under 50K |

You would need **hundreds of active dashboard sessions** or a bug that polls Firestore to hit the free cap at beta scale.

### If you approach the limit

- Temporarily disable `onSnapshot` on Dashboard (switch to manual refresh for merchants).
- Upgrade to **Blaze** (still free until you exceed Spark quotas; pay only for overage).
- Add Firebase **App Check** before any public launch to block abuse bots.

### Authentication

Google sign-in on Spark is fine for beta. No per-sign-in charge on the free tier for normal volumes.

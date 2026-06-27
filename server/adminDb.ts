import type { Firestore } from "firebase-admin/firestore";
import { getAdminFirestore, getAdminAuth } from "./firebaseAdmin";

export async function deleteMerchantCompletely(userId: string): Promise<{
  deleted: Record<string, number>;
}> {
  const db = getAdminFirestore();
  const deleted: Record<string, number> = {
    stores: 0,
    analytics: 0,
    posts: 0,
    merchant_preferences: 0,
    auth: 0,
  };

  const analyticsSnap = await db.collection("analytics").where("storeId", "==", userId).get();
  for (const docSnap of analyticsSnap.docs) {
    await docSnap.ref.delete();
    deleted.analytics++;
  }

  const postsSnap = await db.collection("posts").where("storeId", "==", userId).get();
  for (const docSnap of postsSnap.docs) {
    await docSnap.ref.delete();
    deleted.posts++;
  }

  const prefsRef = db.collection("merchant_preferences").doc(userId);
  const prefsSnap = await prefsRef.get();
  if (prefsSnap.exists) {
    await prefsRef.delete();
    deleted.merchant_preferences++;
  }

  const storeRef = db.collection("stores").doc(userId);
  const storeSnap = await storeRef.get();
  if (storeSnap.exists) {
    await storeRef.delete();
    deleted.stores++;
  }

  try {
    await getAdminAuth().deleteUser(userId);
    deleted.auth = 1;
  } catch {
    // Auth user may not exist or already removed
  }

  return { deleted };
}

export async function listCollection(db: Firestore, name: string, limit = 200) {
  const snap = await db.collection(name).limit(limit).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAdminStats(db: Firestore) {
  const [waitlist, stores, posts, analytics, prefs] = await Promise.all([
    db.collection("waitlist").get(),
    db.collection("stores").get(),
    db.collection("posts").get(),
    db.collection("analytics").get(),
    db.collection("merchant_preferences").get(),
  ]);

  const waitlistEntries = waitlist.docs.map((d) => d.data());
  const pending = waitlistEntries.filter((e) => e.status === "pending").length;
  const approved = waitlistEntries.filter((e) => e.status === "approved").length;

  let config = { merchants_onboarded: 0, founding_spots: 100, launch_city: "Bengaluru" };
  const configSnap = await db.collection("app_config").doc("beta").get();
  if (configSnap.exists) {
    config = { ...config, ...configSnap.data() } as typeof config;
  }

  return {
    waitlistPending: pending,
    waitlistApproved: approved,
    waitlistTotal: waitlist.size,
    storesCount: stores.size,
    postsCount: posts.size,
    analyticsCount: analytics.size,
    preferencesCount: prefs.size,
    betaConfig: config,
  };
}

export async function updateBetaConfig(
  db: Firestore,
  patch: { merchants_onboarded?: number; founding_spots?: number; launch_city?: string }
) {
  const ref = db.collection("app_config").doc("beta");
  await ref.set(patch, { merge: true });
  const snap = await ref.get();
  return snap.data();
}

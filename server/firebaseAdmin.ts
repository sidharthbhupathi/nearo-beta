import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminDb: Firestore | null = null;

export function hasFirebaseAdmin(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function ensureAdminApp(): void {
  if (getApps().length > 0) return;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not set. Add your Firebase service account JSON in Render Environment."
    );
  }

  const serviceAccount = JSON.parse(raw) as ServiceAccount;
  initializeApp({ credential: cert(serviceAccount) });
}

export function getAdminFirestore(): Firestore {
  if (adminDb) return adminDb;
  ensureAdminApp();
  adminDb = getFirestore();
  return adminDb;
}

export function getAdminAuth(): Auth {
  ensureAdminApp();
  return getAuth();
}

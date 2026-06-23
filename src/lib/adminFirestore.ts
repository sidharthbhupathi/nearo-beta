import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { KybStatus, MerchantAccount, WaitlistEntry } from '../types';

export async function fetchWaitlistEntries(): Promise<(WaitlistEntry & { id: string })[]> {
  const snap = await getDocs(query(collection(db, 'waitlist'), orderBy('timestamp', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as WaitlistEntry) }));
}

export async function updateWaitlistStatus(
  entryId: string,
  status: WaitlistEntry['status'],
  existing: WaitlistEntry
): Promise<void> {
  await updateDoc(doc(db, 'waitlist', entryId), {
    ...existing,
    status,
  });
}

export async function upsertMerchantAccount(
  userId: string,
  data: Pick<MerchantAccount, 'email' | 'storeName' | 'kybStatus'> &
    Partial<Pick<MerchantAccount, 'phone' | 'city' | 'waitlistId' | 'approvedAt' | 'verifiedAt'>>
): Promise<void> {
  const payload: MerchantAccount = {
    userId,
    email: data.email.toLowerCase().trim(),
    storeName: data.storeName.trim(),
    kybStatus: data.kybStatus,
    ...(data.phone ? { phone: data.phone } : {}),
    ...(data.city ? { city: data.city } : {}),
    ...(data.waitlistId ? { waitlistId: data.waitlistId } : {}),
    ...(data.approvedAt ? { approvedAt: data.approvedAt } : {}),
    ...(data.verifiedAt ? { verifiedAt: data.verifiedAt } : {}),
  };
  await setDoc(doc(db, 'merchant_accounts', userId), payload, { merge: true });
}

export async function setMerchantKybStatus(userId: string, kybStatus: KybStatus): Promise<void> {
  const now = new Date().toISOString();
  const patch: Record<string, string> = { kybStatus };
  if (kybStatus === 'approved') patch.approvedAt = now;
  if (kybStatus === 'verified') patch.verifiedAt = now;
  await updateDoc(doc(db, 'merchant_accounts', userId), patch);
}

export async function fetchMerchantAccounts(): Promise<MerchantAccount[]> {
  const snap = await getDocs(collection(db, 'merchant_accounts'));
  return snap.docs.map((d) => d.data() as MerchantAccount);
}

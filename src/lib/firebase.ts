import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import type { Store, Analytics } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authenticate via popup with Google Auth
export async function authenticateWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Auth Error: ', error);
    throw error;
  }
}

// Test connection only when explicitly needed (avoids Firestore calls on every page load)
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export const DEFAULT_CONNECTED_PLATFORMS = [
  'Google Maps',
  'Google Search',
  'Instagram',
  'WhatsApp Business',
  'Facebook',
  'Justdial',
  'Sulekha',
];

export function calculateVisibilityScore(platformCount: number): number {
  return Math.min(100, Math.round(20 + platformCount * 6.5));
}

export async function ensureStoreDocument(
  storeId: string,
  defaults: {
    storeName: string;
    address: string;
    products: string;
    platforms?: string[];
  }
): Promise<Store> {
  const storeRef = doc(db, 'stores', storeId);
  const existing = await getDoc(storeRef);

  if (existing.exists()) {
    return { id: existing.id, ...existing.data() } as Store;
  }

  const platforms = defaults.platforms ?? DEFAULT_CONNECTED_PLATFORMS;
  const storePayload: Store = {
    userId: storeId,
    storeName: defaults.storeName,
    address: defaults.address,
    location: defaults.address,
    products: defaults.products,
    visibility_score: calculateVisibilityScore(platforms.length),
    platforms_active: platforms,
    subscription_status: 'free_tier',
  };

  await setDoc(storeRef, storePayload);
  return { id: storeId, ...storePayload };
}

export function subscribeToStoreDocument(
  storeId: string,
  onData: (store: Store | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const storeRef = doc(db, 'stores', storeId);

  return onSnapshot(
    storeRef,
    (snapshot) => {
      onData(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Store) : null);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `stores/${storeId}`);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export function subscribeToStoreAnalytics(
  storeId: string,
  onData: (records: Analytics[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const analyticsQuery = query(collection(db, 'analytics'), where('storeId', '==', storeId));

  return onSnapshot(
    analyticsQuery,
    (snapshot) => {
      const records = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Analytics)
      );
      records.sort((a, b) => a.date.localeCompare(b.date));
      onData(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `analytics?storeId=${storeId}`);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export async function updateStorePlatforms(storeId: string, platforms: string[]): Promise<void> {
  const storeRef = doc(db, 'stores', storeId);
  await updateDoc(storeRef, {
    platforms_active: platforms,
  });
}

export async function updateStoreProfile(
  storeId: string,
  updates: Pick<Store, 'storeName' | 'address' | 'products' | 'location'>
): Promise<void> {
  const storeRef = doc(db, 'stores', storeId);
  await updateDoc(storeRef, {
    ...updates,
    location: updates.location ?? updates.address,
  });
}

export interface AnalyticsSummary {
  impressions: number;
  clicks: number;
  calls: number;
  directions: number;
  impressionsTrend: number;
  avgDailyImpressions: number;
}

export function summarizeAnalytics(records: Analytics[]): AnalyticsSummary {
  if (records.length === 0) {
    return {
      impressions: 0,
      clicks: 0,
      calls: 0,
      directions: 0,
      impressionsTrend: 0,
      avgDailyImpressions: 0,
    };
  }

  const impressions = records.reduce((sum, record) => sum + record.impressions, 0);
  const clicks = records.reduce((sum, record) => sum + record.clicks, 0);
  const calls = records.reduce((sum, record) => sum + record.calls, 0);
  const directions = records.reduce((sum, record) => sum + record.directions, 0);

  const midpoint = Math.floor(records.length / 2);
  const firstHalf = records.slice(0, midpoint);
  const secondHalf = records.slice(midpoint);
  const firstHalfImpressions = firstHalf.reduce((sum, record) => sum + record.impressions, 0);
  const secondHalfImpressions = secondHalf.reduce((sum, record) => sum + record.impressions, 0);
  const impressionsTrend =
    firstHalfImpressions > 0
      ? ((secondHalfImpressions - firstHalfImpressions) / firstHalfImpressions) * 100
      : 0;

  return {
    impressions,
    clicks,
    calls,
    directions,
    impressionsTrend,
    avgDailyImpressions: impressions / records.length,
  };
}

const PLATFORM_IMPRESSION_WEIGHTS: Record<string, number> = {
  'Google Maps': 0.34,
  'Google Search': 0.14,
  Instagram: 0.22,
  'WhatsApp Business': 0.12,
  Facebook: 0.08,
  Justdial: 0.05,
  Sulekha: 0.03,
  'Apple Maps': 0.01,
  'YouTube Shorts': 0.005,
  SMS: 0.003,
  'ChatGPT Discovery': 0.002,
  'TikTok Local': 0.001,
};

export interface PlatformImpressionSlice {
  name: string;
  impressions: number;
  percentage: number;
  color: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  'Google Maps': '#1A1A1A',
  'Google Search': '#2D2D2D',
  Instagram: '#C9A96E',
  'WhatsApp Business': '#E8DCC8',
  Facebook: '#5C5C5C',
  Justdial: '#8B7355',
  Sulekha: '#A0927D',
  Others: 'rgba(26, 26, 26, 0.2)',
};

export function buildPlatformBreakdown(
  totalImpressions: number,
  connectedPlatforms: string[]
): PlatformImpressionSlice[] {
  if (totalImpressions <= 0 || connectedPlatforms.length === 0) {
    return [];
  }

  const activeWeights = connectedPlatforms.map((platform) => ({
    platform,
    weight: PLATFORM_IMPRESSION_WEIGHTS[platform] ?? 0.01,
  }));
  const weightTotal = activeWeights.reduce((sum, entry) => sum + entry.weight, 0);

  const slices = activeWeights
    .map(({ platform, weight }) => {
      const impressions = Math.round(totalImpressions * (weight / weightTotal));
      return {
        name: platform,
        impressions,
        percentage: Math.round((weight / weightTotal) * 100),
        color: PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.Others,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const topSlices = slices.slice(0, 3);
  const remainderImpressions = slices.slice(3).reduce((sum, slice) => sum + slice.impressions, 0);
  const remainderPercentage = slices.slice(3).reduce((sum, slice) => sum + slice.percentage, 0);

  if (remainderImpressions > 0) {
    topSlices.push({
      name: 'Others',
      impressions: remainderImpressions,
      percentage: remainderPercentage,
      color: PLATFORM_COLORS.Others,
    });
  }

  return topSlices;
}

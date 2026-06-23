import { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  auth,
  ensureStoreDocument,
  subscribeToStoreDocument,
  subscribeToStoreAnalytics,
  updateStorePlatforms,
  updateStoreProfile,
  summarizeAnalytics,
  buildPlatformBreakdown,
  calculateVisibilityScore,
  DEFAULT_CONNECTED_PLATFORMS,
  type AnalyticsSummary,
  type PlatformImpressionSlice,
} from '../lib/firebase';
import { getStoreAnalytics } from '../api';
import type { Analytics, Store } from '../types';

const DEFAULT_SHOP = {
  storeName: 'Krishna Swadeshi Organic',
  address: 'No. 12, Indiranagar Double Road, Bengaluru',
  products: 'Cold-pressed mustard oil, local organic honey, Desi A2 ghee',
};

interface DashboardSyncState {
  currentUser: User | null;
  storeId: string | null;
  store: Store | null;
  analytics: Analytics[];
  summary: AnalyticsSummary;
  platformBreakdown: PlatformImpressionSlice[];
  connectedPlatforms: string[];
  visibilityScore: number;
  shopName: string;
  shopAddress: string;
  shopProducts: string;
  loading: boolean;
  syncing: boolean;
  isLive: boolean;
  lastUpdatedAt: Date | null;
  error: string | null;
}

export function useDashboardSync() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [localShopName, setLocalShopName] = useState(DEFAULT_SHOP.storeName);
  const [localShopAddress, setLocalShopAddress] = useState(DEFAULT_SHOP.address);
  const [localShopProducts, setLocalShopProducts] = useState(DEFAULT_SHOP.products);
  const [localPlatforms, setLocalPlatforms] = useState<string[]>(DEFAULT_CONNECTED_PLATFORMS);

  const storeId = currentUser?.uid ?? null;
  const isLive = Boolean(storeId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.displayName) {
        setLocalShopName(`${user.displayName}'s Store`);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('nearo_shopName');
    const savedAddress = localStorage.getItem('nearo_shopAddress');
    const savedProducts = localStorage.getItem('nearo_shopProducts');
    if (savedName) setLocalShopName(savedName);
    if (savedAddress) setLocalShopAddress(savedAddress);
    if (savedProducts) setLocalShopProducts(savedProducts);
  }, []);

  useEffect(() => {
    if (!storeId) {
      setStore(null);
      setAnalytics([]);
      setLoading(false);
      setLastUpdatedAt(null);
      return;
    }

    let cancelled = false;
    let unsubscribeStore: (() => void) | undefined;
    let unsubscribeAnalytics: (() => void) | undefined;

    const bootstrap = async () => {
      setLoading(true);
      setError(null);

      try {
        await ensureStoreDocument(storeId, {
          storeName: localShopName,
          address: localShopAddress,
          products: localShopProducts,
          platforms: localPlatforms,
        });

        try {
          const response = await getStoreAnalytics(storeId);
          if (!cancelled && response.success && response.data?.records.length) {
            setAnalytics(response.data.records);
          }
        } catch (seedError) {
          console.warn('[DashboardSync] Analytics seed skipped:', seedError);
        }

        unsubscribeStore = subscribeToStoreDocument(
          storeId,
          (nextStore) => {
            if (cancelled) return;
            setStore(nextStore);
            if (nextStore) {
              setLocalShopName(nextStore.storeName);
              setLocalShopAddress(nextStore.address);
              setLocalShopProducts(nextStore.products);
              setLocalPlatforms(nextStore.platforms_active);
            }
            setLastUpdatedAt(new Date());
            setLoading(false);
          },
          (listenerError) => {
            if (cancelled) return;
            setError(listenerError.message);
            setLoading(false);
          }
        );

        unsubscribeAnalytics = subscribeToStoreAnalytics(
          storeId,
          (records) => {
            if (cancelled) return;
            setAnalytics(records);
            setLastUpdatedAt(new Date());
            setLoading(false);
          },
          (listenerError) => {
            if (cancelled) return;
            setError(listenerError.message);
            setLoading(false);
          }
        );
      } catch (bootstrapError) {
        if (cancelled) return;
        setError(bootstrapError instanceof Error ? bootstrapError.message : String(bootstrapError));
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      unsubscribeStore?.();
      unsubscribeAnalytics?.();
    };
  }, [storeId]);

  const connectedPlatforms = isLive ? (store?.platforms_active ?? localPlatforms) : localPlatforms;
  const shopName = isLive ? (store?.storeName ?? localShopName) : localShopName;
  const shopAddress = isLive ? (store?.address ?? localShopAddress) : localShopAddress;
  const shopProducts = isLive ? (store?.products ?? localShopProducts) : localShopProducts;

  const summary = useMemo(() => summarizeAnalytics(analytics), [analytics]);
  const platformBreakdown = useMemo(
    () => buildPlatformBreakdown(summary.impressions, connectedPlatforms),
    [summary.impressions, connectedPlatforms]
  );
  const visibilityScore = isLive
    ? (store?.visibility_score ?? calculateVisibilityScore(connectedPlatforms.length))
    : calculateVisibilityScore(connectedPlatforms.length);

  const togglePlatform = useCallback(
    async (platformName: string) => {
      const isConnected = connectedPlatforms.includes(platformName);
      const nextPlatforms = isConnected
        ? connectedPlatforms.filter((platform) => platform !== platformName)
        : [...connectedPlatforms, platformName];

      if (!storeId) {
        setLocalPlatforms(nextPlatforms);
        return { connected: !isConnected, synced: false };
      }

      setSyncing(true);
      try {
        await updateStorePlatforms(storeId, nextPlatforms);
        return { connected: !isConnected, synced: true };
      } catch (updateError) {
        setError(updateError instanceof Error ? updateError.message : String(updateError));
        throw updateError;
      } finally {
        setSyncing(false);
      }
    },
    [connectedPlatforms, storeId]
  );

  const saveStoreInfo = useCallback(
    async (details: { storeName: string; address: string; products: string }) => {
      localStorage.setItem('nearo_shopName', details.storeName);
      localStorage.setItem('nearo_shopAddress', details.address);
      localStorage.setItem('nearo_shopProducts', details.products);
      setLocalShopName(details.storeName);
      setLocalShopAddress(details.address);
      setLocalShopProducts(details.products);

      if (!storeId) {
        window.dispatchEvent(new Event('storage'));
        return { synced: false };
      }

      setSyncing(true);
      try {
        await updateStoreProfile(storeId, {
          storeName: details.storeName,
          address: details.address,
          products: details.products,
          location: details.address,
        });
        window.dispatchEvent(new Event('storage'));
        return { synced: true };
      } catch (updateError) {
        setError(updateError instanceof Error ? updateError.message : String(updateError));
        throw updateError;
      } finally {
        setSyncing(false);
      }
    },
    [storeId]
  );

  const applyPlatforms = useCallback(
    async (platforms: string[]) => {
      if (!storeId) {
        setLocalPlatforms(platforms);
        return { synced: false };
      }
      setSyncing(true);
      try {
        await updateStorePlatforms(storeId, platforms);
        return { synced: true };
      } finally {
        setSyncing(false);
      }
    },
    [storeId]
  );

  const state: DashboardSyncState = {
    currentUser,
    storeId,
    store,
    analytics,
    summary,
    platformBreakdown,
    connectedPlatforms,
    visibilityScore,
    shopName,
    shopAddress,
    shopProducts,
    loading,
    syncing,
    isLive,
    lastUpdatedAt,
    error,
  };

  return {
    ...state,
    togglePlatform,
    saveStoreInfo,
    applyPlatforms,
    setLocalShopName,
    setLocalShopAddress,
    setLocalShopProducts,
  };
}

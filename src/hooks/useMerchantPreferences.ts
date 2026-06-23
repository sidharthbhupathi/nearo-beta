import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../lib/firebase";
import {
  applyPreferencesUpgrade,
  buildPreferences,
  loadFirestorePreferences,
  loadLocalPreferences,
  PREFERENCES_UPDATED_EVENT,
  saveLocalPreferences,
  syncPreferencesToFirestore,
  type MerchantPreferences,
} from "../lib/merchantPreferences";

export function useMerchantPreferences() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<MerchantPreferences | null>(loadLocalPreferences);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const remote = await loadFirestorePreferences(u.uid);
          if (remote) {
            setPreferences(remote);
            saveLocalPreferences(remote);
          }
        } catch {
          // offline / rules — local prefs still work
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<MerchantPreferences>).detail;
      if (detail) setPreferences(detail);
    };
    window.addEventListener(PREFERENCES_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(PREFERENCES_UPDATED_EVENT, onUpdate);
  }, []);

  const upgradeFromPreferences = useCallback(
    async (input: Parameters<typeof buildPreferences>[0], options?: { silent?: boolean }) => {
      const previous = loadLocalPreferences();
      const next = buildPreferences(input);
      const { changed, previousTier, nextTier } = applyPreferencesUpgrade(previous, next);

      saveLocalPreferences(next);
      setPreferences(next);

      if (user?.uid) {
        setSyncing(true);
        try {
          await syncPreferencesToFirestore(user.uid, next);
        } catch (err) {
          console.warn("[Preferences] Firestore sync skipped:", err);
        } finally {
          setSyncing(false);
        }
      }

      if (changed && !options?.silent) {
        toast.success(
          previousTier
            ? `Plan auto-upgraded: ${previousTier} → ${nextTier} (₹${next.monthlyPrice}/mo)`
            : `Your plan: ${nextTier} — ₹${next.monthlyPrice}/mo for ${next.platformsCount} platforms`,
          { duration: 4500 }
        );
      }

      return next;
    },
    [user]
  );

  return {
    preferences,
    syncing,
    upgradeFromPreferences,
  };
}

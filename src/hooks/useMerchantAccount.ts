import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, isNearoAdminEmail, subscribeToMerchantAccount } from '../lib/firebase';
import type { KybStatus, MerchantAccount } from '../types';

export function useMerchantAccount() {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [account, setAccount] = useState<MerchantAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = isNearoAdminEmail(currentUser?.email);
  const kybStatus: KybStatus | null = isAdmin
    ? 'verified'
    : account?.kybStatus ?? (currentUser ? 'pending' : null);
  const isVerified = isAdmin || kybStatus === 'verified';
  const canUseLiveDashboard = !currentUser || isVerified;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setAccount(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const unsubscribeAccount = subscribeToMerchantAccount(
      currentUser.uid,
      (nextAccount) => {
        setAccount(nextAccount);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribeAccount();
  }, [currentUser?.uid]);

  return {
    currentUser,
    account,
    loading,
    isAdmin,
    kybStatus,
    isVerified,
    canUseLiveDashboard,
  };
}

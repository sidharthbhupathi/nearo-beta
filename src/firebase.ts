// Primary Frontend Firebase SDK Wrapper
export { 
  db, 
  auth, 
  googleProvider, 
  OperationType, 
  handleFirestoreError,
  authenticateWithGoogle,
  ensureStoreDocument,
  subscribeToStoreDocument,
  subscribeToStoreAnalytics,
  updateStorePlatforms,
  updateStoreProfile,
  summarizeAnalytics,
  buildPlatformBreakdown,
  calculateVisibilityScore,
  DEFAULT_CONNECTED_PLATFORMS,
} from "./lib/firebase";

export type { FirestoreErrorInfo, AnalyticsSummary, PlatformImpressionSlice } from "./lib/firebase";

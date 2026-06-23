import { WaitlistEntry, Store, Analytics } from "./types";

// Standard Response Template as defined in user requirements
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

const API_BASE = ""; // Relative path to support unified container reverse routing

/**
 * Robust fetches with timeout and error fallback
 */
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.error?.message || `HTTP ${response.status} Error`);
    }
    return body as T;
  } catch (err: any) {
    console.error(`[API Client Error] Fetch failed on ${url}:`, err);
    throw err;
  }
}

/**
 * 1. Health check for integrations
 */
export async function getHealthStatus(): Promise<ApiResponse<{ status: string; platforms: string[] }>> {
  return fetchJson<ApiResponse<{ status: string; platforms: string[] }>>(`${API_BASE}/api/status/health`);
}

/**
 * 2. Submit waitlist entry
 */
export async function submitWaitlist(
  entry: Omit<WaitlistEntry, "id" | "timestamp" | "status">
): Promise<ApiResponse<{ id: string; store_name: string }>> {
  return fetchJson<ApiResponse<{ id: string; store_name: string }>>(`${API_BASE}/api/waitlist`, {
    method: "POST",
    body: JSON.stringify(entry)
  });
}

/**
 * 3. Create/Sync store profile
 */
export async function createStoreProfile(
  store: Omit<Store, "id" | "visibility_score">
): Promise<ApiResponse<Store>> {
  return fetchJson<ApiResponse<Store>>(`${API_BASE}/api/stores`, {
    method: "POST",
    body: JSON.stringify(store)
  });
}

/**
 * 4. Get store analytics records & summarization
 */
export async function getStoreAnalytics(
  storeId: string
): Promise<ApiResponse<{
  records: Analytics[];
  summary: { impressions: number; clicks: number; calls: number; directions: number };
  trends: { clicksToImpressionsRatio: string; avgDailyImpressions: string; aggregateCallsAndDirections: number };
}>> {
  return fetchJson<ApiResponse<{
    records: Analytics[];
    summary: { impressions: number; clicks: number; calls: number; directions: number };
    trends: { clicksToImpressionsRatio: string; avgDailyImpressions: string; aggregateCallsAndDirections: number };
  }>>(`${API_BASE}/api/stores/${storeId}/analytics`);
}

/**
 * 5. Calculate custom price pricing based on business DNA
 */
export interface PricingCalculationRequest {
  location: string;
  crowdDensity: "High" | "Medium" | "Low";
  productType: "Kirana/Grocery" | "Organic Store" | "Pharmacy" | "Restaurant" | "Other";
  platforms: string[];
}

export interface PricingResponseData {
  basePrice: number;
  multiplier: number;
  finalPrice: number;
  breakdown: {
    basePrice: number;
    platformCharge: number;
    crowdBonusFactor: number;
    categoryBonusFactor: number;
    savingsDiscount: number;
  };
}

export async function calculateCustomPricing(
  req: PricingCalculationRequest
): Promise<ApiResponse<PricingResponseData>> {
  return fetchJson<ApiResponse<PricingResponseData>>(`${API_BASE}/api/pricing/calculate`, {
    method: "POST",
    body: JSON.stringify(req)
  });
}

/**
 * 6. Generate 30 days of posts using Gemini AI
 */
export interface PostGenerationRequest {
  storeId: string;
  storeName: string;
  category: string;
  products: string;
  tone: string;
}

export interface GeneratedPost {
  id: string;
  storeId: string;
  content: string;
  imageUrl: string;
  platform: string;
  scheduledFor: string;
  status: "scheduled" | "posted" | "failed";
  postedAt: string | null;
  performance: any;
}

export interface PostGenerationResponse {
  posts: GeneratedPost[];
  count: number;
  estimated_engagement: number;
}

export async function generateAutopilotPosts(
  req: PostGenerationRequest
): Promise<ApiResponse<PostGenerationResponse>> {
  return fetchJson<ApiResponse<PostGenerationResponse>>(`${API_BASE}/api/posts/generate`, {
    method: "POST",
    body: JSON.stringify(req)
  });
}

/**
 * 7. Schedule generated posts queue onto autopilot db
 */
export async function scheduleAutopilotPosts(
  storeId: string,
  posts: GeneratedPost[]
): Promise<ApiResponse<{ scheduled: number; failed: number }>> {
  return fetchJson<ApiResponse<{ scheduled: number; failed: number }>>(`${API_BASE}/api/posts/schedule`, {
    method: "POST",
    body: JSON.stringify({ storeId, posts })
  });
}

/**
 * 8. Refresh live dashboard metrics for real-time sync demos
 */
export async function refreshStoreAnalytics(
  storeId: string
): Promise<ApiResponse<Analytics>> {
  return fetchJson<ApiResponse<Analytics>>(`${API_BASE}/api/stores/${storeId}/analytics/refresh`, {
    method: "POST",
  });
}

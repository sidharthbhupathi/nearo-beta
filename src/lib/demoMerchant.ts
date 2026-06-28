import type { Analytics } from "../types";
import { calculateVisibilityScore } from "./firebase";

/** Founding beta merchant shown in homepage stats and unsigned dashboard demo. */
export const FOUNDING_DEMO_MERCHANT = {
  ownerName: "Sidharth Bhupathi",
  initials: "SB",
  storeName: "Sidharth's Kirana & Essentials",
  address: "Koramangala 4th Block, Bengaluru",
  products: "Daily essentials, organic staples, festival hampers",
  locality: "Koramangala",
  connectedPlatforms: [
    "Google Business Profile",
    "Google Search",
    "WhatsApp Business",
    "Instagram",
    "Facebook",
    "Justdial",
    "Google Ads",
    "YouTube",
  ],
} as const;

export const DEMO_VISIBILITY_SCORE = calculateVisibilityScore(
  FOUNDING_DEMO_MERCHANT.connectedPlatforms.length
);

/** Deterministic 7-day sample metrics for dashboard demo (unsigned visitors). */
const DEMO_DAILY_METRICS = [
  { impressions: 380, clicks: 42, calls: 4, directions: 6 },
  { impressions: 410, clicks: 48, calls: 5, directions: 7 },
  { impressions: 445, clicks: 52, calls: 5, directions: 8 },
  { impressions: 470, clicks: 55, calls: 6, directions: 9 },
  { impressions: 505, clicks: 58, calls: 6, directions: 10 },
  { impressions: 530, clicks: 62, calls: 7, directions: 11 },
  { impressions: 560, clicks: 68, calls: 8, directions: 12 },
] as const;

export function buildDemoAnalyticsRecords(): Analytics[] {
  const now = new Date();
  return DEMO_DAILY_METRICS.map((day, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (DEMO_DAILY_METRICS.length - 1 - index));
    const date = d.toISOString().split("T")[0];
    return {
      id: `demo-founder_${date}`,
      storeId: "demo-founder",
      date,
      impressions: day.impressions,
      clicks: day.clicks,
      calls: day.calls,
      directions: day.directions,
    };
  });
}

export const DEMO_WEEKLY_IMPRESSIONS = DEMO_DAILY_METRICS.reduce(
  (sum, day) => sum + day.impressions,
  0
);

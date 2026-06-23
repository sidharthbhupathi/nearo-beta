import type { FactorOption } from "../types";

export { MERCHANTS_ONBOARDED, BETA_FOUNDING_SLOTS, BETA_CITY } from "./beta";

export const PRICING_FACTORS = {
  location: {
    name: "Location Type",
    options: [
      { label: "Rural / Village", multiplier: 0.5, price: 199 },
      { label: "Small Town", multiplier: 0.7, price: 299 },
      { label: "City Suburb", multiplier: 1.0, price: 399 },
      { label: "City Center", multiplier: 1.5, price: 599 },
      { label: "Premium Locality", multiplier: 2.0, price: 799 },
    ] as FactorOption[],
  },
  crowd: {
    name: "Crowd Density",
    options: [
      { label: "Low (<500 households)", multiplier: 0.6, price: 239 },
      { label: "Medium (500-2000 households)", multiplier: 0.8, price: 319 },
      { label: "High (2000-5000 households)", multiplier: 1.0, price: 399 },
      { label: "Very High (5000+ households)", multiplier: 1.3, price: 519 },
    ] as FactorOption[],
  },
  products: {
    name: "Product/Service Focus",
    options: [
      { label: "Basic Essentials (eg. general kirana)", multiplier: 0.7, price: 279 },
      { label: "Mixed Retail Store (variety items)", multiplier: 1.0, price: 399 },
      { label: "Specialty / Organic Brand", multiplier: 1.5, price: 599 },
    ] as FactorOption[],
  },
  platforms: {
    name: "Platform Coverage",
    options: [
      { label: "Google Maps Only", multiplier: 0.5, price: 199 },
      { label: "Local Search + WhatsApp Pack", multiplier: 0.7, price: 279 },
      { label: "Full Omnichannel (All 12+ channels)", multiplier: 1.0, price: 399 },
    ] as FactorOption[],
  },
};

export const ALL_PLATFORM_NAMES = [
  "Google Maps",
  "Google Search",
  "Instagram",
  "WhatsApp Business",
  "Facebook",
  "Justdial",
  "Sulekha",
  "Apple Maps",
  "YouTube Shorts",
  "SMS",
  "ChatGPT Discovery",
  "TikTok Local",
];

export const PLATFORM_PACKS: Record<string, string[]> = {
  "Google Maps Only": ["Google Maps"],
  "Local Search + WhatsApp Pack": [
    "Google Maps",
    "Google Search",
    "WhatsApp Business",
    "Justdial",
    "Sulekha",
  ],
  "Full Omnichannel (All 12+ channels)": ALL_PLATFORM_NAMES,
};

export type SubscriptionTier = "starter" | "growth" | "pro" | "omnichannel";

export function computeMonthlyPrice(
  location: FactorOption,
  crowd: FactorOption,
  products: FactorOption,
  platforms: FactorOption
): number {
  const rawSum = location.price + crowd.price + products.price + platforms.price;
  const averageRaw = rawSum / 4;
  const multiplierProduct =
    location.multiplier *
    crowd.multiplier *
    products.multiplier *
    platforms.multiplier;
  const computed = Math.round(averageRaw * multiplierProduct * 1.5);
  return Math.max(199, Math.min(1199, computed - (computed % 10)));
}

export function tierFromPrice(price: number): SubscriptionTier {
  if (price < 300) return "starter";
  if (price < 450) return "growth";
  if (price < 650) return "pro";
  return "omnichannel";
}

export function tierLabel(tier: SubscriptionTier): string {
  const labels: Record<SubscriptionTier, string> = {
    starter: "Starter",
    growth: "Growth",
    pro: "Pro",
    omnichannel: "Omnichannel",
  };
  return labels[tier];
}

export function platformsCountFromPack(platformPackLabel: string): number {
  return PLATFORM_PACKS[platformPackLabel]?.length ?? 1;
}

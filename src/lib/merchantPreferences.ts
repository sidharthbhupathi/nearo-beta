import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  PRICING_FACTORS,
  PLATFORM_PACKS,
  PLATFORM_COUNT,
  computeMonthlyPrice,
  tierFromPrice,
  tierLabel,
  platformsCountFromPack,
  type SubscriptionTier,
} from "./pricing";
import type { FactorOption } from "../types";

const STORAGE_KEY = "nearo_merchant_preferences";

export interface MerchantPreferences {
  locationLabel: string;
  crowdLabel: string;
  productLabel: string;
  platformPackLabel: string;
  storeCategory?: string;
  city?: string;
  language?: string;
  syncIntervalMinutes?: number;
  tier: SubscriptionTier;
  tierName: string;
  monthlyPrice: number;
  platformsCount: number;
  recommendedPlatforms: string[];
  updatedAt: string;
}

export const PREFERENCES_UPDATED_EVENT = "nearo-preferences-updated";

function findOption(
  factor: keyof typeof PRICING_FACTORS,
  label: string
): FactorOption {
  const match = PRICING_FACTORS[factor].options.find((o) => o.label === label);
  return match ?? PRICING_FACTORS[factor].options[0];
}

export function inferLocationFromAddress(address: string): string {
  const lower = address.toLowerCase();
  if (/village|rural|taluk|gram/i.test(lower)) return "Rural / Village";
  if (/premium|koramangala|indiranagar|mg road|brigade/i.test(lower)) return "Premium Locality";
  if (/bengaluru|bangalore|mumbai|delhi|hyderabad|chennai|city center/i.test(lower))
    return "City Center";
  if (/suburb|layout|nagar|road/i.test(lower)) return "City Suburb";
  if (/town|district/i.test(lower)) return "Small Town";
  return "City Suburb";
}

export function categoryToProductFocus(category: string): string {
  switch (category) {
    case "Kirana/Grocery":
      return "Basic Essentials (eg. general kirana)";
    case "Organic Store":
      return "Specialty / Organic Brand";
    default:
      return "Mixed Retail Store (variety items)";
  }
}

export function connectedCountToPlatformPack(count: number): string {
  if (count <= 1) return "Google Business Profile Only";
  if (count <= 5) return "Local Search + WhatsApp Pack";
  return `Full Omnichannel (All ${PLATFORM_COUNT} channels)`;
}

export function buildPreferences(input: {
  locationLabel?: string;
  crowdLabel?: string;
  productLabel?: string;
  platformPackLabel?: string;
  storeCategory?: string;
  city?: string;
  address?: string;
  language?: string;
  syncIntervalMinutes?: number;
  connectedPlatformCount?: number;
}): MerchantPreferences {
  const locationLabel =
    input.locationLabel ??
    (input.address ? inferLocationFromAddress(input.address) : PRICING_FACTORS.location.options[2].label);

  const crowdLabel = input.crowdLabel ?? PRICING_FACTORS.crowd.options[2].label;

  const productLabel =
    input.productLabel ??
    (input.storeCategory ? categoryToProductFocus(input.storeCategory) : PRICING_FACTORS.products.options[1].label);

  const platformPackLabel =
    input.platformPackLabel ??
    (input.connectedPlatformCount != null
      ? connectedCountToPlatformPack(input.connectedPlatformCount)
      : PRICING_FACTORS.platforms.options[2].label);

  const location = findOption("location", locationLabel);
  const crowd = findOption("crowd", crowdLabel);
  const products = findOption("products", productLabel);
  const platforms = findOption("platforms", platformPackLabel);

  const monthlyPrice = computeMonthlyPrice(location, crowd, products, platforms);
  const tier = tierFromPrice(monthlyPrice);
  const recommendedPlatforms = PLATFORM_PACKS[platformPackLabel] ?? PLATFORM_PACKS["Google Business Profile Only"];

  return {
    locationLabel,
    crowdLabel,
    productLabel,
    platformPackLabel,
    storeCategory: input.storeCategory,
    city: input.city,
    language: input.language,
    syncIntervalMinutes: input.syncIntervalMinutes,
    tier,
    tierName: tierLabel(tier),
    monthlyPrice,
    platformsCount: platformsCountFromPack(platformPackLabel),
    recommendedPlatforms,
    updatedAt: new Date().toISOString(),
  };
}

export function loadLocalPreferences(): MerchantPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MerchantPreferences;
  } catch {
    return null;
  }
}

export function saveLocalPreferences(prefs: MerchantPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent(PREFERENCES_UPDATED_EVENT, { detail: prefs }));
}

export async function syncPreferencesToFirestore(
  userId: string,
  prefs: MerchantPreferences
): Promise<void> {
  const ref = doc(db, "merchant_preferences", userId);
  await setDoc(ref, { userId, ...prefs }, { merge: true });
}

export async function loadFirestorePreferences(
  userId: string
): Promise<MerchantPreferences | null> {
  const ref = doc(db, "merchant_preferences", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const { userId: _uid, ...rest } = data;
  return rest as MerchantPreferences;
}

export function applyPreferencesUpgrade(
  previous: MerchantPreferences | null,
  next: MerchantPreferences
): { changed: boolean; previousTier?: string; nextTier: string } {
  const changed = !previous || previous.tier !== next.tier || previous.monthlyPrice !== next.monthlyPrice;
  return {
    changed,
    previousTier: previous?.tierName,
    nextTier: next.tierName,
  };
}

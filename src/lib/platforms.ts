/**
 * Agency-aligned channel list for Indian local retail (kirana, organic, boutique).
 * Single source of truth for UI, pricing packs, Firestore defaults, and analytics weights.
 */
export type PlatformCategory =
  | "Local Search"
  | "Paid Ads"
  | "Social"
  | "Messaging"
  | "Directory"
  | "Video";

export interface PlatformDef {
  id: string;
  name: string;
  category: PlatformCategory;
  /** Simple Icons component key used in Logos.tsx */
  icon: string;
  agencyRole: string;
  impressionWeight: number;
  chartColor: string;
}

export const NEARO_PLATFORMS: PlatformDef[] = [
  {
    id: "google_business",
    name: "Google Business Profile",
    category: "Local Search",
    icon: "SiGooglemaps",
    agencyRole: "Maps listing, reviews, local pack rankings",
    impressionWeight: 0.28,
    chartColor: "#4285F4",
  },
  {
    id: "google_search",
    name: "Google Search",
    category: "Local Search",
    icon: "SiGoogle",
    agencyRole: "Local SEO, branded & category keywords",
    impressionWeight: 0.12,
    chartColor: "#34A853",
  },
  {
    id: "google_ads",
    name: "Google Ads",
    category: "Paid Ads",
    icon: "SiGoogleads",
    agencyRole: "Search & Maps paid campaigns, call/direction ads",
    impressionWeight: 0.14,
    chartColor: "#FBBC04",
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Social",
    icon: "SiInstagram",
    agencyRole: "Reels, stories, visual catalog, local hashtags",
    impressionWeight: 0.18,
    chartColor: "#E4405F",
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "Social",
    icon: "SiFacebook",
    agencyRole: "Business page, community posts, local groups",
    impressionWeight: 0.08,
    chartColor: "#1877F2",
  },
  {
    id: "meta_ads",
    name: "Meta Ads",
    category: "Paid Ads",
    icon: "SiMeta",
    agencyRole: "Paid reach on Facebook & Instagram feeds",
    impressionWeight: 0.1,
    chartColor: "#0668E1",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Messaging",
    icon: "SiWhatsapp",
    agencyRole: "Catalog, broadcasts, customer replies, order updates",
    impressionWeight: 0.12,
    chartColor: "#25D366",
  },
  {
    id: "justdial",
    name: "Justdial",
    category: "Directory",
    icon: "SiJustdial",
    agencyRole: "India local directory & lead calls",
    impressionWeight: 0.05,
    chartColor: "#FF6B00",
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Video",
    icon: "SiYoutube",
    agencyRole: "Shorts & shop tours, product demos, trust content",
    impressionWeight: 0.06,
    chartColor: "#FF0000",
  },
  {
    id: "indiamart",
    name: "IndiaMART",
    category: "Directory",
    icon: "SiIndiamart",
    agencyRole: "B2B discovery, wholesale & supplier leads",
    impressionWeight: 0.04,
    chartColor: "#2E3192",
  },
];

/** Legacy names from older builds → current canonical name */
const LEGACY_PLATFORM_ALIASES: Record<string, string> = {
  "google maps": "Google Business Profile",
  "google business profile": "Google Business Profile",
  "google search": "Google Search",
  "google ads": "Google Ads",
  instagram: "Instagram",
  facebook: "Facebook",
  "meta ads": "Meta Ads",
  "whatsapp business": "WhatsApp Business",
  whatsapp: "WhatsApp Business",
  justdial: "Justdial",
  "youtube shorts": "YouTube",
  youtube: "YouTube",
  indiamart: "IndiaMART",
  sulekha: "Justdial",
  "apple maps": "Google Business Profile",
  sms: "WhatsApp Business",
  "chatgpt discovery": "Google Search",
  "tiktok local": "Instagram",
};

export const ALL_PLATFORM_NAMES = NEARO_PLATFORMS.map((p) => p.name);

export const PLATFORM_COUNT = NEARO_PLATFORMS.length;

export const PLATFORM_COUNT_LABEL = `${PLATFORM_COUNT}`;

export const DEFAULT_CONNECTED_PLATFORMS = [
  "Google Business Profile",
  "Google Search",
  "WhatsApp Business",
  "Instagram",
  "Justdial",
];

export function normalizePlatformName(name: string): string {
  const key = name.toLowerCase().trim();
  return LEGACY_PLATFORM_ALIASES[key] ?? name;
}

export function getPlatformByName(name: string): PlatformDef | undefined {
  const canonical = normalizePlatformName(name);
  return NEARO_PLATFORMS.find((p) => p.name === canonical);
}

export function getPlatformWeights(): Record<string, number> {
  return Object.fromEntries(NEARO_PLATFORMS.map((p) => [p.name, p.impressionWeight]));
}

export function getPlatformColors(): Record<string, string> {
  return Object.fromEntries([
    ...NEARO_PLATFORMS.map((p) => [p.name, p.chartColor]),
    ["Others", "rgba(26, 26, 26, 0.2)"],
  ]);
}

export const PLATFORM_PACKS: Record<string, string[]> = {
  "Google Business Profile Only": ["Google Business Profile"],
  "Local Search + WhatsApp Pack": [
    "Google Business Profile",
    "Google Search",
    "WhatsApp Business",
    "Justdial",
  ],
  [`Full Omnichannel (All ${PLATFORM_COUNT} channels)`]: ALL_PLATFORM_NAMES,
};

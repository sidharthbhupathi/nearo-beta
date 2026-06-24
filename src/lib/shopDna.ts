/**
 * Shop DNA — structured inputs collected during in-person onboarding
 * and used to generate a unique marketing playbook per merchant (not a generic template).
 */
export type ShopArchetype =
  | "daily_essentials_kirana"
  | "organic_specialty"
  | "sweets_snacks"
  | "pharmacy_health"
  | "fashion_boutique"
  | "home_hardware"
  | "mixed_retail";

export type CustomerPersona =
  | "walk_in_neighbors"
  | "health_conscious_families"
  | "office_commute_crowd"
  | "festival_bulk_buyers"
  | "whatsapp_repeat_buyers";

export interface ShopDnaProfile {
  storeId: string;
  storeName: string;
  address: string;
  city: string;
  archetype: ShopArchetype;
  heroProducts: string[];
  pricePosition: "budget" | "mid" | "premium";
  peakHours: string[];
  peakDays: string[];
  languages: string[];
  competitorsNearby: string[];
  uniqueSellingPoints: string[];
  customerPersonas: CustomerPersona[];
  toneOfVoice: "warm_local" | "premium_organic" | "fast_value" | "festive_traditional";
  visitNotes: string;
  capturedAt: string;
}

export interface MarketingPlaybook {
  storeId: string;
  positioningStatement: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  hashtagSets: Record<string, string[]>;
  weeklyPostThemes: { day: string; theme: string; exampleHook: string }[];
  platformCadence: Record<string, { frequency: string; contentType: string }>;
  whatsappBroadcastTemplates: string[];
  googleBusinessPostIdeas: string[];
  adAngles: { headline: string; description: string; cta: string }[];
  avoidTopics: string[];
  generatedAt: string;
}

const ARCHETYPE_DEFAULTS: Record<
  ShopArchetype,
  { personas: CustomerPersona[]; tone: ShopDnaProfile["toneOfVoice"] }
> = {
  daily_essentials_kirana: {
    personas: ["walk_in_neighbors", "whatsapp_repeat_buyers"],
    tone: "fast_value",
  },
  organic_specialty: {
    personas: ["health_conscious_families", "office_commute_crowd"],
    tone: "premium_organic",
  },
  sweets_snacks: {
    personas: ["festival_bulk_buyers", "walk_in_neighbors"],
    tone: "festive_traditional",
  },
  pharmacy_health: {
    personas: ["walk_in_neighbors", "health_conscious_families"],
    tone: "warm_local",
  },
  fashion_boutique: {
    personas: ["office_commute_crowd", "festival_bulk_buyers"],
    tone: "premium_organic",
  },
  home_hardware: {
    personas: ["walk_in_neighbors"],
    tone: "fast_value",
  },
  mixed_retail: {
    personas: ["walk_in_neighbors", "whatsapp_repeat_buyers"],
    tone: "warm_local",
  },
};

export function inferArchetypeFromStoreType(storeType: string): ShopArchetype {
  const lower = storeType.toLowerCase();
  if (lower.includes("organic")) return "organic_specialty";
  if (lower.includes("pharmacy")) return "pharmacy_health";
  if (lower.includes("restaurant") || lower.includes("sweet")) return "sweets_snacks";
  if (lower.includes("kirana") || lower.includes("grocery")) return "daily_essentials_kirana";
  return "mixed_retail";
}

export function buildShopDnaFromIntake(input: {
  storeId: string;
  storeName: string;
  address: string;
  city: string;
  storeType: string;
  heroProducts: string[];
  visitNotes?: string;
  competitorsNearby?: string[];
  uniqueSellingPoints?: string[];
  languages?: string[];
}): ShopDnaProfile {
  const archetype = inferArchetypeFromStoreType(input.storeType);
  const defaults = ARCHETYPE_DEFAULTS[archetype];

  return {
    storeId: input.storeId,
    storeName: input.storeName,
    address: input.address,
    city: input.city,
    archetype,
    heroProducts: input.heroProducts,
    pricePosition: archetype === "organic_specialty" ? "premium" : "mid",
    peakHours: archetype === "sweets_snacks" ? ["5pm–9pm"] : ["8am–11am", "5pm–8pm"],
    peakDays: archetype === "sweets_snacks" ? ["Fri", "Sat", "Sun"] : ["Mon", "Wed", "Sat"],
    languages: input.languages ?? ["English", "Kannada"],
    competitorsNearby: input.competitorsNearby ?? [],
    uniqueSellingPoints: input.uniqueSellingPoints ?? [],
    customerPersonas: defaults.personas,
    toneOfVoice: defaults.tone,
    visitNotes: input.visitNotes ?? "",
    capturedAt: new Date().toISOString(),
  };
}

/** Prompt for Gemini — pass ShopDnaProfile JSON; returns MarketingPlaybook JSON */
export function buildMarketingPlaybookPrompt(dna: ShopDnaProfile): string {
  return `You are a local retail marketing strategist for Indian kirana and neighborhood stores in ${dna.city}.

Create a UNIQUE marketing playbook for this specific shop. Do NOT use generic templates.
Use the shop DNA below. Reflect local language mix, product focus, and neighborhood context.

SHOP DNA (JSON):
${JSON.stringify(dna, null, 2)}

Return ONLY valid JSON matching this schema:
{
  "positioningStatement": "one sentence",
  "primaryKeywords": ["5-8 local SEO keywords"],
  "secondaryKeywords": ["5-8 long-tail keywords"],
  "hashtagSets": { "instagram": [], "facebook": [] },
  "weeklyPostThemes": [{ "day": "Monday", "theme": "", "exampleHook": "" }],
  "platformCadence": {
    "Google Business Profile": { "frequency": "", "contentType": "" },
    "Instagram": { "frequency": "", "contentType": "" },
    "WhatsApp Business": { "frequency": "", "contentType": "" }
  },
  "whatsappBroadcastTemplates": ["3 short templates in local tone"],
  "googleBusinessPostIdeas": ["5 post ideas"],
  "adAngles": [{ "headline": "", "description": "", "cta": "" }],
  "avoidTopics": ["topics that don't fit this shop"]
}`;
}

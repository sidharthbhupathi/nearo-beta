export interface WaitlistEntry {
  id?: string;
  store_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  store_type: "Kirana/Grocery" | "Organic Store" | "Pharmacy" | "Restaurant" | "Other";
  timestamp: any; // Firestore serverTimestamp
  status: "pending" | "contacted" | "approved" | "rejected";
}

export interface Store {
  id?: string;
  userId: string;
  storeName: string;
  address: string;
  location: string;
  products: string;
  visibility_score: number;
  platforms_active: string[];
  subscription_status: "free_tier" | "active" | "cancelled";
}

export interface Analytics {
  id?: string;
  storeId: string;
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  calls: number;
  directions: number;
}

export interface PlatformInfo {
  name: string;
  icon: string;
  category: "Search" | "Social" | "Messaging" | "Directory" | "Video" | "Emerging";
}

export interface FactorOption {
  label: string;
  multiplier: number;
  price: number;
}

export interface PricingFactor {
  name: string;
  options: FactorOption[];
}

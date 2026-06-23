import React, { useState } from "react";
import { VisibilityScore } from "../components/dashboard/VisibilityScore";
import { AnalyticsChart } from "../components/dashboard/AnalyticsChart";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { PostCalendar } from "../components/dashboard/PostCalendar";
import { TotalImpressionsCard } from "../components/dashboard/TotalImpressionsCard";
import { PlatformBreakdown } from "../components/dashboard/PlatformBreakdown";
import { MultilingualTranslator } from "../components/dashboard/MultilingualTranslator";
import { WhatsAppMockup } from "../components/dashboard/WhatsAppMockup";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "react-hot-toast";
import { getLogoComponent } from "../components/ui/Logos";
import { useLanguage } from "../hooks/useLanguage";
import { useDashboardSync } from "../hooks/useDashboardSync";
import { useMerchantPreferences } from "../hooks/useMerchantPreferences";
import { SubscriptionUpgradeCard } from "../components/dashboard/SubscriptionUpgradeCard";
import { t } from "../lib/translations";
import { 
  Building2, 
  MapPin, 
  Globe2, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  const { preferences, upgradeFromPreferences, syncing: prefsSyncing } = useMerchantPreferences();
  const {
    connectedPlatforms,
    visibilityScore,
    shopName,
    shopAddress,
    shopProducts,
    summary,
    platformBreakdown,
    loading,
    syncing,
    isLive,
    lastUpdatedAt,
    togglePlatform,
    saveStoreInfo,
    applyPlatforms,
    setLocalShopName,
    setLocalShopAddress,
    setLocalShopProducts,
  } = useDashboardSync();

  const [editing, setEditing] = useState(false);
  const lastPackRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const category = localStorage.getItem("nearo_category") || undefined;
    const syncMin = parseInt(localStorage.getItem("nearo_syncInterval") || "15", 10);
    upgradeFromPreferences(
      {
        address: shopAddress,
        storeCategory: category,
        connectedPlatformCount: connectedPlatforms.length,
        language,
        syncIntervalMinutes: syncMin,
      },
      { silent: true }
    );
  }, [shopAddress, connectedPlatforms.length, language, upgradeFromPreferences]);

  React.useEffect(() => {
    if (!preferences?.platformPackLabel) return;
    const pack = preferences.platformPackLabel;
    if (lastPackRef.current && lastPackRef.current !== pack) {
      applyPlatforms(preferences.recommendedPlatforms).then((r) => {
        if (r?.synced) {
          toast.success(`Platforms auto-upgraded to ${preferences.tierName} pack (${preferences.platformsCount} channels)`);
        }
      });
    }
    lastPackRef.current = pack;
  }, [preferences, applyPlatforms]);

  const allPlatforms = [
    { name: "Google Maps", icon: "📍" },
    { name: "Google Search", icon: "🔍" },
    { name: "Instagram", icon: "📸" },
    { name: "WhatsApp Business", icon: "💬" },
    { name: "Facebook", icon: "👍" },
    { name: "Justdial", icon: "📞" },
    { name: "Sulekha", icon: "📋" },
    { name: "Apple Maps", icon: "🍎" },
    { name: "YouTube Shorts", icon: "🎬" },
    { name: "SMS", icon: "📱" },
    { name: "ChatGPT Discovery", icon: "🤖" },
    { name: "TikTok Local", icon: "🎵" }
  ];

  const handleTogglePlatform = async (name: string) => {
    try {
      const result = await togglePlatform(name);
      if (result.connected) {
        toast.success(`Connected ${name}! Initiated search indexing engine.`);
      } else {
        toast.success(`Disconnected ${name} from autopilot sync.`);
      }
      if (result.synced) {
        toast.success("Synced across all dashboard sessions.", { id: "platform-sync" });
      }
    } catch {
      toast.error(`Could not sync ${name}. Sign in to enable live Firestore updates.`);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    try {
      const result = await saveStoreInfo({ storeName: shopName, address: shopAddress, products: shopProducts });
      toast.success(
        result.synced
          ? "Store details synced live across all connected dashboards!"
          : "Store details updated across all 12 platforms on autopilot!"
      );
    } catch {
      toast.error("Could not sync store details. Please try again.");
    }
  };

  return (
    <div className="page-shell py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-12 relative z-10">
      
      {/* Demo Dashboard Banner */}
      <div className="glass-card-premium p-6 md:p-8 rounded-3xl text-left relative overflow-hidden flex flex-col lg:flex-row items-stretch justify-between gap-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="space-y-3 max-w-2xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-primary to-[#2d2d2d] text-white text-[10px] uppercase font-mono font-black px-3.5 py-1 rounded-full shadow-sm">
              <Sparkles className="h-3 w-3 text-brand-gold animate-spin" /> {t("Autopilot Interactive Control Terminal", language)}
            </div>
            <h2 className="section-title text-2xl md:text-3xl mt-2">
              {t("National Retailer Sync center", language)}
            </h2>
            <p className="text-xs md:text-sm text-brand-secondary leading-relaxed mt-1">
              {t("Connect your catalog directly to Indian consumer touchpoints. Toggle the switches in the switchboard below to simulate map indexing and directory reach metrics immediately.", language)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap text-[10.5px]">
            <span className="font-mono bg-brand-gold/10 text-[#C9A96E] px-2.5 py-1 rounded font-bold border border-brand-gold/20">
              {t("Swadeshi Initiative", language)}
            </span>
            <span className={cn(
              "font-mono px-2.5 py-1 rounded font-bold border",
              isLive
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-brand-bg/50 text-brand-secondary border-brand-beige"
            )}>
              {isLive ? t("● Firestore Live Sync", language) : t("● Local Demo Mode", language)}
            </span>
            {syncing && (
              <span className="font-mono bg-brand-gold/10 text-brand-primary px-2.5 py-1 rounded font-bold border border-brand-gold/20 animate-pulse">
                {t("Syncing…", language)}
              </span>
            )}
          </div>
        </div>

        {/* Dense Autopilot System Status Dashboard Side Panel */}
        <div className="border-t lg:border-t-0 lg:border-l border-brand-beige pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between shrink-0 min-w-[240px]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary font-black block mb-2">
            {t("Automated Host Handshake", language)}
          </span>
          <div className="divide-y divide-brand-beige/50 text-xs font-mono">
            <div className="flex justify-between py-1.5">
              <span className="text-brand-secondary">{t("Merchant ID:", language)}</span>
              <span className="font-bold text-brand-primary">NR-IND-560008</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-brand-secondary">{t("Cron Stagger:", language)}</span>
              <span className="font-bold text-brand-primary">{t("15-Min Intervals", language)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-brand-secondary">{t("Host Security:", language)}</span>
              <span className="font-bold text-brand-primary text-brand-success">{t("Verified SSL", language)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-brand-secondary">{t("Node Cluster:", language)}</span>
              <span className="font-bold text-brand-primary">Swadeshi-Node-01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left items-start">
        <div className="lg:col-span-1">
          <SubscriptionUpgradeCard
            preferences={preferences}
            syncing={prefsSyncing || syncing}
            onPageChange={onPageChange}
            onRecalculate={() =>
              upgradeFromPreferences({
                address: shopAddress,
                storeCategory: localStorage.getItem("nearo_category") || undefined,
                connectedPlatformCount: connectedPlatforms.length,
                language,
                syncIntervalMinutes: parseInt(localStorage.getItem("nearo_syncInterval") || "15", 10),
              })
            }
          />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Circular Progress Gauge / Score */}
        <div className="lg:col-span-1">
          <VisibilityScore score={visibilityScore} />
        </div>

        {/* Column 2: Total Impressions Card */}
        <div className="lg:col-span-1">
          <TotalImpressionsCard
            totalImpressions={summary.impressions}
            impressionsTrend={summary.impressionsTrend}
            monthlyImpressions={Math.round(summary.impressions * 3.9)}
            loading={loading}
            lastUpdatedAt={lastUpdatedAt}
          />
        </div>

        {/* Column 3: Dynamic active channels counters — Structured Grid Card */}
        <div className="lg:col-span-1">
          <div className="glass-dark text-brand-bg rounded-2xl p-5 border border-brand-primary flex flex-col justify-between text-left h-[190px]">
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-brand-gold font-bold">
                  {t("Synchronized Footprint", language)}
                </span>
                <h4 className="font-serif font-black text-2xl text-white mt-0.5 mb-0.5">
                  {connectedPlatforms.length} <span className="text-brand-gold text-xs font-sans font-normal">{t("/ 12 Active", language)}</span>
                </h4>
                <p className="text-[10.5px] text-brand-bg/75 leading-tight">
                  {t("Physical coordinates are locked and broadcasting across regional stores.", language)}
                </p>
              </div>

              {/* Dense subcategory breakdown matching category indices */}
              <div className="border-t border-brand-bg/10 pt-2 flex flex-col gap-1 text-[10px] font-mono text-brand-bg/90">
                <div className="flex justify-between items-center">
                  <span>{t("📍 Maps Guides:", language)}</span>
                  <span className="font-bold text-white">
                    {connectedPlatforms.filter(p => ["Google Maps", "Apple Maps"].includes(p)).length} / 2
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("💬 Social Channels:", language)}</span>
                  <span className="font-bold text-white">
                    {connectedPlatforms.filter(p => ["Instagram", "WhatsApp Business", "Facebook"].includes(p)).length} / 3
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-brand-bg/10 flex items-center justify-between text-[10px] text-brand-gold font-mono">
              <span className="flex items-center gap-1 font-bold">{t("✓ Autopilot Locked", language)}</span>
              <span className="uppercase font-bold text-white bg-green-700/50 px-2 py-0.5 rounded text-[8.5px]">
                {t("Ready", language)}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Middle Grid: Dynamic Analytics Charts, Platform Breakdown donut, Recent activity list, Calendar posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnalyticsChart
          platformBreakdown={platformBreakdown}
          totalClicks={summary.clicks}
          impressionsTrend={summary.impressionsTrend}
          loading={loading}
          lastUpdatedAt={lastUpdatedAt}
        />
        <PlatformBreakdown
          platformBreakdown={platformBreakdown}
          connectedCount={connectedPlatforms.length}
          loading={loading}
        />
        <ActivityFeed
          connectedPlatforms={connectedPlatforms}
          totalImpressions={summary.impressions}
          totalClicks={summary.clicks}
          isLive={isLive}
          lastUpdatedAt={lastUpdatedAt}
        />
        <PostCalendar />
      </div>

      {/* Bottom Segment: Interactive connection Switches and editable store details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Interactive connection Toggles with rich metadata grids */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl lg:col-span-2 space-y-6 bg-white">
          <div className="text-left border-b border-brand-beige/50 pb-3 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-serif font-black text-xl text-brand-primary">{t("Network Synchronization Switchboard", language)}</h3>
              <p className="text-xs text-brand-secondary mt-0.5">
                {t("Toggle channels live to configure automated local listings. Watch search metrics updates dynamically.", language)}
              </p>
            </div>
            <div className="text-[10px] font-mono uppercase bg-brand-gold/15 text-[#C9A96E] font-bold px-2 py-1 rounded">
              {t("Total Powered: 12 Directories", language)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {allPlatforms.map((pt) => {
              const isConnected = connectedPlatforms.includes(pt.name);
              const getSyncFrequency = (name: string) => {
                if (["Google Maps", "Google Search", "WhatsApp Business"].includes(name)) return "Real-time";
                if (["Instagram", "Facebook", "ChatGPT Discovery"].includes(name)) return "15M Interval";
                return "Daily Sync";
              };
              const getPlatformReach = (name: string) => {
                if (["Google Maps", "Google Search"].includes(name)) return "Extreme (5.0★)";
                if (["WhatsApp Business", "Instagram"].includes(name)) return "High (4.8★)";
                return "Targeted (4.5★)";
              };
              const getPlatformDomain = (name: string) => {
                if (["Google Maps", "Apple Maps"].includes(name)) return "Navigation GIS";
                if (["Google Search", "ChatGPT Discovery"].includes(name)) return "Local Search Index";
                if (["Instagram", "Facebook", "YouTube Shorts"].includes(name)) return "Consumer Social";
                if (["WhatsApp Business", "SMS"].includes(name)) return "B2B Messaging";
                return "Industry Directory";
              };

              return (
                <button
                  key={pt.name}
                  onClick={() => handleTogglePlatform(pt.name)}
                  className={cn(
                    "p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 transform active:scale-[0.98] hover:shadow-sm flex flex-col justify-between h-[126px] relative group",
                    isConnected 
                      ? "bg-[#f0f9f1] border-green-300 text-brand-primary" 
                      : "bg-brand-bg/25 border-brand-beige/50 text-brand-secondary/70 hover:border-brand-gold/30"
                  )}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="h-9 w-9 flex items-center justify-center bg-white/80 rounded-lg p-1.5 border border-brand-beige/30 shrink-0">
                      {getLogoComponent(pt.name, "w-6 h-6 object-contain rounded")}
                    </div>
                    
                    {/* Status badge pill */}
                    <span className={cn(
                      "text-[9px] font-mono uppercase font-black px-1.5 py-0.5 rounded-md",
                      isConnected 
                        ? "bg-green-100 text-green-700 font-bold" 
                        : "bg-brand-bg/50 text-brand-secondary/40"
                    )}>
                      {isConnected ? t("Active", language) : t("Offline", language)}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold block text-brand-primary leading-tight font-serif mt-2">
                      {pt.name}
                    </span>
                    <span className="text-[9px] font-mono text-brand-secondary/80 block leading-tight mt-0.5">
                      {getPlatformDomain(pt.name)}
                    </span>
                  </div>

                  {/* High Density technical metadata rows */}
                  <div className="border-t border-brand-beige/40 pt-1.5 mt-1.5 flex justify-between items-center text-[8.5px] font-mono w-full text-brand-secondary/90">
                    <span>{getSyncFrequency(pt.name)}</span>
                    <span className="font-semibold text-brand-primary">{getPlatformReach(pt.name)}</span>
                  </div>

                  {/* Hover visual cue */}
                  <div className="absolute inset-0 bg-brand-gold/[0.02] opacity-0 group-hover:opacity-100 rounded-xl transition-all pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Store Detail mock synchronizer */}
        <div className="glass-card-premium p-6 rounded-2xl text-left space-y-4">
          <div className="flex items-center justify-between border-b border-brand-beige/50 pb-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-gold" />
              <h3 className="font-serif font-black text-lg text-brand-primary">
                {t("Merchant Identity", language)}
              </h3>
            </div>
            <button 
              onClick={() => setEditing(!editing)}
              className="text-xs font-bold text-brand-gold hover:text-brand-primary transition-colors cursor-pointer px-2 py-0.5 bg-brand-gold/5 rounded border border-brand-gold/10"
            >
              {editing ? t("Cancel", language) : t("Modify Details", language)}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <Input 
                label={t("Registered Business Name", language)}
                value={shopName}
                onChange={e => setLocalShopName(e.target.value)}
                required
              />
              <Input 
                label={t("Physical Address", language)}
                value={shopAddress}
                onChange={e => setLocalShopAddress(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                  {t("Core Catalog Keywords", language)}
                </label>
                <textarea 
                  value={shopProducts}
                  onChange={e => setLocalShopProducts(e.target.value)}
                  className="w-full text-xs rounded-xl border border-brand-beige bg-white p-3 text-brand-primary focus:border-brand-gold focus:outline-none placeholder-brand-secondary/50 font-medium"
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" size="md" className="w-full !rounded-xl">
                {t("Publish Updates", language)}
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              {/* KYB Approved Indicator Shield */}
              <div className="p-3 rounded-xl bg-[#f0f9f1] border border-green-200 flex items-center gap-2.5 bg-green-50/50">
                <ShieldCheck className="h-5 w-5 text-green-700 shrink-0" />
                <div className="text-xs">
                  <span className="font-black text-green-800 block">{t("KYB Verified Outpost", language)}</span>
                  <span className="text-[10px] text-green-600 font-mono">{t("Status: Autopilot Publishing Secured", language)}</span>
                </div>
              </div>

              {/* Tabular details block mimicking trading logs */}
              <div className="divide-y divide-brand-beige/50 text-xs border border-brand-beige/50 rounded-xl overflow-hidden bg-brand-bg/5">
                <div className="p-2.5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-brand-secondary font-bold">{t("Trading Name", language)}</span>
                  <span className="font-serif font-black text-brand-primary text-right">{shopName}</span>
                </div>
                <div className="p-2.5 flex flex-col gap-0.5 text-left bg-white">
                  <span className="text-[10px] uppercase font-mono text-brand-secondary font-bold">{t("Trade Location & Hub", language)}</span>
                  <span className="text-brand-primary leading-relaxed text-left font-medium">{shopAddress}</span>
                </div>
                <div className="p-2.5 flex flex-col gap-0.5 text-left bg-brand-bg/5">
                  <span className="text-[10px] uppercase font-mono text-brand-secondary font-bold">{t("Stock Tags cataloged", language)}</span>
                  <span className="text-brand-secondary font-medium leading-relaxed italic">"{shopProducts}"</span>
                </div>
              </div>

              <div className="p-2 bg-brand-gold/10 text-brand-gold text-[10.5px] rounded-lg font-semibold flex items-center gap-1.5">
                <span>⚡ {t("Broadcast Range:", language)}</span>
                <span className="font-bold text-brand-primary font-mono">{t("100% Karnataka Hubs", language)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Vernacular Translations & Customer Stream Layer */}
      <div className="border-t border-brand-beige/50 pt-10 space-y-4 relative">
        <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-brand-gold/60 to-transparent" />
        <span className="section-eyebrow">Live Broadcasts</span>
        <h3 className="section-title text-2xl md:text-3xl text-left -mt-2">
          {t("Vernacular Broadcasts & Customer Stream", language)}
        </h3>
        <p className="text-xs text-brand-secondary text-left -mt-2">
          {t("Harness the power of local languages to hook regional buyers and monitor your automatic push notifications instantly.", language)}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <MultilingualTranslator />
          <WhatsAppMockup />
        </div>
      </div>

    </div>
  );
};

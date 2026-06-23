import React from "react";
import { Sparkles, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import type { MerchantPreferences } from "../../lib/merchantPreferences";
import { Button } from "../ui/Button";

interface SubscriptionUpgradeCardProps {
  preferences: MerchantPreferences | null;
  syncing?: boolean;
  onRecalculate?: () => void;
  onPageChange?: (page: string) => void;
}

export const SubscriptionUpgradeCard: React.FC<SubscriptionUpgradeCardProps> = ({
  preferences,
  syncing = false,
  onRecalculate,
  onPageChange,
}) => {
  if (!preferences) {
    return (
      <div className="glass-card p-5 rounded-2xl text-left">
        <span className="section-eyebrow mb-3">Smart Plan</span>
        <p className="text-xs text-brand-secondary">
          Set your store details in Profile or use the Cost Calculator — your plan upgrades automatically.
        </p>
        {onPageChange && (
          <Button size="sm" className="mt-4" onClick={() => onPageChange("pricing")}>
            Calculate My Plan
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card-premium p-5 rounded-2xl text-left relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="section-eyebrow mb-2 inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Auto-Upgrade Active
          </span>
          <h3 className="font-serif font-black text-lg text-brand-primary">
            {preferences.tierName} Plan
          </h3>
        </div>
        {syncing && <RefreshCw className="h-4 w-4 text-brand-gold animate-spin shrink-0" />}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="panel-card p-3">
          <span className="text-[10px] font-mono uppercase text-brand-secondary block">Monthly</span>
          <span className="text-xl font-serif font-black text-brand-primary">
            {formatCurrency(preferences.monthlyPrice)}
          </span>
        </div>
        <div className="panel-card p-3">
          <span className="text-[10px] font-mono uppercase text-brand-secondary block">Platforms</span>
          <span className="text-xl font-serif font-black text-brand-primary flex items-center gap-1">
            <Zap className="h-4 w-4 text-brand-gold" />
            {preferences.platformsCount}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-brand-secondary leading-relaxed mb-3">
        Adjusts from your shop category, location, platform pack, and sync settings — no manual tier picking.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-[9px] font-mono bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/20">
          {preferences.locationLabel.split(" ")[0]}
        </span>
        <span className="text-[9px] font-mono bg-brand-beige/30 text-brand-primary px-2 py-0.5 rounded-full">
          {preferences.productLabel.split("(")[0].trim()}
        </span>
        <span className="text-[9px] font-mono bg-brand-beige/30 text-brand-primary px-2 py-0.5 rounded-full">
          {preferences.syncIntervalMinutes ? `${preferences.syncIntervalMinutes}m sync` : "15m sync"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-brand-success font-semibold">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>₹0 first month — plan scales as your store grows</span>
      </div>

      {onRecalculate && (
        <button
          type="button"
          onClick={onRecalculate}
          className="mt-4 text-[11px] font-mono font-bold text-brand-gold hover:text-brand-primary underline underline-offset-2 cursor-pointer"
        >
          Recalculate from latest preferences
        </button>
      )}
    </div>
  );
};

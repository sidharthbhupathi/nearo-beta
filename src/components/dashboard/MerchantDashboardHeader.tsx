import React from "react";
import { MapPin, Radio } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";
import { PLATFORM_COUNT } from "../../lib/platforms";

interface MerchantDashboardHeaderProps {
  shopName: string;
  shopAddress: string;
  connectedCount: number;
  isLive: boolean;
  syncing: boolean;
}

/** Merchant-facing dashboard header — no internal ops metadata */
export const MerchantDashboardHeader: React.FC<MerchantDashboardHeaderProps> = ({
  shopName,
  shopAddress,
  connectedCount,
  isLive,
  syncing,
}) => {
  const { language } = useLanguage();

  return (
    <div className="glass-card-premium p-6 md:p-8 rounded-3xl text-left relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <span className="section-eyebrow">{t("Your Store Dashboard", language)}</span>
          <h2 className="section-title text-2xl md:text-3xl truncate">{shopName}</h2>
          <p className="text-xs text-brand-secondary flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
            <span className="line-clamp-2">{shopAddress}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10.5px] shrink-0">
          <span className="font-mono bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded font-bold border border-brand-gold/20 flex items-center gap-1">
            <Radio className="h-3 w-3" />
            {connectedCount} / {PLATFORM_COUNT} {t("channels", language)}
          </span>
          <span
            className={cn(
              "font-mono px-2.5 py-1 rounded font-bold border",
              isLive
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-brand-bg/50 text-brand-secondary border-brand-beige"
            )}
          >
            {isLive ? t("● Live sync", language) : t("● Demo mode", language)}
          </span>
          {syncing && (
            <span className="font-mono bg-brand-gold/10 text-brand-primary px-2.5 py-1 rounded font-bold border border-brand-gold/20 animate-pulse">
              {t("Syncing…", language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

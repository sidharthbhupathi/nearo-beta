import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, Eye, Calendar } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";

interface TotalImpressionsCardProps {
  totalImpressions: number;
  impressionsTrend: number;
  monthlyImpressions: number;
  loading?: boolean;
  lastUpdatedAt?: Date | null;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export const TotalImpressionsCard: React.FC<TotalImpressionsCardProps> = ({
  totalImpressions,
  impressionsTrend,
  monthlyImpressions,
  loading = false,
  lastUpdatedAt,
}) => {
  const { language } = useLanguage();
  const trendLabel = `${impressionsTrend >= 0 ? "+" : ""}${impressionsTrend.toFixed(1)}%`;
  const isPositiveTrend = impressionsTrend >= 0;

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl text-left flex flex-col justify-between min-h-[190px] h-full">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/15">
              <Eye className="h-4 w-4 text-brand-gold" />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-secondary font-black">
              {t("Total Impressions", language)}
            </span>
          </div>
          <span className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isPositiveTrend
              ? "text-brand-success bg-[#f0f9f1] border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}>
            {isPositiveTrend ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>{loading ? "…" : trendLabel}</span>
          </span>
        </div>

        <div className="pt-2 z-10 relative">
          <h4 className="text-4xl font-serif font-black text-brand-primary tracking-tight">
            {loading ? "—" : formatNumber(totalImpressions)}{" "}
            <span className="text-xs font-sans text-brand-secondary font-normal">views</span>
          </h4>
          <p className="text-xs text-brand-secondary mt-1">
            {t("Calculated live footprint of catalog items broadcasted of this week.", language)}
          </p>
        </div>
      </div>

      <div className="border-t border-brand-beige/50 pt-3 flex items-center justify-between text-[11px] font-mono text-brand-secondary">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-brand-gold" />
          <span>
            {t("This Month:", language)} {loading ? "—" : `${formatNumber(monthlyImpressions)} views`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-brand-primary">
          <span className="font-bold">
            {loading ? t("Syncing", language) : isPositiveTrend ? t("Upward Trend", language) : t("Cooling Off", language)}
          </span>
          <ArrowUpRight className={`h-3.5 w-3.5 stroke-[3px] ${isPositiveTrend ? "text-brand-success" : "text-red-500 rotate-90"}`} />
        </div>
      </div>
      {lastUpdatedAt && !loading && (
        <span className="text-[9px] font-mono text-brand-secondary/70 mt-1">
          {t("Live sync", language)} · {lastUpdatedAt.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

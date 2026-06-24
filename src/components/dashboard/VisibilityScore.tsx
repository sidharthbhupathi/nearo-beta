import React from "react";
import { motion } from "motion/react";
import { Award, CheckCircle2, AlertCircle, Shield, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";

interface VisibilityScoreProps {
  score?: number;
  compact?: boolean;
}

export const VisibilityScore: React.FC<VisibilityScoreProps> = ({ score = 78, compact = true }) => {
  const percentage = score;
  const radius = compact ? 42 : 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const { language } = useLanguage();
  const gaugeSize = compact ? 112 : 128;
  const center = gaugeSize / 2;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl text-left flex flex-col gap-4 min-w-0 h-full">
      <div className="flex items-center justify-between gap-2 border-b border-brand-beige/50 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Award className="h-4 w-4 text-brand-gold shrink-0" />
          <h4 className="font-serif font-black text-base text-brand-primary truncate">
            {t("Visibility Score", language)}
          </h4>
        </div>
        <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-brand-primary text-white rounded font-bold shrink-0">
          {t("Beta", language)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 min-w-0">
        <div
          className="relative shrink-0 flex items-center justify-center bg-brand-bg/25 rounded-2xl border border-brand-beige/50"
          style={{ width: gaugeSize, height: gaugeSize }}
        >
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox={`0 0 ${gaugeSize} ${gaugeSize}`}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(232, 220, 200, 0.4)"
              strokeWidth={10}
            />
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#C9A96E"
              strokeWidth={10}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeDasharray={circumference}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-serif font-black text-brand-primary">{percentage}%</span>
            <span className="text-[9px] uppercase font-mono tracking-wider text-brand-gold font-bold">
              {t("SEO Rank", language)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          <div className="p-2 border border-brand-beige/60 bg-brand-bg/15 rounded-lg min-w-0">
            <span className="text-[8px] uppercase font-mono text-brand-secondary block font-bold truncate">
              {t("Local Standing", language)}
            </span>
            <span className="text-[11px] font-bold text-brand-primary flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3 text-brand-success shrink-0" />
              <span className="truncate">{t("Growing", language)}</span>
            </span>
          </div>
          <div className="p-2 border border-brand-beige/60 bg-brand-bg/15 rounded-lg min-w-0">
            <span className="text-[8px] uppercase font-mono text-brand-secondary block font-bold truncate">
              {t("Daily Queries", language)}
            </span>
            <span className="text-[11px] font-bold text-brand-primary flex items-center gap-1 mt-0.5">
              <Users className="h-3 w-3 text-brand-gold shrink-0" />
              <span className="truncate">{t("Local reach", language)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-brand-beige/30 min-w-0">
        <span className="text-[9px] font-mono uppercase tracking-wider text-brand-secondary font-bold block">
          {t("Next steps", language)}
        </span>
        <div className="flex flex-col gap-2 text-[10px]">
          <div className="flex items-start gap-2 text-brand-success font-semibold bg-[#f0f9f1] p-2 rounded-lg border border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600 mt-0.5" />
            <span>{t("Complete KYB visit to unlock full publishing", language)}</span>
          </div>
          <div className="flex items-start gap-2 text-brand-gold font-semibold bg-brand-gold/5 p-2 rounded-lg border border-brand-beige/80">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-brand-gold mt-0.5" />
            <span>
              {percentage < 90
                ? t("Connect more channels in the switchboard below", language)
                : t("Strong omnichannel footprint", language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

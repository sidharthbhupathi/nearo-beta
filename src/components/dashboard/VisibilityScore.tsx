import React from "react";
import { motion } from "motion/react";
import { Award, CheckCircle2, AlertCircle, Shield, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";

interface VisibilityScoreProps {
  score?: number;
}

export const VisibilityScore: React.FC<VisibilityScoreProps> = ({ score = 78 }) => {
  const percentage = score;
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const { language } = useLanguage();

  return (
    <div className="glass-card glass-card-hover p-6 flex flex-col md:flex-row items-center gap-8 rounded-2xl">
      {/* SVG Radial Progress Gauge */}
      <div className="relative h-32 w-32 shrink-0 flex items-center justify-center bg-brand-bg/25 rounded-2xl p-4 border border-brand-beige/50">
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-brand-beigeFill stroke-[10] fill-none"
            style={{ stroke: "rgba(232, 220, 200, 0.4)" }}
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-brand-gold stroke-[10] fill-none"
            style={{ strokeLinecap: "round" }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-serif font-black text-brand-primary">{percentage}%</span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A96E] font-bold">{t("SEO Rank", language)}</span>
        </div>
      </div>

      {/* Highlights & Optimization Tips with beautiful dense Indian B2B layout metrics */}
      <div className="text-left flex-1 space-y-4 w-full">
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-brand-beige/50 pb-2.5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-gold shrink-0" />
            <h4 className="font-serif font-black text-lg text-brand-primary">{t("Merchant Index Status", language)}</h4>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-brand-primary text-white rounded font-bold">
            {t("Indiranagar Premium Tier", language)}
          </span>
        </div>

        {/* Highly Structured Informational Key-Value Metrics Grid matching Udaan style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2 border border-brand-beige/60 bg-brand-bg/15 rounded-lg">
            <span className="text-[9px] uppercase font-mono text-brand-secondary block font-bold">{t("Local Standing", language)}</span>
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3 text-brand-success shrink-0" /> {t("Top 15% stores", language)}
            </span>
          </div>
          <div className="p-2 border border-brand-beige/60 bg-brand-bg/15 rounded-lg">
            <span className="text-[9px] uppercase font-mono text-brand-secondary block font-bold">{t("Daily Queries", language)}</span>
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1 mt-0.5">
              <Users className="h-3 w-3 text-brand-gold shrink-0" /> {t("~500 searches", language)}
            </span>
          </div>
          <div className="p-2 border border-brand-beige/60 bg-brand-bg/15 rounded-lg col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase font-mono text-brand-secondary block font-bold">{t("Integrations", language)}</span>
            <span className="text-xs font-bold text-brand-primary flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-brand-primary shrink-0" /> {t("Multi-Sync Validated", language)}
            </span>
          </div>
        </div>

        {/* Optimization Action plan table/flow */}
        <div className="space-y-2 pt-1 border-t border-brand-beige/30">
          <span className="text-[9.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold block">
            {t("Incremental Optimization checklist:", language)}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2 text-brand-success font-semibold bg-[#f0f9f1] p-1.5 rounded-lg border border-green-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              <span>{t("Base Verification: KYC Approved (+20 pts)", language)}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-gold font-semibold bg-brand-gold/5 p-1.5 rounded-lg border border-brand-beige/80">
              <AlertCircle className="h-4 w-4 shrink-0 text-brand-gold" />
              <span className="line-clamp-1">
                {t("Connect more directory channels (", language)}
                {percentage < 90 ? t("SEO alert", language) : t("Robust", language)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

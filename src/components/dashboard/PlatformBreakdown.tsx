import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t } from "../../lib/translations";
import type { PlatformImpressionSlice } from "../../lib/firebase";

interface PlatformBreakdownProps {
  platformBreakdown: PlatformImpressionSlice[];
  connectedCount: number;
  loading?: boolean;
}

const FALLBACK_DATA = [
  { name: "Google Maps", value: 45, color: "#1A1A1A" },
  { name: "Instagram", value: 30, color: "#C9A96E" },
  { name: "WhatsApp Business", value: 15, color: "#E8DCC8" },
  { name: "Others", value: 10, color: "rgba(26, 26, 26, 0.2)" },
];

export const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({
  platformBreakdown,
  connectedCount,
  loading = false,
}) => {
  const { language } = useLanguage();

  const data = useMemo(() => {
    if (platformBreakdown.length === 0) {
      return FALLBACK_DATA;
    }

    return platformBreakdown.map((entry) => ({
      name: entry.name,
      value: entry.percentage,
      color: entry.color,
    }));
  }, [platformBreakdown]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-brand-beige bg-white text-left flex flex-col justify-between h-[360px] shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-brand-gold" />
          <span className="font-serif font-black text-base text-brand-primary block">
            {t("Platform Distribution Match", language)}
          </span>
        </div>
        <p className="text-xs text-brand-secondary">
          {t("Real-time relative organic traffic density index per directory platform.", language)}
        </p>
      </div>

      <div className="flex-1 mt-4 relative min-h-[170px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FDFBF7",
                border: "1px solid #E8DCC8",
                borderRadius: "12px",
                fontSize: "11px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center">
          <span className="text-lg font-serif font-black text-brand-primary">
            {loading ? "…" : `${connectedCount}+`}
          </span>
          <span className="text-[8.5px] font-mono uppercase text-brand-secondary font-black">{t("Channels", language)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-beige/50 text-[11px] font-mono">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-brand-secondary truncate">{item.name}</span>
            <span className="font-bold text-brand-primary shrink-0 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

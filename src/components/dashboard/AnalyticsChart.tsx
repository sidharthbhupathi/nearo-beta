import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t, translations } from "../../lib/translations";
import type { PlatformImpressionSlice } from "../../lib/firebase";

translations["Platform Impressions"] = {
  "Hindi (हिंदी)": "प्लेटफ़ॉर्म इंप्रेशन",
  "Kannada (ಕನ್ನಡ)": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಇಂಪ್ರೆಶನ್‌ಗಳು",
  "Tamil (தமிழ்)": "தளவமைப்பு பதிவுகள்"
};
translations["THIS WEEK"] = {
  "Hindi (हिंदी)": "इस सप्ताह",
  "Kannada (ಕನ್ನಡ)": "ಈ ವಾರ",
  "Tamil (தமிழ்)": "இந்த வாரம்"
};
translations["Total views across directories and social media:"] = {
  "Hindi (हिंदी)": "निर्देशिकाओं और सोशल मीडिया पर कुल योग:",
  "Kannada (ಕನ್ನಡ)": "ಡೈರೆಕ್ಟರಿಗಳು ಮತ್ತು ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮಗಳಲ್ಲಿ ಒಟ್ಟು ವೀಕ್ಷಣೆಗಳು:",
  "Tamil (தமிழ்)": "கோப்பகங்கள் மற்றும் சமூக ஊடகங்களில் மொத்த காட்சிகள்:"
};
translations["clicks"] = {
  "Hindi (हिंदी)": "क्लिक",
  "Kannada (ಕನ್ನಡ)": "ಕ್ಲಿಕ್‌ಗಳು",
  "Tamil (தமிழ்)": "கிளிக்குகள்"
};
translations["impressions increase"] = {
  "Hindi (हिंदी)": "इंप्रेशन में वृद्धि",
  "Kannada (ಕನ್ನಡ)": "ಇಂಪ್ರೆಶನ್‌ಗಳ ಹೆಚ್ಚಳ",
  "Tamil (தமிழ்)": "பதிவுகள் அதிகரிப்பு"
};
translations["impressions decrease"] = {
  "Hindi (हिंदी)": "इंप्रेशन में कमी",
  "Kannada (ಕನ್ನಡ)": "ಇಂಪ್ರೆಶನ್‌ಗಳ ಕುಸಿತ",
  "Tamil (தமிழ்)": "பதிவுகள் குறைவு"
};
translations["Updated 10m ago"] = {
  "Hindi (हिंदी)": "10 मिनट पहले अपडेट किया गया",
  "Kannada (ಕನ್ನಡ)": "10 ನಿಮಿಷಗಳ ಮೊದಲು ನವೀಕರಿಸಲಾಗಿದೆ",
  "Tamil (தமிழ்)": "10 நிமிடங்களுக்கு முன்பு புதுப்பிக்கப்பட்டது"
};
translations["Live sync active"] = {
  "Hindi (हिंदी)": "लाइव सिंक सक्रिय",
  "Kannada (ಕನ್ನಡ)": "ಲೈವ್ ಸಿಂಕ್ ಸಕ್ರಿಯ",
  "Tamil (தமிழ்)": "நேரடி ஒத்திசைவு செயலில்"
};
translations["Google Maps"] = { "Hindi (हिंदी)": "गूगल मैप्स", "Kannada (ಕನ್ನಡ)": "ಗೂಗಲ್ ನಕ್ಷೆಗಳು", "Tamil (தமிழ்)": "கூகுள் வரைபடம்" };
translations["Instagram"] = { "Hindi (हिंदी)": "इंस्टाग्राम", "Kannada (ಕನ್ನಡ)": "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್", "Tamil (தமிழ்)": "இன்ஸ்டாகிராம்" };
translations["WhatsApp"] = { "Hindi (हिंदी)": "व्हाट्सएप", "Kannada (ಕನ್ನಡ)": "ವಾಟ್ಸಾಪ್", "Tamil (தமிழ்)": "வாட்ஸ்அப்" };
translations["WhatsApp Business"] = { "Hindi (हिंदी)": "व्हाट्सएप बिज़नेस", "Kannada (ಕನ್ನಡ)": "ವಾಟ್ಸಾಪ್ ಬಿಸಿನೆಸ್", "Tamil (தமிழ்)": "வாட்ஸ்அப் பusiness" };
translations["Others"] = { "Hindi (हिंदी)": "अन्य", "Kannada (ಕನ್ನಡ)": "ಇತರರು", "Tamil (தமிழ்)": "மற்றவை" };

interface AnalyticsChartProps {
  platformBreakdown: PlatformImpressionSlice[];
  totalClicks: number;
  impressionsTrend: number;
  loading?: boolean;
  lastUpdatedAt?: Date | null;
}

const FALLBACK_DATA = [
  { name: "Google Maps", impressions: 567, color: "#1A1A1A" },
  { name: "Instagram", impressions: 345, color: "#C9A96E" },
  { name: "WhatsApp", impressions: 234, color: "#C9A96E" },
  { name: "Others", impressions: 88, color: "rgba(201, 169, 110, 0.4)" },
];

function formatUpdatedLabel(lastUpdatedAt: Date | null | undefined, language: string): string {
  if (!lastUpdatedAt) return t("Updated 10m ago", language);
  const seconds = Math.max(0, Math.floor((Date.now() - lastUpdatedAt.getTime()) / 1000));
  if (seconds < 5) return t("Live sync active", language);
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  platformBreakdown,
  totalClicks,
  impressionsTrend,
  loading = false,
  lastUpdatedAt,
}) => {
  const { language } = useLanguage();

  const data = useMemo(() => {
    if (platformBreakdown.length === 0) {
      return FALLBACK_DATA.map((entry) => ({
        ...entry,
        name: t(entry.name, language),
      }));
    }

    return platformBreakdown.map((entry) => ({
      name: t(entry.name === "WhatsApp Business" ? "WhatsApp" : entry.name, language),
      impressions: entry.impressions,
      color: entry.color,
    }));
  }, [platformBreakdown, language]);

  const trendLabel = `${impressionsTrend >= 0 ? "+" : ""}${impressionsTrend.toFixed(0)}%`;
  const isPositiveTrend = impressionsTrend >= 0;

  return (
    <div className="glass-card p-6 rounded-2xl border border-brand-beige flex flex-col justify-between h-[360px] bg-white shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-gold" />
            <span className="font-serif font-black text-base text-brand-primary block">{t("Platform Impressions", language)}</span>
          </div>
          <span className="text-[10px] uppercase font-mono bg-brand-gold/15 text-brand-primary px-2.5 py-1 rounded-full font-bold">
            {t("THIS WEEK", language)}
          </span>
        </div>
        <p className="text-xs text-brand-secondary -mt-2 text-left">
          {t("Total views across directories and social media:", language)}{" "}
          <strong className="text-brand-primary">
            {loading ? "—" : totalClicks.toLocaleString("en-IN")} {t("clicks", language)}
          </strong>
        </p>
      </div>

      <div className="flex-1 min-h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(232, 220, 200, 0.3)" />
            <XAxis
              dataKey="name"
              stroke="#5C5C5C"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#5C5C5C"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FDFBF7",
                border: "1px solid #E8DCC8",
                borderRadius: "12px",
                fontSize: "11px",
              }}
              cursor={{ fill: "rgba(201,169,110,0.05)" }}
            />
            <Bar dataKey="impressions" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-3 border-t border-brand-beige/40 flex items-center justify-between text-xs text-brand-secondary">
        <div className={`flex items-center gap-1.5 font-semibold ${isPositiveTrend ? "text-brand-success" : "text-red-600"}`}>
          {isPositiveTrend ? <TrendingUp className="h-4.5 w-4.5 rotate-6" /> : <TrendingDown className="h-4.5 w-4.5" />}
          <span>
            {loading ? "…" : trendLabel}{" "}
            {isPositiveTrend ? t("impressions increase", language) : t("impressions decrease", language)}
          </span>
        </div>
        <span className="text-[10px] font-mono">{formatUpdatedLabel(lastUpdatedAt, language)}</span>
      </div>
    </div>
  );
};

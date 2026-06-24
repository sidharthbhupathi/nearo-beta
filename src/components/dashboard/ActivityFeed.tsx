import React, { useMemo } from "react";
import { History, RefreshCcw } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { t, translations } from "../../lib/translations";

translations["Autopilot Sync Stream"] = {
  "Hindi (हिंदी)": "ऑटोपायलट सिंक स्ट्रीम",
  "Kannada (ಕನ್ನಡ)": "ಆಟೋಪೈಲಟ್ ಸಿಂಕ್ ಸ್ಟ್ರೀಮ್",
  "Tamil (தமிழ்)": "ஆட்டோபைலட் ஒத்திசைவு பதிவு"
};
translations["Live feeds"] = {
  "Hindi (हिंदी)": "लाइव फीड",
  "Kannada (ಕನ್ನಡ)": "ಲೈವ್ ಫೀಡ್‌ಗಳು",
  "Tamil (தமிழ்)": "நேரடி பதிவுகள்"
};
translations["LIVE"] = {
  "Hindi (हिंदी)": "लाइव",
  "Kannada (ಕನ್ನಡ)": "ಲೈವ್",
  "Tamil (தமிழ்)": "நேரலை"
};
translations["OPTIMIZED"] = {
  "Hindi (हिंदी)": "अनुकूलित",
  "Kannada (ಕನ್ನಡ)": "ಉತ್ತಮಗೊಳಿಸಲಾಗಿದೆ",
  "Tamil (தமிழ்)": "மேம்படுத்தப்பட்டது"
};
translations["BOOST"] = {
  "Hindi (हिंदी)": "बूस्ट",
  "Kannada (ಕನ್ನಡ)": "ಬೂಸ್ಟ್",
  "Tamil (தமிழ்)": "அதிவேகம்"
};
translations["SYNC"] = {
  "Hindi (हिंदी)": "सिंक",
  "Kannada (ಕನ್ನಡ)": "ಸಿಂಕ್",
  "Tamil (தமிழ்)": "ஒத்திசைவு"
};

interface ActivityFeedProps {
  connectedPlatforms: string[];
  totalImpressions: number;
  totalClicks: number;
  isLive: boolean;
  lastUpdatedAt?: Date | null;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  connectedPlatforms,
  totalImpressions,
  totalClicks,
  isLive,
  lastUpdatedAt,
}) => {
  const { language } = useLanguage();

  const activities = useMemo(() => {
    const primaryPlatform = connectedPlatforms[0] ?? "Google Business Profile";
    const socialPlatform = connectedPlatforms.find((platform) =>
      ["Instagram", "Facebook", "Meta Ads", "WhatsApp Business", "YouTube"].includes(platform)
    ) ?? "Instagram";
    const directoryPlatform = connectedPlatforms.find((platform) =>
      ["Justdial", "IndiaMART", "Google Search"].includes(platform)
    ) ?? "Justdial";

    const updatedLabel = lastUpdatedAt
      ? lastUpdatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "10:30 AM";

    return [
      {
        id: 1,
        text: `${primaryPlatform} broadcast synced ${connectedPlatforms.length} active channels with ${totalImpressions.toLocaleString("en-IN")} weekly impressions.`,
        time: `Today ${updatedLabel}`,
        badge: t("LIVE", language),
        badgeColor: "bg-green-100 text-green-700 border-green-200",
        channel: `${primaryPlatform} API`,
      },
      {
        id: 2,
        text: `${socialPlatform} autopilot refreshed catalog keywords and republished merchant promos.`,
        time: `Today ${updatedLabel}`,
        badge: t("SYNC", language),
        badgeColor: "bg-green-100 text-green-700 border-green-200",
        channel: `${socialPlatform} Meta API`,
      },
      {
        id: 3,
        text: `Visibility index recalculated from ${connectedPlatforms.length} connected platforms (${Math.min(100, Math.round(20 + connectedPlatforms.length * 6.5))}/100).`,
        time: `Today ${updatedLabel}`,
        badge: t("OPTIMIZED", language),
        badgeColor: "bg-brand-gold/15 text-brand-primary border-brand-gold/30",
        channel: "Local SEO Indexer",
      },
      {
        id: 4,
        text: `${totalClicks.toLocaleString("en-IN")} direct consumer clicks tracked from ${directoryPlatform} and map listings.`,
        time: `Today ${updatedLabel}`,
        badge: t("BOOST", language),
        badgeColor: "bg-brand-primary/10 text-brand-primary border-brand-beige",
        channel: `${directoryPlatform} Link`,
      },
    ];
  }, [connectedPlatforms, totalImpressions, totalClicks, lastUpdatedAt, language]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-brand-beige flex flex-col justify-between h-[360px] bg-white shadow-sm text-left">
      <div>
        <div className="flex items-center justify-between border-b border-brand-beige/50 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-gold" />
            <span className="font-serif font-black text-base text-brand-primary block">{t("Autopilot Sync Stream", language)}</span>
          </div>
          <span className="text-[10px] font-mono text-brand-secondary inline-flex items-center gap-1">
            <RefreshCcw className={`h-3 w-3 text-brand-gold ${isLive ? "animate-spin" : ""}`} />
            {isLive ? t("Live feeds", language) : t("Demo feeds", language)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex flex-col gap-1 text-xs border border-brand-beige/45 bg-brand-bg/5 p-2.5 rounded-xl text-left"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9.5px] uppercase font-mono text-brand-secondary font-black">
                {act.channel}
              </span>
              <span className={`text-[8.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ${act.badgeColor}`}>
                {act.badge}
              </span>
            </div>

            <p className="font-medium text-brand-primary leading-snug mt-0.5 text-left">
              {act.text}
            </p>

            <span className="text-[9px] text-brand-secondary/70 font-mono mt-1 block">
              ⏱ {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

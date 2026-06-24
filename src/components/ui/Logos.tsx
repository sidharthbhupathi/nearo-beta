import React from "react";
import {
  SiGooglemaps,
  SiGoogle,
  SiGoogleads,
  SiInstagram,
  SiFacebook,
  SiMeta,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";
import { normalizePlatformName } from "../../lib/platforms";

type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

/** Justdial & IndiaMART are not in Simple Icons — minimal brand-styled marks */
const JustdialMark: IconComponent = ({ className, style }) => (
  <svg viewBox="0 0 120 40" className={className} style={style} aria-hidden>
    <text x="2" y="28" fill="#005691" fontFamily="system-ui,sans-serif" fontWeight="800" fontSize="22">Just</text>
    <text x="52" y="28" fill="#FF6B00" fontFamily="system-ui,sans-serif" fontWeight="800" fontSize="22">dial</text>
  </svg>
);

const IndiaMartMark: IconComponent = ({ className, style }) => (
  <svg viewBox="0 0 120 40" className={className} style={style} aria-hidden>
    <text x="4" y="18" fill="#2E3192" fontFamily="system-ui,sans-serif" fontWeight="900" fontSize="11">INDIA</text>
    <text x="4" y="32" fill="#00A651" fontFamily="system-ui,sans-serif" fontWeight="900" fontSize="11">MART</text>
  </svg>
);

const BRAND_ICONS: Record<string, IconComponent> = {
  "Google Business Profile": SiGooglemaps,
  "Google Search": SiGoogle,
  "Google Ads": SiGoogleads,
  Instagram: SiInstagram,
  Facebook: SiFacebook,
  "Meta Ads": SiMeta,
  "WhatsApp Business": SiWhatsapp,
  Justdial: JustdialMark,
  YouTube: SiYoutube,
  IndiaMART: IndiaMartMark,
};

const BRAND_COLORS: Partial<Record<string, string>> = {
  "Google Business Profile": "#4285F4",
  "Google Search": "#4285F4",
  "Google Ads": "#4285F4",
  Instagram: "#E4405F",
  Facebook: "#1877F2",
  "Meta Ads": "#0668E1",
  "WhatsApp Business": "#25D366",
  YouTube: "#FF0000",
};

export const LogoWithFallback: React.FC<{ name: string; className?: string }> = ({
  name,
  className = "w-12 h-12",
}) => {
  const canonical = normalizePlatformName(name);
  const Icon = BRAND_ICONS[canonical];
  const isWordmark = canonical === "Justdial" || canonical === "IndiaMART";

  if (!Icon) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-xl bg-brand-beige/30 text-brand-secondary font-bold text-xs ${className}`}
        title={name}
      >
        {canonical.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-white border border-brand-beige/60 shadow-sm ${isWordmark ? "px-2 py-1" : "p-1.5"} ${className}`}
      title={canonical}
    >
      <Icon
        className={isWordmark ? "w-full h-auto" : "w-full h-full"}
        style={isWordmark ? undefined : { color: BRAND_COLORS[canonical] }}
      />
    </span>
  );
};

export const getLogoComponent = (name: string, className?: string) => {
  return <LogoWithFallback name={name} className={className} />;
};

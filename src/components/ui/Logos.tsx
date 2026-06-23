import React from "react";

export const GoogleMapsLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
    <mask id="google-maps-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" />
    </mask>
    <g mask="url(#google-maps-mask)">
      {/* Background fields */}
      <rect width="120" height="120" fill="#A8D08D" />
      {/* Horizontal river / roads */}
      <path d="M0 45 Q 60 50 120 40" stroke="#BDD7EE" strokeWidth="24" />
      {/* Vertical roads */}
      <path d="M40 -10 L 40 130" stroke="#FFFFFF" strokeWidth="20" />
      <path d="M-10 80 L 130 80" stroke="#FFFFFF" strokeWidth="16" />
      {/* Curved secondary roads */}
      <path d="M0 0 C 40 40, 80 80, 120 120" stroke="#FFFFFF" strokeWidth="8" />
      
      {/* White 'G' with green section */}
      <path d="M0 0 H50 V120 H0 Z" fill="#34A853" opacity="0.9" />
      <circle cx="28" cy="45" r="16" fill="#1E824C" />
      <text x="28" y="53" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="950" fontSize="23" textAnchor="middle">G</text>
      
      {/* Red location pin */}
      <g transform="translate(70, 20)">
        <ellipse cx="15" cy="34" rx="6" ry="2" fill="#7F7F7F" opacity="0.4" />
        <path d="M15 32 C 15 32 29 18 29 12 C 29 5.4 22.7 0 15 0 C 7.3 0 1 5.4 1 12 C 1 18 15 32 15 32 Z" fill="#EA4335" />
        <circle cx="15" cy="12" r="5" fill="#330000" opacity="0.7" />
        <circle cx="15" cy="12" r="4" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

export const GoogleSearchLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
    <g transform="scale(3.2) translate(6, 6)">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335" />
    </g>
  </svg>
);

export const InstagramLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  const gradId = "instagram-gradient-logos-file";
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gradId} cx="0.2" cy="1" r="0.95">
          <stop offset="0" stopColor="#FED976" />
          <stop offset="0.15" stopColor="#FEB24C" />
          <stop offset="0.3" stopColor="#FD8D3C" />
          <stop offset="0.45" stopColor="#FC4E2A" />
          <stop offset="0.6" stopColor="#E31A1C" />
          <stop offset="0.75" stopColor="#BD0026" />
          <stop offset="1" stopColor="#800026" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill={`url(#${gradId})`} />
      <rect x="28" y="28" width="64" height="64" rx="20" stroke="white" strokeWidth="6" />
      <circle cx="60" cy="60" r="16" stroke="white" strokeWidth="6" />
      <circle cx="82" cy="38" r="4" fill="white" />
    </svg>
  );
};

export const WhatsAppBusinessLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#25D366" />
    {/* Speech bubble outline */}
    <path d="M60 22 C39 22, 22 39, 22 60 C22 68.2, 24.6 75.8, 29 82 L24 97 L40 92.2 C45.8 95.8, 52.7 98, 60 98 C81 98, 98 81, 98 60 C98 39, 81 22, 60 22 Z" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    {/* Bold capital white B */}
    <text x="60" y="78" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="50" textAnchor="middle">B</text>
  </svg>
);

export const FacebookLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#1877F2" />
    <path d="M72.5 60h-10v30H50V60h-7V47.5h7v-9c0-9 5.5-14 13.5-14 3.8 0 7.2.3 8.1.4v9.4h-5.6c-4.4 0-5.2 2.1-5.2 5.1V47.5h10.5L72.5 60z" fill="white" />
  </svg>
);

export const JustdialLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#EAEAEA" strokeWidth="1" />
    <g transform="translate(4, 25)">
      {/* "Just" in blue */}
      <text x="5" y="48" fill="#005691" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="950" fontSize="31" letterSpacing="-1.2">Just</text>
      {/* "dial" in orange */}
      <text x="61" y="48" fill="#FF7A00" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="850" fontSize="31" letterSpacing="-1.2">dial</text>
      {/* Superscript circle R */}
      <text x="105" y="32" fill="#FF7A00" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="11">®</text>
    </g>
  </svg>
);

export const SulekhaLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#EAEAEA" strokeWidth="1" />
    <g transform="translate(10, 12)">
      {/* Spiral swooshes */}
      {/* Yellow/Orange top droplet */}
      <path d="M50 8C68.78 8 84 23.22 84 42C84 48.5 81.5 54.4 77.4 58.8C74.5 56.2 70.3 53.4 65.5 53.4C58.3 53.4 52.5 47.6 52.5 40.4C52.5 27.5 50 8 50 8Z" fill="#F0AF15" />
      {/* Red bottom droplet */}
      <path d="M50 72C31.22 72 16 56.78 16 38C16 31.5 18.5 25.6 22.6 21.2C25.5 23.8 29.7 26.6 34.5 26.6C41.7 26.6 47.5 32.4 47.5 39.6C47.5 52.5 50 72 50 72Z" fill="#D31D21" />
      {/* Words below in red sans-serif */}
      <text x="50" y="94" fill="#BF1E24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="950" fontSize="17" textAnchor="middle" letterSpacing="-0.3">Sulekha</text>
    </g>
  </svg>
);

export const AppleMapsLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
    <mask id="apple-maps-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
      <rect width="120" height="120" rx="26" fill="#FFFFFF" />
    </mask>
    <g mask="url(#apple-maps-mask)">
      {/* Map Grid Background */}
      {/* Green regions */}
      <path d="M0 0h120v120H0z" fill="#9CDD96" />
      {/* Water / Blue region on left/top */}
      <path d="M0 0 h60 L45 120 H0 Z" fill="#69C2FA" />
      {/* Orange/Yellow highway region at bottom right */}
      <path d="M60 120 L120 70 V120 Z" fill="#FFDC60" />
      
      {/* Overlapping grid roads */}
      {/* Curved main road */}
      <path d="M-10 60 Q 60 70 130 30" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
      <path d="M-10 60 Q 60 70 130 30" stroke="#FF6A8D" strokeWidth="8" strokeLinecap="round" /> {/* Pink highway overlay */}
      
      {/* Vertically sweeping white route */}
      <path d="M55 -10 C 65 50, 45 70, 75 130" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M55 -10 C 65 50, 45 70, 75 130" stroke="#007AFF" strokeWidth="4" /> {/* Blue path navigation line of Apple Maps! */}
      
      {/* White compass badge */}
      <circle cx="60" cy="61" r="24" fill="#FFFFFF" />
      <circle cx="60" cy="61" r="19" fill="#007AFF" />
      {/* White direct arrow */}
      <path d="M60 48 L69 70 L60 64 L51 70 Z" fill="#FFFFFF" transform="rotate(45, 60, 61)" />
    </g>
  </svg>
);

export const YouTubeShortsLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FF0000" />
    {/* White play-shaped Shorts logo */}
    <g transform="scale(3.8) translate(5.8, 5.8)">
      <path d="M17.77 9.89l-1.33-1c-.55-.42-1.34-.14-1.52.54a1.8 1.8 0 01-1.7 1.34c-1 0-1.8-.8-1.8-1.8 0-.6.3-1.2.85-1.52L14.7 6.1a1 1 0 00.32-1.4 1 1 0 00-1.4-.32L11 6.13c-2.03 1.2-2.73 3.8-1.55 5.86l1.33 2.27c.3.56.12 1.32-.42 1.63a1.8 1.8 0 01-.89.24 1.8 1.8 0 01-1.8-1.8c0-.6.3-1.2.84-1.51L10.3 11a1 1 0 00.32-1.4 1 1 0 00-1.4-.32l-2.4 1.2a4 4 0 00.2 7.15c2 .8 4.2-.1 5-2.1l1.37-2.3c.3-.5.97-.8 1.53-.8.85 0 1.52.68 1.52 1.52 0 .5-.2.95-.57 1.23l-1.23.83a1 1 0 101.1 1.66l1.24-.83A3.5 3.5 0 0017.77 9.89z" fill="white" />
    </g>
  </svg>
);

export const SmsLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#FFFFFF" stroke="#EAEAEA" strokeWidth="1" />
    <g transform="translate(14, 14)">
      {/* Background bubble: light blue/purple */}
      <path d="M50 18C31.22 18 16 33.22 16 52C16 59.12 18.2 65.73 21.96 71.21L16 92L37.66 85.73C41.3 87.17 45.45 88 50 88C68.78 88 84 72.78 84 52C84 33.22 68.78 18 50 18Z" fill="#8AB4F8" opacity="0.85" />
      {/* Foreground bubble: dark rich blue */}
      <path d="M70 33.33C52.66 33.33 38.6 47.4 38.6 64.71C38.6 71.3 40.63 77.44 44.1 82.51L38.6 101.67L58.59 95.87C62.03 97.2 65.86 98 70 98C87.34 98 101.4 83.93 101.4 64.71C101.4 47.4 87.34 33.33 70 33.33Z" fill="#1A73E8" />
    </g>
  </svg>
);

export const ChatGPTLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#10A37F" />
    {/* OpenAI/ChatGPT spiral structure scaled centered */}
    <g transform="scale(3.4) translate(5.6, 5.6)">
      <path d="M18.86 11.33a3.5 3.5 0 00-.51-2.9 3.55 3.55 0 00-2.31-1.63 3.55 3.55 0 00-.73-3.04 3.5 3.5 0 00-2.69-1.26 3.58 3.58 0 00-2.88 1.5A3.55 3.55 0 006.77 5.1a3.5 3.5 0 00-1.48 2.58 3.56 3.56 0 00-1.12 3.2 3.5 3.5 0 00.5 2.9 3.55 3.55 0 002.32 1.63c.12.92.51 1.77 1.13 2.44A3.54 3.54 0 009.28 19c.8.44 1.7.58 2.58.4a3.56 3.56 0 00-2.88-1.5c.9-.1 1.74-.53 2.37-1.19a3.54 3.54 0 001.12-3.18 3.56 3.56 0 001.13-2.2zm-4.7-5.58a1.64 1.64 0 011.23.57 1.62 1.62 0 01.4 1.3v.55a4.23 4.23 0 00-2.9-.1l-1.57-.45 1.12-1.93a1.63 1.63 0 011.72-.4zm-5.1-.38a1.64 1.64 0 011.12.35l1.58.91c.21.12.35.34.42.58a4.23 4.23 0 00-1.43 2.53l-.36 1.6-1.92-1.1a1.62 1.62 0 01-.84-1.15c0-.6.3-1.1.84-1.4l1.58-.91zm-2.8 4a1.62 1.62 0 01.37-1.28l.9-.9c.15-.15.35-.24.58-.27A4.23 4.23 0 008.57 12l.37 1.6-1.91 1.1a1.62 1.62 0 01-1.37 0c-.54-.3-.85-.85-.85-1.4v-.9zm1.18 5.6a1.64 1.64 0 01-.4-1.3v-.55a4.23 4.23 0 002.9.1l1.57.45-1.12 1.93a1.63 1.63 0 01-1.72.4c-.6-.1-1.1-.5-1.23-1.03zm5.1.37a1.64 1.64 0 01-1.12-.35l-1.58-.91a1.6 1.6 0 01-.42-.58 4.23 4.23 0 001.43-2.53l.36-1.6 1.92 1.1a1.62 1.62 0 01.84 1.15c0 .6-.3 1.1-.84 1.4l-1.58.91zm2.8-4a1.62 1.62 0 01-.37 1.28l-.93.93a1.6 1.6 0 01-.58.27 4.23 4.23 0 00-.98-2.65l-.36-1.6 1.9-1.1a1.62 1.62 0 011.37 0c.55.32.86.87.86 1.42v.92z" fill="white" />
    </g>
  </svg>
);

export const TikTokLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#000000" />
    <g transform="translate(26, 22)">
      {/* Blue shadow behind */}
      <path d="M47.78 40.54 a17 17 0 01-14.7-9.5V56.65 a17.15 17.15 0 11-12.82-16.63 v9.87 a7.26 7.26 0 105.56 7.03 V11.66 h7.26 a17 17 0 0014.7 12.25 v7.26 z" fill="#25F4EE" transform="translate(-1.5, -1.5)" />
      {/* Red shadow behind */}
      <path d="M47.78 40.54 a17 17 0 01-14.7-9.5V56.65 a17.15 17.15 0 11-12.82-16.63 v9.87 a7.26 7.26 0 105.56 7.03 V11.66 h7.26 a17 17 0 0014.7 12.25 v7.26 z" fill="#FE2C55" transform="translate(1.5, 1.5)" />
      {/* White main note */}
      <path d="M47.78 40.54 a17 17 0 01-14.7-9.5V56.65 a17.15 17.15 0 11-12.82-16.63 v9.87 a7.26 7.26 0 105.56 7.03 V11.66 h7.26 a17 17 0 0014.7 12.25 v7.26 z" fill="#FFFFFF" />
    </g>
  </svg>
);

const normalizeName = (name: string): string => {
  const lowered = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lowered.includes("whatsapp")) return "whatsapp";
  if (lowered.includes("justdial") || lowered.includes("just") || lowered.includes("jd")) return "justdial";
  if (lowered.includes("sulekha")) return "sulekha";
  if (lowered.includes("apple") || lowered.includes("applemaps")) return "applemaps";
  if (lowered.includes("googlemaps") || (lowered.includes("google") && lowered.includes("map"))) return "googlemaps";
  if (lowered.includes("googlesearch") || (lowered.includes("google") && lowered.includes("search"))) return "googlesearch";
  if (lowered.includes("instagram")) return "instagram";
  if (lowered.includes("facebook")) return "facebook";
  if (lowered.includes("youtubeshorts") || lowered.includes("youtube")) return "youtubeshorts";
  if (lowered.includes("sms") || lowered.includes("message")) return "messages";
  if (lowered.includes("chatgpt")) return "chatgpt";
  if (lowered.includes("tiktok")) return "tiktok";
  return lowered;
};

export const LogoWithFallback: React.FC<{ name: string; className?: string }> = ({ name, className = "w-12 h-12" }) => {
  const normalized = normalizeName(name);

  // Directly return outstanding, custom, pixel-perfect SVGs to guarantee immediate and extremely crisp vector displays matching the user's images exactly.
  switch (normalized) {
    case "googlemaps":
      return <GoogleMapsLogo className={className} />;
    case "googlesearch":
      return <GoogleSearchLogo className={className} />;
    case "instagram":
      return <InstagramLogo className={className} />;
    case "whatsapp":
      return <WhatsAppBusinessLogo className={className} />;
    case "facebook":
      return <FacebookLogo className={className} />;
    case "justdial":
      return <JustdialLogo className={className} />;
    case "sulekha":
      return <SulekhaLogo className={className} />;
    case "applemaps":
      return <AppleMapsLogo className={className} />;
    case "youtubeshorts":
      return <YouTubeShortsLogo className={className} />;
    case "messages":
      return <SmsLogo className={className} />;
    case "chatgpt":
      return <ChatGPTLogo className={className} />;
    case "tiktok":
      return <TikTokLogo className={className} />;
    default:
      return <span className="text-4xl text-brand-primary">🔗</span>;
  }
};

export const getLogoComponent = (name: string, className?: string) => {
  return <LogoWithFallback name={name} className={className} />;
};

import React from "react";
import { Check, X, ShieldCheck, HelpCircle } from "lucide-react";
import { PLATFORM_COUNT } from "../../lib/pricing";

export const ComparisonTable: React.FC = () => {
  const comparisonRows = [
    {
      feature: "Number of Platforms Synced",
      nearo: `${PLATFORM_COUNT} agency channels (search, ads, social, WhatsApp)`,
      diy: "1 (Usually just Google Maps)",
      agency: "Only 2 or 3 (Highly manual)"
    },
    {
      feature: "Digital Setup Friction",
      nearo: "Zero. In-Person Agent representative setup",
      diy: "High. Must manage logins & OTPs",
      agency: "Medium. Requests logins & docs"
    },
    {
      feature: "Daily Inventory Updates Method",
      nearo: "Simple WhatsApp texts to Bot",
      diy: "Must open 12 distinct apps",
      agency: "Requires emailing sheet to consultant"
    },
    {
      feature: "Multi-Language Translations",
      nearo: "Yes. Contextual Indian languages (A2 Ghee, etc.)",
      diy: "Requires manual Google Translate paste",
      agency: "Often poor or extra translation charge"
    },
    {
      feature: "SEO & Query Growth Focus",
      nearo: "Localized density matching & Maps keywords",
      diy: "Basic default profile only",
      agency: "Corporate/Global brand-focused metrics"
    },
    {
      feature: "Pricing Transparency",
      nearo: "Fair Regional Location Multiplier",
      diy: "Free (but infinite time sink)",
      agency: "Expensive flat retention fee (₹15K+/mo)"
    }
  ];

  return (
    <div className="py-16 border-t border-brand-beige/40 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="text-center mb-12">
        <span className="section-eyebrow mb-3 inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Value Comparison Matrix
        </span>
        <h3 className="section-title text-2xl md:text-3xl">NearLy Pro vs Competitors</h3>
        <div className="gold-divider my-3" />
        <p className="text-xs text-brand-secondary max-w-sm mx-auto mt-2">
          See how NearLy beats manual setups and expensive agencies for local retail.
        </p>
      </div>

      <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl glass-card-premium text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-primary text-white font-mono text-[10px] md:text-xs uppercase tracking-wider">
                <th className="py-4 px-5 text-left font-black">Comparison Pillar</th>
                <th className="py-4 px-5 text-left font-black text-brand-gold">NearLy Autopilot</th>
                <th className="py-4 px-5 text-left font-black opacity-8Full">Do It Yourself (DIY)</th>
                <th className="py-4 px-5 text-left font-black opacity-8Full">Typical SEO Agencies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige/30">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${idx % 2 === 0 ? "bg-brand-bg/5" : "bg-white"} hover:bg-brand-gold/5 transition-colors`}
                >
                  <td className="py-4 px-5 font-serif font-black text-brand-primary">
                    {row.feature}
                  </td>
                  <td className="py-4 px-5 font-bold text-brand-primary">
                    <span className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-brand-success shrink-0" />
                      {row.nearo}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-brand-secondary">
                    <span className="flex items-center gap-1.5">
                      <X className="h-4 w-4 text-[#e11d48] shrink-0" />
                      {row.diy}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-brand-secondary">
                    <span className="flex items-center gap-1.5">
                      <X className="h-4 w-4 text-brand-gold shrink-0" />
                      {row.agency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

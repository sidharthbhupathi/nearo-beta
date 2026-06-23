import React from "react";
import { formatCurrency } from "../../lib/utils";
import { Check, Info, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";

interface PriceDisplayProps {
  price: number;
  saving: number;
  platformsCount: number;
  onClaim: () => void;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, saving, platformsCount, onClaim }) => {
  return (
    <div className="glass-card-premium flex flex-col justify-between p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="absolute top-0 right-0 w-44 h-44 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-mono tracking-wider bg-brand-gold/20 text-brand-primary px-3 py-1 rounded-full font-bold">
            Guaranteed Savings
          </span>
          <span className="text-xs text-brand-secondary inline-flex items-center gap-1">
            <Info className="h-3 w-3 text-brand-gold" /> Cancel / downgrade anytime
          </span>
        </div>

        <h3 className="font-serif font-black text-2xl text-brand-primary mb-6">
          Your Customized Estimate
        </h3>

        {/* Big Price Badge */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl md:text-6xl font-serif font-black text-brand-primary">
              {formatCurrency(price)}
            </span>
            <span className="text-sm font-semibold text-brand-secondary">/month</span>
          </div>
          <p className="text-xs text-brand-secondary mt-1 italic">
            * ₹0 due today. Your first 30 days are 100% free.
          </p>
        </div>

        {/* Saving Highlight */}
        <div className="p-4 rounded-xl bg-[#f0f9f1] border border-green-200/50 flex items-center justify-between gap-3 mb-8">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#1b5e20] tracking-wider block">
              Direct Savings vs. Agencies
            </span>
            <span className="text-base font-bold text-[#1b5e20]">
              Save {formatCurrency(saving)} monthly
            </span>
          </div>
          <span className="text-2xl">⚡</span>
        </div>

        {/* Benefits bullets list */}
        <div className="space-y-3.5 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
            Included in every subscription:
          </h4>
          {[
            `Automatic sync to ${platformsCount}+ platforms`,
            "30-Minute In-Person Onboarding",
            "Automatic Weekly WhatsApp Reports",
            "Zero typing, zero code, zero complexity",
            "Dedicated neighborhood account buddy",
            "Official MSME trade billing standard",
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-brand-secondary">
              <Check className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Conversion CTA */}
      <div>
        <button
          onClick={onClaim}
          className="w-full text-center py-4 bg-brand-primary text-brand-bg hover:bg-brand-gold hover:text-brand-primary transition-all rounded-xl font-bold font-serif text-base tracking-wide shadow-lg active:scale-98 cursor-pointer"
        >
          Claim Your Free Month
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-center text-xs text-brand-secondary">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
          <span>No credit card required to start</span>
        </div>
      </div>
    </div>
  );
};

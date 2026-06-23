import React from "react";
import { motion } from "motion/react";
import { Button } from "../ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";
import { foundingCohortLabel } from "../../lib/beta";

interface FinalCTAProps {
  onPageChange: (page: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onPageChange }) => {
  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="glass-dark text-brand-bg rounded-3xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.22),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] sm:text-xs font-mono uppercase font-black border border-brand-gold/20">
            <Sparkles className="h-3 w-3 text-brand-gold" />
            <span>Claim your spot — First 100 Shops Get 30 Days Free</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
            Stop losing local customers to online conglomerates.
          </h2>
          <p className="text-sm md:text-base text-brand-bg/80 leading-relaxed max-w-lg font-medium">
            Apply via the waitlist. After we verify your shop in person, we program your search blueprint and sync your catalog automatically.
          </p>
          <p className="text-xs font-mono text-brand-bg/65 pt-1">{foundingCohortLabel()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto relative z-10">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onPageChange("waitlist")}
            className="w-full sm:w-auto text-center justify-center font-serif text-base tracking-wide flex items-center gap-2 border-0 cursor-pointer text-brand-primary"
          >
            Claim 30 Days Free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <button
            onClick={() => onPageChange("pricing")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-brand-bg/30 text-brand-bg hover:border-brand-gold/60 text-center font-bold text-sm transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center"
          >
            Calculate Multiplier Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

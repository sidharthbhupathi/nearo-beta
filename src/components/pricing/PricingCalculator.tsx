import React from "react";
import { motion } from "motion/react";
import { usePricingCalculator } from "../../hooks/usePricingCalculator";
import { PriceDisplay } from "./PriceDisplay";
import { cn } from "../../lib/utils";
import { ArrowRight, Calculator } from "lucide-react";

interface PricingCalculatorPageProps {
  onPageChange: (page: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorPageProps> = ({ onPageChange }) => {
  const {
    factors,
    selectedLocation,
    setSelectedLocation,
    selectedCrowd,
    setSelectedCrowd,
    selectedProducts,
    setSelectedProducts,
    selectedPlatforms,
    setSelectedPlatforms,
    price,
    saving,
    platformsCount,
  } = usePricingCalculator();

  return (
    <div className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-16">
        <span className="section-eyebrow mb-4">Fair Pricing Matrix</span>
        <h2 className="section-title text-3xl md:text-5xl">Calculate Your Price</h2>
        <div className="gold-divider my-4" />
        <p className="text-base text-brand-secondary max-w-xl mx-auto mt-4">
          We don't believe in charging rural shops the same as metropolitan city centers. Select your store parameters and find your price.
        </p>
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* LEFT/COLUMN: SELECTORS */}
        <div className="lg:col-span-2 space-y-10">
          {/* Factor Segment: Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              1. Where is your shop located?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {factors.location.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedLocation(opt)}
                  className={cn(
                    "glass-card p-4 rounded-xl text-left border flex flex-col justify-between cursor-pointer transition-all duration-300",
                    selectedLocation.label === opt.label
                      ? "border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/20"
                      : "border-brand-beige/50 bg-white hover:border-brand-gold/40"
                  )}
                >
                  <span className="font-semibold text-brand-primary text-sm">{opt.label}</span>
                  <span className="text-xs text-brand-secondary mt-2 block">
                    Weight: {opt.multiplier}x
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Factor Segment: Crowd Density */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              2. What is your neighborhood crowd density?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {factors.crowd.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedCrowd(opt)}
                  className={cn(
                    "glass-card p-4 rounded-xl text-left border flex flex-col justify-between cursor-pointer transition-all duration-300",
                    selectedCrowd.label === opt.label
                      ? "border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/20"
                      : "border-brand-beige/50 bg-white hover:border-brand-gold/40"
                  )}
                >
                  <span className="font-semibold text-brand-primary text-sm">{opt.label.split(" (")[0]}</span>
                  <span className="text-xs text-brand-secondary mt-2 block">
                    {opt.label.includes("(") ? opt.label.substring(opt.label.indexOf("(")) : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Factor Segment: Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              3. What is your store's retail product style?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {factors.products.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedProducts(opt)}
                  className={cn(
                    "glass-card p-4 rounded-xl text-left border flex flex-col justify-between cursor-pointer transition-all duration-300",
                    selectedProducts.label === opt.label
                      ? "border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/20"
                      : "border-brand-beige/50 bg-white hover:border-brand-gold/40"
                  )}
                >
                  <span className="font-semibold text-brand-primary text-sm">{opt.label.split(" (")[0]}</span>
                  <span className="text-xs text-brand-secondary mt-2 block">
                    {opt.label.includes("(") ? opt.label.substring(opt.label.indexOf("(")) : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Factor Segment: Platforms */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              4. Which channels package do you prefer?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {factors.platforms.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedPlatforms(opt)}
                  className={cn(
                    "glass-card p-4 rounded-xl text-left border flex flex-col justify-between cursor-pointer transition-all duration-300",
                    selectedPlatforms.label === opt.label
                      ? "border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/20"
                      : "border-brand-beige/50 bg-white hover:border-brand-gold/40"
                  )}
                >
                  <span className="font-semibold text-brand-primary text-sm">{opt.label}</span>
                  <span className="text-xs text-brand-secondary mt-2 block">
                    Weight: {opt.multiplier}x
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT/COLUMN: PRICE RESULTS CARD */}
        <div>
          <PriceDisplay
            price={price}
            saving={saving}
            platformsCount={platformsCount}
            onClaim={() => onPageChange("waitlist")}
          />
        </div>
      </div>
    </div>
  );
};

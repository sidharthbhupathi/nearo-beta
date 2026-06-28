import React from "react";
import { motion } from "motion/react";
import { Button } from "../ui/Button";
import { ArrowRight, Sparkles, MapPin, Search, Users } from "lucide-react";
import { BETA_LAUNCH_CITY, MERCHANTS_ONBOARDED, PLATFORM_COUNT } from "../../lib/pricing";
import { FOUNDING_DEMO_MERCHANT, DEMO_WEEKLY_IMPRESSIONS } from "../../lib/demoMerchant";

interface HeroProps {
  onPageChange: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onPageChange }) => {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-12 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full">
      {/* Decorative Warm Accent Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-brand-beige/25 blur-[90px] pointer-events-none" />

      {/* LEFT COLUMN: HERO INFORMATION */}
      <div className="flex-1 text-left z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-eyebrow mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
          <span>AI-Powered Visibility for Local Stores</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-brand-primary leading-[1.1] mb-6"
        >
          Your store is invisible. <br />
          <span className="text-gold-shine italic">We fix that.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-brand-secondary leading-relaxed max-w-xl mb-10"
        >
          Get discovered on Google Business Profile, Instagram, WhatsApp, and {PLATFORM_COUNT} agency-grade channels — automatically. No marketing agencies, no technical skills needed. ₹0 for your entire first month.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        >
          <Button
            onClick={() => onPageChange("pricing")}
            variant="primary"
            size="lg"
            className="group w-full sm:w-auto"
          >
            Calculate Your Price
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            onClick={() => {
              const el = document.getElementById("platforms-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            See Supported Platforms
          </Button>
        </motion.div>

        {/* Localized trust proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-6 border-t border-brand-beige/50 pt-8 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5 -mx-2 px-2 rounded-2xl"
        >
          <div className="flex -space-x-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-gold to-[#b8924f] border-2 border-brand-bg flex items-center justify-center font-bold text-[10px] text-brand-primary">
              {FOUNDING_DEMO_MERCHANT.initials}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-gold" />
              <span className="font-semibold text-brand-primary text-sm">
                {MERCHANTS_ONBOARDED} merchant onboarded
              </span>
            </div>
            <span className="text-xs text-brand-secondary">
              {FOUNDING_DEMO_MERCHANT.storeName} · {BETA_LAUNCH_CITY} founding beta
            </span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: MODERN VINTAGE MOCKUP DESIGN */}
      <div className="flex-1 w-full flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Main Visual: Search Discovery Mockup Card */}
          <div className="glass-card-premium relative z-20 p-6 md:p-8 rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
            {/* Inner frame Header */}
            <div className="flex items-center justify-between border-b border-brand-beige/40 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-brand-error" />
                <div className="h-3 w-3 rounded-full bg-brand-gold" />
                <div className="h-3 w-3 rounded-full bg-brand-success" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#5C5C5C] font-semibold bg-brand-beige/30 px-3 py-1 rounded-full">
                SAMPLE GOOGLE MAPS LISTING
              </span>
            </div>

            {/* Simulated Google Maps/Search Bar */}
            <div className="flex items-center gap-3 bg-brand-bg border border-brand-beige rounded-2xl py-3 px-4 mb-6 shadow-inner text-brand-secondary text-sm">
              <Search className="h-4 w-4 text-brand-gold" />
              <span className="font-medium text-brand-primary">"Organic A2 Desi Ghee near me"</span>
            </div>

            {/* Listing Result details */}
            <div className="bg-white/90 border border-brand-gold/30 rounded-2xl p-5 mb-4 shadow-sm hover:border-brand-gold transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif font-black text-lg text-brand-primary">{FOUNDING_DEMO_MERCHANT.storeName}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-brand-gold">4.9</span>
                    <div className="flex text-brand-gold">
                      {"★★★★★".split("").map((s, idx) => (
                        <span key={idx} className="text-xs">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-secondary">(sample listing preview)</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-1 bg-brand-gold/15 text-brand-primary rounded-md border border-brand-gold/20">
                  Open Now
                </span>
              </div>

              {/* Physical details with icons */}
              <div className="flex items-center gap-1.5 text-xs text-brand-secondary mt-3">
                <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                <span>{FOUNDING_DEMO_MERCHANT.locality}, Bengaluru • sample listing</span>
              </div>

              {/* Real-time sync signals */}
              <div className="mt-4 pt-3 border-t border-brand-beige/40 flex flex-wrap gap-2">
                <span className="text-[10px] font-medium bg-[#f0f9f1] border border-green-200 text-[#1b5e20] px-2.5 py-1 rounded-full">
                  ✓ Verified on Google Maps
                </span>
                <span className="text-[10px] font-medium bg-[#fffdeb] border border-amber-200 text-[#7f5f00] px-2.5 py-1 rounded-full">
                  ✓ Active on Instagram
                </span>
                <span className="text-[10px] font-medium bg-[#f5f0fc] border border-purple-200 text-[#4a148c] px-2.5 py-1 rounded-full">
                  ✓ WhatsApp Catalog Online
                </span>
              </div>
            </div>

            {/* Extra floating metrics element inside */}
            <div className="flex items-center justify-between bg-brand-primary rounded-xl p-4.5 text-brand-bg">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-brand-beige/70">Local Discovery</span>
                <span className="text-lg font-serif font-bold text-white block mt-0.5">
                  {DEMO_WEEKLY_IMPRESSIONS.toLocaleString("en-IN")} weekly impressions
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand-gold/25 border border-brand-gold flex items-center justify-center font-bold text-brand-gold text-sm">
                📈
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute right-2 sm:right-4 top-2 sm:-top-3 z-30 rotate-3 sm:rotate-6 bg-brand-gold text-brand-primary py-2 px-3 sm:px-4 rounded-xl shadow-lg border border-brand-primary font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
            ₹0 first month!
          </div>
        </motion.div>
      </div>
    </section>
  );
};

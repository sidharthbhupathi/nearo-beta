import React from "react";
import { WaitlistForm } from "../components/waitlist/WaitlistForm";
import { MERCHANTS_ONBOARDED } from "../lib/pricing";
import { ShieldCheck, Sparkles, Users, MapPin, Gift } from "lucide-react";

const perks = [
  { icon: Gift, title: "₹0 First Month", desc: "Full platform access with zero upfront payment." },
  { icon: MapPin, title: "In-Person Setup", desc: "A Nearo agent visits your store and handles everything." },
  { icon: Users, title: "Beta Cohort", desc: "Be among the first merchants onboarded on Nearo." },
  { icon: ShieldCheck, title: "Secure & Swadeshi", desc: "KYB-verified onboarding with Indian retail standards." },
];

export const Waitlist: React.FC = () => {
  return (
    <div className="page-shell py-16 md:py-24 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <span className="section-eyebrow mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Beta Launch Enrollment
          </span>
          <h2 className="section-title text-3xl md:text-5xl">
            Ready for Ultimate <span className="text-gold-shine italic">Discoverability?</span>
          </h2>
          <div className="gold-divider my-4" />
          <p className="text-sm text-brand-secondary max-w-lg mx-auto">
            {MERCHANTS_ONBOARDED === 0
              ? "Be one of the first merchants in Bangalore. Safe data storage. Cancel or edit anytime."
              : `Join ${MERCHANTS_ONBOARDED}+ merchants in Bangalore. Safe data storage. Cancel or edit anytime.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <div className="glass-card-premium p-6 rounded-2xl text-left relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
              <h3 className="font-serif font-black text-lg text-brand-primary mb-4">
                Why merchants join Nearo
              </h3>
              <div className="space-y-4">
                {perks.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-gold/15 to-brand-gold/5 border border-brand-gold/20 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-brand-primary block">{title}</span>
                      <span className="text-xs text-brand-secondary leading-relaxed">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-5 text-brand-bg text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold block mb-2">
                Limited Beta Slots
              </span>
              <p className="text-xs text-brand-bg/80 leading-relaxed">
                First 100 shops get 30 days free plus priority onboarding. A Nearo representative will reach out on WhatsApp within 24 hours.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { PLATFORM_COUNT } from "../../lib/pricing";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is NearLy, and how does it help my store?",
      answer: "NearLy is a full-visibility digital sync agency tailored for small Indian physical businesses (like Kirana stores, sweet stalls, organic warehouses, and clothing spots). We handle all technical setups in-person to sync your physical location coordinates, daily stock updates, and localized keywords across Google Maps, WhatsApp Business, Justdial, Instagram, and 8+ other local platforms automatically."
    },
    {
      question: `Do I need a computer to manage these ${PLATFORM_COUNT} platforms?`,
      answer: "No, absolutely not! We believe in 'Zero-Setup Friction'. You do not need to download complex web panels or own a laptop. When our NearLy onboarding agent visits your shop in-person, they configure our automated sync engine. After that, you can simply text your fresh inventory or discounts to our verified WhatsApp bot, and our engine automatically translates and publishes the updates across all platform feeds."
    },
    {
      question: "What does the Pricing Multiplier calculate?",
      answer: "We support Swadeshi business values: rural/village general stores shouldn't pay the same high rates as premium city center outlets. Our pricing multiplier algorithm calculates your exact fair monthly subscription fee based on geographic region, localized crowd density around your store, your product focus, and the selected platform pack."
    },
    {
      question: "How do regional languages work on NearLy?",
      answer: "Native language capability is our core feature! Kannada, Hindi, Tamil, Telugu, Marathi, Bengali, and Malayalam are fully integrated. When you provide updates in simple English or your motherboard language, our server-side system localized by Gemini AI produces context-accurate vernacular title tags, ensuring neighborhood local buyers discover your products in their preferred dialect."
    },
    {
      question: "Are there any hidden API costs or set-up fees?",
      answer: "No hidden costs. The calculated price is fully transparent and all-inclusive of API charges, catalog translations, maps listings synchronization, and our in-persona onboarding visit. Plus, the first 30 days are completely free with zero termination penalty."
    }
  ];

  return (
    <div className="py-16 border-t border-brand-beige/40 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="text-center mb-12">
        <span className="section-eyebrow mb-3 inline-flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" /> Clarifications
        </span>
        <h3 className="section-title text-2xl md:text-3xl">Frequently Answered Doubts</h3>
        <div className="gold-divider my-3" />
        <p className="text-xs text-brand-secondary max-w-sm mx-auto mt-2">
          Plain answers about how we handle local catalogs, language options, and regional setups.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3.5 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left font-serif font-black text-brand-primary hover:text-brand-gold transition-colors"
              >
                <span className="text-sm md:text-base pr-4 leading-tight">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-brand-secondary shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-brand-secondary border-t border-brand-beige/20 leading-relaxed font-medium bg-brand-bg/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

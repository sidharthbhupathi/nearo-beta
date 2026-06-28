import React from "react";
import { motion } from "motion/react";

interface Step {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      step: "01",
      title: "We Visit You",
      description: "30-min in-person meeting to understand your store, map coordinates, and catalog details.",
      icon: "🏪",
    },
    {
      step: "02",
      title: "DNA Analysis",
      description: "We analyze products, neighborhood customer density, target demographic, and local demand.",
      icon: "🧬",
    },
    {
      step: "03",
      title: "AI Strategy",
      description: "Our server-side Gemini system develops a custom daily visibility plan tailored to your business.",
      icon: "🤖",
    },
    {
      step: "04",
      title: "Auto-Post",
      description: "High-quality descriptions, deals, and keywords go live on Google Business Profile and all connected agency channels automatically.",
      icon: "⚡",
    },
    {
      step: "05",
      title: "Weekly Report",
      description: "Receive a simple, jargon-free summary directly on your WhatsApp with customer visits and call numbers.",
      icon: "📊",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <span className="section-eyebrow mb-4">The NearLy Process</span>
        <h2 className="section-title text-3xl md:text-5xl">How NearLy Works</h2>
        <div className="gold-divider my-4" />
        <p className="text-base text-brand-secondary max-w-xl mx-auto mt-4">
          Getting on the digital map doesn’t require sitting inside a software program. We do the setup; you run your store.
        </p>
      </div>

      {/* Visual Timeline Row */}
      <div className="relative">
        {/* Connection Line representing timeline */}
        <div className="hidden lg:block absolute left-4 right-4 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover flex flex-col justify-between p-6 rounded-2xl relative z-10 group overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold/20 via-brand-gold to-brand-gold/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              {/* Card top banner with step number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-serif italic text-brand-gold/40 font-bold group-hover:text-brand-gold/80 transition-colors">
                  {item.step}
                </span>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-beige/40 to-brand-gold/10 border border-brand-gold/15 flex items-center justify-center text-2xl group-hover:from-brand-gold/20 group-hover:to-brand-gold/5 transition-all duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="font-serif font-black text-lg text-brand-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

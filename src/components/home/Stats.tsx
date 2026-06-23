import React from "react";
import { motion } from "motion/react";
import { MERCHANTS_ONBOARDED } from "../../lib/pricing";

export const Stats: React.FC = () => {
  const stats = [
    { value: String(MERCHANTS_ONBOARDED), label: "Stores Onboarded (Beta)", icon: "🏪" },
    { value: "12+", label: "Platforms Covered", icon: "🌐" },
    { value: "4.9", label: "Store Rating", icon: "⭐" },
    { value: "₹0", label: "First Month Free", icon: "🎁" },
  ];

  return (
    <section className="py-20 glass-dark text-brand-bg rounded-t-[40px] px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.18),transparent_55%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-brand-gold/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-center p-6 border-b lg:border-b-0 lg:border-r border-brand-bg/10 last:border-0 rounded-2xl hover:bg-white/5 transition-colors duration-300"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-gold/25 to-brand-gold/5 border border-brand-gold/20 flex items-center justify-center text-2xl mb-4">
              {stat.icon}
            </div>

            {/* Value (massive, serif display) */}
            <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white mb-2">
              {stat.value}
            </h3>
            <span className="text-xs uppercase font-mono tracking-wider text-brand-gold font-semibold">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

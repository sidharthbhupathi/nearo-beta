import React from "react";
import { motion } from "motion/react";
import { getLogoComponent } from "../ui/Logos";
import { NEARO_PLATFORMS, PLATFORM_COUNT } from "../../lib/platforms";

export const PlatformGrid: React.FC = () => {
  return (
    <section id="platforms-grid" className="py-24 bg-gradient-to-b from-brand-beige/15 via-brand-bg to-brand-beige/10 border-y border-brand-beige/40 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <span className="section-eyebrow mb-4">
          Agency-Grade Channels
        </span>
        <h2 className="section-title text-3xl md:text-5xl mb-3">
          {PLATFORM_COUNT} Platforms. <span className="text-gold-shine italic">One Subscription.</span>
        </h2>
        <div className="gold-divider mb-4" />
        <p className="text-base text-brand-secondary max-w-2xl mx-auto mb-16">
          The same channels Indian digital marketing agencies use for local retail — local search, paid ads, social, WhatsApp, and directories — synced from one dashboard.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {NEARO_PLATFORMS.map((platform, idx) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card glass-card-hover relative flex flex-col items-center justify-center p-6 rounded-2xl group cursor-default min-h-[11.5rem]"
            >
              <div className="mb-4 flex items-center justify-center h-14 w-14 transform transition-all group-hover:scale-110 duration-300">
                {getLogoComponent(platform.name, "w-12 h-12")}
              </div>

              <h3 className="font-serif font-black text-brand-primary text-sm md:text-base transition-colors group-hover:text-brand-gold leading-tight">
                {platform.name}
              </h3>

              <span className="mt-2 text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-brand-primary/5 text-brand-secondary group-hover:bg-brand-gold/20 group-hover:text-brand-primary font-semibold transition-colors duration-300">
                {platform.category}
              </span>

              <p className="mt-2 text-[10px] text-brand-secondary/80 leading-snug opacity-0 group-hover:opacity-100 transition-opacity">
                {platform.agencyRole}
              </p>

              <div className="absolute inset-0 bg-brand-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <div className="mt-14 max-w-xl mx-auto rounded-2xl bg-white/60 backdrop-blur-sm p-6 text-sm text-brand-secondary italic border border-brand-beige/50 shadow-sm">
          "Update your catalog on NearLy or text our WhatsApp bot — listings, posts, and ad-ready copy propagate to Google Business Profile, Meta, Justdial, and more."
        </div>
      </div>
    </section>
  );
};

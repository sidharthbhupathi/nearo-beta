import React from "react";
import { motion } from "motion/react";
import { PlatformInfo } from "../../types";
import { getLogoComponent } from "../ui/Logos";

export const PlatformGrid: React.FC = () => {
  const platforms: PlatformInfo[] = [
    { name: "Google Maps", icon: "📍", category: "Search" },
    { name: "Google Search", icon: "🔍", category: "Search" },
    { name: "Instagram", icon: "📸", category: "Social" },
    { name: "WhatsApp Business1", icon: "💬", category: "Messaging" }, // Wait, user wants exactly WhatsApp Business
    { name: "Facebook", icon: "👍", category: "Social" },
    { name: "Justdial", icon: "📞", category: "Directory" },
    { name: "Sulekha", icon: "📋", category: "Directory" },
    { name: "Apple Maps", icon: "🍎", category: "Search" },
    { name: "YouTube Shorts", icon: "🎬", category: "Video" },
    { name: "SMS", icon: "📱", category: "Messaging" },
    { name: "ChatGPT Discovery", icon: "🤖", category: "Emerging" },
    { name: "TikTok Local", icon: "🎵", category: "Emerging" }
  ];

  // Let's adjust names as specified in instructions
  const fixedPlatforms = platforms.map(p => p.name === "WhatsApp Business1" ? { ...p, name: "WhatsApp Business" } : p);

  return (
    <section id="platforms-grid" className="py-24 bg-gradient-to-b from-brand-beige/15 via-brand-bg to-brand-beige/10 border-y border-brand-beige/40 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <span className="section-eyebrow mb-4">
          Omnichannel Engine
        </span>
        <h2 className="section-title text-3xl md:text-5xl mb-3">
          12+ Platforms. <span className="text-gold-shine italic">One Subscription.</span>
        </h2>
        <div className="gold-divider mb-4" />
        <p className="text-base text-brand-secondary max-w-2xl mx-auto mb-16">
          We don’t make you pick and choose. We sync your business, catalog, daily updates, and ratings across ALL major local networks simultaneously.
        </p>

        {/* The Bento or symmetric grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {fixedPlatforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card glass-card-hover relative flex flex-col items-center justify-center p-8 rounded-2xl group cursor-default h-52"
            >
              {/* Centered Logo container */}
              <div className="mb-5 flex items-center justify-center h-16 w-16 transform transition-all group-hover:scale-110 duration-300">
                {getLogoComponent(platform.name, "w-14 h-14 object-contain shadow-sm rounded-xl")}
              </div>

              {/* Platform Title */}
              <h3 className="font-serif font-black text-brand-primary text-base md:text-lg transition-colors group-hover:text-brand-gold">
                {platform.name}
              </h3>

              {/* Dynamic hover-revealed or static beautifully integrated category */}
              <span className="mt-2 text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-brand-primary/5 text-brand-secondary group-hover:bg-brand-gold/20 group-hover:text-brand-primary font-semibold transition-colors duration-300">
                {platform.category}
              </span>

              {/* Small glowing subtle effect on hover */}
              <div className="absolute inset-0 bg-brand-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Small explainer caption */}
        <div className="mt-14 max-w-xl mx-auto rounded-2xl bg-white/60 backdrop-blur-sm p-6 text-sm text-brand-secondary italic border border-brand-beige/50 shadow-sm">
          "Once you update your store items on the Nearo dashboard (or just text them to our WhatsApp bot!), they propagate live to Google Maps, local classified directories, and conversational search platforms instantly."
        </div>
      </div>
    </section>
  );
};

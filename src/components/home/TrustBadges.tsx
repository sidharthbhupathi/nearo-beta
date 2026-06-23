import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Flame, Award, HeartHandshake } from "lucide-react";

export const TrustBadges: React.FC = () => {
  const testimonials = [
    {
      quote: "My organic cold-pressed oils start showing up on Google Maps, and daily footfall increased in just 2 weeks. Ramesh did all the setup in-person!",
      author: "Venkadesh Prasad",
      shop: "Prasad Organics, Jayanagar",
      rating: "Pilot story"
    },
    {
      quote: "I just text my new sweet stock updates to Ramesh on WhatsApp, and automatically a beautiful translation goes live on Google Search & Justdial.",
      author: "Savitri Devendra",
      shop: "Sri Sai Grand Sweets, Malleshwaram",
      rating: "Pilot story"
    }
  ];

  const standards = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0" />,
      title: "KYB-Gated Onboarding",
      desc: "Every merchant is verified in person before their store goes live on Nearo."
    },
    {
      icon: <Flame className="h-6 w-6 text-brand-gold shrink-0" />,
      title: "Zero-Setup Friction",
      desc: "No laptops needed. We send our onboarding agent so you can focus strictly on customer sales."
    },
    {
      icon: <Award className="h-6 w-6 text-brand-gold shrink-0" />,
      title: "Vetted Local Audiences",
      desc: "Our platform leverages geo-fenced target keywords to maximize native density matching."
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-brand-beige/40 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
        
        {/* Left Side: Vetted Swadeshi Standards */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-center text-left">
          <span className="section-eyebrow self-start">Trust & Security</span>
          <h2 className="section-title text-3xl md:text-4xl leading-tight">
            Built for Authentic <br />
            <span className="text-gold-shine">Swadeshi Commerce</span>
          </h2>
          <p className="text-sm text-brand-secondary leading-relaxed">
            Nearo combines local hand-on support with powerful server-side tech keeping small Indian businesses secure, trusted, and dominant on conversational and maps search.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-brand-gold shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wide text-brand-primary">Supports Atmanirbhar Bharat Initiative</span>
          </div>
        </div>

        {/* Middle Column: Grid of trust highlights */}
        <div className="lg:col-span-1 flex flex-col justify-between gap-4">
          {standards.map((std, i) => (
            <motion.div
              key={std.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card glass-card-hover p-5.5 rounded-2xl text-left flex gap-4 bg-white"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border border-brand-gold/15 shrink-0 h-10 w-10 flex items-center justify-center shadow-sm">
                {std.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black text-brand-primary text-sm">
                  {std.title}
                </h4>
                <p className="text-xs text-brand-secondary leading-relaxed">
                  {std.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Illustrative pilot stories (not aggregate ratings) */}
        <div className="lg:col-span-1 flex flex-col justify-between gap-4">
          {testimonials.map((testi, i) => (
            <motion.div
              key={testi.author}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-premium p-6 rounded-2xl text-left flex flex-col justify-between hover:shadow-lg transition-all h-[calc(50%-8px)] relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 text-4xl font-serif text-brand-gold/20 leading-none select-none">"</div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-brand-gold text-xs font-semibold tracking-wider font-mono uppercase bg-brand-gold/5 px-2.5 py-1 rounded">
                    Illustrative pilot story
                  </span>
                  <span className="text-[#C9A96E] font-bold text-xs">{testi.rating}</span>
                </div>
                <p className="text-xs italic text-brand-secondary leading-relaxed mt-4 font-medium">
                  "{testi.quote}"
                </p>
              </div>
              <div className="border-t border-brand-beige/40 pt-3 mt-4">
                <h5 className="font-serif font-black text-xs text-brand-primary">
                  {testi.author}
                </h5>
                <p className="text-[10px] text-brand-secondary mt-0.5 uppercase font-mono font-bold tracking-wider">
                  {testi.shop}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

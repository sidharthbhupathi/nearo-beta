import React from "react";

export const Footer: React.FC<{ onPageChange: (page: string) => void }> = ({ onPageChange }) => {
  return (
    <footer className="bg-gradient-to-b from-brand-bg to-brand-beige/20 text-brand-primary py-16 px-6 md:px-12 border-t border-brand-beige/60 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-gold to-[#b8924f] flex items-center justify-center shadow-sm">
              <span className="text-base font-serif text-white font-bold">N</span>
            </div>
            <span className="text-lg font-serif font-bold text-brand-primary tracking-tight">Nearo</span>
          </div>
          <p className="text-sm text-brand-secondary max-w-sm mb-6 font-sans">
            Nearo is the full-stack visibility squad for Indian local commerce. We help Kirana shops, chemical-free organic stores, local boutiques, and small brands unlock organic discoverability on 12+ digital channels with zero technical work.
          </p>
          <div className="text-xs uppercase font-mono tracking-widest text-brand-gold font-semibold">
            🌱 Made for a self-reliant India.
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-serif font-semibold text-brand-primary mb-4 tracking-tight">Navigate</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-secondary">
            <li>
              <button onClick={() => onPageChange("home")} className="hover:text-brand-gold transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange("pricing")} className="hover:text-brand-gold transition-colors cursor-pointer">
                Cost Estimator
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange("dashboard")} className="hover:text-brand-gold transition-colors cursor-pointer">
                Dashboard Demo
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange("waitlist")} className="hover:text-brand-gold transition-colors cursor-pointer">
                Join Waitlist
              </button>
            </li>
          </ul>
        </div>

        {/* Presence */}
        <div>
          <h4 className="font-serif font-semibold text-brand-primary mb-4 tracking-tight">Headquarters</h4>
          <p className="text-sm text-brand-secondary leading-relaxed font-sans">
            Nearo Technologies Private Limited<br />
            Indiranagar Quad, Bengaluru,<br />
            Karnataka — 560038
          </p>
          <div className="mt-4 text-xs text-brand-gold font-medium italic font-sans animate-pulse">
            Available across Bangalore, Mumbai, Delhi-NCR, Hyderabad, and Pune.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-brand-beige/50 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-secondary">
        <p>© 2026 Nearo Technologies. Built in Bengaluru for Indian local retail.</p>
        <p className="font-serif italic font-light">Supporting "Vocal for Local" and digital neighborhood inclusion.</p>
      </div>
    </footer>
  );
};

import React from "react";
import { LogIn, LogOut, Menu, X, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useLanguage } from "../../hooks/useLanguage";
import { AuthModal } from "../ui/AuthModal";
import { t } from "../../lib/translations";

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

function displayLabel(user: User): string {
  const name = user.displayName?.trim();
  if (name) return name.split(" ")[0];
  return user.email?.split("@")[0] || "Merchant";
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "pricing", label: "Cost Calculator" },
    { id: "dashboard", label: "Dashboard (Demo)" },
    { id: "waitlist", label: "Join Waitlist" },
    { id: "profile", label: "Profile & Settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/85 backdrop-blur-lg border-b border-brand-beige/60 shadow-[0_1px_0_rgba(201,169,110,0.15),0_4px_24px_rgba(26,26,26,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-4 min-w-0">
          {/* Logo */}
          <div
            onClick={() => onPageChange("home")}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-[#2d2d2d] flex items-center justify-center transition-all duration-300 group-hover:from-brand-gold group-hover:to-[#b8924f] shadow-sm group-hover:shadow-[0_4px_12px_rgba(201,169,110,0.35)]">
              <span className="text-xl font-serif text-brand-bg font-bold tracking-tight">N</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-serif font-bold tracking-tight text-brand-primary block leading-tight">
                Nearo
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-brand-gold block font-semibold">
                Vocal for Local
              </span>
            </div>
          </div>

          {/* Desktop Nav — lg+ only; tablets use mobile menu to avoid cramped links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 min-w-0 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "relative text-sm font-medium whitespace-nowrap transition-colors hover:text-brand-gold cursor-pointer shrink-0",
                  currentPage === item.id
                    ? "text-brand-primary font-semibold"
                    : "text-brand-secondary"
                )}
              >
                {t(item.label, language)}
                {currentPage === item.id && (
                  <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 border-r border-brand-beige/40 pr-3">
              <Globe className="h-3.5 w-3.5 text-brand-gold" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-brand-primary focus:outline-none border-0 cursor-pointer max-w-[88px]"
              >
                <option value="English">English</option>
                <option value="Hindi (हिंदी)">हिंदी</option>
                <option value="Kannada (ಕನ್ನಡ)">ಕನ್ನಡ</option>
                <option value="Tamil (தமிழ்)">தமிழ்</option>
              </select>
            </div>

            {user ? (
              <div
                onClick={() => onPageChange("profile")}
                className="flex items-center gap-2 bg-brand-beige/20 border border-brand-beige/40 rounded-full py-1 pl-1 pr-3 cursor-pointer hover:border-brand-gold/60 transition-all max-w-[180px]"
              >
                {user.photoURL ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt={displayLabel(user)}
                    className="h-7 w-7 rounded-full border border-brand-gold/50 shrink-0"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-brand-primary flex items-center justify-center text-xs text-brand-bg shrink-0">
                    {displayLabel(user).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-brand-primary truncate min-w-0">
                  {displayLabel(user)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    signOut(auth).catch(console.error);
                  }}
                  className="text-brand-secondary hover:text-brand-error transition-colors p-1 shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-gold/10 transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  {t("Merchant Login", language)}
                </button>
                <button
                  onClick={() => onPageChange("waitlist")}
                  className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-brand-bg hover:bg-brand-gold hover:text-brand-primary transition-all whitespace-nowrap"
                >
                  {t("Claim Free Month", language)}
                </button>
              </>
            )}
          </div>

          {/* Mobile / tablet menu toggle */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-brand-beige/10 border border-brand-beige/30 text-[11px] font-bold text-brand-primary rounded-lg px-2 py-1"
            >
              <option value="English">EN</option>
              <option value="Hindi (हिंदी)">हिं</option>
              <option value="Kannada (ಕನ್ನಡ)">ಕನ್</option>
              <option value="Tamil (தமிழ்)">தமி</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-primary p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-beige bg-brand-bg/98 px-4 py-4 flex flex-col gap-3 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "text-left py-2 font-medium text-base",
                currentPage === item.id ? "text-brand-primary" : "text-brand-secondary"
              )}
            >
              {t(item.label, language)}
            </button>
          ))}
          <hr className="border-brand-beige" />
          {user ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-brand-beige/40 bg-brand-beige/10">
              <button
                onClick={() => {
                  onPageChange("profile");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 min-w-0 text-left"
              >
                <div className="h-8 w-8 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center text-sm font-bold shrink-0">
                  {displayLabel(user).charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-brand-primary truncate">
                  {displayLabel(user)}
                </span>
              </button>
              <button
                onClick={() => {
                  signOut(auth).catch(console.error);
                  setMobileMenuOpen(false);
                }}
                className="text-brand-error text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl border border-brand-gold text-sm font-semibold text-brand-primary"
              >
                {t("Merchant Login", language)}
              </button>
              <button
                onClick={() => {
                  onPageChange("waitlist");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-brand-primary text-sm font-semibold text-brand-bg"
              >
                {t("Claim Free Month", language)}
              </button>
            </div>
          )}
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};

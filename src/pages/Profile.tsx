import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, 
  Settings, 
  Accessibility, 
  Info, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Check, 
  Volume2, 
  VolumeX,
  Save, 
  Globe, 
  Eye, 
  Landmark, 
  Award, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  UserCheck
} from "lucide-react";
import { auth, authenticateWithGoogle } from "../lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useLanguage } from "../hooks/useLanguage";
import { useMerchantPreferences } from "../hooks/useMerchantPreferences";
import { AuthModal } from "../components/ui/AuthModal";

interface ProfileProps {
  onPageChange: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onPageChange }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "general" | "accessibility" | "about_user" | "about_platform" | "logout">("details");

  // Editable Profile state (synced with localStorage for demo or logged-in users)
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [shopName, setShopName] = useState("Krishna Swadeshi Organic");
  const [shopAddress, setShopAddress] = useState("Store 14, High Street Mall, Indiranagar, Bengaluru, KA - 560008");
  const [shopCategory, setShopCategory] = useState("Kirana/Grocery");
  const [merchantNotes, setMerchantNotes] = useState("Established in 2021. Promoting local hand-pressed items across Karnataka.");

  // General Settings
  const { language, setLanguage } = useLanguage();
  const { upgradeFromPreferences } = useMerchantPreferences();
  const [businessHours, setBusinessHours] = useState("09:00 AM - 09:00 PM");
  const [cronInterval, setCronInterval] = useState("15"); // 15 Min, 30 Min, 1 Hour, Daily
  const [defaultAlerts, setDefaultAlerts] = useState(true);

  // Accessibility Settings (Applied in live preview session storage/classes)
  const [fontSize, setFontSize] = useState("normal"); // size: small, normal, large
  const [highContrast, setHighContrast] = useState(false);
  const [interactiveSound, setInteractiveSound] = useState(true);
  const [layoutDensity, setLayoutDensity] = useState("cozy"); // cozy, compact, spacious

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
      if (usr) {
        setDisplayName(usr.displayName || usr.email?.split("@")[0] || "Merchant Owner");
        setEmail(usr.email || "");
      } else {
        // Safe default fallback details
        setDisplayName("Sidharth Bhupathi");
        setEmail("sidharthbhupathi72@gmail.com");
      }
      setLoading(false);
    });

    // Populate from LocalStorage if preset
    const localStoreName = localStorage.getItem("nearo_shopName");
    const localStoreAddr = localStorage.getItem("nearo_shopAddress");
    const localStoreProd = localStorage.getItem("nearo_shopProducts");
    if (localStoreName) setShopName(localStoreName);
    if (localStoreAddr) setShopAddress(localStoreAddr);
    
    // Load local accessibility profiles
    const localHighContrast = localStorage.getItem("nearo_highContrast") === "true";
    const localFontSize = localStorage.getItem("nearo_fontSize") || "normal";
    const localSound = localStorage.getItem("nearo_sound") !== "false";
    const localDensity = localStorage.getItem("nearo_layoutDensity") || "cozy";
    
    setHighContrast(localHighContrast);
    setFontSize(localFontSize);
    setInteractiveSound(localSound);
    setLayoutDensity(localDensity);

    return () => unsubscribe();
  }, []);

  const playChirp = () => {
    if (!interactiveSound) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("nearo_shopName", shopName);
    localStorage.setItem("nearo_shopAddress", shopAddress);
    localStorage.setItem("nearo_owner", displayName);
    localStorage.setItem("nearo_category", shopCategory);

    upgradeFromPreferences({
      address: shopAddress,
      storeCategory: shopCategory,
      language,
      syncIntervalMinutes: parseInt(cronInterval, 10),
    });

    // Save profile settings
    toast.success("Merchant identity and shop coordinates saved successfully!");
    playChirp();
  };

  const handleGeneralSave = () => {
    localStorage.setItem("nearo_syncInterval", cronInterval);
    upgradeFromPreferences({
      address: shopAddress,
      storeCategory: shopCategory,
      language,
      syncIntervalMinutes: parseInt(cronInterval, 10),
    });
    toast.success("General operating settings updated!");
    playChirp();
  };

  const handleAccessibilitySave = () => {
    localStorage.setItem("nearo_highContrast", String(highContrast));
    localStorage.setItem("nearo_fontSize", fontSize);
    localStorage.setItem("nearo_sound", String(interactiveSound));
    localStorage.setItem("nearo_layoutDensity", layoutDensity);

    // Dynamic application of scale/theme classes
    if (highContrast) {
      document.documentElement.classList.add("contrast-high");
    } else {
      document.documentElement.classList.remove("contrast-high");
    }

    toast.success("Accessibility filters updated! Feel the layouts synchronize.");
    playChirp();
  };

  const handleLogout = async () => {
    try {
      if (currentUser) {
        await signOut(auth);
        toast.success("Merchant signed out successfully.");
      } else {
        toast("Demo session closed. Heading to homepage.");
      }
      playChirp();
      onPageChange("home");
    } catch (err) {
      toast.error("Logout issue.");
    }
  };

  const loginWithGoogle = () => {
    setAuthModalOpen(true);
  };

  const getTabLabel = (tab: typeof activeTab) => {
    switch (tab) {
      case "details": return "My Details";
      case "general": return "General Preferences";
      case "accessibility": return "Accessibility Controls";
      case "about_user": return "About Merchant User";
      case "about_platform": return "About NearLy Autopilot";
      case "logout": return "Session Logout";
    }
  };

  return (
    <div id="settings-profile-container" className="page-shell py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-8 select-none relative z-10">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-beige/60 pb-6 relative">
        <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-brand-gold/50 to-transparent" />
        <div className="text-left space-y-2">
          <span className="section-eyebrow">Control Panel</span>
          <h2 className="section-title text-3xl md:text-4xl">
            Settings & <span className="text-gold-shine italic">Profile</span>
          </h2>
          <p className="text-xs md:text-sm text-brand-secondary leading-relaxed">
            Customize layout filters, accessibility helpers, business metadata, and explore security protocols of NearLy.
          </p>
        </div>

        {/* Dynamic User Authentication status card */}
        <div className="glass-card-premium p-4 rounded-2xl text-left max-w-sm w-full md:w-auto shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {currentUser && currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Merchant Avatar" 
                className="h-12 w-12 rounded-xl object-cover border border-brand-gold/60"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-beige flex items-center justify-center text-brand-primary text-xl font-serif">
                🫵
              </div>
            )}
            <div>
              <span className="text-[9px] font-mono uppercase bg-brand-gold/10 text-brand-gold font-bold px-2 py-0.5 rounded-full block w-max">
                {currentUser ? "PRO MERCHANT" : "DEMO SANDBOX"}
              </span>
              <span className="text-sm font-black font-serif text-brand-primary block truncate max-w-[150px]">
                {displayName}
              </span>
              <span className="text-[10px] text-brand-secondary truncate block max-w-[180px]">
                {email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Udaan-inspired High Density Split Workspace (Nav Left - Content Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary block font-black text-left pl-3.5">
            Merchant Categories
          </span>
          <div className="glass-card rounded-2xl p-2 space-y-1.5 text-left">
            <button
              onClick={() => { setActiveTab("details"); playChirp(); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "details"
                  ? "nav-tab-active"
                  : "text-brand-secondary hover:bg-brand-bg/60 hover:text-brand-primary"
              }`}
            >
              <UserIcon className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>Owner Details</span>
            </button>

            <button
              onClick={() => { setActiveTab("general"); playChirp(); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "general"
                  ? "nav-tab-active"
                  : "text-brand-secondary hover:bg-brand-bg/60 hover:text-brand-primary"
              }`}
            >
              <Settings className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>General Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab("accessibility"); playChirp(); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "accessibility"
                  ? "nav-tab-active"
                  : "text-brand-secondary hover:bg-brand-bg/60 hover:text-brand-primary"
              }`}
            >
              <Accessibility className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>Accessibility</span>
            </button>

            <button
              onClick={() => { setActiveTab("about_user"); playChirp(); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "about_user"
                  ? "nav-tab-active"
                  : "text-brand-secondary hover:bg-brand-bg/60 hover:text-brand-primary"
              }`}
            >
              <UserCheck className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>About User</span>
            </button>

            <button
              onClick={() => { setActiveTab("about_platform"); playChirp(); }}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === "about_platform"
                  ? "nav-tab-active"
                  : "text-brand-secondary hover:bg-brand-bg/60 hover:text-brand-primary"
              }`}
            >
              <Info className="h-4 w-4 shrink-0 text-brand-gold" />
              <span>About Platform</span>
            </button>

            <div className="border-t border-brand-beige/40 my-1 pt-1.5">
              <button
                onClick={() => { setActiveTab("logout"); playChirp(); }}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "logout"
                    ? "bg-brand-error text-white"
                    : "text-brand-error/95 hover:bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Session Logout</span>
                </div>
              </button>
            </div>

          </div>

          {/* Prompt to log in if on sandbox mode */}
          {!currentUser && (
            <div className="glass-dark rounded-xl p-4 text-left space-y-3">
              <span className="section-eyebrow text-[9px]">Pro Tips</span>
              <p className="text-xs text-brand-bg/75 leading-relaxed">
                Connect your real Google Merchant profile to save settings persistently in NearLy's Firestore cloud databases!
              </p>
              <button
                onClick={loginWithGoogle}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-[#b8924f] text-brand-primary text-[11px] font-bold hover:from-brand-primary hover:to-[#2d2d2d] hover:text-white border-0 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                Sign In with Google
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Content Panel View on the Right (Udaan Style Grid) */}
        <div className="lg:col-span-3">
          <div className="glass-card-premium p-6 md:p-8 rounded-2xl text-left relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <div className="border-b border-brand-beige/50 pb-3 flex items-center justify-between">
                  <h3 className="font-serif font-black text-xl text-brand-primary">
                    {getTabLabel(activeTab)}
                  </h3>
                  <span className="text-[10px] font-mono uppercase text-brand-secondary font-bold">
                    System Node: KA_BLR_08
                  </span>
                </div>

                {/* TAB CONTENT: DETAILS */}
                {activeTab === "details" && (
                  <form onSubmit={handleProfileSave} className="space-y-5">
                    <p className="text-xs text-brand-secondary -mt-1 leading-normal">
                      Update your company identity. NearLy utilizes these fields to auto-compile geo-tagged metadata records across Indian local directory APIs!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <UserIcon className="h-3 w-3 text-brand-gold" /> Merchant Owner Name
                        </label>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold placeholder-brand-secondary/40 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <Mail className="h-3 w-3 text-brand-gold" /> Contact Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold placeholder-brand-secondary/40 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <Phone className="h-3 w-3 text-brand-gold" /> Mobile Phone (WhatsApp)
                        </label>
                        <input
                          type="text"
                          required
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold placeholder-brand-secondary/40 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <Building className="h-3 w-3 text-brand-gold" /> Trade Category
                        </label>
                        <select
                          value={shopCategory}
                          onChange={e => setShopCategory(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-bold"
                        >
                          <option value="Kirana/Grocery">Kirana / Grocery Outlets</option>
                          <option value="Organic Store">Organic Swadeshi Store</option>
                          <option value="Pharmacy">Ayurveda & Pharmacy</option>
                          <option value="Restaurant">Local Restaurant / Cafe</option>
                          <option value="Other">Artisanal Craftwork & Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <Landmark className="h-3 w-3 text-brand-gold" /> Shop Trade Name
                        </label>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={e => setShopName(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-bold font-serif"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-brand-gold" /> Verified Physical Address & Hub Coordinates
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={shopAddress}
                          onChange={e => setShopAddress(e.target.value)}
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-medium"
                        />
                      </div>
                    </div>

                    <div className="border-t border-brand-beige/50 pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="py-2.5 px-6 font-bold text-xs bg-brand-primary text-white hover:bg-brand-gold rounded-xl border-0 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Save className="h-4 w-4 text-brand-gold" /> Save Details
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB CONTENT: GENERAL SETTINGS */}
                {activeTab === "general" && (
                  <div className="space-y-5">
                    <p className="text-xs text-brand-secondary -mt-1 leading-normal">
                      Manage general operational frequencies, default directories language settings, and notifications triggers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="panel-card p-4 space-y-3">
                        <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Language Coordinates</span>
                        <div className="space-y-2 text-xs">
                          <label className="block text-brand-primary font-bold">Standard Dashboard Language</label>
                          <div className="flex flex-wrap gap-2">
                            {["English", "Hindi (हिंदी)", "Kannada (ಕನ್ನಡ)", "Tamil (தமிழ்)"].map(lang => (
                              <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-2.5 py-1.5 border rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                  language === lang 
                                    ? "bg-brand-primary text-white border-brand-primary" 
                                    : "bg-white border-brand-beige text-brand-secondary hover:border-brand-gold/40"
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="panel-card p-4 space-y-3">
                        <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Automated Sync Frequency</span>
                        <div className="space-y-2 text-xs">
                          <label className="block text-brand-primary font-bold">Autopilot catalog cron crawl interval</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "15 Min (Pro)", val: "15" },
                              { label: "30 Min", val: "30" },
                              { label: "1 Hour", val: "60" },
                              { label: "Daily Crawl", val: "1440" }
                            ].map(item => (
                              <button
                                key={item.val}
                                onClick={() => setCronInterval(item.val)}
                                className={`px-2.5 py-1.5 border rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                  cronInterval === item.val
                                    ? "bg-brand-primary text-white border-brand-primary"
                                    : "bg-white border-brand-beige text-brand-secondary hover:border-brand-gold/30"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="panel-card p-4 space-y-3">
                        <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Standard Operating Hours</span>
                        <div className="space-y-2 text-xs">
                          <label className="block text-brand-primary font-bold">Standard hours pushed to Search & Maps</label>
                          <input
                            type="text"
                            value={businessHours}
                            onChange={e => setBusinessHours(e.target.value)}
                            placeholder="e.g. 09:00 AM - 09:00 PM"
                            className="w-full p-2.5 border border-brand-beige rounded-lg text-xs font-bold text-brand-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-beige/60 bg-brand-bg/10 flex items-center justify-between">
                        <div className="space-y-0.5 pr-4">
                          <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Directory Notifications</span>
                          <span className="text-xs font-bold text-brand-primary block">Automatic WhatsApp Alerts</span>
                          <span className="text-[10px] text-brand-secondary block leading-tight">Receive a text whenever a customer clicks or calls.</span>
                        </div>
                        <button
                          onClick={() => setDefaultAlerts(!defaultAlerts)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                            defaultAlerts ? "bg-brand-success justify-end" : "bg-neutral-300 justify-start"
                          }`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-brand-beige/50 pt-4">
                      <button
                        onClick={handleGeneralSave}
                        className="py-2.5 px-6 font-bold text-xs bg-brand-primary text-white hover:bg-brand-gold rounded-xl border-0 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Save className="h-4 w-4 text-brand-gold" /> Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: ACCESSIBILITY */}
                {activeTab === "accessibility" && (
                  <div className="space-y-5">
                    <p className="text-xs text-brand-secondary -mt-1 leading-normal">
                      We offer comprehensive screen contrast adjustments, sound aids, and dynamic layout scaling tools to suit every user's requirements.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Font scaling preference */}
                      <div className="panel-card p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-brand-gold" />
                          <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Render Font Scaling</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <span className="text-brand-secondary leading-tight block">Enhance general navigation legibility across the screen grids:</span>
                          <div className="flex gap-2">
                            {[
                              { label: "Cozy Standard", scale: "normal" },
                              { label: "Large Reading", scale: "large" }
                            ].map(item => (
                              <button
                                key={item.scale}
                                onClick={() => setFontSize(item.scale)}
                                className={`px-3 py-1.5 border rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                  fontSize === item.scale
                                    ? "bg-brand-primary text-white border-brand-primary"
                                    : "bg-white border-brand-beige text-brand-secondary hover:border-brand-gold/30"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* sound chirps */}
                      <div className="p-4 rounded-xl border border-brand-beige/60 bg-brand-bg/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block flex items-center gap-1">
                            <Volume2 className="h-3 w-3" /> Audio Cues
                          </span>
                          <span className="text-xs font-bold text-brand-primary block">Action Sound Chirps</span>
                          <span className="text-[10px] text-brand-secondary block leading-tight">Hear high quality feedback chimes upon user actions.</span>
                        </div>
                        <button
                          onClick={() => setInteractiveSound(!interactiveSound)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                            interactiveSound ? "bg-brand-success justify-end" : "bg-neutral-300 justify-start"
                          }`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>

                      {/* high Contrast */}
                      <div className="p-4 rounded-xl border border-brand-beige/60 bg-brand-bg/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Visual Contrasts
                          </span>
                          <span className="text-xs font-bold text-brand-primary block">High Contrast Mode</span>
                          <span className="text-[10px] text-brand-secondary block leading-tight">Deepen text borders and labels for eye-strain protection.</span>
                        </div>
                        <button
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 cursor-pointer ${
                            highContrast ? "bg-brand-primary justify-end" : "bg-neutral-300 justify-start"
                          }`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>

                      {/* Layout density option */}
                      <div className="panel-card p-4 space-y-3">
                        <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-black block">Information Layout density</span>
                        <div className="space-y-2 text-xs">
                          <span className="text-brand-secondary block leading-tight">Configure screen structural spacing and pad variables:</span>
                          <div className="flex gap-2">
                            {["cozy", "spacious"].map(dens => (
                              <button
                                key={dens}
                                onClick={() => setLayoutDensity(dens)}
                                className={`px-3.5 py-1 rounded-lg text-[10.5px] uppercase font-mono font-black border cursor-pointer transition-all ${
                                  layoutDensity === dens
                                    ? "bg-brand-primary text-white border-brand-primary"
                                    : "bg-white border-brand-beige text-brand-secondary"
                                }`}
                              >
                                {dens}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="border-t border-brand-beige/50 pt-4">
                      <button
                        onClick={handleAccessibilitySave}
                        className="py-2.5 px-6 font-bold text-xs bg-brand-primary text-white hover:bg-brand-gold rounded-xl border-0 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Save className="h-4 w-4 text-brand-gold" /> Save Accessibility Profile
                      </button>
                    </div>

                  </div>
                )}

                {/* TAB CONTENT: ABOUT MERCHANT USER */}
                {activeTab === "about_user" && (
                  <div className="space-y-5">
                    <p className="text-xs text-brand-secondary -mt-1 leading-normal">
                      Provide a personal bio, founder details, and company values. This story generates contextual narratives for organic AI searches (like ChatGPT Local Discovery/Gemini Maps Grounding).
                    </p>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-brand-beige bg-brand-bg/15 space-y-2">
                        <span className="text-[10.5px] font-mono text-brand-secondary font-bold uppercase block">Verification Credentials</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="flex justify-between border-b border-brand-beige/40 pb-1.5">
                            <span className="text-brand-secondary">Founder position:</span>
                            <span className="font-bold text-brand-primary">Owner / Primary Merchant</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-beige/40 pb-1.5">
                            <span className="text-brand-secondary">License State:</span>
                            <span className="font-bold text-brand-primary">Karnataka Trade Code</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-beige/40 pb-1.5">
                            <span className="text-brand-secondary">Tax Invariant:</span>
                            <span className="font-bold text-brand-primary">GST-REGISTERED</span>
                          </div>
                          <div className="flex justify-between border-b border-brand-beige/40 pb-1.5">
                            <span className="text-brand-secondary">Direct Support:</span>
                            <span className="font-bold text-brand-success flex items-center gap-1">● Active <UserCheck className="h-3 w-3" /></span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-mono uppercase tracking-wider text-brand-secondary font-bold block">
                          Merchant Store Story & Mission
                        </label>
                        <textarea
                          rows={3}
                          value={merchantNotes}
                          onChange={e => setMerchantNotes(e.target.value)}
                          placeholder="Provide any details about your local farm sourcing, heritage, or swadeshi mission..."
                          className="w-full p-3 rounded-lg border border-brand-beige text-xs text-brand-primary bg-brand-bg/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-medium"
                        />
                      </div>
                    </div>

                    <div className="border-t border-brand-beige/50 pt-4">
                      <button
                        onClick={() => {
                          toast.success("Merchant owner notes saved successfully!");
                          playChirp();
                        }}
                        className="py-2.5 px-6 font-bold text-xs bg-brand-primary text-white hover:bg-brand-gold rounded-xl border-0 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Save className="h-4 w-4 text-brand-gold" /> Save User Notes
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: ABOUT PLATFORM */}
                {activeTab === "about_platform" && (
                  <div className="space-y-4">
                    <p className="text-xs text-brand-secondary leading-relaxed">
                      NearLy is an autonomous local marketing engine designed specifically to protect and empower Indian brick-and-mortar merchants against giant conglomerates. By synchronizing metadata coordinates in bulk, local shops get instant coverage.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="p-4 rounded-xl border border-brand-beige/70 bg-brand-bg/10 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-brand-primary font-black font-serif">
                          <ShieldCheck className="h-4 w-4 text-brand-gold" />
                          <span>System Architecture Specs</span>
                        </div>
                        <div className="divide-y divide-brand-beige/30 font-mono text-[10.5px]">
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Core Platform:</span>
                            <span className="text-brand-primary font-bold">NearLy Engine v3.1</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Runtime Node:</span>
                            <span className="text-brand-primary font-bold">Node.js Serverless Cluster</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Database:</span>
                            <span className="text-brand-primary font-bold">Cloud Firestore</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-beige/70 bg-brand-bg/10 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-brand-primary font-black font-serif">
                          <Clock className="h-4 w-4 text-[#C9A96E]" />
                          <span>Legal & Swadeshi Compliance</span>
                        </div>
                        <div className="divide-y divide-brand-beige/30 font-mono text-[10.5px]">
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Trademark:</span>
                            <span className="text-brand-primary font-bold">NearLy Autopilot Reg</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Sourcing Code:</span>
                            <span className="text-brand-primary font-bold">100% Swadeshi</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-brand-secondary">Secured Sandbox:</span>
                            <span className="text-brand-success font-black">ACTIVE CHECK</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="p-4 rounded-xl bg-brand-gold/5 border border-brand-beige text-xs leading-relaxed text-brand-secondary">
                      <strong>Swadeshi Guard:</strong> Unlike massive food/grocery conglomerates that drain fees, NearLy charges flat subscription structures returning up to 98% value instantly to the neighborhood grocer family.
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: LOGOUT */}
                {activeTab === "logout" && (
                  <div className="p-6 rounded-xl border border-red-200 bg-red-50/20 text-left space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-brand-error font-bold text-xl">
                        ⚠️
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-primary">Merchant Session Logout Request</h4>
                        <span className="text-xs text-brand-secondary block mt-0.5">Are you sure you want to log out of your Swadeshi owner panel?</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-secondary leading-relaxed">
                      Logging out will terminate cloud sync operations on this device session. You will be redirected safely to NearLy's public homepage.
                    </p>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleLogout}
                        className="py-2.5 px-6 font-bold text-xs bg-brand-error text-white border-0 hover:bg-brand-error/90 rounded-xl cursor-pointer transition-all"
                      >
                        Yes, Log Me Out
                      </button>
                      <button
                        onClick={() => { setActiveTab("details"); playChirp(); }}
                        className="py-2.5 px-6 font-bold text-xs bg-white text-brand-primary border border-brand-beige rounded-xl cursor-pointer hover:bg-brand-bg/50 transition-all"
                      >
                        Cancel & Remain
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Mail, 
  Lock, 
  LogIn, 
  ShieldAlert, 
  Sparkles, 
  UserPlus, 
  Store, 
  Eye, 
  EyeOff
} from "lucide-react";
import { auth, googleProvider } from "../../lib/firebase";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { toast } from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [shopName, setShopName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setSandboxPrompt(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome back, ${result.user.displayName || "Merchant"}!`);
      onClose();
    } catch (error: any) {
      console.warn("Google Google Sign-In popup error:", error);
      if (
        error?.code === "auth/popup-closed-by-user" || 
        error?.code === "auth/cancelled-popup-request" ||
        error?.message?.includes("closed")
      ) {
        setSandboxPrompt(true);
        toast.error("Google login popup closed or blocked by iframe sandbox.");
      } else {
        toast.error(error?.message || "Google Authentication issue occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Sign Up Flow
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {
          displayName: displayName || email.split("@")[0]
        });
        if (shopName) {
          localStorage.setItem("nearo_shopName", shopName);
        }
        toast.success("Merchant account created successfully! Welcome to Nearo.");
      } else {
        // Sign In Flow
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast.success(`Merchant ${result.user.displayName || ""} signed in successfully.`);
      }
      onClose();
    } catch (error: any) {
      console.error("Email auth error:", error);
      // Auto-registration feature for high usability if they try to sign in but account doesn't exist yet
      if (!isRegistering && (error?.code === "auth/user-not-found" || error?.code === "auth/invalid-credential")) {
        // Attempt a seamless registration on credentials if not found to provide super smooth testing
        try {
          toast.loading("Account not found. Dynamically creating your profile...", { duration: 2000 });
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(result.user, {
            displayName: displayName || email.split("@")[0]
          });
          toast.success("No pre-existing credentials found. Automatically registered and signed in!");
          onClose();
        } catch (regError: any) {
          toast.error(regError?.message || "Failed to sign up.");
        }
      } else {
        toast.error(error?.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setLoading(true);
    const demoEmail = "demo@nearo.in";
    const demoPass = "nearo12345";
    try {
      // Try logging in
      const result = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      toast.success(`Signed in as Demo Merchant: ${result.user.displayName || "Sidharth Bhupathi"}!`);
      onClose();
    } catch (error: any) {
      // If the demo developer account does not exist in their new Firestore Auth project yet, let's create it automatically!
      if (error?.code === "auth/user-not-found" || error?.code === "auth/invalid-credential") {
        try {
          const result = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(result.user, {
            displayName: "Sidharth Bhupathi"
          });
          localStorage.setItem("nearo_shopName", "Krishna Swadeshi Organic Store");
          toast.success("Demo Project Initialized! Signed in with pre-configured developer profile.");
          onClose();
        } catch (createErr: any) {
          toast.error("Instant Demo setup issue.");
        }
      } else {
        toast.error(error?.message || "Instant Demo setup issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-primary/60 backdrop-blur-sm"
      />

      {/* Main Modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-[#FDFBF7] border border-brand-beige/60 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-left space-y-6 max-h-[90vh] overflow-y-auto glass-card-premium"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

        {/* Header Block */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 section-eyebrow text-[10px]">
              <Sparkles className="h-3 w-3" /> Secure Merchant Portal
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-brand-primary tracking-tight">
              {isRegistering ? "Register New Shop" : "Sign In to Nearo"}
            </h3>
            <p className="text-xs text-brand-secondary">
              Unlock synchronized visibility automation across 12+ channels.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-brand-beige/50 text-brand-secondary hover:text-brand-primary hover:bg-brand-beige/20 transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Sandbox notice — only when popup actually blocked */}
        {sandboxPrompt && (
          <div className="p-3 rounded-xl border border-brand-gold/30 bg-brand-gold/5 text-[11px] text-brand-secondary leading-relaxed flex gap-2.5 relative z-10">
            <ShieldAlert className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-brand-primary block">Iframe Popup Blocked!</span>
              <span>
                Google Sign-In was blocked. Use Instant Demo or email/password below.
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4 relative z-10 flex flex-col">
          {/* Quick Instant Access Button - Bypass popup constraints entirely */}
          <button
            onClick={handleInstantDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-gold hover:text-brand-primary font-serif font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4.5 w-4.5 text-brand-gold" />
            Instant One-Click Demo Sign-In
          </button>

          {/* Regular Google Auth button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-brand-beige hover:border-brand-gold/50 bg-white text-brand-primary font-sans font-semibold text-xs tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Sign In with Google Account
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <span className="h-[1px] bg-brand-beige flex-grow" />
            <span className="text-[10px] font-mono text-brand-secondary uppercase font-bold tracking-widest shrink-0">Or Secure Email Entry</span>
            <span className="h-[1px] bg-brand-beige flex-grow" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase text-brand-secondary font-black pl-1 block">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-secondary">
                      ✍️
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Prasad"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-brand-beige focus:border-brand-gold outline-none transition-all placeholder:text-brand-secondary/50 font-medium text-brand-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono uppercase text-brand-secondary font-black pl-1 block">
                    Shop Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-secondary">
                      <Store className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kirana Emporium"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-brand-beige focus:border-brand-gold outline-none transition-all placeholder:text-brand-secondary/50 font-medium text-brand-primary"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono uppercase text-brand-secondary font-black pl-1 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-secondary">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-brand-beige focus:border-brand-gold outline-none transition-all placeholder:text-brand-secondary/50 font-medium text-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono uppercase text-brand-secondary font-black pl-1 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-secondary">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-white border border-brand-beige focus:border-brand-gold outline-none transition-all placeholder:text-brand-secondary/50 font-medium text-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-gold text-brand-primary hover:bg-brand-primary hover:text-brand-bg font-serif font-bold text-sm tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              {loading ? "Processing Securely..." : isRegistering ? "Register as Partner Merchant" : "Sign In with Email"}
            </button>
          </form>

          {/* Toggle Registering view */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[11px] font-mono text-brand-gold hover:text-brand-primary font-bold transition-colors cursor-pointer underline underline-offset-2"
            >
              {isRegistering 
                ? "Already have an account? Sign In here" 
                : "Need a new account? Register Shop here"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

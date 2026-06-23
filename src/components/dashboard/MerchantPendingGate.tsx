import React from "react";
import { ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import type { KybStatus } from "../../types";

interface MerchantPendingGateProps {
  kybStatus: KybStatus;
  email?: string | null;
  onJoinWaitlist?: () => void;
}

export const MerchantPendingGate: React.FC<MerchantPendingGateProps> = ({
  kybStatus,
  email,
  onJoinWaitlist,
}) => {
  const isApproved = kybStatus === "approved";

  return (
    <div className="page-shell py-16 md:py-24 px-6 md:px-12 max-w-3xl mx-auto text-center space-y-8">
      <div className="glass-card-premium p-8 md:p-12 rounded-3xl space-y-6">
        <div className="inline-flex items-center gap-2 section-eyebrow mx-auto">
          {isApproved ? (
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
          ) : (
            <Clock className="h-4 w-4 text-brand-gold" />
          )}
          <span>{isApproved ? "Approved — visit pending" : "Application under review"}</span>
        </div>

        <h1 className="section-title text-3xl md:text-4xl">
          {isApproved ? "Your shop is approved" : "Dashboard unlocks after verification"}
        </h1>

        <p className="text-sm text-brand-secondary leading-relaxed max-w-lg mx-auto">
          {isApproved ? (
            <>
              Nearo will visit your store in person to complete KYB verification. Once verified,
              your live dashboard and platform sync will activate.
              {email ? (
                <>
                  {" "}
                  Signed in as <span className="font-semibold text-brand-primary">{email}</span>.
                </>
              ) : null}
            </>
          ) : (
            <>
              Nearo beta is invite-only. Join the waitlist — we verify every shop before granting
              dashboard access. No self-serve store registration.
            </>
          )}
        </p>

        <div className="text-left max-w-md mx-auto space-y-3 text-xs text-brand-secondary border border-brand-beige/60 rounded-2xl p-5 bg-brand-bg/40">
          <p className="font-mono uppercase tracking-wider text-brand-gold font-bold text-[10px]">
            What happens next
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>We review your waitlist application (24–48 hours).</li>
            <li>We call or WhatsApp you to confirm shop details.</li>
            <li>Our agent visits your store for KYB verification.</li>
            <li>Your merchant account is marked verified — dashboard goes live.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {!isApproved && onJoinWaitlist && (
            <Button variant="primary" onClick={onJoinWaitlist} className="gap-2">
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {isApproved && (
            <p className="text-xs text-brand-secondary">
              Our team will WhatsApp you to schedule the in-person visit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

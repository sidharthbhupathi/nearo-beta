import React, { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Phone,
  RefreshCw,
  ClipboardCopy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMerchantAccount } from "../hooks/useMerchantAccount";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  fetchMerchantAccounts,
  fetchWaitlistEntries,
  setMerchantKybStatus,
  updateWaitlistStatus,
  upsertMerchantAccount,
} from "../lib/adminFirestore";
import type { MerchantAccount, WaitlistEntry } from "../types";
import { cn } from "../lib/utils";

const STATUS_STYLES: Record<WaitlistEntry["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export const Admin: React.FC<{ onPageChange: (page: string) => void }> = ({ onPageChange }) => {
  const { currentUser, isAdmin, loading: authLoading } = useMerchantAccount();
  const [waitlist, setWaitlist] = useState<(WaitlistEntry & { id: string })[]>([]);
  const [merchants, setMerchants] = useState<MerchantAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const [uid, setUid] = useState("");
  const [selected, setSelected] = useState<(WaitlistEntry & { id: string }) | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [entries, accounts] = await Promise.all([fetchWaitlistEntries(), fetchMerchantAccounts()]);
      setWaitlist(entries);
      setMerchants(accounts);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const selectEntry = (entry: WaitlistEntry & { id: string }) => {
    setSelected(entry);
    setUid("");
  };

  const handleWaitlistStatus = async (
    entry: WaitlistEntry & { id: string },
    status: WaitlistEntry["status"]
  ) => {
    setBusy(entry.id);
    try {
      await updateWaitlistStatus(entry.id, status, entry);
      toast.success(`Waitlist → ${status}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(null);
    }
  };

  const handleApproveMerchant = async () => {
    if (!selected || !uid.trim()) {
      toast.error("Select a waitlist row and paste the merchant Firebase UID.");
      return;
    }
    setBusy("approve");
    try {
      await updateWaitlistStatus(selected.id, "approved", selected);
      await upsertMerchantAccount(uid.trim(), {
        email: selected.email,
        storeName: selected.store_name,
        phone: selected.phone,
        city: selected.city,
        kybStatus: "approved",
        waitlistId: selected.id,
        approvedAt: new Date().toISOString(),
      });
      toast.success("Merchant approved — they can sign in and await your visit.");
      setUid("");
      setSelected(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setBusy(null);
    }
  };

  const handleVerify = async (account: MerchantAccount) => {
    setBusy(account.userId);
    try {
      await setMerchantKybStatus(account.userId, "verified");
      toast.success(`${account.storeName} is now KYB verified — live dashboard unlocked.`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verify failed");
    } finally {
      setBusy(null);
    }
  };

  if (authLoading) {
    return <div className="page-shell py-24 text-center text-brand-secondary">Loading…</div>;
  }

  if (!currentUser || !isAdmin) {
    return (
      <div className="page-shell py-24 px-6 max-w-lg mx-auto text-center space-y-4">
        <ShieldCheck className="h-10 w-10 text-brand-gold mx-auto" />
        <h1 className="section-title text-2xl">Admin only</h1>
        <p className="text-sm text-brand-secondary">Sign in with your Nearo admin Google account to manage waitlist and merchants.</p>
        <Button variant="outline" onClick={() => onPageChange("home")}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="page-shell py-12 px-6 md:px-12 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="section-eyebrow">Nearo Ops</span>
          <h1 className="section-title text-3xl">Merchant Admin</h1>
          <p className="text-sm text-brand-secondary mt-1">
            Approve waitlist applications and activate verified merchants. Uses one Firestore read per refresh — not live listeners.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Activate merchant */}
      <div className="glass-card-premium p-6 rounded-2xl space-y-4">
        <h2 className="font-serif font-bold text-lg text-brand-primary">2. Approve & create merchant account</h2>
        <p className="text-xs text-brand-secondary">
          After the merchant signs in once with Google, copy their UID from Firebase Console → Authentication → Users.
        </p>
        {selected ? (
          <div className="text-xs bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-3 flex justify-between gap-2">
            <span>
              Selected: <strong>{selected.store_name}</strong> ({selected.email})
            </span>
            <button type="button" onClick={() => setSelected(null)} className="text-brand-secondary hover:text-brand-primary shrink-0">
              Clear
            </button>
          </div>
        ) : (
          <p className="text-xs text-brand-secondary italic">Click a waitlist row below to select it.</p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Firebase Auth UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Paste UID from Firebase Console"
          />
          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={handleApproveMerchant}
              disabled={!selected || !uid.trim() || busy === "approve"}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Approve + create merchant_accounts doc
            </Button>
          </div>
        </div>
      </div>

      {/* Waitlist */}
      <div className="space-y-3">
        <h2 className="font-serif font-bold text-lg text-brand-primary">1. Waitlist ({waitlist.length})</h2>
        {loading ? (
          <p className="text-sm text-brand-secondary">Loading…</p>
        ) : waitlist.length === 0 ? (
          <p className="text-sm text-brand-secondary">No waitlist entries yet.</p>
        ) : (
          <div className="space-y-2">
            {waitlist.map((entry) => (
              <div
                key={entry.id}
                onClick={() => selectEntry(entry)}
                className={cn(
                  "glass-card p-4 rounded-xl cursor-pointer border transition-colors",
                  selected?.id === entry.id ? "border-brand-gold bg-brand-gold/5" : "border-brand-beige/50 hover:border-brand-gold/40"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-brand-primary">{entry.store_name}</p>
                    <p className="text-xs text-brand-secondary">{entry.owner_name} · {entry.email}</p>
                    <p className="text-xs text-brand-secondary flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" /> {entry.phone} · {entry.city} · {entry.store_type}
                    </p>
                  </div>
                  <span className={cn("text-[10px] font-mono uppercase px-2 py-1 rounded border font-bold", STATUS_STYLES[entry.status])}>
                    {entry.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  {entry.status === "pending" && (
                    <button
                      type="button"
                      disabled={busy === entry.id}
                      onClick={() => handleWaitlistStatus(entry, "contacted")}
                      className="text-[10px] font-bold px-2 py-1 rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Mark contacted
                    </button>
                  )}
                  {entry.status !== "approved" && entry.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={busy === entry.id}
                      onClick={() => handleWaitlistStatus(entry, "approved")}
                      className="text-[10px] font-bold px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Approve waitlist
                    </button>
                  )}
                  {entry.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={busy === entry.id}
                      onClick={() => handleWaitlistStatus(entry, "rejected")}
                      className="text-[10px] font-bold px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(entry.email);
                      toast.success("Email copied");
                    }}
                    className="text-[10px] font-bold px-2 py-1 rounded border border-brand-beige text-brand-secondary hover:text-brand-primary flex items-center gap-1"
                  >
                    <ClipboardCopy className="h-3 w-3" /> Copy email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Merchant accounts */}
      <div className="space-y-3">
        <h2 className="font-serif font-bold text-lg text-brand-primary">3. Merchant accounts ({merchants.length})</h2>
        {merchants.length === 0 ? (
          <p className="text-sm text-brand-secondary">No merchant_accounts yet.</p>
        ) : (
          <div className="space-y-2">
            {merchants.map((m) => (
              <div key={m.userId} className="glass-card p-4 rounded-xl border border-brand-beige/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif font-bold text-brand-primary">{m.storeName}</p>
                  <p className="text-xs text-brand-secondary">{m.email}</p>
                  <p className="text-[10px] font-mono text-brand-secondary mt-1">UID: {m.userId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-mono uppercase px-2 py-1 rounded border font-bold",
                    m.kybStatus === "verified"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  )}>
                    {m.kybStatus}
                  </span>
                  {m.kybStatus !== "verified" && (
                    <Button size="sm" onClick={() => handleVerify(m)} disabled={busy === m.userId} className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verify after visit
                    </Button>
                  )}
                  {m.kybStatus === "verified" && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[10px] text-brand-secondary font-mono text-center pb-8">
        Tip: After verifying, set MERCHANTS_ONBOARDED in src/lib/beta.ts and redeploy.
      </p>
    </div>
  );
};

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";
import { ShieldCheck, Calendar, Sparkles, Send } from "lucide-react";

const waitlistSchema = z.object({
  store_name: z.string().min(2, "Store name must be at least 2 characters").max(150, "Store name is too long"),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters").max(100, "Owner name is too long"),
  email: z.string().email("Please enter a valid email address").max(150, "Email is too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  city: z.string().min(2, "City name must be at least 2 characters").max(100, "City name is too long"),
  store_type: z.enum(["Kirana/Grocery", "Organic Store", "Pharmacy", "Restaurant", "Other"]),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export const WaitlistForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      store_type: "Kirana/Grocery",
    }
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setLoading(true);
    const toastId = toast.loading("Submitting your request...");
    const path = "waitlist";
    try {
      // Build Waitlist doc payload as defined in rules size/timestamp
      const waitlistRef = collection(db, path);
      await addDoc(waitlistRef, {
        store_name: data.store_name.trim(),
        owner_name: data.owner_name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        city: data.city.trim(),
        store_type: data.store_type,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      toast.success("Successfully registered! We will text you on WhatsApp shortly.", {
        id: toastId,
        duration: 5000,
      });

      reset();
    } catch (error) {
      console.error("Waitlist Error:", error);
      toast.error("An error occurred. Please verify form values and try again.", {
        id: toastId,
      });
      // Fire-off our required Firestore JSON-reporting error handler
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card-premium max-w-xl mx-auto p-8 rounded-3xl relative overflow-hidden shadow-xl lg:max-w-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 relative z-10">
        <div className="section-eyebrow mb-3">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
          <span>Claim ₹0 Start Offer</span>
        </div>
        <h3 className="font-serif font-black text-2xl text-brand-primary">
          Join the NearLy Waitlist
        </h3>
        <p className="text-sm text-brand-secondary mt-1 max-w-md">
          Provide your store details to unlock 30-day Free Trial. A NearLy representative will schedule an in-person meeting.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Store Name"
            placeholder="Krishna Kirana"
            error={errors.store_name?.message}
            {...register("store_name")}
          />
          <Input
            label="Owner Name"
            placeholder="Ramesh Kumar"
            error={errors.owner_name?.message}
            {...register("owner_name")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            placeholder="ramesh@krishnakirana.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="10-Digit Mobile Number"
            placeholder="9876543210"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="Bangalore"
            error={errors.city?.message}
            {...register("city")}
          />
          <Select
            label="Store Type"
            options={["Kirana/Grocery", "Organic Store", "Pharmacy", "Restaurant", "Other"]}
            error={errors.store_type?.message}
            {...register("store_type")}
          />
        </div>

        <div className="pt-4 border-t border-brand-beige/50">
          <Button
            type="submit"
            className="w-full py-4 text-center justify-center font-serif text-base tracking-wide flex items-center gap-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Submit Enrollment Request"}
            <Send className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-brand-secondary text-center">
            <ShieldCheck className="h-4 w-4 text-brand-success" />
            <span>Secure trade database with Indian retail standards protection</span>
          </div>
        </div>
      </form>
    </div>
  );
};

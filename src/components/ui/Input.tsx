import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-brand-beige/70 bg-white/80 px-4 py-3 text-sm text-brand-primary placeholder-brand-secondary/60 shadow-sm transition-all focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:shadow-md",
            error && "border-brand-error focus:border-brand-error focus:ring-brand-error/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-brand-error font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

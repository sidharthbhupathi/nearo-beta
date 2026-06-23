import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-brand-beige/70 bg-white/80 px-4 py-3 text-sm text-brand-primary shadow-sm transition-all focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:shadow-md cursor-pointer appearance-none",
            error && "border-brand-error focus:border-brand-error focus:ring-brand-error/20",
            className
          )}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-brand-error font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

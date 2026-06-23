import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition-all duration-300 transform active:scale-97 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold/40",
          // Variants
          variant === "primary" && "bg-gradient-to-br from-brand-gold via-[#c4a066] to-[#b8924f] text-white hover:from-brand-primary hover:via-brand-primary hover:to-[#2a2a2a] hover:text-white shadow-[0_4px_14px_rgba(201,169,110,0.35)] hover:shadow-[0_6px_20px_rgba(26,26,26,0.2)] border border-brand-gold/30",
          variant === "gold" && "bg-gradient-to-br from-brand-gold via-[#c4a066] to-[#b8924f] text-white hover:from-brand-primary hover:via-brand-primary hover:to-[#2a2a2a] shadow-[0_4px_14px_rgba(201,169,110,0.35)] border border-brand-gold/30",
          variant === "secondary" && "bg-brand-beige/30 text-brand-primary hover:bg-brand-beige focus:ring-brand-beige border border-brand-beige/50",
          variant === "outline" && "border border-brand-gold bg-transparent text-brand-primary hover:bg-brand-gold/10 hover:border-brand-gold",
          variant === "ghost" && "bg-transparent text-brand-secondary hover:bg-brand-beige/20 hover:text-brand-primary",
          // Sizes
          size === "sm" && "px-4 py-2 text-xs",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

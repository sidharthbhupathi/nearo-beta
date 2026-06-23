import React from "react";
import { PricingCalculator } from "../components/pricing/PricingCalculator";
import { ComparisonTable } from "../components/pricing/ComparisonTable";
import { FAQ } from "../components/pricing/FAQ";

interface PricingProps {
  onPageChange: (page: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onPageChange }) => {
  return (
    <div className="page-shell bg-brand-bg relative min-h-screen">
      <PricingCalculator onPageChange={onPageChange} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-6">
        <ComparisonTable />
        <FAQ />
      </div>
    </div>
  );
};

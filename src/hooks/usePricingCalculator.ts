import { useState, useMemo, useEffect } from "react";
import { PricingFactor, FactorOption } from "../types";
import { PRICING_FACTORS, computeMonthlyPrice, platformsCountFromPack } from "../lib/pricing";
import { buildPreferences, saveLocalPreferences } from "../lib/merchantPreferences";

export const FACTORS: Record<string, PricingFactor> = PRICING_FACTORS;

export const usePricingCalculator = () => {
  const [selectedLocation, setSelectedLocation] = useState<FactorOption>(PRICING_FACTORS.location.options[2]);
  const [selectedCrowd, setSelectedCrowd] = useState<FactorOption>(PRICING_FACTORS.crowd.options[2]);
  const [selectedProducts, setSelectedProducts] = useState<FactorOption>(PRICING_FACTORS.products.options[1]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<FactorOption>(PRICING_FACTORS.platforms.options[2]);

  const pricingDetails = useMemo(() => {
    const finalPrice = computeMonthlyPrice(
      selectedLocation,
      selectedCrowd,
      selectedProducts,
      selectedPlatforms
    );

    return {
      price: finalPrice,
      saving: Math.round(finalPrice * 0.4),
      platformsCount: platformsCountFromPack(selectedPlatforms.label),
    };
  }, [selectedLocation, selectedCrowd, selectedProducts, selectedPlatforms]);

  useEffect(() => {
    const prefs = buildPreferences({
      locationLabel: selectedLocation.label,
      crowdLabel: selectedCrowd.label,
      productLabel: selectedProducts.label,
      platformPackLabel: selectedPlatforms.label,
    });
    saveLocalPreferences(prefs);
  }, [selectedLocation, selectedCrowd, selectedProducts, selectedPlatforms]);

  return {
    factors: FACTORS,
    selectedLocation,
    setSelectedLocation,
    selectedCrowd,
    setSelectedCrowd,
    selectedProducts,
    setSelectedProducts,
    selectedPlatforms,
    setSelectedPlatforms,
    price: pricingDetails.price,
    saving: pricingDetails.saving,
    platformsCount: pricingDetails.platformsCount,
  };
};

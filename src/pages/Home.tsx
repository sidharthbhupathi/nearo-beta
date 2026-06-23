import React from "react";
import { Hero } from "../components/home/Hero";
import { PlatformGrid } from "../components/home/PlatformGrid";
import { HowItWorks } from "../components/home/HowItWorks";
import { Stats } from "../components/home/Stats";
import { TrustBadges } from "../components/home/TrustBadges";
import { FinalCTA } from "../components/home/FinalCTA";

interface HomeProps {
  onPageChange: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  return (
    <div className="space-y-6">
      <Hero onPageChange={onPageChange} />
      <PlatformGrid />
      <HowItWorks />
      <Stats />
      <TrustBadges />
      <FinalCTA onPageChange={onPageChange} />
    </div>
  );
};

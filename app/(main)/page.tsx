"use client";
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";
import VisualNarratives from "@/components/shared/visual-narratives";

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Hero Section */}
      <HeroSection />

      <VisualNarratives />
    </div>
  );
};

export default Page;

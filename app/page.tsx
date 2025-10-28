"use client";
import Navbar from "@/components/shared/navbar";
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />
    </div>
  );
};

export default Page;

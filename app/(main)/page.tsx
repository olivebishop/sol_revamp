"use client";
import { motion } from "motion/react";
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";
import FeaturedPackages from "@/components/packages/featured-packages";
import VisualNarratives from "@/components/shared/visual-narratives";
import WhyChooseUs from "@/components/shared/why-choose-us";
import Testimonials from "@/components/shared/testimonials";
import CTASection from "@/components/shared/cta-section";
import { packages } from "@/data/packages";
import { testimonials } from "@/data/testimonials";

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Packages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FeaturedPackages packages={packages} />
      </motion.div>

      {/* Visual Narratives */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <VisualNarratives />
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <WhyChooseUs />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Testimonials testimonials={testimonials} />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CTASection
          title="Your African Adventure Awaits"
          description="From wild safaris to pristine beaches, let's turn your dream vacation into reality"
          image="/images/sol_car.jpg"
          buttonText="Chat with Michael Kisangi"
          buttonAction={() => {
            window.open("https://wa.me/+254768453819", "_blank");
          }}
        />
      </motion.div>
    </div>
  );
};

export default Page;

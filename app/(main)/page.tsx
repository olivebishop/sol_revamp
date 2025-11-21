"use client";
import { motion } from "motion/react";
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";
import FeaturedPackages from "@/components/packages/featured-packages";
import VisualNarratives from "@/components/shared/visual-narratives";
import WhyChooseUs from "@/components/shared/why-choose-us";
import Testimonials from "@/components/shared/testimonials";
import CTASection from "@/components/shared/cta-section";

import { useEffect, useState } from "react";
import type { PackageData } from "@/data/packages";

const Page = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesResponse = await fetch("/api/packages");
        if (packagesResponse.ok) {
          const data = await packagesResponse.json();
          const transformedPackages: PackageData[] = data.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            slug: pkg.slug,
            packageType: pkg.packageType || "safari",
            description: pkg.description,
            pricing: pkg.pricing,
            daysOfTravel: pkg.daysOfTravel,
            images: pkg.images || [],
            maxCapacity: pkg.maxCapacity || 10,
            currentBookings: pkg.currentBookings || 0,
            isActive: pkg.isActive,
            destination: pkg.destination || {
              id: "default",
              name: "Kenya",
              slug: "kenya",
              bestTime: "Year-round"
            }
          }));
          setPackages(transformedPackages.filter((pkg: PackageData) => pkg.isActive));
        }

        // Fetch testimonials
        const testimonialsResponse = await fetch("/api/testimonials");
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Packages */}
      {!loading && packages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <FeaturedPackages packages={packages} />
        </motion.div>
      )}

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

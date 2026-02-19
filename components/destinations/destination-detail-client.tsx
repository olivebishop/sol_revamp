"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import type { DestinationData } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import GrainOverlay from "@/components/shared/grain-overlay";
import CTASection from "@/components/shared/cta-section";
import { SupabaseImage } from "@/components/shared/supabase-image";

interface DestinationDetailClientProps {
  destination: DestinationData;
}

export default function DestinationDetailClient({
  destination,
}: DestinationDetailClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white relative">
      <GrainOverlay />

      {/* Hero Section - Simple header */}
      <section className="relative border-b border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-[0.9]">
              {destination.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-500 font-light italic mb-4 sm:mb-6">
              {destination.tagline}
            </p>
            <div className="flex justify-end r-8">
              <Badge className="bg-zinc-900 text-white border-zinc-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {destination.location.region}, {destination.location.country}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction - Magazine style */}
      <section className="border-b border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Left - Large dropcap intro */}
            <div className="lg:col-span-7">
              {/* Main Description */}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light leading-relaxed">
                <span className="float-left text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-orange-500 leading-none mr-3 sm:mr-4 mt-1 sm:mt-2">
                  {destination.name.charAt(0)}
                </span>
                {destination.description}
              </p>
            </div>

            {/* Right - Hero Image */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded overflow-hidden">
                <SupabaseImage
                  src={destination.heroImage}
                  alt={destination.name}
                  className="w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready for Your Safari Adventure?"
        description="Explore our curated safari packages and start planning your unforgettable journey through Africa's wilderness"
        image="/images/sol_car.jpg"
        buttonText="View All Packages"
        buttonAction={() => router.push("/packages")}
      />
    </div>
  );
}

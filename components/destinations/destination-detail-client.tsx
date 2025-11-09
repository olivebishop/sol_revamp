"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import type { DestinationData } from "@/data/destinations";
import { Badge } from "@/components/ui/badge";
import GrainOverlay from "@/components/shared/grain-overlay";
import CTASection from "@/components/shared/cta-section";

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
            {/* Left - Large dropcap intro with wildlife & when to visit */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-12 lg:space-y-16">
              {/* Main Description */}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light leading-relaxed">
                <span className="float-left text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-orange-500 leading-none mr-3 sm:mr-4 mt-1 sm:mt-2">
                  {destination.name.charAt(0)}
                </span>
                {destination.description}
              </p>

              {/* Wildlife */}
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-orange-500">
                  Wildlife
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {destination.wildlife.animals.slice(0, 8).map((animal) => (
                    <div
                      key={animal.name}
                      className="flex items-center gap-2 sm:gap-3 text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded bg-orange-500 shrink-0"></div>
                      <span className="text-sm sm:text-base lg:text-lg">
                        {animal.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* When to Visit */}
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-orange-500">
                  When to Visit
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {destination.bestTimeToVisit.seasons.map((season) => (
                    <div
                      key={season.period}
                      className="flex items-start gap-2 sm:gap-3 text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded bg-orange-500 shrink-0 mt-1.5 sm:mt-2"></div>
                      <span className="text-sm sm:text-base lg:text-lg">
                        {season.period} - {season.weather}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded overflow-hidden">
                <Image
                  src={destination.heroImage}
                  alt={destination.name}
                  fill
                  className="object-cover"
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

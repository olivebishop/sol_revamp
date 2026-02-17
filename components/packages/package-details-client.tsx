"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  Check,
  ChevronLeft,
  Star,
  Info,
} from "lucide-react";
import type { PackageData } from "@/data/packages";
import PackageBookingDrawer from "@/components/packages/package-booking-drawer";
import { PackageCard } from "@/components/shared/package-card";
import CTASection from "@/components/shared/cta-section";
import GrainOverlay from "@/components/shared/grain-overlay";

interface PackageDetailsClientProps {
  package: PackageData;
  relatedPackages: PackageData[];
}

export default function PackageDetailsClient({
  package: pkg,
  relatedPackages,
}: PackageDetailsClientProps) {
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Back Button */}
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-3 sm:pb-4">
        <Link href="/packages">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Packages
          </Button>
        </Link>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {pkg.images && pkg.images.length > 0 ? (
              <>
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded overflow-hidden">
                  <Image
                    src={pkg.images[selectedImage]}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Thumbnail Gallery */}
                {pkg.images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {pkg.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 sm:h-20 rounded overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-orange-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${pkg.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
                )}
              </>
            ) : (
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded overflow-hidden bg-zinc-900 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No images available</p>
              </div>
            )}
          </motion.div>

          {/* Package Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-orange-500/20 border border-orange-500/50 rounded text-orange-500 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                {pkg.packageType}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {pkg.name}
            </h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="text-sm font-semibold">
                    {pkg.destination.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-semibold">
                    {pkg.daysOfTravel} Days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Best Time</p>
                  <p className="text-sm font-semibold truncate">
                    {pkg.destination.bestTime.split(",")[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold">
                About This Experience
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            

            {/* Pricing & CTA */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Price per person
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    ${pkg.pricing.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`${pkg.id}-rating-star-${i}`}
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setIsBookingDrawerOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 sm:py-6 text-base sm:text-lg rounded hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] transition-all"
              >
                Book This Experience
              </Button>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                Free cancellation up to 48 hours before departure
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Packages Section */}
      {relatedPackages.length > 0 && (
        <section className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  More Adventures <span className="text-orange-500">Await</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Discover other extraordinary experiences crafted just for you
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedPackages.map((relatedPkg, index) => (
                <motion.div
                  key={relatedPkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PackageCard package={relatedPkg} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Adventure"
        description="Get in touch with our travel experts to customize your perfect African safari experience."
        image="/images/lion.png"
        buttonText="Contact Us Now"
        buttonAction={() => setIsBookingDrawerOpen(true)}
      />

      {/* Booking Drawer */}
      <PackageBookingDrawer
        isOpen={isBookingDrawerOpen}
        onClose={() => setIsBookingDrawerOpen(false)}
        package={pkg}
      />
    </div>
  );
}

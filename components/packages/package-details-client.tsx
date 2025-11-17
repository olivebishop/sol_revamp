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

  // Mock features based on package type
  const getFeatures = () => {
    const baseFeatures = [
      "Professional guide included",
      "All meals provided",
      "Transportation arranged",
      "Accommodation included",
      "Travel insurance coverage",
      "24/7 support available",
    ];

    if (pkg.packageType === "luxury") {
      return [
        ...baseFeatures,
        "Premium accommodation",
        "Private transfers",
        "Complimentary drinks",
      ];
    }
    return baseFeatures;
  };

  const features = getFeatures();

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
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded overflow-hidden">
              <Image
                src={pkg.images[selectedImage]}
                alt={pkg.name}
                fill
                className="object-cover"
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
                    />
                  </button>
                ))}
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

      {/* Bento Grid Section - What's Included & Details */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 auto-rows-auto">
          {/* What's Included - Large Card (Spans 2 columns on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900/30 border border-zinc-800 rounded p-4 sm:p-6 lg:p-8 lg:col-span-2 lg:row-span-2"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-1 h-5 sm:h-6 bg-orange-500 rounded"></div>
              What's Included
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 text-gray-300 group hover:text-white transition-colors"
                >
                  <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Best Time to Visit - Tall Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-linear-to-br from-orange-500/10 via-zinc-900/30 to-zinc-900/30 border border-orange-500/30 rounded p-4 sm:p-6 lg:p-8 lg:row-span-1 relative overflow-hidden group hover:border-orange-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                Best Time to Visit
              </h3>
              <p className="text-orange-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                {pkg.destination.bestTime}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Weather conditions are optimal during these months, offering the
                best wildlife viewing and comfortable temperatures for outdoor
                activities.
              </p>
            </div>
          </motion.div>

          {/* Important Information - Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/30 border border-zinc-800 rounded p-4 sm:p-6 lg:p-8 md:col-span-2 lg:col-span-1 lg:row-span-1 hover:border-zinc-700 transition-colors"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded flex items-center justify-center">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              Important Information
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-400">
              <li className="flex items-start gap-2 sm:gap-3 group">
                <div className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 rounded-md flex items-center justify-center mt-0.5 group-hover:bg-orange-500/30 transition-colors">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                </div>
                <span className="text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
                  Valid passport required (6 months validity)
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 group">
                <div className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 rounded flex items-center justify-center mt-0.5 group-hover:bg-orange-500/30 transition-colors">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                </div>
                <span className="text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
                  Travel insurance recommended
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 group">
                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 rounded flex items-center justify-center mt-0.5 group-hover:bg-orange-500/30 transition-colors">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                </div>
                <span className="text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
                  Moderate fitness level required
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 group">
                <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 rounded flex items-center justify-center mt-0.5 group-hover:bg-orange-500/30 transition-colors">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                </div>
                <span className="text-xs sm:text-sm group-hover:text-gray-300 transition-colors">
                  Suitable for ages 12 and above
                </span>
              </li>
            </ul>
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

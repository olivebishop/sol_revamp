"use client";
import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import type { PackageData } from "@/data/packages";

interface PackageCardProps {
  package: PackageData;
}

export const PackageCard = memo(({ package: pkg }: PackageCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = pkg.images?.[0] || "/images/default-package.jpg";
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-black/40 border border-white/10 rounded overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-zinc-900">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={pkg.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <span className="text-gray-500 text-sm">Image not available</span>
            </div>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors line-clamp-1">
          {pkg.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {pkg.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2 text-gray-300"
          >
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{pkg.destination.name}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-2 text-gray-300"
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>
              {pkg.daysOfTravel} {pkg.daysOfTravel === 1 ? "Day" : "Days"}
            </span>
          </motion.div>

        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-gray-400 text-xs">Starting from</p>
            <p className="text-2xl font-bold text-white">
              ${pkg.pricing.toLocaleString()}
              <span className="text-sm text-gray-400 font-normal">/person</span>
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/packages/${pkg.slug}`}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded px-6 hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] transition-all">
                View Details
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

PackageCard.displayName = "PackageCard";

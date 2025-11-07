"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import type { PackageData } from "@/data/packages";

interface PackageCardProps {
  package: PackageData;
}

export const PackageCard = ({ package: pkg }: PackageCardProps) => {
  return (
    <div className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.images[0]}
          alt={pkg.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
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
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{pkg.destination.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>
              {pkg.daysOfTravel} {pkg.daysOfTravel === 1 ? "Day" : "Days"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-orange-500" />
            <span>Up to {pkg.maxCapacity} people</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-gray-400 text-xs">Starting from</p>
            <p className="text-2xl font-bold text-white">
              ${pkg.pricing.toLocaleString()}
              <span className="text-sm text-gray-400 font-normal">/person</span>
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded px-6 hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] transition-all">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

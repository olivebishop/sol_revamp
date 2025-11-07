import GrainOverlay from "@/components/shared/grain-overlay";
import { packages } from "@/data/packages";
import { PackagesClient } from "./packages-client";

export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};

export default function PackagesPage() {
  // Server-side data fetching
  // In production, this could fetch from your database using Prisma
  const allPackages = packages;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Client Component for interactivity */}
      <PackagesClient packages={allPackages} />
    </div>
  );
}

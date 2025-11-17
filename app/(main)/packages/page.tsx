
import GrainOverlay from "@/components/shared/grain-overlay";
import { PackagesClient } from "../../../components/packages/packages-client";


export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};


// Next.js 16: Use async server component for data fetching
export default async function PackagesPage() {
  // Fetch packages from the API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages`, {
    cache: 'no-store',
    next: { tags: ['packages'] },
  });
  const allPackages = await res.json();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GrainOverlay />
      <PackagesClient packages={allPackages} />
    </div>
  );
}

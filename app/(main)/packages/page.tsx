import { Suspense } from 'react';
import GrainOverlay from "@/components/shared/grain-overlay";
import { PackagesClient } from "../../../components/packages/packages-client";

export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};

// Async function to fetch packages
async function getPackages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages`, {
    cache: 'no-store',
    next: { tags: ['packages'] },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch packages');
  }
  
  return res.json();
}

// Component that fetches the data
async function PackagesData() {
  const allPackages = await getPackages();
  return <PackagesClient packages={allPackages} />;
}

// Loading fallback component
function PackagesLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GrainOverlay />
      <Suspense fallback={<PackagesLoading />}>
        <PackagesData />
      </Suspense>
    </div>
  );
}
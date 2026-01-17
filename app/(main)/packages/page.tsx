import { Suspense, cache } from 'react';
import { PackagesClient } from "../../../components/packages/packages-client";
import GrainOverlay from "@/components/shared/grain-overlay";
import CTASection from "@/components/shared/cta-section";
import type { PackageData } from "@/data/packages";

export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};

// Static shell component - renders immediately (cached using React cache)
// This is part of the static shell in PPR
const StaticShell = cache(() => {
  return (
    <>
      <GrainOverlay />
      {/* Static header - renders immediately */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Tour Packages
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400">
            Discover unforgettable adventures across East Africa
          </p>
        </div>
      </section>
    </>
  );
});

// Dynamic function to fetch packages (streams in at runtime)
// Using stable Next.js 16 pattern: cache: 'no-store' prevents build-time pre-rendering
async function getPackages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/packages`, {
      cache: 'no-store', // Stable API: prevents build-time pre-rendering, fetches at runtime
      next: { tags: ['packages'] }, // Allows revalidation via revalidateTag() at runtime
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }
    
    // Transform to PackageData format
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
    
    return transformedPackages.filter((pkg: PackageData) => pkg.isActive);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

// Skeleton loader for dynamic packages content (only the dynamic part)
function PackagesLoading() {
  return (
    <>
      {/* Filters Skeleton */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>

      {/* Packages Grid Skeleton */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Results Info Skeleton */}
          <div className="h-6 bg-zinc-800 rounded w-1/4"></div>
          
          {/* Package Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="h-48 bg-zinc-800"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-8 bg-zinc-800 rounded w-24"></div>
                      <div className="h-6 bg-zinc-800 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Skeleton */}
          <div className="pt-8">
            <div className="h-10 bg-zinc-800 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
}

// Dynamic packages content component (streams in)
async function PackagesContent() {
  const packages = await getPackages();
  return <PackagesClient packages={packages} />;
}

// Static CTA component (cached, renders immediately as part of static shell)
const StaticCTA = cache(() => {
  return (
    <div className="relative">
      <CTASection
        title="Want Something Unique?"
        description="Don't see exactly what you're looking for? Let's craft a personalized safari experience tailored just for you"
        image="/images/sol_car.jpg"
        buttonText="Chat with Michael Kisangi"
        buttonUrl="https://wa.me/+254768453819"
      />
    </div>
  );
});

// Main page component - PPR (Partial Prerendering) pattern:
// - Static shell renders immediately (StaticShell, StaticCTA)
// - Dynamic content streams in via Suspense (PackagesContent)
// This follows Next.js 16 best practices for PPR
export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Static shell - renders immediately (cached) */}
      <StaticShell />
      
      {/* Dynamic content - streams in with Suspense boundary */}
      <Suspense fallback={<PackagesLoading />}>
        <PackagesContent />
      </Suspense>
      
      {/* Static CTA Section - renders immediately (cached) */}
      <StaticCTA />
    </div>
  );
}
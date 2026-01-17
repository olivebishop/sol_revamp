import { Suspense } from 'react';
import { PackagesClient } from "../../../components/packages/packages-client";
import GrainOverlay from "@/components/shared/grain-overlay";
import CTASection from "@/components/shared/cta-section";
import type { PackageData } from "@/data/packages";

export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};

// Force dynamic rendering to avoid oversized pre-rendered pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Function to fetch packages (using fetch cache instead of 'use cache' to avoid 2MB limit)
async function getPackages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages`, {
      next: { tags: ['packages'], revalidate: 3600 },
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

// Skeleton loader for packages
function PackagesLoading() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GrainOverlay />
      
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
    </div>
  );
}

// Dynamic packages content component
async function PackagesContent() {
  const packages = await getPackages();
  return <PackagesClient packages={packages} />;
}

// Main page component - Static shell with streaming dynamic content
export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Static shell - renders immediately */}
      <GrainOverlay />
      
      {/* Dynamic content - streams in with Suspense */}
      <Suspense fallback={<PackagesLoading />}>
        <PackagesContent />
      </Suspense>
      
      {/* Static CTA Section - renders immediately (client component) */}
      <div className="relative">
        <CTASection
          title="Want Something Unique?"
          description="Don't see exactly what you're looking for? Let's craft a personalized safari experience tailored just for you"
          image="/images/sol_car.jpg"
          buttonText="Chat with Michael Kisangi"
          buttonUrl="https://wa.me/+254768453819"
        />
      </div>
    </div>
  );
}
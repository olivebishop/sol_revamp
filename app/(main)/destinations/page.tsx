import { Suspense } from 'react';
import DestinationsClient from "@/components/destinations/destinations-client";
import GrainOverlay from "@/components/shared/grain-overlay";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Function to fetch destinations (dynamic, not cached during build)
async function getDestinations() {
  // Use no-store to prevent build-time pre-rendering and avoid oversized pages
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/destinations?listView=true`, {
      cache: 'no-store', // Prevent build-time caching
      next: { tags: ['destinations'] },
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

// Skeleton loader for destinations
function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <GrainOverlay />
      
      {/* Hero Section Skeleton */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          </div>
        </div>
      </section>

      {/* Destinations List Skeleton */}
      <section className="py-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${
              i % 2 === 0 ? "bg-black" : "bg-zinc-950"
            } border-b border-zinc-900`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 sm:py-20 lg:py-32 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Skeleton */}
                <div
                  className={`relative h-80 sm:h-96 lg:h-[500px] overflow-hidden rounded bg-zinc-800 animate-pulse ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                />

                {/* Content Skeleton */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="space-y-4">
                    <div className="h-20 bg-zinc-800 rounded w-1/4"></div>
                    <div className="h-12 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-full"></div>
                      <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                      <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 sm:py-20 lg:py-32 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-zinc-800 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-zinc-800 rounded w-2/3 mx-auto"></div>
            <div className="h-12 bg-zinc-800 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dynamic destinations content component
async function DestinationsContent() {
  const destinations = await getDestinations();
  return <DestinationsClient destinations={destinations} />;
}

// Main page component - Static shell with streaming dynamic content
export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Static shell - renders immediately */}
      <GrainOverlay />
      
      {/* Dynamic content - streams in with Suspense */}
      <Suspense fallback={<DestinationsLoading />}>
        <DestinationsContent />
      </Suspense>
    </div>
  );
}
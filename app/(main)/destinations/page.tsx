import { Suspense, cache } from 'react';
import DestinationsClient from "@/components/destinations/destinations-client";
import GrainOverlay from "@/components/shared/grain-overlay";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
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
            Destinations
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400">
            Explore the breathtaking landscapes and wildlife of East Africa
          </p>
        </div>
      </section>
      
      {/* Static CTA Section - renders immediately */}
      <section className="py-16 sm:py-20 lg:py-32 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Safari?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-10">
            Browse our curated packages or let our experts craft a custom journey tailored to your dreams.
          </p>
        </div>
      </section>
    </>
  );
});

// Dynamic function to fetch destinations (streams in at runtime)
// Using stable Next.js 16 pattern: cache: 'no-store' prevents build-time pre-rendering
async function getDestinations() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/destinations?listView=true`, {
      cache: 'no-store', // Stable API: prevents build-time pre-rendering, fetches at runtime
      next: { tags: ['destinations'] }, // Allows revalidation via revalidateTag() at runtime
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

// Skeleton loader for dynamic destinations content (only the dynamic part)
function DestinationsLoading() {
  return (
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
  );
}

// Dynamic destinations content component (streams in)
async function DestinationsContent() {
  const destinations = await getDestinations();
  return <DestinationsClient destinations={destinations} />;
}

// Main page component - PPR (Partial Prerendering) pattern:
// - Static shell renders immediately (StaticShell)
// - Dynamic content streams in via Suspense (DestinationsContent)
// This follows Next.js 16 best practices for PPR
export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Static shell - renders immediately (cached) */}
      <StaticShell />
      
      {/* Dynamic content - streams in with Suspense boundary */}
      <Suspense fallback={<DestinationsLoading />}>
        <DestinationsContent />
      </Suspense>
    </div>
  );
}
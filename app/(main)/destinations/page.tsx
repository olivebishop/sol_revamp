import { Suspense } from 'react';
import { cacheLife } from 'next/cache';
import DestinationsClient from "@/components/destinations/destinations-client";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Async function to fetch destinations
async function getDestinations() {
  'use cache'
  cacheLife('hours'); // Destinations updated multiple times per day
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations`, {
    next: { tags: ['destinations'] },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch destinations');
  }
  
  return res.json();
}

// Component that fetches the data
async function DestinationsData() {
  const destinations = await getDestinations();
  return <DestinationsClient destinations={destinations} />;
}

// Loading fallback component
function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-pulse">
            <div className="h-12 bg-zinc-800 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-zinc-800"></div>
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                  <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function DestinationsPage() {
  return (
    <Suspense fallback={<DestinationsLoading />}>
      <DestinationsData />
    </Suspense>
  );
}
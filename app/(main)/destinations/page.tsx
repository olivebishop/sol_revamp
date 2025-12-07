import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import DestinationsClient from "@/components/destinations/destinations-client";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Async function to fetch destinations with limit to reduce payload
async function getDestinations() {
  'use cache'
  cacheLife('hours');
  cacheTag('destinations');
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations?listView=true&limit=20`, {
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

// Minimal loading fallback to reduce serialized size
function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
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
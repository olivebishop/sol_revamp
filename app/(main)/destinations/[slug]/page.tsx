import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from "next/navigation";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";
import { Suspense } from 'react';

// Cached function to fetch destination by slug
async function getDestination(slug: string) {
  'use cache'
  cacheLife('hours');
  cacheTag('destinations', `destination-${slug}`);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations?slug=${slug}`, {
    next: { tags: ['destinations', `destination-${slug}`] },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data && data.length > 0 ? data[0] : null;
}

// Loading component with better skeleton
function DestinationContentLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[60vh] bg-zinc-800"></div>
        
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-12 bg-zinc-800 rounded w-2/3"></div>
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
              </div>
              <div className="h-64 bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main destination content component (cached)
async function DestinationContent({ slug }: { slug: string }) {
  const destination = await getDestination(slug);
  
  if (!destination) {
    notFound();
  }
  
  return <DestinationDetailClient destination={destination} />;
}

// Main page component - Creates static shell with cached content
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Destination content - Cached and part of static shell */}
      <Suspense fallback={<DestinationContentLoading />}>
        <DestinationContent slug={slug} />
      </Suspense>
    </div>
  );
}

// Generate metadata for SEO (cached)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestination(slug);
  
  if (!destination) {
    return {
      title: 'Destination Not Found',
    };
  }
  
  return {
    title: `${destination.name} | Destinations`,
    description: destination.tagline || destination.description?.substring(0, 160),
  };
}

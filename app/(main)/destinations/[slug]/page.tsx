'use cache'

import { cacheLife } from 'next/cache';
import { notFound } from "next/navigation";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";
import { Suspense } from 'react';

// Async function to fetch destination by slug
async function getDestination(slug: string) {
  'use cache'
  cacheLife('hours'); // Destinations updated multiple times per day
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations?slug=${slug}`, {
    next: { tags: ['destinations', `destination-${slug}`] },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data && data.length > 0 ? data[0] : null;
}

// Loading component
function DestinationLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

// Data component
async function DestinationData({ slug }: { slug: string }) {
  const destination = await getDestination(slug);
  
  if (!destination) {
    notFound();
  }
  
  return <DestinationDetailClient destination={destination} />;
}

// Main page component
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<DestinationLoading />}>
      <DestinationData slug={slug} />
    </Suspense>
  );
}

// Generate metadata for SEO
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

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from "next/navigation";
import PackageDetailsClient from "@/components/packages/package-details-client";
import type { PackageData } from "@/data/packages";
import { Suspense } from 'react';

// Cached function to fetch package by slug
async function getPackage(slug: string) {
  'use cache'
  cacheLife('hours');
  cacheTag('packages', `package-${slug}`);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages?slug=${slug}`, {
    next: { tags: ['packages', `package-${slug}`] },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data && data.length > 0 ? data[0] : null;
}

// Cached function to fetch related packages
async function getRelatedPackages(packageType: string, excludeId: string) {
  'use cache'
  cacheLife('hours');
  cacheTag('packages');
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages?type=${packageType}&exclude=${excludeId}&limit=3`,
    {
      next: { tags: ['packages'] },
    }
  );
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

// Transform DB package to PackageData format
function transformPackage(dbPackage: any): PackageData {
  return {
    id: dbPackage.id,
    name: dbPackage.name,
    slug: dbPackage.slug,
    packageType: dbPackage.packageType,
    description: dbPackage.description,
    pricing: dbPackage.pricing,
    daysOfTravel: dbPackage.daysOfTravel,
    images: dbPackage.images,
    maxCapacity: dbPackage.maxCapacity,
    currentBookings: dbPackage.currentBookings,
    isActive: dbPackage.isActive,
    destination: dbPackage.destination,
  };
}

// Loading component for package details
function PackageDetailsLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Hero skeleton */}
            <div className="h-96 bg-zinc-800 rounded-lg"></div>
            
            {/* Content skeleton */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-zinc-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for related packages
function RelatedPackagesLoading() {
  return (
    <div className="mt-16">
      <div className="h-8 bg-zinc-800 rounded w-1/3 mb-8"></div>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-zinc-800 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// Main package content component (cached)
async function PackageContent({ slug }: { slug: string }) {
  const dbPackage = await getPackage(slug);
  
  if (!dbPackage) {
    notFound();
  }
  
  const packageData = transformPackage(dbPackage);
  
  return <PackageDetailsClient package={packageData} relatedPackages={[]} />;
}

// Related packages component (cached separately)
async function RelatedPackages({ packageType, excludeId }: { packageType: string; excludeId: string }) {
  const relatedData = await getRelatedPackages(packageType, excludeId);
  const relatedPackages = relatedData.map(transformPackage);
  
  if (relatedPackages.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-white">Similar Packages</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPackages.map((pkg: PackageData) => (
          <div key={pkg.id} className="bg-zinc-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
            <p className="text-gray-400 text-sm mt-2">{pkg.description.substring(0, 100)}...</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-orange-500 font-bold">${pkg.pricing}</span>
              <span className="text-gray-400 text-sm">{pkg.daysOfTravel} days</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Related packages wrapper that fetches package data inside Suspense
async function RelatedPackagesWrapper({ slug }: { slug: string }) {
  const dbPackage = await getPackage(slug);
  
  if (!dbPackage) {
    return null;
  }
  
  return <RelatedPackages packageType={dbPackage.packageType} excludeId={dbPackage.id} />;
}

// Main page component - Static shell with dynamic sections
export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main package content - Cached and part of static shell */}
      <Suspense fallback={<PackageDetailsLoading />}>
        <PackageContent slug={slug} />
      </Suspense>
      
      {/* Related packages - Cached separately, can stream in */}
      <div className="container mx-auto px-4 pb-20">
        <Suspense fallback={<RelatedPackagesLoading />}>
          <RelatedPackagesWrapper slug={slug} />
        </Suspense>
      </div>
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
  const dbPackage = await getPackage(slug);
  
  if (!dbPackage) {
    return {
      title: 'Package Not Found',
    };
  }
  
  return {
    title: `${dbPackage.name} | Tour Packages`,
    description: dbPackage.description?.substring(0, 160),
  };
}
'use cache'

import { cacheLife } from 'next/cache';
import { notFound } from "next/navigation";
import PackageDetailsClient from "@/components/packages/package-details-client";
import type { PackageData } from "@/data/packages";
import { Suspense } from 'react';

// Async function to fetch package by slug
async function getPackage(slug: string) {
  'use cache'
  cacheLife('hours'); // Packages updated multiple times per day
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/packages?slug=${slug}`, {
    next: { tags: ['packages', `package-${slug}`] },
  });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  return data && data.length > 0 ? data[0] : null;
}

// Async function to fetch related packages
async function getRelatedPackages(packageType: string, excludeId: string) {
  'use cache'
  cacheLife('hours');
  
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

// Loading component
function PackageLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
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

// Data component
async function PackageData({ slug }: { slug: string }) {
  const dbPackage = await getPackage(slug);
  
  if (!dbPackage) {
    notFound();
  }
  
  const packageData = transformPackage(dbPackage);
  const relatedData = await getRelatedPackages(dbPackage.packageType, dbPackage.id);
  const relatedPackages = relatedData.map(transformPackage);
  
  return <PackageDetailsClient package={packageData} relatedPackages={relatedPackages} />;
}

// Main page component
export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<PackageLoading />}>
      <PackageData slug={slug} />
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
}
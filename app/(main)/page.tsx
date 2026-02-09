import { Suspense, cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";
import FeaturedPackages from "@/components/packages/featured-packages";
import VisualNarratives from "@/components/shared/visual-narratives";
import WhyChooseUs from "@/components/shared/why-choose-us";
import Testimonials from "@/components/shared/testimonials";
import CTASectionWrapper from "@/components/shared/cta-section-wrapper";
import { getAllPackages } from "@/lib/dal/packageDAL";
import { getApprovedTestimonials } from "@/lib/dal/testimonialDAL";
import type { PackageData } from "@/data/packages";

// Cached function to fetch packages directly from database
// Using Next.js 'use cache' with cacheLife for cross-request caching
// This provides persistent caching across requests, not just within a single request
async function getCachedPackages(): Promise<PackageData[]> {
  'use cache'
  cacheLife('hours'); // Cache for hours - data doesn't change frequently
  cacheTag('packages'); // Tag for manual revalidation
  
  try {
    const packages = await getAllPackages();
    
    // Transform to PackageData format
    const transformedPackages: PackageData[] = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      packageType: pkg.packageType || "safari",
      description: pkg.description,
      pricing: pkg.pricing,
      daysOfTravel: pkg.daysOfTravel,
      images: Array.isArray(pkg.images) && pkg.images.length > 0 
        ? [pkg.images[0]] 
        : (pkg.images || []),
      maxCapacity: pkg.maxCapacity || 10,
      currentBookings: pkg.currentBookings || 0,
      isActive: pkg.isActive,
      destination: (typeof pkg.destination === 'object' && pkg.destination !== null)
        ? pkg.destination as { id: string; name: string; slug: string; bestTime: string }
        : {
            id: "default",
            name: "Kenya",
            slug: "kenya",
            bestTime: "Year-round"
          }
    }));
    
    return transformedPackages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

// Cached function to fetch testimonials directly from database
// Using Next.js 'use cache' with cacheLife for cross-request caching
// This provides persistent caching across requests, not just within a single request
async function getCachedTestimonials() {
  'use cache'
  cacheLife('hours'); // Cache for hours - testimonials don't change frequently
  cacheTag('testimonials'); // Tag for manual revalidation
  
  try {
    return await getApprovedTestimonials(6);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Loading component for packages
function PackagesLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading component for testimonials
function TestimonialsLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-zinc-800 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-lg p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Packages section component (cached - queries DB directly)
async function PackagesSection() {
  const packages = await getCachedPackages();
  
  if (packages.length === 0) {
    return null;
  }
  
  return <FeaturedPackages packages={packages} />;
}

// Testimonials section component (cached - queries DB directly)
async function TestimonialsSection() {
  const testimonials = await getCachedTestimonials();
  
  return <Testimonials testimonials={testimonials} />;
}

// Main page component - Static shell with cached dynamic sections
export default async function Page() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay - Part of static shell */}
      <GrainOverlay />

      {/* Hero Section - Part of static shell */}
      <HeroSection />

      {/* Featured Packages - Cached, can be part of static shell */}
      <Suspense fallback={<PackagesLoading />}>
        <PackagesSection />
      </Suspense>

      {/* Visual Narratives - Part of static shell */}
      <VisualNarratives />

      {/* Why Choose Us Section - Part of static shell */}
      <WhyChooseUs />

      {/* Testimonials Section - Cached, streams in if needed */}
      <Suspense fallback={<TestimonialsLoading />}>
        <TestimonialsSection />
      </Suspense>

      {/* CTA Section - Part of static shell */}
      <CTASectionWrapper />
    </div>
  );
}

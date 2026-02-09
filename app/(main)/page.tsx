import { Suspense } from 'react';
import HeroSection from "@/components/shared/hero";
import GrainOverlay from "@/components/shared/grain-overlay";
import FeaturedPackages from "@/components/packages/featured-packages";
import VisualNarratives from "@/components/shared/visual-narratives";
// import WhyChooseUs from "@/components/shared/why-choose-us";
import Testimonials from "@/components/shared/testimonials";
import CTASectionWrapper from "@/components/shared/cta-section-wrapper";
import type { PackageData } from "@/data/packages";

// Function to fetch packages (using fetch cache to avoid build-time timeout)
async function getPackages() {
  try {
    // During build, use relative URL or empty string (fetch will use current origin at runtime)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/packages`, {
      cache: 'force-cache', // Cache aggressively - use cached data when available
      next: { 
        tags: ['packages'], // Allows revalidation via revalidateTag() at runtime
        revalidate: 3600, // Revalidate every hour (3600 seconds)
      },
    } as RequestInit & { next?: { tags?: string[]; revalidate?: number } });
  
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }
    
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
    
    // Return all packages (don't filter by isActive - show all created packages)
    return transformedPackages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

// Function to fetch testimonials (using fetch cache to avoid build-time timeout)
async function getTestimonials() {
  try {
    // During build, use relative URL or empty string (fetch will use current origin at runtime)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/testimonials`, {
      next: { tags: ['testimonials'] },
      // Use default caching strategy (not no-store) for homepage to allow static generation
    } as RequestInit & { next?: { tags?: string[] } });
    
    if (!res.ok) {
      return [];
    }
    
    return res.json();
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

// Packages section component (cached)
async function PackagesSection() {
  const packages = await getPackages();
  
  if (packages.length === 0) {
    return null;
  }
  
  return <FeaturedPackages packages={packages} />;
}

// Testimonials section component (cached)
async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  
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
      {/* <WhyChooseUs /> */}

      {/* Testimonials Section - Cached, streams in if needed */}
      <Suspense fallback={<TestimonialsLoading />}>
        <TestimonialsSection />
      </Suspense>

      {/* CTA Section - Part of static shell */}
      <CTASectionWrapper />
    </div>
  );
}

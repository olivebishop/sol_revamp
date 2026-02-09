/**
 * Example usage of image components
 * These examples demonstrate Next.js 16+ best practices
 */

// ============================================
// Example 1: Client Component with ImageUpload
// ============================================
"use client";
import { ImageUpload } from "@/components/shared/image-upload";
import { useState } from "react";

export function PackageFormExample() {
  const [images, setImages] = useState<string[]>([]);

  const handleUploadComplete = (newUrls: string[]) => {
    setImages((prev) => [...prev, ...newUrls]);
  };

  const handleRemove = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  return (
    <div className="space-y-4">
      <h2>Upload Package Images</h2>
      <ImageUpload
        bucket="packages"
        maxFiles={5}
        maxSizeMB={5}
        onUploadComplete={handleUploadComplete}
        onUploadError={(error) => console.error("Upload error:", error)}
        existingImages={images}
        onRemove={handleRemove}
      />
    </div>
  );
}

// ============================================
// Example 2: Server Component with Streaming
// ============================================
import { Suspense, cache } from "react";
import { ServerImage } from "@/components/shared/server-image";

// Static shell - cached, renders immediately
const GalleryStaticShell = cache(() => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
      <p className="text-gray-400">Browse our collection</p>
    </div>
  );
});

// Dynamic content - streams in
async function GalleryContent() {
  // Simulate data fetching
  const images = await fetch("/api/images/list?bucket=gallery")
    .then((res) => res.json())
    .then((data) => data.images || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((img: { url: string; name: string }) => (
        <div key={img.url} className="relative aspect-square">
          <ServerImage
            src={img.url}
            alt={img.name}
            className="rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
          />
        </div>
      ))}
    </div>
  );
}

// Loading skeleton
function GalleryLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-square bg-zinc-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

// Page component with PPR pattern
export default function GalleryPageExample() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Static shell - renders immediately */}
      <GalleryStaticShell />

      {/* Dynamic content - streams in */}
      <Suspense fallback={<GalleryLoading />}>
        <GalleryContent />
      </Suspense>
    </div>
  );
}

// ============================================
// Example 3: Client Component with ImageGallery
// ============================================
"use client";
import { ImageGallery } from "@/components/shared/image-gallery";

export function PackageDetailsExample({ images }: { images: string[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Package Images</h2>
        <ImageGallery
          images={images}
          alt="Package images"
          showThumbnails={true}
          className="my-4"
        />
      </div>
    </div>
  );
}

// ============================================
// Example 4: Using SupabaseImage in Client Component
// ============================================
"use client";
import { SupabaseImage } from "@/components/shared/supabase-image";

export function ImageCardExample({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden">
      <SupabaseImage
        src={imageUrl}
        alt={alt}
        className="w-full h-full"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      />
    </div>
  );
}

// ============================================
// Example 5: Cached Server Component
// ============================================
import { cache } from "react";
import { ServerImage } from "@/components/shared/server-image";

// Cache the image component for request-level memoization
const CachedHeroImage = cache(({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative h-96 w-full">
      <ServerImage
        src={src}
        alt={alt}
        priority
        sizes="100vw"
      />
    </div>
  );
});

export function HeroSectionExample({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <section>
      <CachedHeroImage src={imageUrl} alt={title} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
    </section>
  );
}

"use client";
import { memo } from "react";
import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SupabaseImageProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
}

/**
 * Optimized image component for Supabase Storage URLs
 * Handles Supabase URLs, local paths, and fallbacks
 * Uses Next.js Image optimization with proper caching
 */
export const SupabaseImage = memo(function SupabaseImage({
  src,
  alt,
  fallback = "/images/default-image.jpg",
  className,
  priority = false,
  loading = "lazy",
  sizes,
  ...props
}: SupabaseImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder for better UX
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Determine if it's a Supabase URL
  const isSupabaseUrl = imgSrc.includes("supabase.co");
  // Determine if it's a local path
  const isLocalPath = imgSrc.startsWith("/");

  // Use unoptimized for Supabase URLs if needed, or let Next.js handle it
  // Next.js 16+ handles external images via remotePatterns in next.config
  const imageSrc = imgSrc || fallback;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading && "opacity-0",
          !isLoading && !hasError && "opacity-100",
          hasError && "opacity-75"
        )}
        priority={priority}
        loading={loading}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
});

SupabaseImage.displayName = "SupabaseImage";

"use client";
import { memo, useEffect } from "react";
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
  fallback, // No default fallback - images must come from Supabase
  className,
  priority = false,
  loading = "lazy",
  sizes,
  ...props
}: SupabaseImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Check if src is a Supabase URL
  const isSupabaseUrl = src?.includes("supabase.co") || src?.includes("supabase");

  // Generate blur placeholder for better UX
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  const handleError = (e: any) => {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('SupabaseImage error:', {
        src: imgSrc,
        isSupabaseUrl,
        error: e,
      });
    }
    
    // For Supabase images, don't use static fallbacks - show placeholder instead
    if (isSupabaseUrl) {
      setHasError(true);
      setIsLoading(false);
    } else if (fallback && imgSrc !== fallback) {
      // Only use fallback for non-Supabase images (local images)
      setImgSrc(fallback);
      setIsLoading(true);
    } else {
      // No fallback available, show placeholder
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Normalize image source - ensure we have a valid URL
  // Next.js 16+ handles external images via remotePatterns in next.config
  // Supabase URLs are automatically optimized by Next.js Image component
  // For Supabase images, never use static fallbacks
  const imageSrc = imgSrc || (isSupabaseUrl ? undefined : fallback);
  
  // Log in development if image source is empty or invalid
  if (process.env.NODE_ENV === 'development' && !imgSrc) {
    if (isSupabaseUrl) {
      console.warn('SupabaseImage: No Supabase image URL provided', { alt });
    } else {
      console.warn('SupabaseImage: No image source provided', { alt, fallback });
    }
  }
  
  // Update src if it changes externally
  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, imgSrc]);

  // Don't pass loading prop when priority is true (Next.js requirement)
  const imageProps: any = {
    src: imageSrc,
    alt,
    fill: true,
    className: cn(
      "object-cover transition-opacity duration-300",
      isLoading && "opacity-0",
      !isLoading && !hasError && "opacity-100",
      hasError && "opacity-75"
    ),
    priority,
    sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    placeholder: "blur",
    blurDataURL,
    onError: handleError,
    onLoad: handleLoad,
    ...props,
  };

  // Only add loading prop if priority is false
  if (!priority) {
    imageProps.loading = loading;
  }

  // If we have an error, no valid image, or no src at all, show placeholder
  // For Supabase images, never show static fallback - only placeholder
  if (hasError || !imageSrc || (isSupabaseUrl && !imgSrc)) {
    return (
      <div className={cn("relative overflow-hidden bg-zinc-800 flex items-center justify-center", className)}>
        <div className="text-gray-500 text-sm text-center p-4">
          <svg
            className="w-12 h-12 mx-auto mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image {...imageProps} />
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
});

SupabaseImage.displayName = "SupabaseImage";

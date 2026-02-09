import { cache } from "react";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ServerImageProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Server-side image component optimized for caching
 * Can be used in Server Components and cached with React cache()
 * 
 * Following Next.js 16+ best practices:
 * - Uses React cache() for request-level memoization
 * - Optimized for server-side rendering
 * - Proper image optimization via Next.js Image
 */
export const ServerImage = cache(function ServerImage({
  src,
  alt,
  fallback = "/images/default-image.jpg",
  className,
  priority = false,
  sizes,
  ...props
}: ServerImageProps) {
  const imageSrc = src || fallback;
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        placeholder="blur"
        blurDataURL={blurDataURL}
        {...props}
      />
    </div>
  );
});

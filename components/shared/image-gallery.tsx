"use client";
import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SupabaseImage } from "./supabase-image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * Image gallery component with lightbox functionality
 * Optimized with React.memo and proper event handling
 * Follows React best practices for performance
 */
export const ImageGallery = memo(function ImageGallery({
  images,
  alt = "Gallery image",
  className,
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-64 bg-zinc-900 rounded", className)}>
        <p className="text-zinc-500">No images available</p>
      </div>
    );
  }

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        default:
          break;
      }
    },
    [selectedIndex, closeLightbox, goToPrevious, goToNext]
  );

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox(0);
            }
          }}
          aria-label="Open image gallery"
        >
          <SupabaseImage
            src={images[0]}
            alt={alt}
            className="w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {images.length > 1 && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">
                {images.length} {images.length === 1 ? "image" : "images"} • Click to view
              </p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.slice(0, 8).map((image, index) => (
              <motion.button
                key={image}
                type="button"
                onClick={() => openLightbox(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded border-2 transition-all",
                  index === 0
                    ? "border-orange-500 scale-105"
                    : "border-transparent hover:border-zinc-600"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View image ${index + 1}`}
              >
                <SupabaseImage
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, 12vw"
                />
              </motion.button>
            ))}
            {images.length > 8 && (
              <div className="relative aspect-square overflow-hidden rounded border-2 border-zinc-800 flex items-center justify-center bg-zinc-900">
                <p className="text-xs text-zinc-400">+{images.length - 8}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery lightbox"
            tabIndex={-1}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl w-full max-h-[90vh] cursor-default"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors p-2 z-10"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors p-2 bg-black/50 rounded-full hover:bg-black/70 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors p-2 bg-black/50 rounded-full hover:bg-black/70 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Current Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative max-w-full max-h-[90vh]"
                  >
                    <SupabaseImage
                      src={images[currentIndex]}
                      alt={`${alt} ${currentIndex + 1}`}
                      className="w-full h-auto max-h-[90vh] object-contain"
                      sizes="90vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ImageGallery.displayName = "ImageGallery";

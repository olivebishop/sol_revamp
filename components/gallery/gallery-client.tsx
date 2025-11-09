"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { GalleryImage } from "@/data/gallery";
import CTASection from "@/components/shared/cta-section";

interface GalleryClientProps {
  images: GalleryImage[];
}

export function GalleryClient({ images }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      {/* Header Section */}
      <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
          >
            Our
            <span className="text-orange-500"> Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-gray-400 text-lg max-w-2xl"
          >
            Explore the breathtaking moments captured during our safari
            adventures across East Africa
          </motion.p>
        </div>
      </div>

      {/* Gallery Grid - Masonry Layout */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8 }}
                className="break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="relative aspect-auto overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection
        title="Loved What You Saw?"
        description="These moments can be yours. Let's create your unforgettable African adventure"
        image="/images/sol_car.jpg"
        buttonText="Chat with Michael Kisangi"
        buttonAction={() => {
          window.open("https://wa.me/+254706294505", "_blank");
        }}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full cursor-default"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Close</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import GrainOverlay from "@/components/shared/grain-overlay";
import { galleryImages } from "@/data/gallery";
import { GalleryClient } from "@/components/gallery/gallery-client";

export const metadata = {
  title: "Gallery | The Sol Safari & Tours",
  description:
    "Explore stunning images from our safari adventures across East Africa. Wildlife, landscapes, culture, and unforgettable moments captured on camera.",
};

export default function GalleryPage() {
  // Server-side data fetching
  // In production, this could fetch from your database using Prisma
  const images = galleryImages;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Client Component for interactivity */}
      <div className="relative z-10">
        <GalleryClient images={images} />
      </div>
    </div>
  );
}

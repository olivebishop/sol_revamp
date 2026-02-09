import GrainOverlay from "@/components/shared/grain-overlay";
import { AboutClient } from "@/components/aboutComponent/about-client";

export const metadata = {
  title: "About Us | The Sol Safari & Tours",
  description:
    "Discover our story and learn about our commitment to sustainable tourism and authentic African safari experiences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Client Component for interactivity */}
      <div className="relative z-10">
        <AboutClient />
      </div>
    </div>
  );
}

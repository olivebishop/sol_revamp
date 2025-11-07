import GrainOverlay from "@/components/shared/grain-overlay";
import { team } from "@/data/about";
import { AboutClient } from "@/components/aboutComponent/about-client";

export const metadata = {
  title: "About Us | The Sol Safari & Tours",
  description:
    "Discover our story, meet our team, and learn about our commitment to sustainable tourism and authentic African safari experiences.",
};

export default function AboutPage() {
  // Server-side data fetching
  // In production, this could fetch from your database using Prisma
  const teamMembers = team;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Client Component for interactivity */}
      <div className="relative z-10">
        <AboutClient teamMembers={teamMembers} />
      </div>
    </div>
  );
}

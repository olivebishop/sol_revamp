import DestinationsClient from "@/components/destinations/destinations-client";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Simple page that delegates to client component
// This avoids the oversized RSC payload issue
export default function DestinationsPage() {
  return <DestinationsClient destinations={[]} />;
}
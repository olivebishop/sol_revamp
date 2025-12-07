import DestinationsClient from "@/components/destinations/destinations-client";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Fetch destinations dynamically (no caching to avoid oversized fallback)
async function getDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations?listView=true`, {
    cache: 'no-store', // Force dynamic rendering
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch destinations');
  }
  
  return res.json();
}

// Main page component - fully dynamic (no PPR/ISR)
export default async function DestinationsPage() {
  const destinations = await getDestinations();
  
  return <DestinationsClient destinations={destinations} />;
}
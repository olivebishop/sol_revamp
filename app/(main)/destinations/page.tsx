import DestinationsClient from "@/components/destinations/destinations-client";

export const metadata = {
  title: "Destinations | Explore East Africa",
  description:
    "Discover stunning destinations across East Africa. From the Serengeti to Zanzibar beaches.",
};

// Async function to fetch destinations - now fully static at build time
async function getDestinations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations?listView=true`, {
    next: { 
      revalidate: 3600, // Revalidate every hour (ISR)
      tags: ['destinations'] 
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch destinations');
  }
  
  return res.json();
}

// Main page component - fully prerendered at build time
export default async function DestinationsPage() {
  const destinations = await getDestinations();
  
  return <DestinationsClient destinations={destinations} />;
}
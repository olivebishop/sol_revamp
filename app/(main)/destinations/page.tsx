
import DestinationsClient from "@/components/destinations/destinations-client";

// Next.js 16: Use async server component for data fetching
export default async function DestinationsPage() {
  // Fetch destinations from the API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/destinations`, {
    cache: 'no-store',
    next: { tags: ['destinations'] },
  });
  const destinations = await res.json();

  return <DestinationsClient destinations={destinations} />;
}

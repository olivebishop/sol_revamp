import { cache } from 'react';
import NavbarClient from "./navbarClient";
import { getAllDestinations } from "@/lib/dal/destinationDAL";

// Cache the destinations fetch for the request
const getCachedDestinations = cache(async () => {
  try {
    return await getAllDestinations();
  } catch (error) {
    console.error("Error loading destinations for navbar:", error);
    return [];
  }
});

export default async function Navbar() {
  try {
    // Fetch latest destinations from DB (cached per request)
    const destinations = await getCachedDestinations();
    // Only published destinations for nav
    const published = destinations.filter((d) => d.isPublished);
    const navDestinations = published.map((d) => ({
      name: d.name,
      route: `/destinations/${d.slug}`,
    }));
    // Featured: most recently created published destination, fallback to null
    const featured = published.length > 0 ? published[0] : null;
    return <NavbarClient destinations={navDestinations} featured={featured} />;
  } catch (error) {
    // Handle database errors gracefully - return empty navbar
    console.error("Error loading destinations for navbar:", error);
    return <NavbarClient destinations={[]} featured={null} />;
  }
}
"use cache";

import NavbarClient from "./navbarClient";
import { getAllDestinations } from "@/lib/dal/destinationDAL";

export default async function Navbar() {
  // Fetch latest destinations from DB
  const destinations = await getAllDestinations();
  // Only published destinations for nav
  const published = destinations.filter((d) => d.isPublished);
  const navDestinations = published.map((d) => ({
    name: d.name,
    route: `/destinations/${d.slug}`,
  }));
  // Featured: most recently created published destination, fallback to null
  const featured = published.length > 0 ? published[0] : null;
  return <NavbarClient destinations={navDestinations} featured={featured} />;
}
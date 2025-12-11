import { PackagesClient } from "../../../components/packages/packages-client";

export const metadata = {
  title: "Tour Packages | Safari & Beach Adventures",
  description:
    "Explore our curated collection of safari, beach, cultural, and adventure packages across East Africa. Book your dream vacation today.",
};

// Simple page that delegates to client component
export default function PackagesPage() {
  return <PackagesClient packages={[]} />;
}
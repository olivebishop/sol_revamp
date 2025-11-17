import { notFound } from "next/navigation";
import { getPackageBySlug, packages } from "@/data/packages";
import PackageDetailsClient from "@/components/packages/package-details-client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PackageDetailsPage(props: PageProps) {
  const params = await props.params;
  const packageData = getPackageBySlug(params.slug);

  if (!packageData) {
    notFound();
  }

  // Get related packages on the server side
  const relatedPackages = packages
    .filter(
      (p) =>
        p.id !== packageData.id &&
        (p.destination.id === packageData.destination.id ||
          p.packageType === packageData.packageType),
    )
    .slice(0, 3);

  return <PackageDetailsClient package={packageData} relatedPackages={relatedPackages} />;
}

export async function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}
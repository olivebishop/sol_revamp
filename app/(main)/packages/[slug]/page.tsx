import { notFound } from "next/navigation";
import { getPackageBySlug } from "@/data/packages";
import PackageDetailsClient from "@/components/packages/package-details-client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PackageDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const packageData = getPackageBySlug(slug);

  if (!packageData) {
    notFound();
  }

  return <PackageDetailsClient package={packageData} />;
}

export async function generateStaticParams() {
  const { packages } = await import("@/data/packages");
  
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PackageDetailsClient from "@/components/packages/package-details-client";
import type { PackageData } from "@/data/packages";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function PackageContent({ slug }: { slug: string }) {
  // Fetch package from database
  const dbPackage = await prisma.package.findUnique({
    where: { slug, isActive: true },
  });

  if (!dbPackage) {
    notFound();
  }

  // Transform to PackageData format
  const packageData: PackageData = {
    id: dbPackage.id,
    name: dbPackage.name,
    slug: dbPackage.slug,
    packageType: dbPackage.packageType as any,
    description: dbPackage.description,
    pricing: dbPackage.pricing,
    daysOfTravel: dbPackage.daysOfTravel,
    images: dbPackage.images,
    maxCapacity: dbPackage.maxCapacity,
    currentBookings: dbPackage.currentBookings,
    isActive: dbPackage.isActive,
    destination: dbPackage.destination as any,
  };

  // Get related packages from database
  const relatedDbPackages = await prisma.package.findMany({
    where: {
      isActive: true,
      id: { not: dbPackage.id },
      OR: [
        { packageType: dbPackage.packageType },
      ],
    },
    take: 3,
  });

  const relatedPackages: PackageData[] = relatedDbPackages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    packageType: pkg.packageType as any,
    description: pkg.description,
    pricing: pkg.pricing,
    daysOfTravel: pkg.daysOfTravel,
    images: pkg.images,
    maxCapacity: pkg.maxCapacity,
    currentBookings: pkg.currentBookings,
    isActive: pkg.isActive,
    destination: pkg.destination as any,
  }));

  return <PackageDetailsClient package={packageData} relatedPackages={relatedPackages} />;
}

function PackageLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

export default async function PackageDetailsPage(props: PageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PackageLoading />}>
      <PackageContent slug={params.slug} />
    </Suspense>
  );
}
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import PackageDetailsClient from "@/components/packages/package-details-client";
import type { PackageData } from "@/data/packages";

export default function PackageDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        // Fetch main package
        const response = await fetch(`/api/packages?slug=${slug}`);
        if (!response.ok) {
          setNotFoundError(true);
          return;
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          setNotFoundError(true);
          return;
        }

        const dbPackage = data[0];

        // Transform to PackageData format
        const transformedPackage: PackageData = {
          id: dbPackage.id,
          name: dbPackage.name,
          slug: dbPackage.slug,
          packageType: dbPackage.packageType,
          description: dbPackage.description,
          pricing: dbPackage.pricing,
          daysOfTravel: dbPackage.daysOfTravel,
          images: dbPackage.images,
          maxCapacity: dbPackage.maxCapacity,
          currentBookings: dbPackage.currentBookings,
          isActive: dbPackage.isActive,
          destination: dbPackage.destination,
        };

        setPackageData(transformedPackage);

        // Fetch related packages
        const relatedResponse = await fetch(`/api/packages?type=${dbPackage.packageType}&exclude=${dbPackage.id}&limit=3`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const transformedRelated: PackageData[] = relatedData.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            slug: pkg.slug,
            packageType: pkg.packageType,
            description: pkg.description,
            pricing: pkg.pricing,
            daysOfTravel: pkg.daysOfTravel,
            images: pkg.images,
            maxCapacity: pkg.maxCapacity,
            currentBookings: pkg.currentBookings,
            isActive: pkg.isActive,
            destination: pkg.destination,
          }));
          setRelatedPackages(transformedRelated);
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPackage();
    }
  }, [slug]);

  if (notFoundError) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!packageData) {
    return null;
  }

  return <PackageDetailsClient package={packageData} relatedPackages={relatedPackages} />;
}
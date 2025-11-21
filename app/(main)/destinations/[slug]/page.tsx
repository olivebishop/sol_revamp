import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";
import { Suspense } from "react";

async function DestinationContent({ slug }: { slug: string }) {
  // Fetch destination from database
  const destination = await prisma.destination.findUnique({
    where: { slug, isPublished: true },
  });

  if (!destination) {
    notFound();
  }

  return <DestinationDetailClient destination={destination} />;
}

function DestinationLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<DestinationLoading />}>
      <DestinationContent slug={slug} />
    </Suspense>
  );
}

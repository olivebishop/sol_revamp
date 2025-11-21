import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Fetch destination from database
  const destination = await prisma.destination.findUnique({
    where: { slug, isPublished: true },
  });

  if (!destination) {
    notFound();
  }

  return <DestinationDetailClient destination={destination} />;
}

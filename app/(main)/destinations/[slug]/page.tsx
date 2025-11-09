import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";

export function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  return <DestinationDetailClient destination={destination} />;
}

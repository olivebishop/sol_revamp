"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import DestinationDetailClient from "@/components/destinations/destination-detail-client";

export default function DestinationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations?slug=${slug}`);
        if (!response.ok) {
          setNotFoundError(true);
          return;
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          setNotFoundError(true);
          return;
        }
        setDestination(data[0]);
      } catch (error) {
        console.error("Error fetching destination:", error);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDestination();
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

  if (!destination) {
    return null;
  }

  return <DestinationDetailClient destination={destination} />;
}

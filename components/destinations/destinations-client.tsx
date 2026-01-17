"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import GrainOverlay from "@/components/shared/grain-overlay";


interface DestinationsClientProps {
  destinations: any[];
}

export default function DestinationsClient({ destinations: initialDestinations }: DestinationsClientProps) {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [loading, setLoading] = useState(initialDestinations.length === 0);

  useEffect(() => {
    // Only fetch if no initial destinations provided
    if (initialDestinations.length === 0 && !loading) {
      setLoading(true);
      fetch('/api/destinations?listView=true')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Ensure data is an array
          if (Array.isArray(data)) {
            setDestinations(data);
          } else {
            console.error('Invalid data format received:', data);
            setDestinations([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch destinations:', err);
          setDestinations([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialDestinations.length, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <GrainOverlay />
        <div className="container mx-auto px-4 py-32">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Guard against undefined or empty destinations
  if (!destinations || destinations.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <GrainOverlay />
        <div className="container mx-auto px-4 py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">No Destinations Found</h1>
            <p className="text-gray-400">Check back soon for amazing destinations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <GrainOverlay />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Africa's Most <span className="text-orange-500">Iconic</span>{" "}
              Destinations
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl">
              From the rolling plains of the Maasai Mara to Kilimanjaro's
              majestic shadow, discover where adventure meets wilderness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations - Alternating layout */}
      <section className="py-0">
        {destinations.map((destination, index) => (
          <Link
            key={destination.id}
            href={`/destinations/${destination.slug}` as any}
            prefetch={index < 3} // Only prefetch first 3 for performance
          >
            <motion.article
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`${
                index % 2 === 0 ? "bg-black" : "bg-zinc-950"
              } border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors group`}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 sm:py-20 lg:py-32 ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative h-80 sm:h-96 lg:h-[500px] overflow-hidden rounded ${
                      index % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={destination.heroImage || "/images/default-destination.jpg"}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index < 3 ? "eager" : "lazy"}
                      priority={index < 2}
                    />
                    {destination.location?.country && (
                      <div className="absolute top-6 left-6">
                        <div className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {destination.location.country}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div className="mb-4">
                        <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-orange-500/10">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 group-hover:text-orange-500 transition-colors">
                        {destination.name}
                      </h2>
                      <p className="text-2xl sm:text-3xl text-orange-500 font-light italic mb-6">
                        {destination.tagline}
                      </p>
                      {destination.description && (
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                          {destination.description}
                        </p>
                      )}

                      {/* Highlights */}
                      {destination.highlights && destination.highlights.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                            Highlights
                          </h3>
                          <ul className="space-y-2">
                            {destination.highlights
                              .slice(0, 3)
                              .map((highlight: string) => (
                                <li
                                  key={highlight}
                                  className="text-gray-300 pl-6 relative before:content-['\u2014'] before:absolute before:left-0 before:text-orange-500"
                                >
                                  {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center gap-3 text-orange-500 font-semibold group/btn">
                        <span>Explore Destination</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Safari?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10">
              Browse our curated packages or let our experts craft a custom
              journey tailored to your dreams.
            </p>
            <Link href="/packages">
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded text-lg font-semibold hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] transition-all inline-flex items-center gap-3"
              >
                View All Packages
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface Experience {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

interface ExperienceDetailClientProps {
  experience: Experience;
}

export default function ExperienceDetailClient({
  experience,
}: ExperienceDetailClientProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] w-full mt-8"
      >
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
              {experience.category}
            </p>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {experience.title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">
              {experience.description}
            </p>

            {/* Additional Content Placeholder */}
            <div className="mt-12 pt-12 border-t border-zinc-800">
              <p className="text-gray-400">
                More details about this experience coming soon...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  text: string;
  tripType: string | null;
  createdAt: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) {
    return (
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            What Our Travelers
            <span className="text-orange-500"> Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Be the first to share your experience with us!
          </p>
          <Link href="/feedback">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6">
              Share Your Feedback
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            What Our Travelers
            <span className="text-orange-500"> Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real stories from real travelers who experienced the magic of Africa with us
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -8 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded p-6 space-y-4"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <Star
                    key={`${testimonial.id}-star-${starIndex}`}
                    className="w-5 h-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed italic line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="pt-4 border-t border-zinc-800">
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                </div>
                {testimonial.tripType && (
                  <div className="mt-2 text-xs text-gray-500">
                    {testimonial.tripType}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/feedback">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
              Share Your Experience
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

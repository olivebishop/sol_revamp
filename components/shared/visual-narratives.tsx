"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/data/visual";

const FeaturedExperiences = () => {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 via-[#36454F] to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-black"
            >
              Experiences
              <br />
              That Matter
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-black text-sm sm:text-base leading-relaxed max-w-md"
            >
              Unforgettable journeys across Africa's most breathtaking
              landscapes. From wildlife encounters to cultural immersion, each
              adventure is crafted to create memories that last a lifetime.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white transition-all px-6 py-3 text-sm font-semibold tracking-wider"
            >
              <Link href="/packages" className="flex items-center gap-2">
                VIEW ALL
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                // @ts-expect-error - Dynamic route from data file
                href={`/experiences/${experience.id}`}
                className="group cursor-pointer block"
              >
                {/* Image Container - 1st and 3rd are tall, 2nd and 4th are short */}
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`relative overflow-hidden mb-3 sm:mb-4 rounded-sm ${
                    index === 0 || index === 2 ? "aspect-3/4" : "aspect-4/3"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={experience.image}
                      alt={experience.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </motion.div>

                {/* Text Content Below Image */}
                <div className="space-y-1.5 sm:space-y-2">
                  {/* Category */}
                  <p className="text-orange-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    {experience.category}
                  </p>

                  {/* Title */}
                  <h3 className="text-white text-lg sm:text-xl font-bold leading-tight group-hover:text-orange-500 transition-colors duration-300">
                    {experience.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-px w-24 bg-linear-to-r from-transparent to-orange-500/50" />
          <div className="w-2 h-2 bg-orange-500 rotate-45" />
          <div className="h-px w-24 bg-linear-to-l from-transparent to-orange-500/50" />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;

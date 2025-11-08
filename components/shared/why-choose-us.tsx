"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { whyChooseUs } from "@/data/about";

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
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
            What Sets Us
            <span className="text-orange-500"> Apart</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover why travelers choose us for their African adventures
          </p>
        </motion.div>

        {/* Grid Layout - Staircase/Staggered Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className={`relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded overflow-hidden group ${
                index === 0 ? "md:mt-0" : index === 1 ? "md:mt-12" : "md:mt-24"
              }`}
            >
              {/* Image Background */}
              <div className="relative h-64 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/40" />
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                className="p-6 space-y-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
              >
                <h3 className="text-xl font-bold font-['Cal_Sans','Oswald',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

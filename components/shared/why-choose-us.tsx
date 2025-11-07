"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { whyChooseUs } from "@/data/about";

export default function WhyChooseUs() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <p className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase">
          Why Choose Us
        </p>
        <h2 className="text-4xl md:text-5xl font-bold font-['Cal_Sans','Oswald',sans-serif]">
          What Sets Us Apart
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {whyChooseUs.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.7,
              delay: index * 0.2,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              y: -12,
              rotateY: 5,
              transition: { duration: 0.3 },
            }}
            className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden group"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {/* Image Background */}
            <div className="relative h-64 overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
              </motion.div>

              {/* Icon */}
              <div className="absolute top-6 left-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 rounded-full flex items-center justify-center"
                >
                  <item.icon className="w-7 h-7 text-orange-500" />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <motion.div
              className="p-6 space-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.3 }}
            >
              <h3 className="text-2xl font-bold font-['Cal_Sans','Oswald',sans-serif]">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>

            {/* Stacked Card Effect - Shadow Cards */}
            <div
              className="absolute -bottom-2 left-4 right-4 h-3 bg-zinc-800/50 rounded-b-2xl -z-10"
              style={{ transform: "translateZ(-10px)" }}
            />
            <div
              className="absolute -bottom-4 left-8 right-8 h-3 bg-zinc-800/30 rounded-b-2xl -z-20"
              style={{ transform: "translateZ(-20px)" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

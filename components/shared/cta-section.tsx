"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonAction: () => void;
}

export default function CTASection({
  title,
  description,
  image,
  buttonText,
  buttonAction,
}: CTASectionProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded border border-zinc-800 bg-zinc-900/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {title.split(" ").map((word, wordIndex, arr) => (
                    <span key={`word-${word}-${wordIndex}-${arr.length}`}>
                      {wordIndex === arr.length - 1 ? (
                        <span className="text-orange-500">{word}</span>
                      ) : (
                        `${word} `
                      )}
                    </span>
                  ))}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-md">
                  {description}
                </p>

                {/* Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={buttonAction}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold tracking-wider rounded transition-all shadow-lg hover:shadow-orange-500/50 group"
                  >
                    {buttonText}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -z-10" />
              </motion.div>
            </div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative h-64 sm:h-80 lg:h-full min-h-[400px] overflow-hidden rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                  priority={false}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent lg:bg-linear-to-l" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent lg:hidden" />
              </motion.div>
            </motion.div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" aria-hidden="true">
                <title>Decorative background pattern</title>
                <pattern
                  id="cta-pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="1" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

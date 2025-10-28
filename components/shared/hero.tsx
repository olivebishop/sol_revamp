"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { slides } from "@/data/slides";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoplay(false);
    setCurrentSlide(index);
  };

  const getSlideIndex = (offset: number) => {
    return (currentSlide + offset + slides.length) % slides.length;
  };

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[500px] flex items-center">
      {/* Left Side - PREV Button (Hidden on small devices) */}
      <div className="hidden md:block absolute left-4 md:left-8 z-40">
        <Button
          onClick={prevSlide}
          className="text-white border-2 border-gray-600 rounded px-5 py-3 md:px-7 md:py-3.5 hover:text-orange-500 hover:border-orange-500 transition-all flex items-center gap-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wider">PREV</span>
        </Button>
      </div>

      {/* Carousel Container - Full Width */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Slides Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Previous Slide - Left Partial (Hidden on mobile) */}
          <div
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{
              width: "25%",
              height: "70%",
              opacity: 0.3,
              zIndex: 10,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[getSlideIndex(-1)].image}
                alt="Previous slide"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </div>

          {/* Current Slide - Center Full */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out w-[90%] h-[75%] sm:h-[85%] md:w-[50%]"
            style={{
              zIndex: 30,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                fill
                className="object-cover"
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20"></div>

              {/* Content Overlay - Bottom */}
              <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="flex-1">
                  {/* Top Label */}
                  <p className="text-orange-400 text-[10px] sm:text-xs font-semibold tracking-wider mb-2 sm:mb-3 drop-shadow-lg">
                    {slides[currentSlide].label}
                  </p>

                  {/* Main Heading */}
                  <h1
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed tracking-wide drop-shadow-2xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {slides[currentSlide].title.split("\n").map((line, i) => (
                      <span key={`${slides[currentSlide].title}-${line}`}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                  </h1>
                </div>

                {/* CTA Button - Right Side */}
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wider rounded px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] shadow-xl hover:scale-105 whitespace-nowrap">
                  BOOK NOW
                </Button>
              </div>
            </div>
          </div>

          {/* Next Slide - Right Partial (Hidden on mobile) */}
          <div
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{
              width: "25%",
              height: "70%",
              opacity: 0.3,
              zIndex: 10,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[getSlideIndex(1)].image}
                alt="Next slide"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - NEXT Button (Hidden on small devices) */}
      <div className="hidden md:block absolute right-4 md:right-8 z-40">
        <Button
          onClick={nextSlide}
          className="text-white border-2 border-gray-600 rounded px-5 py-3 md:px-7 md:py-3.5 hover:text-orange-500 hover:border-orange-500 transition-all flex items-center gap-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 shadow-xl"
        >
          <span className="text-sm font-bold tracking-wider">NEXT</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3">
        {slides.map((slide, index) => (
          <Button
            key={slide.image}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              currentSlide === index
                ? "w-8 sm:w-12 h-1 sm:h-1.5 bg-orange-500 shadow-[0_0_10px_rgba(255,107,53,0.8)]"
                : "w-6 sm:w-8 h-1 sm:h-1.5 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

"use client";
import { useState } from "react";
import { Search, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { packages, destinations } from "@/data/navigation";
import SearchMenu from "./search-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMouseEnter = (menu: string) => {
    setSearchOpen(false);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setActiveDropdown(null);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  return (
    <nav className="relative z-50" onMouseLeave={handleMouseLeave}>
      {/* Nav Backdrop */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm"></div>

      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-6 relative z-10">
        {/* Mobile Menu Button - Left */}
        <Button
          className="lg:hidden p-2 hover:text-orange-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>

        {/* Left Section - Desktop Only */}
        <div className="hidden lg:flex items-center gap-0 border border-gray-700 bg-black/30 backdrop-blur-sm">
          <Link
            href="/#book"
            className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap"
          >
            BOOK NOW
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 xl:px-3 py-2 cursor-pointer hover:text-orange-500 transition-colors h-auto"
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Center Section - Logo */}
        <div className="flex-1 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 text-center lg:text-left">
          <div
            className="font-bold tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base md:text-lg xl:text-xl text-gray-50"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <span className="hidden sm:inline">THE SOL</span>
            <span className="sm:hidden">SOL</span>
            <span className="text-orange-500"> OF AFRICAN</span>
          </div>
        </div>

        {/* Right Section - Desktop Menu */}
        <div className="hidden lg:flex items-center gap-0 border border-gray-700 bg-black/30 backdrop-blur-sm">
          <Link
            href="/#about"
            className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap"
          >
            ABOUT
          </Link>
          <button
            type="button"
            className="relative border-r border-gray-700 bg-transparent text-inherit"
            onMouseEnter={() => handleMouseEnter("packages")}
          >
            <Link
              href="/#packages"
              className="px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              PACKAGES
              <ChevronDown className="w-3 h-3" />
            </Link>
          </button>
          <button
            type="button"
            className="relative border-r border-gray-700 bg-transparent text-inherit"
            onMouseEnter={() => handleMouseEnter("destinations")}
          >
            <Link
              href="/#destinations"
              className="px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              DESTINATIONS
              <ChevronDown className="w-3 h-3" />
            </Link>
          </button>
          <Link
            href="/#gallery"
            className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap"
          >
            GALLERY
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 hover:text-orange-500 transition-colors cursor-pointer h-auto"
            onClick={toggleSearch}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Desktop Mega Menu - Packages */}
      {activeDropdown === "packages" && !searchOpen && (
        <div
          className="hidden lg:block absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-60"
          onMouseEnter={() => handleMouseEnter("packages")}
          onMouseLeave={handleMouseLeave}
          role="menu"
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
              {/* Package Categories */}
              {packages.map((pkg) => (
                <div key={pkg.route} className="space-y-2">
                  <Link
                    // @ts-expect-error - Dynamic route from data file
                    href={pkg.route}
                    className="text-sm font-bold text-black uppercase tracking-wide hover:text-orange-500 transition-colors"
                  >
                    {pkg.name}
                  </Link>
                  <p className="text-gray-600 text-xs">Explore this package</p>
                </div>
              ))}
            </div>

            {/* Bottom Promotional Sections */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Promotional Section */}
                <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-4/3 bg-linear-to-br from-orange-900/50 to-black relative">
                    <Image
                      src="/images/lion.png"
                      alt="Safari Adventure"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">
                        PREMIUM SAFARI EXPERIENCE
                      </p>
                      <h3 className="text-white text-xl font-bold leading-tight mb-4">
                        WITNESS THE GREAT
                        <br />
                        MIGRATION.
                      </h3>
                      <Button className="inline-flex items-center gap-2 text-white text-sm font-medium bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                        EXPLORE NOW
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Promotional Section */}
                <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-4/3 bg-linear-to-br from-orange-900/50 to-black relative">
                    <Image
                      src="/images/giraffe.png"
                      alt="giraffe in park"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">
                        COASTAL PARADISE
                      </p>
                      <h3 className="text-white text-xl font-bold leading-tight mb-4">
                        RELAX BY THE INDIAN
                        <br />
                        OCEAN.
                      </h3>
                      <Button className="inline-flex items-center gap-2 text-white text-sm font-medium bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                        DISCOVER MORE
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Mega Menu - Destinations */}
      {activeDropdown === "destinations" && !searchOpen && (
        <div
          className="hidden lg:block absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-60"
          onMouseEnter={() => handleMouseEnter("destinations")}
          onMouseLeave={handleMouseLeave}
          role="menu"
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-6">
              {/* Destination List */}
              {destinations.map((dest) => (
                <div key={dest.route} className="space-y-2">
                  <Link
                    // @ts-expect-error - Dynamic route from data file
                    href={dest.route}
                    className="block text-sm font-bold text-black hover:text-orange-500 transition-colors uppercase tracking-wide"
                  >
                    {dest.name}
                  </Link>
                  <p className="text-gray-600 text-xs">
                    Explore this destination
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Promotional Sections */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Promotional Section */}
                <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-4/3 bg-linear-to-br from-orange-900/50 to-black relative">
                    <Image
                      src="/images/elephant.png"
                      alt="Masai Mara"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">
                        KENYA'S JEWEL
                      </p>
                      <h3 className="text-white text-xl font-bold leading-tight mb-4">
                        DISCOVER MASAI MARA'S
                        <br />
                        UNTAMED BEAUTY.
                      </h3>
                      <Button className="inline-flex items-center gap-2 text-white text-sm font-medium bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                        VIEW PACKAGES
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Promotional Section */}
                <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-4/3 bg-linear-to-br from-orange-900/50 to-black relative">
                    <Image
                      src="/images/sea.png"
                      alt="Zanzibar"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">
                        ISLAND PARADISE
                      </p>
                      <h3 className="text-white text-xl font-bold leading-tight mb-4">
                        ZANZIBAR'S WHITE SAND
                        <br />
                        BEACHES AWAIT.
                      </h3>
                      <Button className="inline-flex items-center gap-2 text-white text-sm font-medium bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition-colors">
                        BOOK NOW
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-700 z-60">
          <div className="flex flex-col">
            <Link
              href="/#book"
              className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800"
            >
              BOOK NOW
            </Link>
            <Link
              href="/#about"
              className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800"
            >
              ABOUT
            </Link>

            {/* Mobile Packages Dropdown */}
            <div className="border-b border-gray-800">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "packages" ? null : "packages",
                  )
                }
                className="w-full px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors flex items-center justify-between text-left"
              >
                PACKAGES
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeDropdown === "packages" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "packages" && (
                <div className="bg-black/50">
                  {packages.map((pkg) => (
                    <Link
                      key={pkg.route}
                      // @ts-expect-error - Dynamic route from data file
                      href={pkg.route}
                      className="block px-10 py-3 text-xs tracking-wide hover:text-orange-500 hover:bg-white/5 transition-colors border-t border-gray-800/50"
                    >
                      {pkg.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Destinations Dropdown */}
            <div className="border-b border-gray-800">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "destinations" ? null : "destinations",
                  )
                }
                className="w-full px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors flex items-center justify-between text-left"
              >
                DESTINATIONS
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeDropdown === "destinations" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "destinations" && (
                <div className="bg-black/50">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.route}
                      // @ts-expect-error - Dynamic route from data file
                      href={dest.route}
                      className="block px-10 py-3 text-xs tracking-wide hover:text-orange-500 hover:bg-white/5 transition-colors border-t border-gray-800/50"
                    >
                      {dest.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#gallery"
              className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors"
            >
              GALLERY
            </Link>
          </div>
        </div>
      )}

      {/* Search Menu */}
      <SearchMenu isOpen={searchOpen} onClose={closeSearch} />
    </nav>
  );
};

export default Navbar;

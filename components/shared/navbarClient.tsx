"use client";
import { useState } from "react";
import { Search, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { UrlObject } from "url";
import Image from "next/image";
import { Button } from "../ui/button";
import SearchMenu from "./search-menu";
import BookingDrawer from "./booking-drawer";

interface DestinationNav {
  name: string;
  route: string;
}


interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  heroImage: string;
  description: string;
}

interface NavbarClientProps {
  destinations: DestinationNav[];
  featured?: Destination | null;
}

const NavbarClient = ({ destinations, featured }: NavbarClientProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      {/* ...existing code, but replace all 'destinations' with the prop... */}
      {/* Nav Backdrop */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-transparent"></div>
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-6 relative z-10">
        {/* ...existing code... */}
        {/* Right Section - Desktop Menu */}
        <div className="hidden lg:flex items-center gap-0 border border-gray-700 bg-black/30">
          {/* ...existing code... */}
          <button
            type="button"
            className="relative border-r border-gray-700 bg-transparent text-inherit"
            onMouseEnter={() => handleMouseEnter("destinations")}
          >
            <Link
              href={"/destinations" as unknown as UrlObject}
              className="px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              DESTINATIONS
              <ChevronDown className="w-3 h-3" />
            </Link>
          </button>
          {/* ...existing code... */}
        </div>
      </div>
      {/* Desktop Mega Menu - Destinations */}
      {activeDropdown === "destinations" && !searchOpen && (
        <div
          className="hidden lg:block absolute left-0 top-full w-full z-60"
          onMouseEnter={() => handleMouseEnter("destinations")}
          onMouseLeave={handleMouseLeave}
          role="menu"
        >
          <div className="mx-3 sm:mx-6 bg-white border border-gray-200 shadow-2xl rounded">
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-0">
              {/* Left Side - Destination Links */}
              <div className="py-5 px-5 xl:border-r border-gray-200">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Popular Destinations
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-x-4 lg:gap-x-6 gap-y-2.5">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.route}
                      href={dest.route as unknown as UrlObject}
                      className="block group py-1"
                    >
                      <div className="text-xs font-semibold text-black group-hover:text-orange-500 transition-colors uppercase tracking-wide flex items-center gap-1">
                        {dest.name}
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-gray-500 text-[10px] mt-0.5">
                        Explore now
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              {/* ...existing code... */}
              <div className="py-5 px-5 border-t xl:border-t-0 border-gray-200">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Featured
                </h3>
                {featured ? (
                  <Link
                    href={`/destinations/${featured.slug}` as unknown as UrlObject}
                    className="relative group cursor-pointer rounded overflow-hidden border border-gray-200 hover:border-orange-500 transition-colors block"
                  >
                    <div className="aspect-video xl:aspect-square bg-linear-to-br from-orange-900/50 to-black relative">
                      <Image
                        src={featured.heroImage || "/images/elephant.png"}
                        alt={featured.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3 xl:p-4">
                        <p className="text-white text-[9px] font-bold uppercase tracking-wide mb-1 opacity-90">
                          {featured.tagline || featured.name}
                        </p>
                        <h3 className="text-white text-xs xl:text-sm font-bold leading-tight mb-2">
                          {featured.description?.slice(0, 60) || featured.name}
                        </h3>
                        <div className="inline-flex items-center gap-1 text-white text-[10px] font-medium">
                          EXPLORE
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="text-gray-400 text-xs">No featured destination yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-t border-gray-700 z-60">
          <div className="flex flex-col">
            {/* ...existing code... */}
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
                      href={dest.route as unknown as UrlObject}
                      className="block px-10 py-3 text-xs tracking-wide hover:text-orange-500 hover:bg-white/5 transition-colors border-t border-gray-800/50"
                    >
                      {dest.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* ...existing code... */}
          </div>
        </div>
      )}
      {/* Search Menu */}
      <SearchMenu isOpen={searchOpen} onClose={closeSearch} destinations={destinations} />
      {/* Booking Drawer */}
      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </nav>
  );
};

export default NavbarClient;

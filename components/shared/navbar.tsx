'use client';
import { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50">
      {/* Nav Backdrop */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm"></div>
      
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-6 relative z-10">
        {/* Mobile Menu Button - Left */}
        <Button 
          className="lg:hidden p-2 hover:text-orange-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Left Section - Desktop Only */}
        <div className="hidden lg:flex items-center gap-0 border border-gray-700 bg-black/30 backdrop-blur-sm">
          <Link href="#" className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap">
            BOOK NOW
          </Link>
          <div className="px-2 xl:px-3 py-2 cursor-pointer hover:text-orange-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
        </div>

        {/* Center Section - Logo */}
        <div className="flex-1 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 text-center lg:text-left">
          <div className="font-bold tracking-[0.15em] sm:tracking-[0.3em] text-sm sm:text-base md:text-lg xl:text-xl text-gray-50" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="hidden sm:inline">THE SOL</span>
            <span className="sm:hidden">SOL</span>
            <span className="text-orange-500"> OF AFRICA</span>
          </div>
        </div>

        {/* Right Section - Desktop Menu */}
        <div className="hidden lg:flex items-center gap-0 border border-gray-700 bg-black/30 backdrop-blur-sm">
          <Link href="#" className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap">
            ABOUT
          </Link>
          <Link href="#" className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors flex items-center gap-1 whitespace-nowrap">
            PACKAGES
            <ChevronDown className="w-3 h-3" />
          </Link>
          <Link href="#" className="border-r border-gray-700 px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors flex items-center gap-1 whitespace-nowrap">
            DESTINATIONS
            <ChevronDown className="w-3 h-3" />
          </Link>
          <Link href="#" className="px-3 xl:px-4 py-2 text-xs font-semibold tracking-wider hover:text-orange-500 transition-colors whitespace-nowrap">
            GALLERY
          </Link>
        </div>

        {/* Mobile Search Icon - Right */}
        <div className="lg:hidden p-2 hover:text-orange-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-700 z-50">
          <div className="flex flex-col">
            <Link href="#" className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800">
              BOOK NOW
            </Link>
            <Link href="#" className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800">
              ABOUT
            </Link>
            <Link href="#" className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800 flex items-center justify-between">
              PACKAGES
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="#" className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors border-b border-gray-800 flex items-center justify-between">
              DESTINATIONS
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="#" className="px-6 py-4 text-sm font-semibold tracking-wider hover:text-orange-500 hover:bg-white/5 transition-colors">
              GALLERY
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
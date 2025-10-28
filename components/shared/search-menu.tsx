"use client";
import { useState, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "../ui/button";
import { packages, destinations } from "@/data/navigation";

interface SearchItem {
  name: string;
  route: string;
}

interface SearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchMenu = ({ isOpen, onClose }: SearchMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute filtered results directly with useMemo instead of useEffect + state
  const { filteredPackages, filteredDestinations } = useMemo(() => {
    if (searchQuery.trim() === "") {
      return { filteredPackages: [], filteredDestinations: [] };
    }

    const query = searchQuery.toLowerCase();
    return {
      filteredPackages: packages.filter((pkg) =>
        pkg.name.toLowerCase().includes(query),
      ),
      filteredDestinations: destinations.filter((dest) =>
        dest.name.toLowerCase().includes(query),
      ),
    };
  }, [searchQuery]);

  // Focus input when menu opens - use autoFocus or manual focus on render
  if (
    isOpen &&
    inputRef.current &&
    document.activeElement !== inputRef.current
  ) {
    inputRef.current.focus();
  }

  if (!isOpen) return null;

  const hasResults =
    filteredPackages.length > 0 || filteredDestinations.length > 0;
  const showResults = searchQuery.trim() !== "";

  return (
    <div className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-60">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center gap-4 border-b-2 border-gray-300 pb-4">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search packages, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-2xl font-light text-black placeholder-gray-400 outline-none bg-transparent"
            />
            <Button
              onClick={onClose}
              className="p-2 rounded transition-colors bg-orange-500 hover:bg-orange-600"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-black" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="mt-8">
            {hasResults ? (
              <div className="space-y-6">
                {filteredPackages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Packages
                    </h3>
                    <div className="space-y-1">
                      {filteredPackages.map((pkg: SearchItem) => (
                        <Link
                          key={pkg.route}
                          href={pkg.route as Route}
                          onClick={onClose}
                          className="block py-3 px-4 text-black hover:text-orange-500 hover:bg-gray-50 rounded transition-colors"
                        >
                          <span className="text-base">{pkg.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {filteredDestinations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Destinations
                    </h3>
                    <div className="space-y-1">
                      {filteredDestinations.map((dest: SearchItem) => (
                        <Link
                          key={dest.route}
                          href={dest.route as Route}
                          onClick={onClose}
                          className="block py-3 px-4 text-black hover:text-orange-500 hover:bg-gray-50 rounded transition-colors"
                        >
                          <span className="text-base">{dest.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMenu;

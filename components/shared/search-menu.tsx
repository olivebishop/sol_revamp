"use client";
import { useState, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { Button } from "../ui/button";


interface SearchItem {
  name: string;
  route: string;
}

  isOpen: boolean;
  onClose: () => void;
  destinations: { name: string; route: string }[];
}


const SearchMenu = ({ isOpen, onClose, destinations }: SearchMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute filtered results directly with useMemo instead of useEffect + state
  const filteredDestinations = useMemo(() => {
    if (searchQuery.trim() === "") {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return destinations.filter((dest) =>
      dest.name.toLowerCase().includes(query),
    );
  }, [searchQuery, destinations]);

  // Focus input when menu opens - use autoFocus or manual focus on render
  if (
    isOpen &&
    inputRef.current &&
    document.activeElement !== inputRef.current
  ) {
    inputRef.current.focus();
  }

  if (!isOpen) return null;

  const hasResults = filteredDestinations.length > 0;
  const showResults = searchQuery.trim() !== "";

  return (
    <div className="absolute left-0 top-full w-full z-60">
      <div className="mx-3 sm:mx-6 bg-white border border-gray-200 shadow-2xl rounded">
        <div className="px-5 py-5">
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center gap-3 border-b border-gray-300 pb-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg font-light text-black placeholder-gray-400 outline-none bg-transparent"
              />
              <Button
                onClick={onClose}
                className="p-1.5 rounded transition-colors bg-orange-500 hover:bg-orange-600 shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="mt-5">
              {hasResults ? (
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Destinations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {filteredDestinations.map((dest: SearchItem) => (
                      <Link
                        key={dest.route}
                        href={dest.route as Route}
                        onClick={onClose}
                        className="block py-2 px-3 text-black hover:text-orange-500 hover:bg-gray-50 rounded transition-colors text-sm"
                      >
                        {dest.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMenu;

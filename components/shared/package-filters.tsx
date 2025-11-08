"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export interface FilterOptions {
  category: string;
  priceRange: string;
  duration: string;
  sortBy: string;
}

interface PackageFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export const PackageFilters = ({ onFilterChange }: PackageFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    priceRange: "all",
    duration: "all",
    sortBy: "popular",
  });

  const categories = [
    { value: "all", label: "All Types" },
    { value: "wildlife", label: "Wildlife Safari" },
    { value: "beach", label: "Beach & Coast" },
    { value: "adventure", label: "Adventure" },
    { value: "cultural", label: "Cultural" },
    { value: "luxury", label: "Luxury" },
  ];

  const priceRanges = [
    { value: "all", label: "Any Price" },
    { value: "0-2000", label: "Under $2,000" },
    { value: "2000-4000", label: "$2,000 - $4,000" },
    { value: "4000-6000", label: "$4,000 - $6,000" },
    { value: "6000+", label: "$6,000+" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "all",
      priceRange: "all",
      duration: "all",
      sortBy: "popular",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-black/40 border border-white/10 rounded p-4">
      {/* Filter Icon & Label */}
      <div className="flex items-center gap-2 text-gray-300">
        <SlidersHorizontal className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold">Filter:</span>
      </div>

      {/* Category Dropdown */}
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        className="bg-black/60 border border-white/10 text-white text-sm rounded px-4 py-2 hover:border-orange-500/50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Price Range Dropdown */}
      <select
        value={filters.priceRange}
        onChange={(e) => handleFilterChange("priceRange", e.target.value)}
        className="bg-black/60 border border-white/10 text-white text-sm rounded px-4 py-2 hover:border-orange-500/50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
      >
        {priceRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>

      {/* Sort Dropdown */}
      <select
        value={filters.sortBy}
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        className="bg-black/60 border border-white/10 text-white text-sm rounded px-4 py-2 hover:border-orange-500/50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Reset Button */}
      <Button
        onClick={resetFilters}
        className="ml-auto text-sm text-gray-400 hover:text-white bg-transparent border border-white/10 hover:border-orange-500/50 rounded px-4 py-2 h-auto transition-all"
      >
        Reset
      </Button>
    </div>
  );
};

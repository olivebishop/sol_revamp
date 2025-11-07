"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is less than showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-2 flex-wrap"
    >
      {/* Previous Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-black/40 border border-white/10 text-white hover:border-orange-500/50 hover:bg-orange-500/10 rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>
      </motion.div>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${page}-${getPageNumbers()[index - 1]}`}
                className="px-3 py-2 text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <motion.div
              key={pageNum}
              whileHover={{ scale: isActive ? 1 : 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => onPageChange(pageNum)}
                className={`min-w-10 h-10 rounded font-semibold transition-all ${
                  isActive
                    ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(255,107,53,0.4)] border-orange-500"
                    : "bg-black/40 border border-white/10 text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white"
                }`}
              >
                {pageNum}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-black/40 border border-white/10 text-white hover:border-orange-500/50 hover:bg-orange-500/10 rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

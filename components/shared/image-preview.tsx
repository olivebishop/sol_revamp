"use client";
import { useState, useEffect, memo } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  file: File;
  onRemove?: () => void;
  className?: string;
  showRemove?: boolean;
}

/**
 * Image preview component for files before upload
 * Displays file preview with optional remove button
 * Optimized with React.memo
 */
export const ImagePreview = memo(function ImagePreview({
  file,
  onRemove,
  className,
  showRemove = true,
}: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(false);

    // Cleanup on unmount
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!preview) {
    return (
      <div
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center",
          className
        )}
      >
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn("relative group aspect-square rounded-lg overflow-hidden border border-zinc-800", className)}
    >
      <Image
        src={preview}
        alt={file.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
      />
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
      {loading && (
        <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      )}
    </motion.div>
  );
});

ImagePreview.displayName = "ImagePreview";

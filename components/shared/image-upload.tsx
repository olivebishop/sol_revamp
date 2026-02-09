"use client";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface UploadedImage {
  url: string;
  file: File;
  preview?: string;
}

interface ImageUploadProps {
  bucket: "packages" | "destinations" | "gallery" | string;
  onUploadComplete?: (images: string[]) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
  existingImages?: string[];
  onRemove?: (url: string) => void;
  disabled?: boolean;
}

/**
 * Image upload component with drag-and-drop support
 * Uploads images to Supabase Storage buckets
 * Follows React best practices with proper error handling
 */
export function ImageUpload({
  bucket,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = "image/*",
  className,
  existingImages = [],
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/")) {
        return "File must be an image";
      }
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB`;
      }
      return null;
    },
    [maxSizeMB]
  );

  // Create preview URL
  const createPreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  // Upload single file
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const error = validateFile(file);
      
      if (error) {
        setErrors((prev) => ({ ...prev, [fileId]: error }));
        throw new Error(error);
      }

      // Create preview
      const preview = createPreview(file);
      setPreviews((prev) => ({ ...prev, [fileId]: preview }));

      // Upload to API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      try {
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        const response = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();
        const imageUrl = data.url;

        // Clean up preview
        URL.revokeObjectURL(preview);
        setPreviews((prev) => {
          const newPreviews = { ...prev };
          delete newPreviews[fileId];
          return newPreviews;
        });

        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });

        return imageUrl;
      } catch (error) {
        // Clean up preview on error
        URL.revokeObjectURL(preview);
        setPreviews((prev) => {
          const newPreviews = { ...prev };
          delete newPreviews[fileId];
          return newPreviews;
        });
        throw error;
      }
    },
    [bucket, validateFile, createPreview]
  );

  // Handle file selection
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxFiles - uploadedImages.length;

      if (fileArray.length > remainingSlots) {
        onUploadError?.(new Error(`Maximum ${maxFiles} images allowed`));
        return;
      }

      setUploading(true);
      setErrors({});

      try {
        const uploadPromises = fileArray.map((file) => uploadFile(file));
        const urls = await Promise.all(uploadPromises);

        const newImages = [...uploadedImages, ...urls];
        setUploadedImages(newImages);
        onUploadComplete?.(urls);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        onUploadError?.(new Error(errorMessage));
      } finally {
        setUploading(false);
      }
    },
    [maxFiles, uploadedImages.length, uploadFile, onUploadComplete, onUploadError]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      await handleFiles(files);
    },
    [disabled, handleFiles]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      await handleFiles(files);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  // Remove image
  const handleRemove = useCallback(
    async (url: string, index: number) => {
      try {
        // Call API to delete from Supabase
        await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, bucket }),
        });

        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        onRemove?.(url);
      } catch (error) {
        console.error("Error removing image:", error);
        // Still remove from UI even if API call fails
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
      }
    },
    [uploadedImages, bucket, onRemove]
  );

  const canUploadMore = uploadedImages.length < maxFiles && !uploading && !disabled;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all",
            isDragging
              ? "border-orange-500 bg-orange-500/10"
              : "border-zinc-700 hover:border-zinc-600",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            onChange={handleInputChange}
            disabled={disabled || uploading}
            className="hidden"
            id={`image-upload-${bucket}`}
          />
          <label
            htmlFor={`image-upload-${bucket}`}
            className={cn(
              "flex flex-col items-center justify-center cursor-pointer",
              (disabled || uploading) && "cursor-not-allowed"
            )}
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-zinc-400 mb-4" />
            )}
            <p className="text-sm text-zinc-400 mb-2">
              {isDragging
                ? "Drop images here"
                : uploading
                  ? "Uploading..."
                  : "Drag & drop images or click to select"}
            </p>
            <p className="text-xs text-zinc-500">
              {uploadedImages.length} / {maxFiles} images • Max {maxSizeMB}MB per file
            </p>
          </label>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {uploadedImages.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-800"
              >
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(url, index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Preview Images (while uploading) */}
      {Object.keys(previews).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(previews).map(([fileId, preview]) => (
            <div
              key={fileId}
              className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800"
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover opacity-50"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
              {errors[fileId] && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 p-2">
                  <p className="text-xs text-white truncate">{errors[fileId]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>Some files failed to upload. Please check the errors above.</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Plus, Edit, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  images: string[];
  isPublished: boolean;
}

interface DestinationsManagerProps {
  destinations: Destination[];
}

export default function DestinationsManager({
  destinations: initialDestinations,
}: DestinationsManagerProps) {
  const [destinations, setDestinations] = useState(initialDestinations);
  // Removed drawer state for add/edit
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    isPublished: false,
  });

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImageFile(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleCreate = async () => {
    // Client-side validation
    if (!formData.name.trim() || !formData.slug.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields (name, slug, description)");
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error("Slug must be lowercase alphanumeric with hyphens only (e.g., 'maasai-mara')");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("slug", formData.slug.trim().toLowerCase());
      formDataToSend.append("tagline", formData.tagline.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("isPublished", formData.isPublished.toString());

      if (heroImageFile) {
        // Validate file size (max 5MB)
        if (heroImageFile.size > 5 * 1024 * 1024) {
          toast.error("Hero image must be less than 5MB");
          return;
        }
        formDataToSend.append("heroImage", heroImageFile);
      }

      if (imageFiles) {
        Array.from(imageFiles).forEach((file) => {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Image ${file.name} is too large (max 5MB)`);
            return;
          }
          formDataToSend.append("images", file);
        });
      }

      const response = await fetch("/api/destinations", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        const newDestination = result.destination || result;
        setDestinations([newDestination, ...destinations]);
        toast.success("Destination created successfully");
        resetForm();
      } else {
        const error = await response.json().catch(() => ({ error: "Failed to create destination" }));
        toast.error(error.error || error.details || "Failed to create destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEdit = async () => {
    if (!editingDestination) return;

    // Client-side validation
    if (!formData.name.trim() || !formData.slug.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields (name, slug, description)");
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error("Slug must be lowercase alphanumeric with hyphens only (e.g., 'maasai-mara')");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("slug", formData.slug.trim().toLowerCase());
      formDataToSend.append("tagline", formData.tagline.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("isPublished", formData.isPublished.toString());

      // Send file directly if new image selected
      if (heroImageFile) {
        if (heroImageFile.size > 5 * 1024 * 1024) {
          toast.error("Hero image must be less than 5MB");
          return;
        }
        formDataToSend.append("heroImage", heroImageFile);
      }
      
      // Handle additional images
      if (imageFiles) {
        Array.from(imageFiles).forEach((file) => {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Image ${file.name} is too large (max 5MB)`);
            return;
          }
          formDataToSend.append("images", file);
        });
      }

      const response = await fetch(`/api/destinations/${editingDestination.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedDestination = await response.json();
        setDestinations((prev) =>
          prev.map((d) =>
            d.id === updatedDestination.id ? updatedDestination : d
          )
        );
        setEditingDestination(null);
        toast.success("Destination updated successfully");
        resetForm();
      } else {
        toast.error("Failed to update destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const openEditDialog = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      slug: destination.slug,
      tagline: destination.tagline || "",
      description: destination.description,
      isPublished: destination.isPublished,
    });
    setHeroImageFile(null);
    setImageFiles(null);
    // setIsEditDialogOpen(true); // Drawer removed
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
        toast.success("Destination deleted successfully");
      } else {
        toast.error("Failed to delete destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  }, []);

  const togglePublish = useCallback(async (destination: Destination) => {
    try {
      const response = await fetch(`/api/destinations/${destination.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...destination,
          isPublished: !destination.isPublished,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setDestinations((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
        toast.success(
          `Destination ${updated.isPublished ? "published" : "unpublished"}`
        );
      } else {
        toast.error("Failed to update destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      isPublished: false,
    });
    setHeroImageFile(null);
    setImageFiles(null);
  };

  const FormFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-200">Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            placeholder="Enter destination name"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-200">Slug *</Label>
          <Input
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            placeholder="e.g., maasai-mara"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-200">Tagline</Label>
        <Input
          value={formData.tagline}
          onChange={(e) =>
            setFormData({ ...formData, tagline: e.target.value })
          }
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
          placeholder="Short catchy description"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-200">Description *</Label>
        <ContentEditable
          placeholder="Detailed description of the destination"
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-[120px] rounded-md px-3 py-2 mt-1"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-200">Hero Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleHeroImageChange}
          className="bg-zinc-800 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        />
        <p className="text-xs text-gray-500 mt-1">
          {heroImageFile ? heroImageFile.name : "Select a hero image"}
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-200">Additional Images</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          className="bg-zinc-800 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        />
        <p className="text-xs text-gray-500 mt-1">
          {imageFiles ? `${imageFiles.length} file(s) selected` : "Select one or multiple images"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) =>
            setFormData({ ...formData, isPublished: e.target.checked })
          }
          className="w-4 h-4"
        />
        <Label htmlFor="isPublished">Published</Label>
      </div>
    </>
  );

  const router = useRouter();
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 py-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Destinations</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your travel destinations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a href="/the-sol/dashboard/destinations/add">
            <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Destination
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {destinations.map((destination) => {
          // Memoize destination card to prevent unnecessary re-renders
          return (
          <div
            key={destination.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors flex flex-col justify-between min-h-[180px]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  {destination.isPublished ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded">
                      Draft
                    </span>
                  )}
                </div>
                {destination.tagline && (
                  <p className="text-orange-500 italic mb-2 text-sm">
                    {destination.tagline}
                  </p>
                )}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Slug: {destination.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(destination)}
                  className="text-gray-400 hover:text-orange-500"
                >
                  {destination.isPublished ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(destination)}
                  className="text-gray-400 hover:text-orange-500"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(destination.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          );
        })}

        {destinations.length === 0 && (
          <div className="text-center py-12 text-gray-500 col-span-full">
            <p>No destinations yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
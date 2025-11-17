"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  location: any;
  overview: any;
  wildlife: any;
  bestTimeToVisit: any;
  thingsToKnow: any;
  whatToPack: any;
  accommodation: any;
  activities: any;
  highlights: string[];
  funFacts: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    name: string;
    email: string;
  };
}

interface DestinationsManagerProps {
  destinations: Destination[];
  userId: string;
}

export default function DestinationsManager({
  destinations: initialDestinations,
  userId,
}: DestinationsManagerProps) {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    heroImage: "",
    images: "",
    isPublished: false,
  });

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images.split(",").map((img) => img.trim()),
          location: { country: "", region: "", coordinates: { lat: 0, lng: 0 } },
          overview: { title: "Overview", content: "Destination overview content" },
          wildlife: { title: "Wildlife", description: "Wildlife information", animals: [] },
          bestTimeToVisit: { title: "Best Time to Visit", description: "Seasonal information", seasons: [] },
          thingsToKnow: { title: "Things to Know", items: [] },
          whatToPack: { title: "What to Pack", categories: [] },
          accommodation: { title: "Accommodation", description: "Accommodation options", types: [] },
          activities: { title: "Activities", list: [] },
          highlights: [],
          funFacts: [],
        }),
      });

      if (response.ok) {
        const newDestination = await response.json();
        setDestinations([newDestination, ...destinations]);
        setIsCreateDialogOpen(false);
        toast.success("Destination created successfully");
        resetForm();
      } else {
        toast.error("Failed to create destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDestinations(destinations.filter((d) => d.id !== id));
        toast.success("Destination deleted successfully");
      } else {
        toast.error("Failed to delete destination");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const togglePublish = async (destination: Destination) => {
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
        setDestinations(
          destinations.map((d) => (d.id === updated.id ? updated : d))
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
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      heroImage: "",
      images: "",
      isPublished: false,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Destinations</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your travel destinations</p>
        </div>
        <Drawer open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Destination
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-zinc-900 text-white border-l border-zinc-800 h-full w-full sm:w-[600px] fixed right-0 top-0">
            <DrawerHeader className="pb-4 border-b border-zinc-800 flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold">Create New Destination</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="space-y-6 overflow-y-auto p-6 flex-1">
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
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none"
                  rows={4}
                  placeholder="Detailed description of the destination"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-200">Hero Image URL</Label>
                <Input
                  value={formData.heroImage}
                  onChange={(e) =>
                    setFormData({ ...formData, heroImage: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="/images/destination-hero.jpg"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-200">Additional Images</Label>
                <Input
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="/images/1.jpg, /images/2.jpg, /images/3.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas</p>
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
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Create Destination
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-4 lg:gap-6">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
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
                <p className="text-orange-500 italic mb-2">
                  {destination.tagline}
                </p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Slug: {destination.slug}</span>
                  <span>•</span>
                  <span>By: {destination.admin.name}</span>
                  <span>•</span>
                  <span>
                    Created: {new Date(destination.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
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
                  onClick={() => setEditingDestination(destination)}
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
        ))}

        {destinations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No destinations yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

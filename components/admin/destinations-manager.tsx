"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
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
          overview: { title: "", content: "" },
          wildlife: { title: "", description: "", animals: [] },
          bestTimeToVisit: { title: "", description: "", seasons: [] },
          thingsToKnow: { title: "", items: [] },
          whatToPack: { title: "", categories: [] },
          accommodation: { title: "", description: "", types: [] },
          activities: { title: "", list: [] },
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Destination</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g., maasai-mara"
                />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                  rows={4}
                />
              </div>
              <div>
                <Label>Hero Image URL</Label>
                <Input
                  value={formData.heroImage}
                  onChange={(e) =>
                    setFormData({ ...formData, heroImage: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="/images/destination.jpg"
                />
              </div>
              <div>
                <Label>Images (comma-separated URLs)</Label>
                <Input
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="/images/1.jpg, /images/2.jpg"
                />
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
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

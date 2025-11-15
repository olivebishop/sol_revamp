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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  slug: string;
  packageType: string;
  description: string;
  pricing: number;
  daysOfTravel: number;
  images: string[];
  maxCapacity: number;
  currentBookings: number;
  destination: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    name: string;
    email: string;
  };
}

interface PackagesManagerProps {
  packages: Package[];
  userId: string;
}

export default function PackagesManager({
  packages: initialPackages,
  userId,
}: PackagesManagerProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    packageType: "safari",
    description: "",
    pricing: 0,
    daysOfTravel: 1,
    images: "",
    maxCapacity: 10,
    isActive: true,
  });

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images.split(",").map((img) => img.trim()),
          destination: {
            id: "dest_001",
            name: "Maasai Mara",
            slug: "maasai-mara",
            bestTime: "July - October",
          },
        }),
      });

      if (response.ok) {
        const newPackage = await response.json();
        setPackages([newPackage, ...packages]);
        setIsCreateDialogOpen(false);
        toast.success("Package created successfully");
        resetForm();
      } else {
        toast.error("Failed to create package");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPackages(packages.filter((p) => p.id !== id));
        toast.success("Package deleted successfully");
      } else {
        toast.error("Failed to delete package");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const toggleActive = async (pkg: Package) => {
    try {
      const response = await fetch(`/api/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pkg,
          isActive: !pkg.isActive,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPackages(packages.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(
          `Package ${updated.isActive ? "activated" : "deactivated"}`
        );
      } else {
        toast.error("Failed to update package");
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
      packageType: "safari",
      description: "",
      pricing: 0,
      daysOfTravel: 1,
      images: "",
      maxCapacity: 10,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
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
                  placeholder="e.g., ultimate-safari-experience"
                />
              </div>
              <div>
                <Label>Package Type</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, packageType: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="safari">Safari</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pricing ($)</Label>
                  <Input
                    type="number"
                    value={formData.pricing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label>Days of Travel</Label>
                  <Input
                    type="number"
                    value={formData.daysOfTravel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        daysOfTravel: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <div>
                <Label>Max Capacity</Label>
                <Input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCapacity: Number(e.target.value),
                    })
                  }
                  className="bg-zinc-800 border-zinc-700"
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
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Activate immediately</Label>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Create Package
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded uppercase">
                    {pkg.packageType}
                  </span>
                  {pkg.isActive ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {pkg.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-orange-500 font-bold">
                    ${pkg.pricing}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{pkg.daysOfTravel} days</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">
                    {pkg.currentBookings}/{pkg.maxCapacity} booked
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>By: {pkg.admin.name}</span>
                  <span>•</span>
                  <span>
                    Created: {new Date(pkg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(pkg)}
                  className="text-gray-400 hover:text-orange-500"
                >
                  {pkg.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingPackage(pkg)}
                  className="text-gray-400 hover:text-orange-500"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(pkg.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No packages yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

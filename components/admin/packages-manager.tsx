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
import dynamic from "next/dynamic";
import Image from "next/image";
// import { Textarea } from "@/components/ui/textarea";
// Dynamically import the rich text editor
const Editor = dynamic(() => import("@/components/blocks/editor-00/editor").then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, X } from "lucide-react";
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
}

export default function PackagesManager({
  packages: initialPackages,
}: PackagesManagerProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
  const [editorState, setEditorState] = useState<any>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>("");

    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images ? formData.images.split(",").map((img) => img.trim()).filter(Boolean) : [],
          destination: {
            id: "temp_destination",
            name: "Select Destination",
            slug: "select-destination",
            bestTime: "Year-round",
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
  const handleCreate = async () => {
    try {
      let heroImageUrl = formData.images;
      // Handle hero image upload if a file is selected
      if (heroImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", heroImageFile);
        // You should implement an API route to handle this upload and return the URL
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          heroImageUrl = url;
        }
      }
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: editorState,
          images: heroImageUrl ? [heroImageUrl] : [],
          destination: {
            id: "temp_destination",
            name: "Select Destination",
            slug: "select-destination",
            bestTime: "Year-round",
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

  const handleEdit = async () => {
    if (!editingPackage) return;

    try {
      const response = await fetch(`/api/packages/${editingPackage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingPackage,
          ...formData,
          images: formData.images ? formData.images.split(",").map((img) => img.trim()).filter(Boolean) : [],
        }),
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        setPackages(
          packages.map((p) => (p.id === updatedPackage.id ? updatedPackage : p))
        );
        setIsEditDialogOpen(false);
        setEditingPackage(null);
        toast.success("Package updated successfully");
        resetForm();
      } else {
        toast.error("Failed to update package");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const openEditDialog = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      packageType: pkg.packageType,
      description: pkg.description,
      pricing: pkg.pricing,
      daysOfTravel: pkg.daysOfTravel,
      images: pkg.images?.join(", ") || "",
      maxCapacity: pkg.maxCapacity,
      isActive: pkg.isActive,
    });
    setIsEditDialogOpen(true);
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Packages</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your tour packages</p>
        </div>
        <Drawer open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-zinc-900 text-white border-l border-zinc-800 h-full w-full sm:w-[600px] fixed right-0 top-0">
            <DrawerHeader className="pb-4 border-b border-zinc-800 flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold">Create New Package</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="space-y-6 overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-200">Package Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="Enter package name"
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
                    placeholder="e.g., ultimate-safari-experience"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-200">Package Type *</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, packageType: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select package type" />
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
                <Label className="text-sm font-medium text-gray-200">Description *</Label>
                <div className="bg-zinc-800 border border-zinc-700 rounded-md p-2">
                  <Editor
                    editorSerializedState={editorState}
                    onSerializedChange={setEditorState}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-200">Pricing ($) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-200">Days of Travel *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.daysOfTravel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        daysOfTravel: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-200">Max Capacity *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCapacity: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-200">Package Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setHeroImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setHeroImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setHeroImagePreview("");
                    }
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                {heroImagePreview && (
                  <div className="mt-2">
                    <Image src={heroImagePreview} alt="Preview" width={320} height={180} className="rounded-md object-cover" />
                  </div>
                )}
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
          </DrawerContent>
        </Drawer>

        {/* Edit Drawer */}
        <Drawer open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} direction="right">
          <DrawerContent className="bg-zinc-900 text-white border-l border-zinc-800 h-full w-full max-w-[700px] fixed right-0 top-0 px-0 sm:px-0">
            <DrawerHeader className="pb-4 border-b border-zinc-800 flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold">Edit Package</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="space-y-6 overflow-y-auto px-6 sm:px-8 py-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-200">Package Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="Enter package name"
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
                    placeholder="e.g., ultimate-safari-experience"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-200">Package Type *</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, packageType: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select package type" />
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
                <Label className="text-sm font-medium text-gray-200">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none"
                  rows={4}
                  placeholder="Detailed description of the package"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-200">Pricing ($) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-200">Days of Travel *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.daysOfTravel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        daysOfTravel: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-200">Max Capacity *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCapacity: Number(e.target.value),
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-200">Package Images</Label>
                <Input
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="/images/package1.jpg, /images/package2.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="editIsActive">Active</Label>
              </div>
              <Button
                onClick={handleEdit}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Update Package
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-4 lg:gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors"
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
                  onClick={() => openEditDialog(pkg)}
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

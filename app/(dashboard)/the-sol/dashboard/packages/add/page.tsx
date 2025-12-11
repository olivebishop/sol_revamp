"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/auth-guard";
import { toast } from "sonner";

function AddPackageForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    duration: "",
    isPublished: false,
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.duration) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      let heroImageBase64 = "";
      
      // Convert hero image to base64
      if (heroImageFile) {
        try {
          heroImageBase64 = await convertToBase64(heroImageFile);
        } catch (error) {
          console.error("Error converting image:", error);
          toast.error("Failed to process image");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: formData.duration,
          isPublished: formData.isPublished,
          heroImage: heroImageBase64,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Package created successfully!");
        // Use replace instead of push to avoid history issues
        router.replace("/the-sol/dashboard/packages");
      } else {
        console.error("Error response:", data);
        toast.error(data.error || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      toast.error("An error occurred while creating the package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Add New Package</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-200">Package Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({ ...formData, name });
                // Auto-generate slug if slug is empty or matches the previous auto-generated slug
                if (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')) {
                  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                  setFormData({ ...formData, name, slug });
                }
              }}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="Enter package name"
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-200">Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => {
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
                setFormData({ ...formData, slug });
              }}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="e.g., safari-adventure"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-formatted: lowercase with hyphens
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-200">Price (USD) *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="e.g., 1500"
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-200">Duration *</Label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="e.g., 5 Days / 4 Nights"
              required
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-200">Description *</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-[120px]"
            placeholder="Detailed description of the package"
            required
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
            {heroImageFile ? heroImageFile.name : "Select a hero image (uploaded to Supabase)"}
          </p>
        </div>



        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800"
          />
          <Label htmlFor="isPublished" className="text-gray-200">Published</Label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-white" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Package"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AddPackagePage() {
  return (
    <AuthGuard>
      <AddPackageForm />
    </AuthGuard>
  );
}
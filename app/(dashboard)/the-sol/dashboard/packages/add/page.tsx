"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/auth-guard";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("isPublished", formData.isPublished.toString());

      const response = await fetch("/api/packages", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/the-sol/dashboard/packages");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      alert("An error occurred while creating the package");
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="Enter package name"
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-200">Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="e.g., safari-adventure"
              required
            />
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

        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <p className="text-sm text-yellow-200">
            <strong>Note:</strong> Image uploads are temporarily disabled. Default placeholder images will be used. 
            To enable image uploads, integrate with Cloudinary, AWS S3, or Vercel Blob storage.
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
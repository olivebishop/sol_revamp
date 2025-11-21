"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/auth-guard";

function AddDestinationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
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
      let heroImageBase64 = "";
      
      // Convert hero image to base64
      if (heroImageFile) {
        heroImageBase64 = await convertToBase64(heroImageFile);
      }
      
      const response = await fetch("/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          tagline: formData.tagline,
          description: formData.description,
          isPublished: formData.isPublished,
          heroImage: heroImageBase64,
        }),
      });
      
      if (response.ok) {
        router.push("/the-sol/dashboard/destinations");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create destination");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Add New Destination</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-200">Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="Enter destination name"
              required
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-200">Slug *</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
              placeholder="e.g., maasai-mara"
              required
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-200">Tagline</Label>
          <Input
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            placeholder="Short catchy description"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-200">Description *</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the destination"
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-[120px]"
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
            {imageFiles ? `${imageFiles.length} file(s) selected` : "Select one or multiple images (uploaded to Supabase)"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
            {loading ? "Creating..." : "Create Destination"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AddDestinationPage() {
  return (
    <AuthGuard>
      <AddDestinationForm />
    </AuthGuard>
  );
}

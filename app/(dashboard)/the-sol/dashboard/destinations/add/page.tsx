"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
const ContentEditable = dynamic(
  () => import("@/components/editor/editor-ui/content-editable").then(mod => mod.ContentEditable),
  { ssr: false }
);
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function AddDestinationPage() {
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

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("tagline", formData.tagline);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isPublished", formData.isPublished.toString());
      if (heroImageFile) {
        formDataToSend.append("heroImage", heroImageFile);
      }
      if (imageFiles) {
        Array.from(imageFiles).forEach((file) => {
          formDataToSend.append("images", file);
        });
      }
      const response = await fetch("/api/destinations", {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        router.push("/the-sol/dashboard/destinations");
      } else {
        alert("Failed to create destination");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Add New Destination</h2>
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            router.push("/sign-in");
          }}
        >
          Logout
        </Button>
      </div>
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
          <ContentEditable
            placeholder="Detailed description of the destination"
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-[120px] rounded-md px-3 py-2 mt-1"
            value={formData.description}
            onChange={handleDescriptionChange}
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

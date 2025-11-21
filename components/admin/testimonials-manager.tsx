"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  text: string;
  tripType: string | null;
  isApproved: boolean;
  createdAt: string;
}

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

export default function TestimonialsManager({
  testimonials: initialTestimonials,
}: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const toggleApproval = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isApproved: !testimonial.isApproved,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setTestimonials(
          testimonials.map((t) => (t.id === updated.id ? updated : t))
        );
        toast.success(
          `Testimonial ${updated.isApproved ? "approved" : "unapproved"}`
        );
      } else {
        toast.error("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-4">
      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800 rounded-lg">
          <p className="text-gray-400">No testimonials yet</p>
        </div>
      ) : (
        testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white text-lg">{testimonial.name}</h3>
                  {testimonial.isApproved ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-1">{testimonial.location}</p>
                <p className="text-xs text-gray-500">{testimonial.email}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleApproval(testimonial)}
                  className="text-gray-400 hover:text-orange-500"
                >
                  {testimonial.isApproved ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-1 mb-2">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
              ))}
            </div>

            <p className="text-gray-300 italic">"{testimonial.text}"</p>

            {testimonial.tripType && (
              <p className="text-sm text-gray-500">Trip: {testimonial.tripType}</p>
            )}

            <p className="text-xs text-gray-600">
              Submitted: {new Date(testimonial.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

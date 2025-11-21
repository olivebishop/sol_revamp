"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import GrainOverlay from "@/components/shared/grain-overlay";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    rating: 5,
    text: "",
    tripType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Thank you for your feedback! It will be reviewed and published soon.");
        setFormData({
          name: "",
          email: "",
          location: "",
          rating: 5,
          text: "",
          tripType: "",
        });
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <GrainOverlay />
      
      <div className="container mx-auto px-4 py-20 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Share Your
              <span className="text-orange-500"> Experience</span>
            </h1>
            <p className="text-gray-400 text-lg">
              We'd love to hear about your journey with us. Your feedback helps us improve and inspires future travelers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-200">Your Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-200">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-200">Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="New York, USA"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-200">Trip Type (Optional)</Label>
                <Input
                  value={formData.tripType}
                  onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  placeholder="Safari Adventure"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-200 mb-3 block">Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? "fill-orange-500 text-orange-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-200">Your Feedback *</Label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 resize-none min-h-[150px]"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your feedback will be reviewed by our team before being published on our website.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

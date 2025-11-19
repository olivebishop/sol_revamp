"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  X,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { PackageData } from "@/data/packages";
import { format } from "date-fns";

interface PackageBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  package: PackageData;
}

export default function PackageBookingDrawer({
  isOpen,
  onClose,
  package: pkg,
}: PackageBookingDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfTravelers: 1,
    message: "",
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select travel dates");
      return;
    }

    if (formData.numberOfTravelers > pkg.maxCapacity - pkg.currentBookings) {
      toast.error(
        `Only ${pkg.maxCapacity - pkg.currentBookings} spots available`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Format WhatsApp message
      const whatsappMessage =
        `*Booking Request - ${pkg.name}*%0A%0A` +
        `*Package:* ${pkg.name}%0A` +
        `*Destination:* ${pkg.destination.name}%0A` +
        `*Duration:* ${pkg.daysOfTravel} days%0A` +
        `*Travel Dates:* ${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}%0A` +
        `*Number of Travelers:* ${formData.numberOfTravelers}%0A` +
        `*Total Estimate:* $${(pkg.pricing * formData.numberOfTravelers).toLocaleString()}%0A%0A` +
        `*Contact Details:*%0A` +
        `Name: ${formData.name}%0A` +
        `Email: ${formData.email}%0A` +
        `Phone: ${formData.phone}%0A%0A` +
        (formData.message ? `*Message:* ${formData.message}%0A%0A` : "") +
        `Looking forward to this adventure!`;

      window.open(
        `https://wa.me/254768453819?text=${whatsappMessage}`,
        "_blank",
      );

      toast.success("Booking request sent! We'll contact you shortly.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        numberOfTravelers: 1,
        message: "",
      });
      setDateRange({ from: undefined, to: undefined });
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
            aria-label="Close booking drawer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-zinc-900 border-l border-zinc-800 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Book Your Experience
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{pkg.name}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Package Summary */}
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Destination</span>
                  <span className="text-white font-semibold">
                    {pkg.destination.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">
                    {pkg.daysOfTravel} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per person</span>
                  <span className="text-white font-semibold">
                    ${pkg.pricing.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available spots</span>
                  <span className="text-white font-semibold">
                    {pkg.maxCapacity - pkg.currentBookings} remaining
                  </span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-orange-500" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-orange-500" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* Number of Travelers */}
                <div className="space-y-2">
                  <Label
                    htmlFor="travelers"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-orange-500" />
                    Number of Travelers *
                  </Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    max={pkg.maxCapacity - pkg.currentBookings}
                    value={formData.numberOfTravelers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numberOfTravelers: Number.parseInt(e.target.value, 10),
                      })
                    }
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum {pkg.maxCapacity - pkg.currentBookings} travelers
                    for this booking
                  </p>
                </div>

                {/* Date Range Picker */}
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    Travel Dates *
                  </Label>
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 sm:p-4">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) =>
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        })
                      }
                      numberOfMonths={1}
                      disabled={(date) => date < new Date()}
                      className="mx-auto"
                    />
                    {dateRange.from && dateRange.to && (
                      <div className="mt-4 pt-4 border-t border-zinc-700 text-sm text-gray-300">
                        <p>
                          <span className="font-semibold">Selected dates:</span>{" "}
                          {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                          {format(dateRange.to, "MMM dd, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Any dietary restrictions, special occasions, or specific requests..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Total Estimate */}
                {formData.numberOfTravelers > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Estimated Total</span>
                      <span className="text-2xl font-bold text-orange-500">
                        $
                        {(
                          pkg.pricing * formData.numberOfTravelers
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Final price may vary based on your specific requirements
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 text-lg rounded-lg hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Send Booking Request"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms and
                  conditions. We'll contact you within 24 hours to confirm your
                  booking.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { prisma } from "@/lib/prisma";

/**
 * Get approved testimonials for display
 * Optimized query - only fetches approved testimonials
 */
export async function getApprovedTestimonials(limit?: number) {
  try {
    return await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: limit || 6,
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        rating: true,
        text: true,
        tripType: true,
        isApproved: true,
        createdAt: true,
        // Exclude: updatedAt to reduce payload
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

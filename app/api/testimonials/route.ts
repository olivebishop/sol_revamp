import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET approved testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 6, // Limit to 6 most recent
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create new testimonial (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, location, rating, text, tripType } = body;

    // Validate required fields
    if (!name || !email || !location || !rating || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        email,
        location,
        rating,
        text,
        tripType: tripType || null,
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

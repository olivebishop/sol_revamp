export const maxRequestBodySize = '20mb';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET all destinations or single by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Get single destination by slug
      const destination = await prisma.destination.findUnique({
        where: { slug, isPublished: true },
      });
      return NextResponse.json(destination ? [destination] : []);
    }

    // Get all destinations
    const destinations = await prisma.destination.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST create new destination (admin only)
// ...existing code...

// POST create new destination (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    const { name, slug, tagline, description, isPublished, heroImage } = body;
    
    // Use hero image if provided (base64), otherwise use default
    const heroImageUrl = heroImage || "/images/default-destination.jpg";
    const finalImages = ["/images/giraffe.png", "/images/elephant.png"];

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        tagline: tagline || "",
        description,
        heroImage: heroImageUrl,
        images: finalImages,
        location: {
          country: "Kenya",
          region: name,
          coordinates: { lat: 0, lng: 0 }
        },
        overview: {
          title: "Overview",
          content: description
        },
        wildlife: {
          title: "Wildlife",
          description: "Discover amazing wildlife",
          animals: []
        },
        bestTimeToVisit: {
          title: "Best Time to Visit",
          description: "Year-round destination",
          seasons: []
        },
        thingsToKnow: {
          title: "Things to Know",
          items: []
        },
        whatToPack: {
          title: "What to Pack",
          categories: []
        },
        accommodation: {
          title: "Accommodation",
          description: "Various accommodation options available",
          types: []
        },
        activities: {
          title: "Activities",
          list: []
        },
        highlights: [],
        funFacts: [],
        isPublished,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

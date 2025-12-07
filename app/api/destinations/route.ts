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
    const listView = searchParams.get("listView") === "true";

    if (slug) {
      // Get single destination by slug
      const destination = await prisma.destination.findUnique({
        where: { slug, isPublished: true },
      });
      return NextResponse.json(destination ? [destination] : []);
    }

    // Get all destinations
    if (listView) {
      // For list view, only return essential fields to reduce payload size
      const destinations = await prisma.destination.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          description: true,
          heroImage: true,
          location: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          // Exclude: images, overview, wildlife, bestTimeToVisit, thingsToKnow
        },
      });
      return NextResponse.json(destinations);
    }

    // Full data for other cases
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

    // Validate required fields
    if (!name || !slug || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for duplicate slug (idempotency)
    const existing = await prisma.destination.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Destination with this slug already exists", destination: existing }, { status: 200 });
    }

    // Use hero image if provided (base64), otherwise use default
    const heroImageUrl = heroImage || "/images/default-destination.jpg";
    const finalImages = ["/images/giraffe.png", "/images/elephant.png"];

    let destination;
    try {
      destination = await prisma.destination.create({
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
    } catch (dbError) {
      // Prisma/DB error logging
      if (dbError instanceof Error) {
        console.error("Prisma error creating destination:", dbError.message, dbError.stack);
      } else {
        console.error("Prisma error creating destination:", dbError);
      }
      return NextResponse.json(
        { error: "Database error", details: dbError instanceof Error ? dbError.message : "Unknown error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, destination }, { status: 201 });
  } catch (error) {
    // General error logging
    if (error instanceof Error) {
      console.error("Error creating destination:", error.message, error.stack);
    } else {
      console.error("Error creating destination:", error);
    }
    return NextResponse.json(
      { error: "Failed to create destination", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

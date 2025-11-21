import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET all destinations
export async function GET() {
  try {
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

    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tagline = formData.get("tagline") as string || "";
    const description = formData.get("description") as string;
    const isPublished = formData.get("isPublished") === "true";
    
    // For now, use placeholder images until cloud storage is set up
    // TODO: Integrate with Cloudinary, AWS S3, or Vercel Blob for production
    const defaultHeroImage = "/images/default-destination.jpg";
    const defaultImages = ["/images/giraffe.png", "/images/elephant.png"];

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        tagline,
        description,
        heroImage: defaultHeroImage,
        images: defaultImages,
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

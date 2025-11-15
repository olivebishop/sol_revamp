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

    const body = await request.json();

    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        slug: body.slug,
        tagline: body.tagline,
        description: body.description,
        heroImage: body.heroImage,
        images: body.images || [],
        location: body.location,
        overview: body.overview,
        wildlife: body.wildlife,
        bestTimeToVisit: body.bestTimeToVisit,
        thingsToKnow: body.thingsToKnow,
        whatToPack: body.whatToPack,
        accommodation: body.accommodation,
        activities: body.activities,
        highlights: body.highlights || [],
        funFacts: body.funFacts || [],
        isPublished: body.isPublished ?? false,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}

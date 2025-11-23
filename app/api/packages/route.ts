import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

// GET all packages or filtered
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    const exclude = searchParams.get("exclude");
    const limit = searchParams.get("limit");

    // Get single package by slug
    if (slug) {
      const packageData = await prisma.package.findUnique({
        where: { slug, isActive: true },
      });
      return NextResponse.json(packageData ? [packageData] : []);
    }

    // Get related packages by type
    if (type) {
      const packages = await prisma.package.findMany({
        where: {
          isActive: true,
          packageType: type,
          ...(exclude && { id: { not: exclude } }),
        },
        orderBy: { createdAt: "desc" },
        take: limit ? parseInt(limit) : undefined,
      });
      return NextResponse.json(packages);
    }

    // Get all packages
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// POST create new package (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    
    const { name, slug, description, price, duration, isPublished, heroImage } = body;
    
    // Use hero image if provided, otherwise use default
    const finalImages = heroImage 
      ? [heroImage] 
      : ["/images/default-package.jpg"];
    
    // Extract days from duration string (e.g., "5 Days / 4 Nights" -> 5)
    const daysMatch = duration.match(/(\d+)/);
    const daysOfTravel = daysMatch ? parseInt(daysMatch[1]) : 1;

    const packageData = await prisma.package.create({
      data: {
        name,
        slug,
        packageType: "safari", // Default type, can be made dynamic
        description,
        pricing: price,
        daysOfTravel,
        images: finalImages,
        maxCapacity: 10,
        currentBookings: 0,
        destination: {
          id: "default",
          name: "Kenya",
          slug: "kenya",
          bestTime: "Year-round"
        },
        isActive: isPublished,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(packageData, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

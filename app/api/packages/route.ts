import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const maxRequestBodySize = '20mb';

// Previous body parser configuration is no longer needed.

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
      return NextResponse.json(packages, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Get all packages
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
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

    // Check content type to handle both FormData and JSON
    const contentType = request.headers.get("content-type") || "";
    let name: string;
    let slug: string;
    let packageType: string;
    let description: string;
    let pricing: number;
    let daysOfTravel: number;
    let isActive: boolean;
    let heroImage: string | null = null;

    if (contentType.includes("multipart/form-data") || contentType.includes("form-data")) {
      // Handle FormData
      const formData = await request.formData();
      name = formData.get("name") as string;
      slug = formData.get("slug") as string;
      packageType = (formData.get("packageType") as string) || "safari";
      description = formData.get("description") as string;
      pricing = parseFloat(formData.get("pricing") as string);
      daysOfTravel = parseInt(formData.get("daysOfTravel") as string) || 1;
      isActive = formData.get("isActive") === "true";
      
      // Handle image files - convert first image to base64 if provided
      const imageFiles = formData.getAll("images");
      if (imageFiles.length > 0 && imageFiles[0] instanceof File) {
        const firstImage = imageFiles[0] as File;
        const arrayBuffer = await firstImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const mimeType = firstImage.type || "image/jpeg";
        heroImage = `data:${mimeType};base64,${base64}`;
      }
    } else {
      // Handle JSON
      const body = await request.json();
      name = body.name;
      slug = body.slug;
      packageType = body.packageType || "safari";
      description = body.description;
      pricing = parseFloat(body.price || body.pricing);
      // Extract days from duration string if provided, otherwise use daysOfTravel
      if (body.duration) {
        const daysMatch = body.duration.match(/(\d+)/);
        daysOfTravel = daysMatch ? parseInt(daysMatch[1]) : (body.daysOfTravel || 1);
      } else {
        daysOfTravel = body.daysOfTravel || 1;
      }
      isActive = body.isPublished ?? body.isActive ?? true;
      heroImage = body.heroImage || null;
    }

    // Validate required fields
    if (!name || !slug || !description || isNaN(pricing) || pricing < 0 || !daysOfTravel || daysOfTravel < 1) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: "Name, slug, description, pricing (>= 0), and daysOfTravel (>= 1) are required"
      }, { status: 400 });
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        error: "Invalid slug format",
        details: "Slug must be lowercase alphanumeric with hyphens only (e.g., 'ultimate-safari')"
      }, { status: 400 });
    }

    // Validate package type
    const validPackageTypes = ["safari", "beach", "cultural", "adventure", "luxury", "mixed"];
    if (!validPackageTypes.includes(packageType)) {
      return NextResponse.json({ 
        error: "Invalid package type",
        details: `Package type must be one of: ${validPackageTypes.join(", ")}`
      }, { status: 400 });
    }

    // Check for duplicate slug (idempotency)
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ 
        error: "Package with this slug already exists", 
        package: existing 
      }, { status: 409 });
    }

    // Use hero image if provided, otherwise use default
    const finalImages = heroImage 
      ? [heroImage] 
      : ["/images/default-package.jpg"];

    let packageData;
    try {
      packageData = await prisma.package.create({
        data: {
          name,
          slug,
          packageType,
          description,
          pricing,
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
          isActive,
          createdBy: session.user.id,
        },
      });
    } catch (dbError) {
      // Prisma/DB error logging
      if (dbError instanceof Error) {
        console.error("Prisma error creating package:", dbError.message, dbError.stack);
      } else {
        console.error("Prisma error creating package:", dbError);
      }
      return NextResponse.json(
        { error: "Database error", details: dbError instanceof Error ? dbError.message : "Unknown error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, package: packageData }, { status: 201 });
  } catch (error) {
    // General error logging
    if (error instanceof Error) {
      console.error("Error creating package:", error.message, error.stack);
    } else {
      console.error("Error creating package:", error);
    }
    return NextResponse.json(
      { error: "Failed to create package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

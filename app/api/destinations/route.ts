export const maxRequestBodySize = '20mb';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { uploadToSupabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

// GET all destinations or single by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const listView = searchParams.get("listView") === "true";
    const limit = searchParams.get("limit");

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
        take: limit ? parseInt(limit) : undefined,
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          description: true, // Needed for display
          heroImage: true,
          location: true,
          highlights: true, // Needed for display
          isPublished: true,
          // Exclude: images array, overview, wildlife, bestTimeToVisit, thingsToKnow, whatToPack, accommodation, activities, createdAt, updatedAt
        },
      });
      return NextResponse.json(destinations, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Full data for other cases - but still optimize by excluding large fields when not needed
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
        images: true,
        location: true,
        overview: true,
        wildlife: true,
        bestTimeToVisit: true,
        thingsToKnow: true,
        whatToPack: true,
        accommodation: true,
        activities: true,
        highlights: true,
        funFacts: true,
        isPublished: true,
        // Exclude: createdAt, updatedAt, createdBy to reduce payload
      },
    });

    return NextResponse.json(destinations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
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

    // Check content type to handle both FormData and JSON
    const contentType = request.headers.get("content-type") || "";
    let name: string;
    let slug: string;
    let tagline: string;
    let description: string;
    let isPublished: boolean;
    let heroImage: string | null = null;
    let uploadedImages: string[] = [];

    if (contentType.includes("multipart/form-data") || contentType.includes("form-data")) {
      // Handle FormData
      const formData = await request.formData();
      name = formData.get("name") as string;
      slug = formData.get("slug") as string;
      tagline = (formData.get("tagline") as string) || "";
      description = formData.get("description") as string;
      isPublished = formData.get("isPublished") === "true";
      
      // Handle hero image file - upload to Supabase
      const heroImageFile = formData.get("heroImage") as File | null;
      if (heroImageFile && heroImageFile instanceof File && heroImageFile.size > 0) {
        try {
          heroImage = await uploadToSupabase("destinations", heroImageFile);
        } catch (uploadError) {
          console.error("Error uploading hero image:", uploadError);
          // Fallback to default image if upload fails
          heroImage = "/images/default-destination.jpg";
        }
      }
      
      // Handle additional images
      const imageFiles = formData.getAll("images") as File[];
      for (const imageFile of imageFiles) {
        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            const imageUrl = await uploadToSupabase("destinations", imageFile);
            uploadedImages.push(imageUrl);
          } catch (uploadError) {
            console.error("Error uploading additional image:", uploadError);
            // Continue with other images even if one fails
          }
        }
      }
    } else {
      // Handle JSON
      const body = await request.json();
      name = body.name;
      slug = body.slug;
      tagline = body.tagline || "";
      description = body.description;
      isPublished = body.isPublished ?? false;
      heroImage = body.heroImage || null;
      uploadedImages = body.images || [];
    }

    // Validate required fields
    if (!name || !slug || !description) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: "Name, slug, and description are required"
      }, { status: 400 });
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        error: "Invalid slug format",
        details: "Slug must be lowercase alphanumeric with hyphens only (e.g., 'maasai-mara')"
      }, { status: 400 });
    }

    // Check for duplicate slug (idempotency)
    const existing = await prisma.destination.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ 
        error: "Destination with this slug already exists", 
        destination: existing 
      }, { status: 409 });
    }

    // Use hero image if provided, otherwise use default
    const heroImageUrl = heroImage || "/images/default-destination.jpg";
    // Use uploaded images if any, otherwise use defaults
    const finalImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ["/images/giraffe.png", "/images/elephant.png"];

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

    // Revalidate cache
    revalidateTag('destinations');
    revalidateTag(`destination-${slug}`);

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

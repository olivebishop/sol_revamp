// Ensure this file is treated as a module
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET single destination by ID

export async function GET(request: NextRequest, context: any) {
  try {
    const params = context?.params ? await context.params : {};
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

// PUT update destination (admin only)

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = context?.params ? await context.params : {};
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

    // Get existing destination to preserve data if not updating
    const existingDestination = await prisma.destination.findUnique({
      where: { id: params.id },
    });

    if (!existingDestination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tagline = formData.get("tagline") as string || "";
    const description = formData.get("description") as string;
    const isPublished = formData.get("isPublished") === "true";

    // Keep existing images by default
    let heroImageUrl = existingDestination.heroImage;
    let finalImages = existingDestination.images;

    // Handle hero image upload
    const heroImageFile = formData.get("heroImage") as File | null;
    if (heroImageFile && heroImageFile.size > 0) {
      const { uploadToSupabase } = await import("@/lib/supabase");
      try {
        heroImageUrl = await uploadToSupabase("destinations", heroImageFile);
      } catch (error) {
        console.error("Failed to upload hero image:", error);
      }
    }

    // Handle additional images upload
    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      const { uploadToSupabase } = await import("@/lib/supabase");
      const uploadedImages: string[] = [];
      
      for (const file of imageFiles) {
        if (file && file.size > 0) {
          try {
            const imageUrl = await uploadToSupabase("destinations", file);
            uploadedImages.push(imageUrl);
          } catch (error) {
            console.error("Failed to upload image:", error);
          }
        }
      }
      
      if (uploadedImages.length > 0) {
        finalImages = uploadedImages;
      }
    }

    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        tagline,
        description,
        heroImage: heroImageUrl,
        images: finalImages,
        isPublished,
        // Keep existing complex fields - cast to any to avoid type issues
        location: existingDestination.location as any,
        overview: { title: "Overview", content: description } as any,
        wildlife: existingDestination.wildlife as any,
        bestTimeToVisit: existingDestination.bestTimeToVisit as any,
        thingsToKnow: existingDestination.thingsToKnow as any,
        whatToPack: existingDestination.whatToPack as any,
        accommodation: existingDestination.accommodation as any,
        activities: existingDestination.activities as any,
        highlights: existingDestination.highlights,
        funFacts: existingDestination.funFacts,
      },
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Failed to update destination", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE destination (admin only)

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = context?.params ? await context.params : {};
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

    await prisma.destination.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Destination deleted" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}

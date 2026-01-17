// Ensure this file is treated as a module
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { uploadToSupabase, deleteFromSupabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

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

    // Get existing destination
    const existingDestination = await prisma.destination.findUnique({
      where: { id: params.id },
    });

    if (!existingDestination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    // Check content type to determine if it's JSON (toggle) or FormData (edit)
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      // Handle JSON update (for toggle)
      const body = await request.json();
      
      const destination = await prisma.destination.update({
        where: { id: params.id },
        data: {
          isPublished: body.isPublished,
        },
      });

      // Revalidate cache
      revalidateTag('destinations');
      revalidateTag(`destination-${destination.slug}`);

      return NextResponse.json(destination);
    } else {
      // Handle FormData update (for edit with possible image)
      const formData = await request.formData();
      
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const tagline = formData.get("tagline") as string || "";
      const description = formData.get("description") as string;
      const isPublished = formData.get("isPublished") === "true";
      
      // Handle hero image file upload
      let heroImageUrl = existingDestination.heroImage;
      const heroImageFile = formData.get("heroImage") as File | null;
      if (heroImageFile && heroImageFile instanceof File && heroImageFile.size > 0) {
        try {
          // Upload new image to Supabase
          heroImageUrl = await uploadToSupabase("destinations", heroImageFile);
          
          // Optionally delete old image from Supabase if it's a Supabase URL
          if (existingDestination.heroImage && existingDestination.heroImage.includes('supabase.co')) {
            try {
              const oldImagePath = existingDestination.heroImage.split('/storage/v1/object/public/destinations/')[1];
              if (oldImagePath) {
                await deleteFromSupabase("destinations", oldImagePath);
              }
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
              // Continue even if deletion fails
            }
          }
        } catch (uploadError) {
          console.error("Error uploading new hero image:", uploadError);
          // Keep existing image if upload fails
        }
      }
      
      // Handle additional images
      const imageFiles = formData.getAll("images") as File[];
      let updatedImages = existingDestination.images || [];
      if (imageFiles.length > 0) {
        const newImages: string[] = [];
        for (const imageFile of imageFiles) {
          if (imageFile instanceof File && imageFile.size > 0) {
            try {
              const imageUrl = await uploadToSupabase("destinations", imageFile);
              newImages.push(imageUrl);
            } catch (uploadError) {
              console.error("Error uploading additional image:", uploadError);
            }
          }
        }
        if (newImages.length > 0) {
          updatedImages = [...updatedImages, ...newImages];
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
          images: updatedImages,
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

      // Revalidate cache
      revalidateTag('destinations');
      revalidateTag(`destination-${destination.slug}`);

      return NextResponse.json(destination);
    }
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

    // Get destination to delete images
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
    });

    if (destination) {
      // Delete images from Supabase
      try {
        // Delete hero image
        if (destination.heroImage && destination.heroImage.includes('supabase.co')) {
          const heroImagePath = destination.heroImage.split('/storage/v1/object/public/destinations/')[1];
          if (heroImagePath) {
            await deleteFromSupabase("destinations", heroImagePath);
          }
        }
        
        // Delete additional images
        if (destination.images && Array.isArray(destination.images)) {
          for (const imageUrl of destination.images) {
            if (imageUrl && imageUrl.includes('supabase.co')) {
              const imagePath = imageUrl.split('/storage/v1/object/public/destinations/')[1];
              if (imagePath) {
                try {
                  await deleteFromSupabase("destinations", imagePath);
                } catch (deleteError) {
                  console.error("Error deleting image:", deleteError);
                  // Continue deleting other images
                }
              }
            }
          }
        }
      } catch (imageDeleteError) {
        console.error("Error deleting destination images:", imageDeleteError);
        // Continue with database deletion even if image deletion fails
      }
    }

    await prisma.destination.delete({
      where: { id: params.id },
    });

    // Revalidate cache
    revalidateTag('destinations');
    if (destination) {
      revalidateTag(`destination-${destination.slug}`);
    }

    return NextResponse.json({ message: "Destination deleted" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}

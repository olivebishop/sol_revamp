import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { uploadToSupabase, deleteFromSupabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

// GET single package by ID
export async function GET(request: NextRequest, context: any) {
  try {
    const params = context?.params ? await context.params : {};
    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

// PUT update package (admin only)
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

    // Get existing package
    const existingPackage = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Check content type to determine if it's JSON (toggle) or FormData (edit)
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      // Handle JSON update (for toggle)
      const body = await request.json();
      
      const packageData = await prisma.package.update({
        where: { id: params.id },
        data: {
          isActive: body.isActive,
        },
      });

      // Revalidate cache
      revalidateTag('packages');
      revalidateTag(`package-${packageData.slug}`);

      return NextResponse.json(packageData);
    } else {
      // Handle FormData update (for edit with possible image)
      const formData = await request.formData();
      
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const packageType = formData.get("packageType") as string;
      const description = formData.get("description") as string;
      const pricing = parseFloat(formData.get("pricing") as string);
      const daysOfTravel = parseInt(formData.get("daysOfTravel") as string);
      const isActive = formData.get("isActive") === "true";
      
      // Handle image files upload
      let finalImages = existingPackage.images || [];
      const imageFiles = formData.getAll("images") as File[];
      if (imageFiles.length > 0) {
        const newImages: string[] = [];
        for (const imageFile of imageFiles) {
          if (imageFile instanceof File && imageFile.size > 0) {
            try {
              const imageUrl = await uploadToSupabase("packages", imageFile);
              newImages.push(imageUrl);
            } catch (uploadError) {
              console.error("Error uploading package image:", uploadError);
            }
          }
        }
        if (newImages.length > 0) {
          finalImages = [...finalImages, ...newImages];
        }
      }

      const packageData = await prisma.package.update({
        where: { id: params.id },
        data: {
          name,
          slug,
          packageType,
          description,
          pricing,
          daysOfTravel,
          images: finalImages,
          isActive,
        },
      });

      // Revalidate cache
      revalidateTag('packages');
      revalidateTag(`package-${packageData.slug}`);

      return NextResponse.json(packageData);
    }
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE package (admin only)
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

    // Get package to delete images
    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (packageData) {
      // Delete images from Supabase
      try {
        if (packageData.images && Array.isArray(packageData.images)) {
          for (const imageUrl of packageData.images) {
            if (imageUrl && imageUrl.includes('supabase.co')) {
              const imagePath = imageUrl.split('/storage/v1/object/public/packages/')[1];
              if (imagePath) {
                try {
                  await deleteFromSupabase("packages", imagePath);
                } catch (deleteError) {
                  console.error("Error deleting package image:", deleteError);
                  // Continue deleting other images
                }
              }
            }
          }
        }
      } catch (imageDeleteError) {
        console.error("Error deleting package images:", imageDeleteError);
        // Continue with database deletion even if image deletion fails
      }
    }

    await prisma.package.delete({
      where: { id: params.id },
    });

    // Revalidate cache
    revalidateTag('packages');
    if (packageData) {
      revalidateTag(`package-${packageData.slug}`);
    }

    return NextResponse.json({ message: "Package deleted" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}

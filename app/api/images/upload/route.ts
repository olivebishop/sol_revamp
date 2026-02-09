import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadToSupabase } from "@/lib/supabase";
import { createImage } from "@/lib/dal/images";
import { revalidateTag } from "next/cache";

export const maxRequestBodySize = "20mb";

/**
 * POST /api/images/upload
 * Upload image to Supabase Storage bucket
 * 
 * Following Next.js 16+ best practices:
 * - Server-side only (no client code)
 * - Proper error handling
 * - Authentication check
 * - Cache revalidation
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const packageId = formData.get("packageId") as string | null;
    const destinationId = formData.get("destinationId") as string | null;
    const isHero = formData.get("isHero") === "true";
    const displayOrder = formData.get("displayOrder")
      ? parseInt(formData.get("displayOrder") as string, 10)
      : undefined;

    // Validate inputs
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        { error: "No bucket specified" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Upload to Supabase
    try {
      const imageUrl = await uploadToSupabase(bucket, file);

      // Extract file path from URL
      const urlParts = imageUrl.split(`/storage/v1/object/public/${bucket}/`);
      const filePath = urlParts.length > 1 ? urlParts[1] : file.name;

      // Get image dimensions if possible (optional, can be done client-side)
      // For now, we'll skip this and set it later if needed

      // Create image record in database
      let imageRecord = null;
      if (packageId || destinationId) {
        try {
          imageRecord = await createImage({
            url: imageUrl,
            bucket,
            filename: file.name,
            filePath,
            fileSize: file.size,
            mimeType: file.type,
            isHero,
            displayOrder,
            packageId: packageId || undefined,
            destinationId: destinationId || undefined,
          });
        } catch (dbError) {
          console.error("Error creating image record:", dbError);
          // Continue even if DB record creation fails - image is still uploaded
        }
      }

      // Revalidate relevant cache tags
      revalidateTag(`images-${bucket}`);
      revalidateTag(bucket);
      if (packageId) {
        revalidateTag(`package-${packageId}`);
        revalidateTag("packages");
      }
      if (destinationId) {
        revalidateTag(`destination-${destinationId}`);
        revalidateTag("destinations");
      }

      return NextResponse.json(
        {
          success: true,
          url: imageUrl,
          bucket,
          filename: file.name,
          size: file.size,
          imageId: imageRecord?.id,
        },
        { status: 200 }
      );
    } catch (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload image",
          details: uploadError instanceof Error ? uploadError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image upload API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

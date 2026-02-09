import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { deleteFromSupabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

/**
 * POST /api/images/delete
 * Delete image from Supabase Storage bucket
 * 
 * Following Next.js 16+ best practices:
 * - Server-side only
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

    // Parse request body
    const body = await request.json();
    const { imageId, url, bucket } = body;

    // Validate inputs - can delete by imageId or url+bucket
    if (!imageId && (!url || !bucket)) {
      return NextResponse.json(
        { error: "Either imageId or both url and bucket are required" },
        { status: 400 }
      );
    }

    let imageRecord = null;
    let filePath: string;
    let imageBucket: string;
    let imageUrl: string;

    // If imageId is provided, fetch from database
    if (imageId) {
      imageRecord = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!imageRecord) {
        return NextResponse.json(
          { error: "Image not found" },
          { status: 404 }
        );
      }

      imageUrl = imageRecord.url;
      imageBucket = imageRecord.bucket;
      filePath = imageRecord.filePath;
    } else {
      // Use provided url and bucket
      imageUrl = url;
      imageBucket = bucket;
      
      // Extract file path from Supabase URL
      if (url.includes("supabase.co")) {
        const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
        if (urlParts.length !== 2) {
          return NextResponse.json(
            { error: "Invalid Supabase URL format" },
            { status: 400 }
          );
        }
        filePath = urlParts[1];
      } else {
        filePath = url;
      }
    }

    // Delete from Supabase Storage
    try {
      await deleteFromSupabase(imageBucket, filePath);

      // Delete from database if record exists
      if (imageRecord) {
        await prisma.image.delete({
          where: { id: imageRecord.id },
        });
      } else {
        // Try to find and delete by URL
        await prisma.image.deleteMany({
          where: { url: imageUrl },
        });
      }

      // Revalidate relevant cache tags
      revalidateTag(`images-${imageBucket}`);
      revalidateTag(imageBucket);
      if (imageRecord?.packageId) {
        revalidateTag(`package-${imageRecord.packageId}`);
        revalidateTag("packages");
      }
      if (imageRecord?.destinationId) {
        revalidateTag(`destination-${imageRecord.destinationId}`);
        revalidateTag("destinations");
      }

      return NextResponse.json(
        {
          success: true,
          message: "Image deleted successfully",
          url: imageUrl,
          bucket: imageBucket,
        },
        { status: 200 }
      );
    } catch (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        {
          error: "Failed to delete image",
          details: deleteError instanceof Error ? deleteError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image delete API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

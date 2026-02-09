import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/images/list
 * List images from a Supabase Storage bucket
 * 
 * Following Next.js 16+ best practices:
 * - Server-side only
 * - Proper caching with Next.js 16 cache API
 * - Authentication check
 * - Error handling
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket");
    const folder = searchParams.get("folder") || "";
    const limit = searchParams.get("limit");

    // Validate bucket
    if (!bucket) {
      return NextResponse.json(
        { error: "Bucket parameter is required" },
        { status: 400 }
      );
    }

    // List files from Supabase Storage
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || undefined, {
          limit: limit ? parseInt(limit, 10) : 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Supabase list error:", error);
        return NextResponse.json(
          {
            error: "Failed to list images",
            details: error.message,
          },
          { status: 500 }
        );
      }

      // Transform data to include public URLs
      const images = await Promise.all(
        (data || []).map(async (file) => {
          const filePath = folder ? `${folder}/${file.name}` : file.name;
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(filePath);

          return {
            name: file.name,
            path: filePath,
            url: publicUrl,
            size: file.metadata?.size || 0,
            createdAt: file.created_at,
            updatedAt: file.updated_at,
          };
        })
      );

      return NextResponse.json(
        {
          success: true,
          images,
          count: images.length,
          bucket,
          folder: folder || null,
        },
        {
          status: 200,
          headers: {
            // Cache for 5 minutes, revalidate in background
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    } catch (listError) {
      console.error("Error listing images:", listError);
      return NextResponse.json(
        {
          error: "Failed to list images",
          details: listError instanceof Error ? listError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image list API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

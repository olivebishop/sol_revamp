import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { checkBucketAccess } from "@/lib/supabase-bucket-check";

/**
 * GET /api/admin/check-buckets
 * Check Supabase Storage bucket configuration
 * Admin only endpoint for debugging
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

    // Check if user is admin
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check both buckets
    const packagesBucket = await checkBucketAccess("packages");
    const destinationsBucket = await checkBucketAccess("destinations");

    return NextResponse.json({
      success: true,
      buckets: {
        packages: packagesBucket,
        destinations: destinationsBucket,
      },
      instructions: {
        "If buckets are not public": "Go to Supabase Dashboard > Storage > Select bucket > Settings > Make bucket public",
        "If buckets don't exist": "Create buckets named 'packages' and 'destinations' in Supabase Storage",
        "If images still don't render": "Check that image URLs in database are valid Supabase Storage URLs",
      },
    });
  } catch (error) {
    console.error("Error checking buckets:", error);
    return NextResponse.json(
      {
        error: "Failed to check buckets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

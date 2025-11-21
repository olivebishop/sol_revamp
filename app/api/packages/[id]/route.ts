import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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
      const heroImage = formData.get("heroImage") as string | null;

      // Use new image if provided, otherwise keep existing
      const finalImages = heroImage ? [heroImage] : existingPackage.images;

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

    await prisma.package.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Package deleted" });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// GET all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages);
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

    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const duration = formData.get("duration") as string;
    const isPublished = formData.get("isPublished") === "true";
    
    // Handle file uploads
    const heroImageFile = formData.get("heroImage") as File | null;
    const imageFiles = formData.getAll("images") as File[];
    
    let heroImageUrl = "";
    const imageUrls: string[] = [];
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "packages");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Save hero image
    if (heroImageFile && heroImageFile.size > 0) {
      const bytes = await heroImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${heroImageFile.name.replace(/\s/g, "-")}`;
      const filepath = join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      heroImageUrl = `/uploads/packages/${filename}`;
    }
    
    // Save additional images
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        imageUrls.push(`/uploads/packages/${filename}`);
      }
    }
    
    // Extract days from duration string (e.g., "5 Days / 4 Nights" -> 5)
    const daysMatch = duration.match(/(\d+)/);
    const daysOfTravel = daysMatch ? parseInt(daysMatch[1]) : 1;

    const packageData = await prisma.package.create({
      data: {
        name,
        slug,
        packageType: "safari", // Default type, can be made dynamic
        description,
        pricing: price,
        daysOfTravel,
        images: heroImageUrl ? [heroImageUrl, ...imageUrls] : imageUrls,
        maxCapacity: 10,
        currentBookings: 0,
        destination: {
          id: "default",
          name: "Kenya",
          slug: "kenya",
          bestTime: "Year-round"
        },
        isActive: isPublished,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(packageData, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}

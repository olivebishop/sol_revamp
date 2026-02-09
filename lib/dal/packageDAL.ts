import { prisma } from "@/lib/prisma";
import { Package } from "@prisma/client";
import type { Prisma } from "@prisma/client";

/**
 * Get all packages optimized for list view
 * Only fetches essential fields for fast loading
 */
export async function getAllPackages() {
  try {
    return await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        packageType: true,
        description: true,
        pricing: true,
        daysOfTravel: true,
        images: true,
        maxCapacity: true,
        currentBookings: true,
        isActive: true,
        destination: true,
        // Exclude: createdAt, updatedAt, createdBy to reduce payload
      },
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPackageById(id: string) {
  try {
    return await prisma.package.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error fetching package by id:", error);
    return null;
  }
}

export async function createPackage(data: Prisma.PackageCreateInput) {
  try {
    return await prisma.package.create({ data });
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
}

export async function updatePackage(id: string, data: Prisma.PackageUpdateInput) {
  try {
    return await prisma.package.update({ where: { id }, data });
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
}

export async function deletePackage(id: string) {
  try {
    return await prisma.package.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
}

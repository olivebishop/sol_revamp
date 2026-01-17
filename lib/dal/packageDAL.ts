import { prisma } from "@/lib/prisma";
import { Package } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function getAllPackages() {
  try {
    return await prisma.package.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Error fetching packages:", error);
    // Return empty array if database is not available
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

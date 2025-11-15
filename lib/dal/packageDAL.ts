import { prisma } from "@/lib/prisma";
import { Package } from "@prisma/client";

export async function getAllPackages() {
  return prisma.package.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPackageById(id: string) {
  return prisma.package.findUnique({ where: { id } });
}

export async function createPackage(data: Omit<Package, "id" | "createdAt" | "updatedAt">) {
  return prisma.package.create({ data });
}

export async function updatePackage(id: string, data: Partial<Package>) {
  return prisma.package.update({ where: { id }, data });
}

export async function deletePackage(id: string) {
  return prisma.package.delete({ where: { id } });
}

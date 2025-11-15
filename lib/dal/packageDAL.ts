import { prisma } from "@/lib/prisma";
import { Package } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function getAllPackages() {
  return prisma.package.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPackageById(id: string) {
  return prisma.package.findUnique({ where: { id } });
}

export async function createPackage(data: Prisma.PackageCreateInput) {
  return prisma.package.create({ data });
}



export async function updatePackage(id: string, data: Prisma.PackageUpdateInput) {
  return prisma.package.update({ where: { id }, data });
}

export async function deletePackage(id: string) {
  return prisma.package.delete({ where: { id } });
}

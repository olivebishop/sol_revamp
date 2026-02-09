/**
 * Data Access Layer for Images
 * Helper functions to work with the Image model
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface CreateImageData {
  url: string;
  bucket: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  alt?: string;
  isHero?: boolean;
  displayOrder?: number;
  packageId?: string;
  destinationId?: string;
}

/**
 * Create an image record in the database
 */
export async function createImage(data: CreateImageData) {
  return prisma.image.create({
    data: {
      url: data.url,
      bucket: data.bucket,
      filename: data.filename,
      filePath: data.filePath,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      width: data.width,
      height: data.height,
      alt: data.alt,
      isHero: data.isHero ?? false,
      displayOrder: data.displayOrder ?? 0,
      packageId: data.packageId,
      destinationId: data.destinationId,
    },
  });
}

/**
 * Create multiple image records
 */
export async function createImages(images: CreateImageData[]) {
  return prisma.$transaction(
    images.map((data) =>
      prisma.image.create({
        data: {
          url: data.url,
          bucket: data.bucket,
          filename: data.filename,
          filePath: data.filePath,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          width: data.width,
          height: data.height,
          alt: data.alt,
          isHero: data.isHero ?? false,
          displayOrder: data.displayOrder ?? 0,
          packageId: data.packageId,
          destinationId: data.destinationId,
        },
      })
    )
  );
}

/**
 * Get images for a package
 */
export async function getPackageImages(packageId: string) {
  return prisma.image.findMany({
    where: { packageId },
    orderBy: [
      { isHero: "desc" },
      { displayOrder: "asc" },
    ],
  });
}

/**
 * Get images for a destination
 */
export async function getDestinationImages(destinationId: string) {
  return prisma.image.findMany({
    where: { destinationId },
    orderBy: [
      { isHero: "desc" },
      { displayOrder: "asc" },
    ],
  });
}

/**
 * Delete an image (from DB and optionally from Supabase)
 */
export async function deleteImage(imageId: string) {
  return prisma.image.delete({
    where: { id: imageId },
  });
}

/**
 * Delete images by package ID
 */
export async function deletePackageImages(packageId: string) {
  return prisma.image.deleteMany({
    where: { packageId },
  });
}

/**
 * Delete images by destination ID
 */
export async function deleteDestinationImages(destinationId: string) {
  return prisma.image.deleteMany({
    where: { destinationId },
  });
}

/**
 * Update image order
 */
export async function updateImageOrder(imageId: string, displayOrder: number) {
  return prisma.image.update({
    where: { id: imageId },
    data: { displayOrder },
  });
}

/**
 * Set hero image
 */
export async function setHeroImage(imageId: string, packageId?: string, destinationId?: string) {
  // First, unset all other hero images for this package/destination
  if (packageId) {
    await prisma.image.updateMany({
      where: { packageId, isHero: true },
      data: { isHero: false },
    });
  }
  if (destinationId) {
    await prisma.image.updateMany({
      where: { destinationId, isHero: true },
      data: { isHero: false },
    });
  }

  // Set the new hero image
  return prisma.image.update({
    where: { id: imageId },
    data: { isHero: true },
  });
}

/**
 * Get image URLs array (for backward compatibility)
 */
export async function getImageUrls(
  packageId?: string,
  destinationId?: string
): Promise<string[]> {
  const images = await prisma.image.findMany({
    where: {
      ...(packageId && { packageId }),
      ...(destinationId && { destinationId }),
    },
    orderBy: [
      { isHero: "desc" },
      { displayOrder: "asc" },
    ],
  });

  return images.map((img) => img.url);
}

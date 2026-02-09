/**
 * Migration script to move image URLs from String[] arrays to Image model
 * This preserves all existing data while moving to the new structure
 * 
 * Run with: dotenv -e .env -- tsx scripts/migrate-images-to-db.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateImages() {
  console.log("🔄 Starting image migration...");

  try {
    // Migrate Package images
    console.log("\n📦 Migrating Package images...");
    const packages = await prisma.package.findMany({
      where: {
        images: {
          isEmpty: false,
        },
      },
    });

    let packageCount = 0;
    for (const pkg of packages) {
      if (pkg.images && pkg.images.length > 0) {
        const imageRecords = await Promise.all(
          pkg.images.map(async (url, index) => {
            // Extract bucket from URL or default to "packages"
            const bucket = url.includes("/packages/")
              ? "packages"
              : url.includes("/destinations/")
                ? "destinations"
                : "packages";

            // Extract filename from URL
            const urlParts = url.split("/");
            const filename = urlParts[urlParts.length - 1] || `image-${index}.jpg`;
            const filePath = url.includes("supabase.co")
              ? url.split(`/storage/v1/object/public/${bucket}/`)[1] || filename
              : filename;

            // Check if image already exists
            const existing = await prisma.image.findFirst({
              where: {
                url,
                packageId: pkg.id,
              },
            });

            if (existing) {
              // Update existing
              return prisma.image.update({
                where: { id: existing.id },
                data: {
                  displayOrder: index,
                  isHero: index === 0,
                },
              });
            }

            // Create new
            return prisma.image.create({
              data: {
                url,
                bucket,
                filename,
                filePath,
                fileSize: 0, // Unknown size for existing images
                mimeType: "image/jpeg", // Default, can be updated later
                isHero: index === 0,
                displayOrder: index,
                packageId: pkg.id,
              },
            });
          })
        );

        packageCount += imageRecords.length;
        console.log(`  ✓ Migrated ${imageRecords.length} images for package: ${pkg.name}`);
      }
    }

    console.log(`✅ Migrated ${packageCount} package images`);

    // Migrate Destination images
    console.log("\n🗺️  Migrating Destination images...");
    const destinations = await prisma.destination.findMany({
      where: {
        OR: [
          { heroImage: { not: null } },
          { images: { isEmpty: false } },
        ],
      },
    });

    let destinationCount = 0;
    for (const dest of destinations) {
      const imagesToMigrate: string[] = [];

      // Add hero image if exists
      if (dest.heroImage) {
        imagesToMigrate.push(dest.heroImage);
      }

      // Add other images
      if (dest.images && dest.images.length > 0) {
        imagesToMigrate.push(...dest.images);
      }

      if (imagesToMigrate.length > 0) {
        const imageRecords = await Promise.all(
          imagesToMigrate.map(async (url, index) => {
            // Extract bucket from URL or default to "destinations"
            const bucket = url.includes("/destinations/")
              ? "destinations"
              : url.includes("/packages/")
                ? "packages"
                : "destinations";

            // Extract filename from URL
            const urlParts = url.split("/");
            const filename = urlParts[urlParts.length - 1] || `image-${index}.jpg`;
            const filePath = url.includes("supabase.co")
              ? url.split(`/storage/v1/object/public/${bucket}/`)[1] || filename
              : filename;

            // First image is hero if it was the heroImage
            const isHero = index === 0 && url === dest.heroImage;

            // Check if image already exists
            const existing = await prisma.image.findFirst({
              where: {
                url,
                destinationId: dest.id,
              },
            });

            if (existing) {
              // Update existing
              return prisma.image.update({
                where: { id: existing.id },
                data: {
                  displayOrder: index,
                  isHero,
                },
              });
            }

            // Create new
            return prisma.image.create({
              data: {
                url,
                bucket,
                filename,
                filePath,
                fileSize: 0, // Unknown size for existing images
                mimeType: "image/jpeg", // Default, can be updated later
                isHero,
                displayOrder: index,
                destinationId: dest.id,
              },
            });
          })
        );

        destinationCount += imageRecords.length;
        console.log(`  ✓ Migrated ${imageRecords.length} images for destination: ${dest.name}`);
      }
    }

    console.log(`✅ Migrated ${destinationCount} destination images`);

    console.log("\n✨ Migration complete!");
    console.log(`   Total images migrated: ${packageCount + destinationCount}`);
    console.log("\n📝 Note: Original String[] arrays are kept for backward compatibility.");
    console.log("   You can remove them after verifying the migration.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateImages()
  .then(() => {
    console.log("\n✅ Migration script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration script failed:", error);
    process.exit(1);
  });

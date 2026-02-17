import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDefaultImages() {
  try {
    console.log("🧹 Cleaning up default image references...\n");

    // Find all packages with default image references
    const packages = await prisma.package.findMany({
      where: {
        OR: [
          { images: { has: "/images/default-package.jpg" } },
          { images: { has: "/images/premium.jpg" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
      },
    });

    console.log(`Found ${packages.length} packages with default image references\n`);

    let cleanedCount = 0;

    for (const pkg of packages) {
      if (Array.isArray(pkg.images) && pkg.images.length > 0) {
        // Filter out default image references
        const cleanedImages = pkg.images.filter(
          (url) =>
            url !== "/images/default-package.jpg" &&
            url !== "/images/premium.jpg" &&
            url.trim() !== ""
        );

        // Only update if images changed
        if (cleanedImages.length !== pkg.images.length) {
          await prisma.package.update({
            where: { id: pkg.id },
            data: {
              images: cleanedImages.length > 0 ? cleanedImages : [],
            },
          });

          console.log(`✅ Cleaned ${pkg.name} (${pkg.slug})`);
          console.log(`   Removed ${pkg.images.length - cleanedImages.length} default image reference(s)`);
          console.log(`   Remaining images: ${cleanedImages.length}\n`);

          cleanedCount++;
        }
      }
    }

    // Also check destinations
    const destinations = await prisma.destination.findMany({
      where: {
        OR: [
          { heroImage: { contains: "/images/default" } },
          { heroImage: { contains: "/images/premium" } },
          { images: { has: "/images/default" } },
          { images: { has: "/images/premium" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        heroImage: true,
        images: true,
      },
    });

    console.log(`\nFound ${destinations.length} destinations with default image references\n`);

    let cleanedDestCount = 0;

    for (const dest of destinations) {
      let needsUpdate = false;
      const updateData: { heroImage?: string | null; images?: string[] } = {};

      // Clean heroImage
      if (
        dest.heroImage &&
        (dest.heroImage.includes("/images/default") ||
          dest.heroImage.includes("/images/premium"))
      ) {
        updateData.heroImage = null;
        needsUpdate = true;
      }

      // Clean images array
      if (Array.isArray(dest.images) && dest.images.length > 0) {
        const cleanedImages = dest.images.filter(
          (url) =>
            !url.includes("/images/default") &&
            !url.includes("/images/premium") &&
            url.trim() !== ""
        );

        if (cleanedImages.length !== dest.images.length) {
          updateData.images = cleanedImages.length > 0 ? cleanedImages : [];
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await prisma.destination.update({
          where: { id: dest.id },
          data: updateData,
        });

        console.log(`✅ Cleaned ${dest.name} (${dest.slug})`);
        if (updateData.heroImage === null) {
          console.log(`   Removed default hero image`);
        }
        if (updateData.images) {
          console.log(
            `   Cleaned images array: ${dest.images?.length || 0} → ${updateData.images.length}`
          );
        }
        console.log("");

        cleanedDestCount++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Packages cleaned: ${cleanedCount}`);
    console.log(`   Destinations cleaned: ${cleanedDestCount}`);
    console.log(
      `   Total items cleaned: ${cleanedCount + cleanedDestCount}`
    );
    console.log("\n✅ Cleanup complete! Packages and destinations now only have valid image references.");
  } catch (error) {
    console.error("❌ Error cleaning default images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDefaultImages();

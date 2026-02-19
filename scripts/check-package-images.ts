import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPackageImages() {
  try {
    console.log("🔍 Checking packages and their images...\n");

    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        packageImages: {
          select: {
            id: true,
            url: true,
            bucket: true,
            filename: true,
            isHero: true,
          },
        },
      },
      take: 10, // Check first 10 packages
    });

    console.log(`Found ${packages.length} packages\n`);

    for (const pkg of packages) {
      console.log(`📦 Package: ${pkg.name} (${pkg.slug})`);
      console.log(`   ID: ${pkg.id}`);

      // Check packageImages relation
      if (pkg.packageImages && pkg.packageImages.length > 0) {
        console.log(`   ✅ Has ${pkg.packageImages.length} image(s) in packageImages relation:`);
        pkg.packageImages.forEach((img, idx) => {
          console.log(`      ${idx + 1}. ${img.url}`);
          console.log(`         Bucket: ${img.bucket}, Hero: ${img.isHero}`);
        });
      } else {
        console.log(`   ❌ No images in packageImages relation`);
      }

      // Check images array
      if (Array.isArray(pkg.images) && pkg.images.length > 0) {
        console.log(`   ✅ Has ${pkg.images.length} image(s) in images array:`);
        pkg.images.forEach((url, idx) => {
          console.log(`      ${idx + 1}. ${url}`);
        });
      } else {
        console.log(`   ❌ No images in images array`);
      }

      console.log("");
    }

    // Summary
    const packagesWithImages = packages.filter(
      (pkg) =>
        (pkg.packageImages && pkg.packageImages.length > 0) ||
        (Array.isArray(pkg.images) && pkg.images.length > 0)
    );

    console.log("\n📊 Summary:");
    console.log(`   Total packages checked: ${packages.length}`);
    console.log(`   Packages with images: ${packagesWithImages.length}`);
    console.log(
      `   Packages without images: ${packages.length - packagesWithImages.length}`
    );
  } catch (error) {
    console.error("❌ Error checking packages:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPackageImages();

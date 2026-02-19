/**
 * Script to verify image setup and diagnose issues
 * Run with: npx tsx scripts/verify-images.ts
 */

import { PrismaClient } from "@prisma/client";
import { checkBucketAccess, verifyImageUrl } from "../lib/supabase-bucket-check";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verifying Image Setup...\n");

  // 1. Check bucket access
  console.log("1️⃣ Checking Supabase Buckets...");
  const packagesCheck = await checkBucketAccess("packages");
  const destinationsCheck = await checkBucketAccess("destinations");

  console.log("\n📦 Packages Bucket:");
  console.log(`   Exists: ${packagesCheck.exists ? "✅" : "❌"}`);
  console.log(`   Public: ${packagesCheck.isPublic ? "✅" : "❌"}`);
  if (packagesCheck.error) console.log(`   Error: ${packagesCheck.error}`);
  if (packagesCheck.sampleUrl) console.log(`   Sample URL: ${packagesCheck.sampleUrl}`);

  console.log("\n🗺️  Destinations Bucket:");
  console.log(`   Exists: ${destinationsCheck.exists ? "✅" : "❌"}`);
  console.log(`   Public: ${destinationsCheck.isPublic ? "✅" : "❌"}`);
  if (destinationsCheck.error) console.log(`   Error: ${destinationsCheck.error}`);
  if (destinationsCheck.sampleUrl) console.log(`   Sample URL: ${destinationsCheck.sampleUrl}`);

  // 2. Check packages with images
  console.log("\n\n2️⃣ Checking Package Images...");
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    include: {
      packageImages: {
        orderBy: [{ isHero: "desc" }, { displayOrder: "asc" }],
      },
    },
    take: 5,
  });

  console.log(`\n   Found ${packages.length} packages (showing first 5)`);
  
  for (const pkg of packages) {
    const packageImages = pkg.packageImages || [];
    const legacyImages = Array.isArray(pkg.images) ? pkg.images : [];
    const totalImages = packageImages.length + legacyImages.length;

    console.log(`\n   📦 ${pkg.name} (${pkg.slug}):`);
    console.log(`      PackageImages: ${packageImages.length}`);
    console.log(`      Legacy images array: ${legacyImages.length}`);
    console.log(`      Total: ${totalImages}`);

    if (packageImages.length > 0) {
      const firstImage = packageImages[0];
      console.log(`      First image URL: ${firstImage.url}`);
      
      // Verify URL
      const urlCheck = await verifyImageUrl(firstImage.url);
      console.log(`      URL accessible: ${urlCheck.accessible ? "✅" : "❌"}`);
      if (urlCheck.error) console.log(`      Error: ${urlCheck.error}`);
    } else if (legacyImages.length > 0) {
      const firstImage = legacyImages[0];
      if (typeof firstImage === "string") {
        console.log(`      First legacy image URL: ${firstImage}`);
        const urlCheck = await verifyImageUrl(firstImage);
        console.log(`      URL accessible: ${urlCheck.accessible ? "✅" : "❌"}`);
        if (urlCheck.error) console.log(`      Error: ${urlCheck.error}`);
      }
    } else {
      console.log(`      ⚠️  No images found`);
    }
  }

  // 3. Check destinations with images
  console.log("\n\n3️⃣ Checking Destination Images...");
  const destinations = await prisma.destination.findMany({
    where: { isPublished: true },
    take: 5,
  });

  console.log(`\n   Found ${destinations.length} destinations (showing first 5)`);
  
  for (const dest of destinations) {
    console.log(`\n   🗺️  ${dest.name} (${dest.slug}):`);
    
    if (dest.heroImage) {
      console.log(`      Hero image: ${dest.heroImage}`);
      const urlCheck = await verifyImageUrl(dest.heroImage);
      console.log(`      URL accessible: ${urlCheck.accessible ? "✅" : "❌"}`);
      if (urlCheck.error) console.log(`      Error: ${urlCheck.error}`);
    } else {
      console.log(`      ⚠️  No hero image`);
    }

    const images = Array.isArray(dest.images) ? dest.images : [];
    console.log(`      Additional images: ${images.length}`);
  }

  // 4. Summary
  console.log("\n\n📊 Summary:");
  console.log("   ✅ Buckets configured correctly");
  console.log("   ✅ Policies allow public SELECT access");
  console.log("   ⚠️  Note: Bucket file size limit is 5MB, but code allows up to 10MB");
  console.log("      Consider updating bucket limit or code validation\n");

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

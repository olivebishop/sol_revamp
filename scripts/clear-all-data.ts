/**
 * Script to clear all data from database except Testimonials (reviews)
 * 
 * WARNING: This will delete all data except testimonials!
 * Run with: dotenv -e .env -- tsx scripts/clear-all-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearAllData() {
  console.log("🗑️  Starting data cleanup (keeping Testimonials)...\n");

  try {
    // Delete in order to respect foreign key constraints
    
    // 1. Delete Travelers (depends on Booking)
    console.log("Deleting Travelers...");
    const travelersDeleted = await prisma.traveler.deleteMany({});
    console.log(`  ✓ Deleted ${travelersDeleted.count} travelers`);

    // 2. Delete BookingEmails (depends on Booking)
    console.log("Deleting BookingEmails...");
    const emailsDeleted = await prisma.bookingEmail.deleteMany({});
    console.log(`  ✓ Deleted ${emailsDeleted.count} booking emails`);

    // 3. Delete Bookings (depends on Package, PackageSchedule, User)
    console.log("Deleting Bookings...");
    const bookingsDeleted = await prisma.booking.deleteMany({});
    console.log(`  ✓ Deleted ${bookingsDeleted.count} bookings`);

    // 4. Delete PackageSchedules (depends on Package)
    console.log("Deleting PackageSchedules...");
    const schedulesDeleted = await prisma.packageSchedule.deleteMany({});
    console.log(`  ✓ Deleted ${schedulesDeleted.count} package schedules`);

    // 5. Delete Images (depends on Package, Destination)
    console.log("Deleting Images...");
    const imagesDeleted = await (prisma as any).image.deleteMany({});
    console.log(`  ✓ Deleted ${imagesDeleted.count} images`);

    // 6. Delete Packages (depends on User)
    console.log("Deleting Packages...");
    const packagesDeleted = await prisma.package.deleteMany({});
    console.log(`  ✓ Deleted ${packagesDeleted.count} packages`);

    // 7. Delete Destinations (depends on User)
    console.log("Deleting Destinations...");
    const destinationsDeleted = await prisma.destination.deleteMany({});
    console.log(`  ✓ Deleted ${destinationsDeleted.count} destinations`);

    // 8. Delete WhitelistedEmails (optional - you might want to keep these)
    console.log("Deleting WhitelistedEmails...");
    const whitelistedDeleted = await prisma.whitelistedEmail.deleteMany({});
    console.log(`  ✓ Deleted ${whitelistedDeleted.count} whitelisted emails`);

    // 9. Delete Verifications (auth-related, but safe to delete expired ones)
    console.log("Deleting Verifications...");
    const verificationsDeleted = await prisma.verification.deleteMany({});
    console.log(`  ✓ Deleted ${verificationsDeleted.count} verifications`);

    // 10. Delete Accounts (depends on User) - but keep Users for auth
    console.log("Deleting Accounts...");
    const accountsDeleted = await prisma.account.deleteMany({});
    console.log(`  ✓ Deleted ${accountsDeleted.count} accounts`);

    // 11. Delete Sessions (depends on User) - but keep Users for auth
    console.log("Deleting Sessions...");
    const sessionsDeleted = await prisma.session.deleteMany({});
    console.log(`  ✓ Deleted ${sessionsDeleted.count} sessions`);

    // 12. Delete Users (but you might want to keep admin users - uncomment if needed)
    // Uncomment the next lines if you want to delete ALL users including admins
    // console.log("Deleting Users...");
    // const usersDeleted = await prisma.user.deleteMany({});
    // console.log(`  ✓ Deleted ${usersDeleted.count} users`);

    // Keep Testimonials - DO NOT DELETE
    const testimonialsCount = await prisma.testimonial.count({});
    console.log(`\n✅ Testimonials preserved: ${testimonialsCount} reviews kept`);

    console.log("\n✨ Data cleanup complete!");
    console.log("   All business data deleted, Testimonials preserved.");
    console.log("   Note: Users, Sessions, and Accounts were deleted.");
    console.log("   You may need to recreate admin users.");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run cleanup
clearAllData()
  .then(() => {
    console.log("\n✅ Cleanup script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Cleanup script failed:", error);
    process.exit(1);
  });

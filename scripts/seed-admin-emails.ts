import { prisma } from "../lib/prisma";

async function seedAdminEmails() {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
    email.trim()
  ) || [];

  console.log("Seeding admin emails:", adminEmails);

  for (const email of adminEmails) {
    try {
      await prisma.whitelistedEmail.upsert({
        where: { email },
        update: {},
        create: {
          email,
          isUsed: false,
        },
      });
      console.log(`✓ Added/Updated: ${email}`);
    } catch (error) {
      console.error(`✗ Failed to add ${email}:`, error);
    }
  }

  console.log("\nDone! Admin emails have been whitelisted.");
  await prisma.$disconnect();
}

seedAdminEmails().catch((error) => {
  console.error("Error seeding admin emails:", error);
  process.exit(1);
});

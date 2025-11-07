import { prisma } from "../lib/prisma";

async function addAdminEmail(email: string) {
  try {
    const existing = await prisma.whitelistedEmail.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`❌ Email ${email} is already whitelisted`);
      return;
    }

    await prisma.whitelistedEmail.create({
      data: { email },
    });

    console.log(`✅ Email ${email} has been whitelisted as admin`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: npx tsx scripts/add-admin-email.ts admin@example.com");
  process.exit(1);
}

addAdminEmail(email);

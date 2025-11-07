import { prisma } from "../lib/prisma";

const adminEmailsString = process.env.ADMIN_EMAILS || "";
const adminEmails = adminEmailsString
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

async function seedAdminEmails() {
  if (adminEmails.length === 0) {
    console.log(
      "⚠️  No admin emails found in ADMIN_EMAILS environment variable",
    );
    console.log("Please add ADMIN_EMAILS to your .env file");
    console.log("Example: ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com");
    return;
  }

  try {
    console.log(`📧 Found ${adminEmails.length} email(s) to whitelist...\n`);

    for (const email of adminEmails) {
      const existing = await prisma.whitelistedEmail.findUnique({
        where: { email },
      });

      if (existing) {
        console.log(`⚠️  ${email} is already whitelisted`);
        continue;
      }

      await prisma.whitelistedEmail.create({
        data: { email },
      });

      console.log(`✅ ${email} has been whitelisted`);
    }

    console.log("\n🎉 All admin emails have been processed!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminEmails();

import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { prisma } from "./prisma";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      isAdmin: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // Don't allow users to set this themselves
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          // Check if email is whitelisted
          const whitelisted = await prisma.whitelistedEmail.findUnique({
            where: { email: user.email },
          });

          if (!whitelisted) {
            throw new APIError("FORBIDDEN", {
              message: "Access denied.",
            });
          }

          // Mark email as used and set admin role
          await prisma.whitelistedEmail.update({
            where: { email: user.email },
            data: {
              isUsed: true,
              usedBy: user.id,
            },
          });

          // Return user with admin role
          return {
            data: {
              ...user,
              isAdmin: true,
            },
          };
        },
      },
    },
  },
});

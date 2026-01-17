import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL environment variable is not set. Database operations will fail.");
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

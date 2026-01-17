import { prisma } from "@/lib/prisma";
import { Destination, Prisma } from "@prisma/client";

export async function getAllDestinations() {
  try {
    return await prisma.destination.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    // Return empty array if database is not available
    return [];
  }
}

export async function getDestinationById(id: string) {
  try {
    return await prisma.destination.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error fetching destination by id:", error);
    return null;
  }
}

export async function createDestination(data: Prisma.DestinationCreateInput) {
  try {
    return await prisma.destination.create({ data });
  } catch (error) {
    console.error("Error creating destination:", error);
    throw error;
  }
}

export async function updateDestination(id: string, data: Prisma.DestinationUpdateInput) {
  try {
    return await prisma.destination.update({ where: { id }, data });
  } catch (error) {
    console.error("Error updating destination:", error);
    throw error;
  }
}

export async function deleteDestination(id: string) {
  try {
    return await prisma.destination.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting destination:", error);
    throw error;
  }
}

import { prisma } from "@/lib/prisma";
import { Destination } from "@prisma/client";

export async function getAllDestinations() {
  return prisma.destination.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDestinationById(id: string) {
  return prisma.destination.findUnique({ where: { id } });
}

export async function createDestination(data: Omit<Destination, "id" | "createdAt" | "updatedAt">) {
  return prisma.destination.create({ data });
}

export async function updateDestination(id: string, data: Partial<Destination>) {
  return prisma.destination.update({ where: { id }, data });
}

export async function deleteDestination(id: string) {
  return prisma.destination.delete({ where: { id } });
}

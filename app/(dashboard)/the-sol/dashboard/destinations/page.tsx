import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import DestinationsManager from "@/components/admin/destinations-manager";

export default async function DestinationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  // Fetch all destinations
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Destinations Management</h1>
            <p className="text-gray-400">
              Create and manage travel destinations
            </p>
          </div>
        </div>

        <DestinationsManager
          destinations={JSON.parse(JSON.stringify(destinations))}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}

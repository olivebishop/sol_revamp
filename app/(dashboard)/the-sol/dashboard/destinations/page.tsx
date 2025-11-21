import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import DestinationsManager from "@/components/admin/destinations-manager";
import { Suspense } from "react";

// Loading component for the skeleton UI
function DestinationsLoading() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Destinations Management
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Create and manage travel destinations
            </p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="h-24 sm:h-32 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-24 sm:h-32 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-24 sm:h-32 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Separate data fetching function
async function getDestinationsData(headersObj: Headers) {
  const session = await auth.api.getSession({
    headers: headersObj,
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

  return destinations;
}

// Content component that uses the fetched data
async function DestinationsContent({ headersObj }: { headersObj: Headers }) {
  const destinations = await getDestinationsData(headersObj);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Destinations Management
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Create and manage travel destinations
            </p>
          </div>
        </div>

        <DestinationsManager
          destinations={JSON.parse(JSON.stringify(destinations))}
        />
      </div>
    </div>
  );
}

export default async function DestinationsPage() {
  const headersObj = await headers();
  
  return (
    <Suspense fallback={<DestinationsLoading />}>
      <DestinationsContent headersObj={headersObj} />
    </Suspense>
  );
}
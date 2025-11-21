import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import PackagesManager from "@/components/admin/packages-manager";
import { Suspense } from "react";

// Loading component for the skeleton UI
function PackagesLoading() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Packages Management
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Create and manage tour packages
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
async function getPackagesData(headersObj: Headers) {
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

  // Fetch all packages
  const packages = await prisma.package.findMany({
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

  return packages;
}

// Content component that uses the fetched data
async function PackagesContent({ headersObj }: { headersObj: Headers }) {
  const packages = await getPackagesData(headersObj);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        </div>

        <PackagesManager
          packages={JSON.parse(JSON.stringify(packages))}
        />
      </div>
    </div>
  );
}

export default async function PackagesPage() {
  const headersObj = await headers();
  
  return (
    <Suspense fallback={<PackagesLoading />}>
      <PackagesContent headersObj={headersObj} />
    </Suspense>
  );
}
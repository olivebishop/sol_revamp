import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import PackagesManager from "@/components/admin/packages-manager";
import { Suspense } from "react";
import { cacheLife } from "next/cache";

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

// Move ALL dynamic data access into this component
// @see https://nextjs.org/docs/app/building-your-application/data-fetching/caching
export async function PackagesContent({ headersObj }: { headersObj: any }) {
  'use cache';
  cacheLife('hours');
  // Auth check uses headers() which is a runtime API
  const session = await auth.api.getSession({
    headers: headersObj,
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user is admin (database query)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  // Fetch all packages (database query)
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
      {/* @ts-expect-error Async Server Component */}
      <PackagesContent headersObj={headersObj} />
    </Suspense>
  );
}
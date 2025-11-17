import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Package, MapPin, Users, TrendingUp } from "lucide-react";

// Loading component
function DashboardLoading() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-400">Welcome to your admin dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard content with data fetching
async function DashboardContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true, name: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  // Get dashboard stats
  const [destinationsCount, packagesCount, bookingsCount] = await Promise.all([
    prisma.destination.count(),
    prisma.package.count(),
    prisma.booking.count(),
  ]);

  const stats = [
    {
      title: "Total Destinations",
      value: destinationsCount,
      icon: MapPin,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Packages",
      value: packagesCount,
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Bookings",
      value: bookingsCount,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Revenue",
      value: "$0", // You can calculate this based on bookings
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Here's what's happening with your travel business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <a
              href="/the-sol/dashboard/destinations"
              className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-sm sm:text-base">Manage Destinations</span>
            </a>
            <a
              href="/the-sol/dashboard/packages"
              className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5 text-green-500" />
              <span className="text-sm sm:text-base">Manage Packages</span>
            </a>
            <a
              href="/the-sol/dashboard"
              className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-sm sm:text-base">View Bookings</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

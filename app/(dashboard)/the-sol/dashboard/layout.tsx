import DashboardSidebar from "@/components/admin/dashboard-sidebar";
import React, { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardSidebar>
      <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto bg-black text-white">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
          {children}
        </Suspense>
      </main>
    </DashboardSidebar>
  );
}

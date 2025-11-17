import DashboardSidebar from "@/components/admin/dashboard-sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardSidebar>
      <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto bg-black text-white">
        {children}
      </main>
    </DashboardSidebar>
  );
}

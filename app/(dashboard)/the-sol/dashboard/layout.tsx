import DashboardSidebar from "@/components/admin/dashboard-sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}

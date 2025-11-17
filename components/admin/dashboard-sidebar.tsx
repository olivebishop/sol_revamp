
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Package } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const links = [
  { href: "/the-sol/dashboard" as const, label: "Dashboard", icon: Home },
  { href: "/the-sol/dashboard/destinations" as const, label: "Destinations", icon: Map },
  { href: "/the-sol/dashboard/packages" as const, label: "Packages", icon: Package },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar className="bg-zinc-950 border-r border-zinc-900">
        <SidebarHeader className="mb-4">
          <Link href="/the-sol/dashboard" className="text-2xl font-bold text-orange-500">
            Admin Panel
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {links.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  className="gap-3 px-4 py-2 text-gray-300 hover:bg-zinc-900 hover:text-orange-500"
                >
                  <Link href={href} className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

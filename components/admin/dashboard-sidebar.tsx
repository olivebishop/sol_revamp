
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Map, Package, Menu, LogOut } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/the-sol/dashboard" as const, label: "Dashboard", icon: Home },
  { href: "/the-sol/dashboard/destinations" as const, label: "Destinations", icon: Map },
  { href: "/the-sol/dashboard/packages" as const, label: "Packages", icon: Package },
] as const;

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black">
        <Sidebar className="bg-zinc-950 border-r border-zinc-900">
          <SidebarHeader className="p-4 border-b border-zinc-800">
            <Link
              href="/the-sol/dashboard"
              className="text-xl sm:text-2xl font-bold text-orange-500 truncate"
            >
              Admin Panel
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className="w-full justify-start gap-3 px-3 py-2.5 text-black hover:bg-zinc-900 hover:text-orange-500 rounded-md transition-colors data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-500 data-[active=true]:border-orange-500/20"
                  >
                    <Link href={href} className="flex items-center gap-3 w-full">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-zinc-800">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2.5 text-gray-400 hover:bg-zinc-900 hover:text-red-500 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen bg-black">
          {/* Mobile header with trigger */}
          <header className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-4 flex items-center justify-between">
            <Link
              href="/the-sol/dashboard"
              className="text-lg font-bold text-orange-500"
            >
              Admin Panel
            </Link>
            <SidebarTrigger className="text-gray-300 hover:text-white">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          </header>

          {/* Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      if (isPending) return;

      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      // Check if user is admin
      try {
        const userResponse = await fetch(`/api/admin/check`);
        if (!userResponse.ok) {
          router.push("/");
          return;
        }
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [session, isPending, router]);

  if (isPending || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

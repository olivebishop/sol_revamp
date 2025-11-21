
import PackagesManager from "@/components/admin/packages-manager";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Add Package | Admin Dashboard",
};

export async function AddPackageContent({ headersObj }: { headersObj: Record<string, string> }) {
  'use cache';
  // Auth check
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!user?.isAdmin) redirect("/");
  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Package</h1>
      <PackagesManager packages={[]} />
    </div>
  );
}

export default function AddPackagePage() {
  // Only pass the `cookie` header which is required for session lookup.
  // Some runtimes don't expose `entries()` on the headers object, so
  // extracting `cookie` is more reliable for auth session checks.
  const headersObj = { cookie: (headers() as any).get?.("cookie") ?? "" };
  return (
    <Suspense>
      <AddPackageContent headersObj={headersObj} />
    </Suspense>
  );
}

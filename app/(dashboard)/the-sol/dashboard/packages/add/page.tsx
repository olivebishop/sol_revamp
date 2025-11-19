
import PackagesManager from "@/components/admin/packages-manager";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Add Package | Admin Dashboard",
};

export async function AddPackageContent({ headersObj }: { headersObj: any }) {
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

export default async function AddPackagePage() {
  const headersObj = await headers();
  return (
    <Suspense>
      <AddPackageContent headersObj={headersObj} />
    </Suspense>
  );
}

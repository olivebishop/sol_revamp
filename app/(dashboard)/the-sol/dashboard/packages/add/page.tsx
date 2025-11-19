import PackagesManager from "@/components/admin/packages-manager";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Package | Admin Dashboard",
};

export default async function AddPackagePage() {
  'use cache'; // Next.js 16.0.3 cache directive

  // Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!user?.isAdmin) redirect("/");

  // Pass empty packages array for add form
  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Package</h1>
      <PackagesManager packages={[]} mode="add" />
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getPackageById, updatePackage, deletePackage } from "@/lib/dal/packageDAL";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(_req: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params);
  const id = params?.id as string;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pkg = await getPackageById(id);
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(req: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params);
  const id = params?.id as string;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();
  const updated = await updatePackage(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, context: any) {
  const params = await Promise.resolve(context?.params);
  const id = params?.id as string;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await deletePackage(id);
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getAllPackages, createPackage } from "@/lib/dal/packageDAL";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const packages = await getAllPackages();
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await req.json();
  const pkg = await createPackage({ ...data, createdBy: session.user.id });
  return NextResponse.json(pkg, { status: 201 });
}

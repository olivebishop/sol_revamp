import { NextRequest, NextResponse } from "next/server";
import { getAllDestinations, createDestination } from "@/lib/dal/destinationDAL";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const destinations = await getAllDestinations();
  return NextResponse.json(destinations);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await req.json();
  const destination = await createDestination({ ...data, createdBy: session.user.id });
  return NextResponse.json(destination, { status: 201 });
}

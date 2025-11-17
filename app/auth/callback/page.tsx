import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

async function CallbackHandler() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user is admin and redirect accordingly
  if (session.user.isAdmin) {
    redirect("/the-sol/dashboard");
  } else {
    redirect("/");
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Redirecting...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}

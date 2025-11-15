

export default async function AuthCallbackPage() {
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

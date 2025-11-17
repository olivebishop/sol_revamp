import { createAuthClient } from "better-auth/react";

// Automatically detect the correct base URL
const getBaseURL = () => {
  // In production, use the current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // For SSR, use environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession } = authClient;

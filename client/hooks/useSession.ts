import { authClient } from "@/lib/auth-client";

/**
 * Lightweight hook for components that only need basic session info.
 * Much faster than useUser as it doesn't fetch additional API data.
 * Perfect for navbars and components that just need to know if user is logged in.
 */
export function useSession() {
  const { data: session, isPending } = authClient.useSession();

  return {
    session,
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image,
        }
      : null,
    isAuthenticated: !!session?.user,
    loading: isPending,
  };
}

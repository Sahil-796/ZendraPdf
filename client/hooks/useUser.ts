import { authClient } from "@/lib/auth-client";
import { userKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { UserDetails } from "@/types/user";

/**
 * Optimized useUser hook that separates session check from heavy data fetching.
 * Uses React Query for caching and deduplication.
 */
export default function useUser() {
  // Use better-auth's built-in useSession for fast session access
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  // Only fetch additional user details when we have a session
  const { data: userDetails, isLoading: detailsLoading } = useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      // Fetch user details in parallel
      const [creditHistoryRes, detailsRes] = await Promise.all([
        fetch("/api/getCreditHistory"),
        fetch("/api/getUserDetails", { cache: "no-store" }),
      ]);

      const creditsHistory = creditHistoryRes.ok
        ? await creditHistoryRes.json()
        : [];

      let details: Partial<UserDetails> = {};
      if (detailsRes.ok) {
        details = await detailsRes.json();
      }

      return {
        plan: details.plan || "free",
        emailVerified: details.emailVerified ?? false,
        creditsLeft: details.creditsLeft ?? 0,
        providerId: details.providerId ?? "",
        creditsHistory,
      };
    },
    // Only run when we have a session
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Combine session data with user details
  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
        plan: userDetails?.plan || "free",
        emailVerified: userDetails?.emailVerified ?? false,
        creditsLeft: userDetails?.creditsLeft ?? 0,
        providerId: userDetails?.providerId ?? "",
        creditsHistory: userDetails?.creditsHistory || [],
        isCreator: userDetails?.plan === "creator",
        isAuthenticated: true,
        userProvider: userDetails?.providerId ?? "",
      }
    : null;

  return {
    user,
    // Loading is true only during initial session check
    // Once session is known, we show the user immediately (with defaults)
    loading: sessionLoading,
    // Separate flag for when additional details are still loading
    detailsLoading: detailsLoading && !!session?.user,
  };
}

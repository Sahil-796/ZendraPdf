"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./useSession";
import LumaSpin from "@/components/21st/LumaSpin";

/**
 * Optimized AuthGuard that uses lightweight session check.
 * With middleware handling server-side redirects, this is now a fallback
 * for client-side navigation protection.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if session check is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show minimal loading state during session check
  if (loading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-background">
        <LumaSpin />
      </div>
    );
  }

  // Middleware should have already redirected, but this is a fallback
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

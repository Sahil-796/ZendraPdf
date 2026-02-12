import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated users from protected routes to login
  if (!session) {
    // If trying to access auth routes without session, allow it
    if (isAuthRoute) {
      return NextResponse.next();
    }
    // Otherwise redirect to login with callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/generate",
    "/edit",
    "/edit/:path*",
    "/account",
    "/templates",
    "/tools/:path*",
    "/success",
    "/login",
    "/signup",
  ],
};

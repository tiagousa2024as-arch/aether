/**
 * Proxy (Next.js 16) - Protects /dashboard/*, /billing, /settings.
 * Redirects to /login when unauthenticated.
 * Replaces deprecated middleware.ts.
 */

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname === "/billing" ||
    req.nextUrl.pathname === "/settings";

  if (isProtected && !isLoggedIn) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/dashboard/:path*",
    "/billing",
    "/settings",
  ],
};

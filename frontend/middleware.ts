import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSessionCookieName } from "./src/lib/auth/session";

const PROTECTED_ROUTES = ["/dashboard", "/avyakta-control"];

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.AUTH_SESSION_SECRET;
    if (!secret) return false;

    const secretBytes = new TextEncoder().encode(secret);
    await jwtVerify(token, secretBytes, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get(getSessionCookieName())?.value;

  // Check if user is authenticated
  const isAuthenticated = authCookie
    ? await verifySessionToken(authCookie)
    : false;

  // Protected routes - require authentication
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (pathname === "/auth/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/* (Next.js internals)
     * - common metadata files
     */
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

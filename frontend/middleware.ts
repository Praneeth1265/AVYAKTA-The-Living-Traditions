import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "./src/lib/auth/session";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes: string[] = ["/avyakta-control", "/dashboard"];
  const authRoutes: string[] = ["/auth/login"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Only verify session if accessing protected routes or redirecting from auth routes
  // Skip session verification for public routes to improve performance
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Now check session only when needed
  const cookieName = getSessionCookieName();
  const token = request.cookies.get(cookieName)?.value;
  const session: SessionPayload | null = token
    ? await verifySessionId(token)
    : null;

  // If there's no token and they're trying to access a protected route, redirect to login
  if (isProtectedRoute && !session) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));

    if (token) {
      response.cookies.set({
        name: cookieName,
        value: "",
        path: "/",
        maxAge: 0,
      });
    }

    return response;
  }

  // If they have a token and are trying to access auth routes, redirect to admin entry
  // Use the ADMIN_HASH from env as the access code
  const adminHash = process.env.ADMIN_HASH || "secret123";
  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL(`/avyakta-control/${adminHash}/dashboard`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

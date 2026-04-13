import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "./src/lib/auth/session";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const cookieName = getSessionCookieName();
  const token = request.cookies.get(cookieName)?.value;
  const session: SessionPayload | null = token
    ? await verifySessionId(token)
    : null;

  // Define protected routes
  const protectedRoutes: string[] = ["/dashboard", "/avyakta-control"];
  const authRoutes: string[] = ["/auth/login"];

  const pathname = request.nextUrl.pathname;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

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

  // If they have a token and are trying to access auth routes, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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

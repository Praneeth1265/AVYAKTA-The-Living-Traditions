import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the auth token from the cookie
  const token = request.cookies.get("avyakta-auth")?.value;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/avyakta-control"];
  const authRoutes = ["/auth/login"];

  const pathname = request.nextUrl.pathname;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If there's no token and they're trying to access a protected route, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If they have a token and are trying to access auth routes, redirect to dashboard
  if (isAuthRoute && token) {
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

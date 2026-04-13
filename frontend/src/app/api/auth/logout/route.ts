import { NextResponse } from "next/server";
import { getSessionCookieName } from "../../../../lib/auth/session";

interface LogoutResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(): Promise<
  NextResponse<LogoutResponse | ErrorResponse>
> {
  try {
    const response = NextResponse.json(
      { message: "Sign out successful" } as LogoutResponse,
      { status: 200 },
    );

    // Clear the auth cookie
    response.cookies.set({
      name: getSessionCookieName(),
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign out" } as ErrorResponse,
      { status: 500 },
    );
  }
}

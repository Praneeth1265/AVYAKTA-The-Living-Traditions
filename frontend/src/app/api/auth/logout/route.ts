import { NextResponse } from "next/server";
import { getSessionCookieName } from "../../../../lib/auth/session";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Sign out successful" },
      { status: 200 },
    );

    // Clear the auth cookie
    response.cookies.delete(getSessionCookieName());

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign out" },
      { status: 500 },
    );
  }
}

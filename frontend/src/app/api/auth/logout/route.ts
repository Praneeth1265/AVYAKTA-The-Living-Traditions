import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Sign out successful" },
      { status: 200 },
    );

    // Clear the auth cookie
    response.cookies.delete("avyakta-auth");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign out" },
      { status: 500 },
    );
  }
}

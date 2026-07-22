import { NextResponse } from "next/server";
import { getSessionCookieName } from "../../../../lib/auth/session";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );

    response.cookies.delete(getSessionCookieName());

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

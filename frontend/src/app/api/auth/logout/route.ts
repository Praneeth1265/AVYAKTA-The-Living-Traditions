import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName } from "../../../../lib/auth/session";

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete(getSessionCookieName());

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

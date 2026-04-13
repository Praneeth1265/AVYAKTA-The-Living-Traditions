import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSupabaseAdmin } from "../../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const plainPassword = String(password);
    const supabase = getSupabaseAdmin();

    const { data, error: queryError } = await supabase
      .from("login_credentials")
      .select("id, email, password_hash")
      .ilike("email", normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (queryError) {
      console.error("Credential lookup failed:", queryError);
      return NextResponse.json(
        { error: "Unable to verify credentials" },
        { status: 500 },
      );
    }

    const credential = data;

    if (!credential) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      plainPassword,
      credential.password_hash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: credential.id,
          email: credential.email,
        },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: "avyakta-auth",
      value: credential.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const message =
      error instanceof Error ? error.message : "An error occurred during sign in";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "An error occurred during sign in",
      },
      { status: 500 },
    );
  }
}

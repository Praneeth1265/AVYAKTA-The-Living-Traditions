import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSupabaseAdmin } from "../../../../lib/supabase/server";
import {
  createSessionToken,
  getSessionCookieName,
} from "../../../../lib/auth/session";
import { loginSchema } from "../../../../lib/validators/auth";

interface ErrorResponse {
  error: string;
  issues?: Array<{
    path: string[];
    message: string;
  }>;
}

interface Credential {
  id: string | number;
  email: string;
  password_hash: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message,
          })),
        } as ErrorResponse,
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = String(email).trim().toLowerCase();
    const plainPassword = String(password);
    const supabase = getSupabaseAdmin();

    const { data, error: queryError } = await supabase
      .from("login_credentials")
      .select("id, email, password_hash")
      .eq("email", normalizedEmail)
      .limit(1)
      .maybeSingle<Credential>();

    if (queryError) {
      console.error("Credential lookup failed:", queryError);
      return NextResponse.json(
        { error: "Unable to verify credentials" } as ErrorResponse,
        { status: 500 },
      );
    }

    const credential = data as Credential | null;

    if (!credential) {
      return NextResponse.json(
        { error: "Invalid email or password" } as ErrorResponse,
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      plainPassword,
      credential.password_hash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" } as ErrorResponse,
        { status: 401 },
      );
    }

    const sessionToken = await createSessionToken({
      userId: String(credential.id),
      email: credential.email,
    });

    const response = NextResponse.json(
      { message: "Login successful" } as { message: string },
      { status: 200 },
    );

    response.cookies.set({
      name: getSessionCookieName(),
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign in" } as ErrorResponse,
      { status: 500 },
    );
  }
}

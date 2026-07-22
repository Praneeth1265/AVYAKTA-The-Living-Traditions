import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifySessionId,
  getSessionCookieName,
} from "../../../lib/auth/session";
import { getRecruitmentStatus, setRecruitmentStatus } from "../../../lib/config/recruitmentStatus";

async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;

    if (!token) {
      return false;
    }

    const session = await verifySessionId(token);
    return session !== null;
  } catch {
    return false;
  }
}

export async function GET() {
  const isOpen = await getRecruitmentStatus();
  return NextResponse.json({ isOpen });
}

export async function PATCH(request: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (typeof body.isOpen !== "boolean") {
    return NextResponse.json({ error: "isOpen (boolean) is required" }, { status: 400 });
  }

  await setRecruitmentStatus(body.isOpen);
  return NextResponse.json({ isOpen: body.isOpen });
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "../../../lib/auth/session";

export default async function AdminLoginPage() {
  const authCookie = (await cookies()).get(getSessionCookieName())?.value;
  const session: SessionPayload | null = authCookie
    ? await verifySessionId(authCookie)
    : null;

  if (!session) {
    redirect("/auth/login");
  }

  redirect("/dashboard");
}

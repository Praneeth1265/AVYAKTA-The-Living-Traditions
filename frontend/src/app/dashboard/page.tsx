import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionCookieName,
  verifySessionToken,
} from "../../lib/auth/session";

export default async function DashboardPage() {
  const authCookie = (await cookies()).get(getSessionCookieName())?.value;
  const session = authCookie ? await verifySessionToken(authCookie) : null;

  if (!session) {
    redirect("/auth/login");
  }

  redirect("/avyakta-control/admin/dashboard");
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "../../components/admin/AdminDashboardClient";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "../../lib/auth/session";

export default async function DashboardPage() {
  // Verify session on server-side
  const authCookie = (await cookies()).get(getSessionCookieName())?.value;
  const session: SessionPayload | null = authCookie
    ? await verifySessionId(authCookie)
    : null;

  if (!session) {
    // Not authenticated - redirect to login
    redirect("/auth/login");
  }

  // User is authenticated, render dashboard directly
  return <AdminDashboardClient />;
}

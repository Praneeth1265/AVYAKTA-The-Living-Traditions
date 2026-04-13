import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "../../../../components/admin/AdminDashboardClient";
import {
  getSessionCookieName,
  verifySessionId,
} from "../../../../lib/auth/session";

export default async function DashboardPage() {
  const authCookie = (await cookies()).get(getSessionCookieName())?.value;
  const session = authCookie ? await verifySessionId(authCookie) : null;

  if (!session) {
    redirect("/auth/login");
  }

  return <AdminDashboardClient />;
}

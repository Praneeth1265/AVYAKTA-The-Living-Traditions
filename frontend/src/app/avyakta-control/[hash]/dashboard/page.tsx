import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import AdminDashboardClient from "../../../../components/admin/AdminDashboardClient";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "../../../../lib/auth/session";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  // Validate the hash parameter
  const { hash } = await params;
  const expectedHash = process.env.ADMIN_HASH || "secret123";
  if (hash !== expectedHash) {
    // Invalid hash - return 404
    notFound();
  }

  // Verify session on server-side (double-check after middleware)
  // Dashboard is only accessible after successful login
  const authCookie = (await cookies()).get(getSessionCookieName())?.value;
  const session: SessionPayload | null = authCookie
    ? await verifySessionId(authCookie)
    : null;

  if (!session) {
    // Not authenticated - redirect to login
    redirect("/auth/login");
  }

  // User is authenticated and hash is valid, render dashboard
  return <AdminDashboardClient />;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionCookieName,
  verifySessionId,
  type SessionPayload,
} from "../../../lib/auth/session";

export default async function AdminEntryPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;

  // Check if user has a valid session
  const cookieName = getSessionCookieName();
  const token = (await cookies()).get(cookieName)?.value;
  const session: SessionPayload | null = token
    ? await verifySessionId(token)
    : null;

  // If not logged in, redirect to login page with redirect parameter
  if (!session) {
    redirect(`/auth/login?redirect=/avyakta-control/${hash}`);
  }

  // If logged in, redirect to the dashboard
  redirect(`/avyakta-control/${hash}/dashboard`);
}

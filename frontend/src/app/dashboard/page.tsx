import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const authCookie = (await cookies()).get("avyakta-auth")?.value;

  if (!authCookie) {
    redirect("/auth/login");
  }

  redirect("/avyakta-control/admin/dashboard");
}

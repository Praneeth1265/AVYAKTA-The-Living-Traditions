import MembersPageClient from "./MembersPageClient";
import { getMembersFromDb } from "@/lib/data/members";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembersFromDb();
  return <MembersPageClient initialMembers={members} />;
}

import HomePageClient from "./HomePageClient";
import { getEventsFromDb } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbEvents = await getEventsFromDb();
  const events = dbEvents
    .filter((e) => e.status === "upcoming")
    .map((e) => ({
      slug: e.slug,
      name: e.title,
      date: e.date,
      type: e.domain || "Event",
    }));
  return <HomePageClient initialEvents={events} />;
}

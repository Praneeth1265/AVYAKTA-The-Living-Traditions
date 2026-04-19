import HomePageClient from "./HomePageClient";
import { getEventsFromDb } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const eventItems = await getEventsFromDb();

  const initialEvents = eventItems.slice(0, 3).map((item) => ({
    slug: item.slug,
    name: item.title,
    date: item.date,
    type: item.domain?.trim() || "Cultural showcase",
  }));

  return <HomePageClient initialEvents={initialEvents} />;
}

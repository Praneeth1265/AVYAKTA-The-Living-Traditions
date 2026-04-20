import GalleryPageClient from "./GalleryPageClient";
import { getGalleryEventsFromDb } from "@/lib/data/gallery";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const events = await getGalleryEventsFromDb();
  return <GalleryPageClient initialEvents={events} />;
}

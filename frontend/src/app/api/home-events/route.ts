import { NextResponse } from "next/server";
import { getEventsFromDb } from "@/lib/data/events";

export const dynamic = "force-dynamic";

function toHomeType(domain: string) {
  const normalized = domain?.trim();
  if (!normalized) {
    return "Cultural showcase";
  }
  return normalized;
}

export async function GET() {
  const eventItems = await getEventsFromDb();

  const events = eventItems.slice(0, 3).map((item) => ({
    slug: item.slug,
    name: item.title,
    date: item.date,
    type: toHomeType(item.domain),
  }));

  return NextResponse.json({ events });
}

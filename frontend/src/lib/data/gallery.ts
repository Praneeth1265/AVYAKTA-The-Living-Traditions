import "server-only";

import { asc, eq } from "drizzle-orm";
import { event_slug, events, posters } from "@drizzle/schema";
import { db } from "@/lib/db";

export type GalleryImage = {
  id: string;
  url: string;
  name: string;
};

export type GalleryEvent = {
  id: string;
  name: string;
  year: string;
  thumbnail: string;
  images: GalleryImage[];
};

type GalleryRow = {
  id: string;
  title: string;
  date: string | null;
  image_url: string | null;
  slug_image_url: string | null;
  poster_image_url: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitUrls(input: string | null | undefined): string[] {
  if (!input) {
    return [];
  }

  return input
    .split(/[\n,|]/)
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));
}

function fallbackEventImages(title: string, count = 8): string[] {
  const slug = slugify(title) || "avyakta-event";
  return Array.from({ length: count }, (_, index) => {
    const width = 900;
    const height = index % 3 === 0 ? 1200 : index % 2 === 0 ? 980 : 1100;
    return `https://picsum.photos/seed/${slug}-${index + 1}/${width}/${height}`;
  });
}

function yearFromDate(dateValue: string | null): string {
  if (!dateValue) {
    return "TBA";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return "TBA";
  }

  return String(parsed.getFullYear());
}

function mapRowsToGalleryEvents(rows: GalleryRow[]): GalleryEvent[] {
  const grouped = new Map<
    string,
    {
      title: string;
      date: string | null;
      images: Set<string>;
      thumbnail: string | null;
    }
  >();

  for (const row of rows) {
    const current = grouped.get(row.id) ?? {
      title: row.title,
      date: row.date,
      images: new Set<string>(),
      thumbnail: null,
    };

    const urls = [
      ...splitUrls(row.poster_image_url),
      ...splitUrls(row.slug_image_url),
      ...splitUrls(row.image_url),
    ];

    for (const url of urls) {
      current.images.add(url);
    }

    current.thumbnail =
      current.thumbnail ||
      row.poster_image_url ||
      row.slug_image_url ||
      row.image_url;

    grouped.set(row.id, current);
  }

  return Array.from(grouped.entries()).map(([id, value]) => {
    const imageUrls = value.images.size
      ? Array.from(value.images)
      : fallbackEventImages(value.title);

    const images = imageUrls.map((url, index) => ({
      id: `${id}-${index + 1}`,
      url,
      name: `${value.title} • Frame ${String(index + 1).padStart(2, "0")}`,
    }));

    return {
      id,
      name: value.title,
      year: yearFromDate(value.date),
      thumbnail: value.thumbnail || imageUrls[0],
      images,
    };
  });
}

function fallbackGalleryEvents(): GalleryEvent[] {
  const templates = [
    "Rangotsav Night",
    "Swar and Stage",
    "Creative Confluence",
    "Alaap Collective",
  ];

  return templates.map((title, index) => {
    const images = fallbackEventImages(title, 9).map((url, imageIndex) => ({
      id: `fallback-${index + 1}-${imageIndex + 1}`,
      url,
      name: `${title} • Frame ${String(imageIndex + 1).padStart(2, "0")}`,
    }));

    return {
      id: `fallback-${index + 1}`,
      name: title,
      year: String(2023 + index),
      thumbnail: images[0].url,
      images,
    };
  });
}

export async function getGalleryEventsFromDb(): Promise<GalleryEvent[]> {
  try {
    const rows = await db
      .select({
        id: events.id,
        title: events.title,
        date: events.date,
        image_url: events.image_url,
        slug_image_url: event_slug.image_url,
        poster_image_url: posters.poster_image_url,
      })
      .from(events)
      .leftJoin(event_slug, eq(event_slug.event_id, events.id))
      .leftJoin(posters, eq(posters.event_id, events.id))
      .orderBy(asc(events.date), asc(events.title));

    if (!rows.length) {
      return fallbackGalleryEvents();
    }

    return mapRowsToGalleryEvents(rows);
  } catch (error) {
    console.warn(
      "[gallery] Database unavailable, serving fallback gallery.",
      error,
    );
    return fallbackGalleryEvents();
  }
}

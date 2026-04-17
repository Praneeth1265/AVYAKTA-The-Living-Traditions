import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { retryWithBackoff } from "../../../lib/api/retry";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type EventWritePayload = {
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  registration_enabled?: boolean;
  payment_image_required?: boolean;
};

// GET - Fetch all events with related data
export async function GET(_request: NextRequest) {
  try {
    const result = await retryWithBackoff(async () =>
      supabase
        .from("events")
        .select(
          `
          *,
          event_slug(*),
          posters(*)
        `
        )
        .order("date", { ascending: false })
    );

    const { data: events, error: eventsError } = result;
    if (eventsError) throw new Error(eventsError.message);

    return NextResponse.json({ success: true, data: events || [] });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, date, registration_enabled, payment_image_required } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const insertPayload: EventWritePayload = {
      title: title.trim(),
      description: description?.trim() || null,
      image_url: image_url || null,
      date: date || null,
    };

    // Only add optional fields if they're provided
    if (registration_enabled !== undefined) {
      insertPayload.registration_enabled = registration_enabled;
    }
    if (payment_image_required !== undefined) {
      insertPayload.payment_image_required = payment_image_required;
    }

    const result = await retryWithBackoff(async () =>
      supabase
        .from("events")
        .insert([insertPayload])
        .select(
          `
          *,
          event_slug(*),
          posters(*)
        `
        )
    );

    let { data, error } = result;

    // Backward compatible fallback when optional DB columns are not migrated yet
    if (
      error &&
      (error.message?.includes("registration_enabled") ||
        error.message?.includes("payment_image_required") ||
        error.message?.includes("schema cache"))
    ) {
      const fallbackPayload = {
        title: title.trim(),
        description: description?.trim() || null,
        image_url: image_url || null,
        date: date || null,
      };

      const retryResult = await retryWithBackoff(async () =>
        supabase
          .from("events")
          .insert([fallbackPayload])
          .select(
            `
            *,
            event_slug(*),
            posters(*)
          `
          )
      );

      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}

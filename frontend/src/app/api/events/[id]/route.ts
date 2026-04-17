import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { retryWithBackoff } from "../../../../lib/api/retry";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type EventUpdatePayload = {
  title?: string;
  description?: string;
  image_url?: string | null;
  date?: string | null;
  registration_enabled?: boolean;
  payment_image_required?: boolean;
};

// GET - Fetch a single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        .eq("id", id)
        .single()
    );

    const { data, error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT - Update an event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image_url, date, registration_enabled, payment_image_required } = body;

    const updatePayload: EventUpdatePayload = {};

    // Only add fields that are provided
    if (title !== undefined) updatePayload.title = title?.trim();
    if (description !== undefined) updatePayload.description = description?.trim();
    if (image_url !== undefined) updatePayload.image_url = image_url;
    if (date !== undefined) updatePayload.date = date;
    if (registration_enabled !== undefined) updatePayload.registration_enabled = registration_enabled;
    if (payment_image_required !== undefined) updatePayload.payment_image_required = payment_image_required;

    let result = await retryWithBackoff(async () =>
      supabase
        .from("events")
        .update(updatePayload)
        .eq("id", id)
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
      (error.message.includes("registration_enabled") ||
        error.message.includes("payment_image_required") ||
        error.message.includes("schema cache"))
    ) {
      const fallbackPayload = { ...updatePayload };
      delete fallbackPayload.registration_enabled;
      delete fallbackPayload.payment_image_required;

      const fallbackResult = await retryWithBackoff(async () =>
        supabase
          .from("events")
          .update(fallbackPayload)
          .eq("id", id)
          .select(
            `
            *,
            event_slug(*),
            posters(*)
          `
          )
      );

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an event (cascade deletes related records)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await retryWithBackoff(async () =>
      supabase.from("events").delete().eq("id", id)
    );

    const { error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { retryWithBackoff } from "../../../../../lib/api/retry";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET - Fetch all posters for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await retryWithBackoff(async () =>
      supabase.from("posters").select("*").eq("event_id", id),
    );

    const { data, error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching posters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posters" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { poster_image_url } = body;

    const result = await retryWithBackoff(async () =>
      supabase
        .from("posters")
        .insert([
          {
            event_id: id,
            poster_image_url,
          },
        ])
        .select(),
    );

    let { data, error } = result;

    // If schema cache error, try alternative approach
    if (
      error &&
      (error.message?.includes("title") ||
        error.message?.includes("schema cache") ||
        (error as { code?: string }).code === "PGRST204")
    ) {
      console.warn(
        "Schema cache issue detected, retrying with refreshed connection:",
        error.message,
      );

      // Wait a moment and retry
      await new Promise((resolve) => setTimeout(resolve, 500));

      const retryResult = await retryWithBackoff(async () =>
        supabase
          .from("posters")
          .insert([
            {
              event_id: id,
              poster_image_url,
            },
          ])
          .select(),
      );

      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error("Supabase poster error:", {
        message: error.message,
        code: (error as { code?: string }).code,
        details: (error as { details?: string }).details,
      });
      throw new Error(error.message || "Failed to create poster");
    }

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create poster";
    console.error("Error creating poster:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// PUT - Update a poster
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await params;
    const body = await request.json();
    const { posterId, poster_image_url } = body;

    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 },
      );
    }

    const updatePayload: Record<string, unknown> = {};

    if (poster_image_url !== undefined)
      updatePayload.poster_image_url = poster_image_url;

    const result = await retryWithBackoff(async () =>
      supabase
        .from("posters")
        .update(updatePayload)
        .eq("id", posterId)
        .select(),
    );

    const { data, error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error("Error updating poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update poster" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a poster
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await params;
    const body = await request.json();
    const { posterId } = body;

    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("posters")
      .delete()
      .eq("id", posterId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete poster" },
      { status: 500 },
    );
  }
}

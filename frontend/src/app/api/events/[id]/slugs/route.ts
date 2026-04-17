import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { retryWithBackoff } from "../../../../../lib/api/retry";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all slugs for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await retryWithBackoff(async () =>
      supabase
        .from("event_slug")
        .select("*")
        .eq("event_id", id)
    );

    const { data, error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slugs" },
      { status: 500 }
    );
  }
}

// POST - Create a new slug for an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    let { more_description, image_url } = body;

    const slugPayload: any = {
      event_id: id,
      ...(more_description && { more_description: more_description.trim() }),
      ...(image_url && { image_url: image_url }), // Store comma or pipe-separated URLs
    };

    // Use retry logic for transient failures
    let result = await retryWithBackoff(async () => 
      supabase
        .from("event_slug")
        .insert([slugPayload])
        .select()
    );

    let { data, error } = result;

    // If schema cache error, try alternative approach
    if (error && (error.message?.includes("title") || error.message?.includes("schema cache") || (error as any).code === "PGRST204")) {
      console.warn("Schema cache issue detected, retrying with refreshed connection:", error.message);
      
      // Wait a moment and retry
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const retryResult = await retryWithBackoff(async () => 
        supabase
          .from("event_slug")
          .insert([slugPayload])
          .select()
      );
      
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      throw new Error(error.message || "Failed to create slug");
    }

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create slug";
    console.error("Error creating slug:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update a slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    const { slugId, title, more_description, image_url } = body;

    if (!slugId) {
      return NextResponse.json(
        { success: false, error: "Slug ID is required" },
        { status: 400 }
      );
    }

    const updatePayload: any = {};

    if (more_description !== undefined) updatePayload.more_description = more_description?.trim();
    if (image_url !== undefined) updatePayload.image_url = image_url;

    const { data, error } = await supabase
      .from("event_slug")
      .update(updatePayload)
      .eq("id", slugId)
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error("Error updating slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update slug" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    const { slugId } = body;

    if (!slugId) {
      return NextResponse.json(
        { success: false, error: "Slug ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("event_slug")
      .delete()
      .eq("id", slugId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete slug" },
      { status: 500 }
    );
  }
}

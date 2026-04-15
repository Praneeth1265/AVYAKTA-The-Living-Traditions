import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all slugs for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("event_slug")
      .select("*")
      .eq("event_id", id);

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, more_description, image_url } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("event_slug")
      .insert([
        {
          event_id: id,
          title,
          more_description: more_description || null,
          image_url: image_url || null,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create slug" },
      { status: 500 }
    );
  }
}

// PUT - Update a slug
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { slugId, title, more_description, image_url } = body;

    if (!slugId) {
      return NextResponse.json(
        { success: false, error: "Slug ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("event_slug")
      .update({
        title,
        more_description,
        image_url,
      })
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
  { params }: { params: { id: string } }
) {
  try {
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

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all posters for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("posters")
      .select("*")
      .eq("event_id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching posters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posters" },
      { status: 500 }
    );
  }
}

// POST - Create a new poster for an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, poster_image_url } = body;

    if (!title || !poster_image_url) {
      return NextResponse.json(
        { success: false, error: "Title and poster image are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posters")
      .insert([
        {
          event_id: id,
          title,
          poster_image_url,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create poster" },
      { status: 500 }
    );
  }
}

// PUT - Update a poster
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { posterId, title, poster_image_url } = body;

    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posters")
      .update({
        title,
        poster_image_url,
      })
      .eq("id", posterId)
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    console.error("Error updating poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update poster" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a poster
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { posterId } = body;

    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 }
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
      { status: 500 }
    );
  }
}

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all events with related data
export async function GET(request: NextRequest) {
  try {
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(
        `
        *,
        event_slug(*),
        posters(*)
      `
      )
      .order("date", { ascending: false });

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
    const { title, description, image_url, date } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          description: description || null,
          image_url: image_url || null,
          date: date || null,
        },
      ])
      .select(
        `
        *,
        event_slug(*),
        posters(*)
      `
      );

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

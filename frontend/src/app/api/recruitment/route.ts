import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      srn,
      sem,
      branch,
      section,
      links,
      experience,
      why_you,
      why_us,
      phone_number,
      email,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Insert into database using Supabase client
    const { data, error } = await supabase
      .from("recruitment")
      .insert([
        {
          name,
          srn: srn || null,
          sem: sem || null,
          branch: branch || null,
          section: section || null,
          links: links || null,
          experience: experience || null,
          why_you: why_you || null,
          why_us: why_us || null,
          phone_number: phone_number || null,
          email,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Recruitment application submitted successfully",
        data: data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Recruitment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit recruitment application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("recruitment")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching recruitments:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruitments" },
      { status: 500 }
    );
  }
}

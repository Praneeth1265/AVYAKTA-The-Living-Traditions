import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase/server";
import { recruitmentSchema } from "../../../lib/validators/recruitment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validation = recruitmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten() },
        { status: 400 },
      );
    }

    const data = validation.data;

    // links already validated by schema (parsed JSON array with size/length limits)
    const supabaseAdmin = getSupabaseAdmin();
    const { data: insertedData, error } = await supabaseAdmin
      .from("recruitment")
      .insert([
        {
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          domain: data.domain,
          srn: data.srn,
          year: data.year ?? null,
          branch: data.branch || null,
          section: data.section || null,
          links: data.links ?? null,
          experience: data.experience ?? null,
          why_you: data.why_you,
          why_us: data.why_us,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to submit recruitment application",
          code: "RECRUITMENT_INSERT_FAILED",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Recruitment application submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Recruitment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit recruitment application" },
      { status: 500 },
    );
  }
}

// GET endpoint removed due to privacy concerns
// PII (email, phone) should not be exposed publicly
// If retrieval is needed, implement proper authentication/authorization

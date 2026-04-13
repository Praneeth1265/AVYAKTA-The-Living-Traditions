import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase/server";
import { recruitmentSchema } from "../../../lib/validators/recruitment";

interface ErrorResponse {
  error: string;
  code?: string;
}

interface SuccessResponse {
  message: string;
}

interface RecruitmentInsertData {
  name: string;
  email: string;
  phone_no: number | null;
  domain: string;
  srn: string;
  year: number | null;
  branch: string | null;
  section: string | null;
  links: string[] | null;
  experience: string | null;
  why_you: string;
  why_us: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body = await request.json();

    // Server-side validation
    const validation = recruitmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed" } as ErrorResponse,
        { status: 400 },
      );
    }

    const data = validation.data;

    // links already validated by schema (parsed JSON array with size/length limits)
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("recruitment")
      .insert<RecruitmentInsertData>([
        {
          name: data.name,
          email: data.email,
          phone_no: data.phone_number ? parseInt(data.phone_number) : null,
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
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to submit recruitment application",
          code: "RECRUITMENT_INSERT_FAILED",
        } as ErrorResponse,
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Recruitment application submitted successfully",
      } as SuccessResponse,
      { status: 201 },
    );
  } catch (error) {
    console.error("Recruitment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit recruitment application" } as ErrorResponse,
      { status: 500 },
    );
  }
}

// GET endpoint removed due to privacy concerns
// PII (email, phone) should not be exposed publicly
// If retrieval is needed, implement proper authentication/authorization

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase/server";

/**
 * GET domain-specific recruitment reports
 *
 * This endpoint fetches all recruitment applications for a specified domain.
 * Currently accessible to authenticated domain heads only.
 *
 * Request body:
 * - domain: string (required) - The domain name (e.g., "Technical", "Design")
 *
 * Response:
 * - domain: string - The requested domain
 * - total_count: number - Total number of applicants
 * - recruits: array - List of recruitment records with applicant details
 * - generated_at: string - ISO timestamp when report was generated
 *
 * Authorization:
 * TODO: Implement JWT/session validation to verify user is authenticated domain head
 * TODO: Add domain-specific authorization checks to ensure domain heads only access their domain
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 },
      );
    }

    // TODO: Add authentication verification
    // const authHeader = request.headers.get("authorization");
    // if (!authHeader?.startsWith("Bearer ")) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // TODO: Verify domain head has access to this domain
    // const domainHeadEmail = verifyJWT(authHeader.substring(7));
    // const { data: isValidHead } = await supabaseAdmin
    //   .from("login_credentials")
    //   .select("email")
    //   .eq("email", domainHeadEmail)
    //   .eq("domain", domain)
    //   .single();
    //
    // if (!isValidHead) {
    //   return NextResponse.json(
    //     { error: "Not authorized to access this domain" },
    //     { status: 403 }
    //   );
    // }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch all recruitment applications for the specified domain
    const { data, error } = await supabaseAdmin
      .from("recruitment")
      .select(
        "id, name, email, phone_no, srn, branch, section, year, first_preference_domain, second_domain_preference, experience, why_you, why_us, first_preference_status, interview, created_at",
      )
      .eq("first_preference_domain", domain)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch recruitment data",
          code: "RECRUITMENT_FETCH_FAILED",
        },
        { status: 500 },
      );
    }

    // Return the data for PDF generation on client-side
    return NextResponse.json(
      {
        domain,
        total_count: data?.length || 0,
        recruits: data || [],
        generated_at: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}

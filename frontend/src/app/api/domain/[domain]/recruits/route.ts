import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain: domainParam } = await params;
    const domain = domainParam
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const supabaseAdmin = getSupabaseAdmin();

    // ============ STEP 1: Get all second_preference recruitment IDs ============
    // These recruits should NOT appear in first preference array
    const { data: secondPrefAllData } = await supabaseAdmin
      .from("second_preference")
      .select("recruitment_id");

    const secondPrefIds = new Set(
      (secondPrefAllData || []).map((item: any) => item.recruitment_id)
    );

    // ============ STEP 2: FIRST PREFERENCE RECRUITS ============
    // Recruits who applied for this domain as first choice (not rejected, not in second preference)
    const { data: allFirstPref } = await supabaseAdmin
      .from("recruitment")
      .select("*")
      .eq("first_preference_domain", domain)
      .neq("first_preference_status", "rejected");

    // Filter out those who have a second_preference entry
    const firstPreferenceRecruits = (allFirstPref || []).filter(
      (recruit: any) => !secondPrefIds.has(recruit.id)
    );

    // ============ STEP 3: SECOND PREFERENCE RECRUITS ============
    // Recruits with entries in second_preference table for this domain
    const { data: secondPrefData } = await supabaseAdmin
      .from("second_preference")
      .select(
        `
        recruitment_id,
        interview,
        second_preference_status,
        recruitment:recruitment_id(*)
      `
      );

    // Filter to only include recruits for this specific domain
    // AND deduplicate to ensure each recruit appears only once
    // AND exclude rejected recruits
    const secondPrefMap = new Map();
    (secondPrefData || []).forEach((item: any) => {
      if (item.recruitment && item.recruitment.second_domain_preference === domain && item.second_preference_status !== 'rejected') {
        const recruitId = item.recruitment.id;
        // Only keep the first entry for each recruit
        if (!secondPrefMap.has(recruitId)) {
          secondPrefMap.set(recruitId, {
            ...item.recruitment,
            second_preference_id: item.recruitment_id,
            second_preference_interview: item.interview,
            second_preference_status: item.second_preference_status,
          });
        }
      }
    });

    const secondPreferenceRecruits = Array.from(secondPrefMap.values());

    // ============ STEP 4: COUNTER DATA ============
    const { data: counterData } = await supabaseAdmin
      .from("counter")
      .select("*")
      .eq("domain", domain)
      .single();

    return NextResponse.json(
      {
        firstPreference: firstPreferenceRecruits,
        secondPreference: secondPreferenceRecruits,
        counter: counterData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Domain recruits fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruits" },
      { status: 500 }
    );
  }
}

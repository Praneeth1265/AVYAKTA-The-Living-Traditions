import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateAndFormatDomain } from "@/lib/utils/domainValidator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  try {
    const { domain: domainParam } = await params;

    console.log("=== RECRUITS FETCH ===");
    console.log("Domain param (kebab-case):", domainParam);

    // Validate domain
    const domain = validateAndFormatDomain(domainParam);
    console.log("Formatted domain (Title Case):", domain);

    if (!domain) {
      console.error("Invalid domain:", domainParam);
      return NextResponse.json({ error: "Invalid domain" }, { status: 404 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ============ DEBUG: Check what domains exist in the database ============
    const { data: allRecruits } = await supabaseAdmin
      .from("recruitment")
      .select("id, first_preference_domain");

    const domainsInDb = new Set(
      (allRecruits || []).map(
        (r: Record<string, unknown>) => r.first_preference_domain,
      ),
    );
    console.log("All domains in recruitment table:", Array.from(domainsInDb));
    console.log("Total recruits in database:", allRecruits?.length || 0);
    // These recruits should NOT appear in first preference array
    const { data: secondPrefAllData } = await supabaseAdmin
      .from("second_preference")
      .select("recruitment_id");

    const secondPrefIds = new Set(
      (secondPrefAllData || []).map(
        (item: Record<string, unknown>) => item.recruitment_id,
      ),
    );

    // ============ STEP 2: FIRST PREFERENCE RECRUITS ============
    // Recruits who applied for this domain as first choice (not rejected, not in second preference)
    console.log(`Querying recruitment table for domain: "${domain}"`);
    const { data: allFirstPref, error: firstPrefError } = await supabaseAdmin
      .from("recruitment")
      .select("*")
      .eq("first_preference_domain", domain)
      .neq("first_preference_status", "rejected");

    if (firstPrefError) {
      console.error(
        "Error querying first preference recruits:",
        firstPrefError,
      );
    }

    // Also query ALL first preference recruits (including rejected) for accurate counter
    const { data: allFirstPrefIncludingRejected } = await supabaseAdmin
      .from("recruitment")
      .select("*")
      .eq("first_preference_domain", domain);

    console.log(
      `Found ${allFirstPref?.length || 0} recruits with first_preference_domain="${domain}"`,
    );
    if (allFirstPref && allFirstPref.length > 0) {
      console.log(
        "First pref data sample:",
        JSON.stringify(allFirstPref[0], null, 2),
      );
    }

    // Filter out those who have a second_preference entry
    const firstPreferenceRecruits = (allFirstPref || []).filter(
      (recruit: Record<string, unknown>) => !secondPrefIds.has(recruit.id),
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
      `,
      );

    // Filter to only include recruits for this specific domain
    // AND deduplicate to ensure each recruit appears only once
    // AND exclude rejected recruits
    const secondPrefMap = new Map();
    (secondPrefData || []).forEach((item: Record<string, unknown>) => {
      const recruitment = item.recruitment as
        | Record<string, unknown>
        | undefined;
      if (
        recruitment &&
        recruitment.second_domain_preference === domain &&
        item.second_preference_status !== "rejected"
      ) {
        const recruitId = recruitment.id as string;
        // Only keep the first entry for each recruit
        if (!secondPrefMap.has(recruitId)) {
          secondPrefMap.set(recruitId, {
            ...recruitment,
            second_preference_id: item.recruitment_id,
            second_preference_interview: item.interview,
            second_preference_status: item.second_preference_status,
          });
        }
      }
    });

    const secondPreferenceRecruits = Array.from(secondPrefMap.values());

    // ============ STEP 4: COUNTER DATA ============
    // Calculate counter dynamically from ALL recruits with correct status field
    // For first preference: use first_preference_status
    // For second preference: use second_preference_status

    // Get all second preference recruits for this domain with their statuses
    const secondPrefRecruitsByDomain = (secondPrefData || [])
      .filter((item: Record<string, unknown>) => {
        const recruitment = item.recruitment as
          | Record<string, unknown>
          | undefined;
        return recruitment && recruitment.second_domain_preference === domain;
      })
      .map((item: Record<string, unknown>) => ({
        status: item.second_preference_status as string,
      }));

    // Count from first preference (using first_preference_status) - uses ALL recruits including rejected
    const firstPrefCounts = {
      not_sure: (allFirstPrefIncludingRejected || []).filter(
        (r: Record<string, unknown>) =>
          r.first_preference_status === "not_sure",
      ).length,
      approved: (allFirstPrefIncludingRejected || []).filter(
        (r: Record<string, unknown>) =>
          r.first_preference_status === "approved",
      ).length,
      rejected: (allFirstPrefIncludingRejected || []).filter(
        (r: Record<string, unknown>) =>
          r.first_preference_status === "rejected",
      ).length,
    };

    // Count from second preference (using second_preference_status)
    const secondPrefCounts = {
      not_sure: secondPrefRecruitsByDomain.filter(
        (r) => r.status === "not_sure",
      ).length,
      approved: secondPrefRecruitsByDomain.filter(
        (r) => r.status === "approved",
      ).length,
      rejected: secondPrefRecruitsByDomain.filter(
        (r) => r.status === "rejected",
      ).length,
    };

    // Combine counts
    const counterData = {
      domain,
      not_sure: firstPrefCounts.not_sure + secondPrefCounts.not_sure,
      approved: firstPrefCounts.approved + secondPrefCounts.approved,
      rejected: firstPrefCounts.rejected + secondPrefCounts.rejected,
    };

    // Debug logging for Media and Visibility
    if (domain === "Media and Visibility") {
      console.log("=== COUNTER DEBUG: Media and Visibility ===");
      console.log(
        "First pref total count (all including rejected):",
        allFirstPrefIncludingRejected?.length || 0,
      );
      console.log("First pref counts:", firstPrefCounts);
      console.log(
        "Second pref recruits for this domain:",
        secondPrefRecruitsByDomain.length,
      );
      console.log("Second pref counts:", secondPrefCounts);
      console.log("Final counter:", counterData);
    }

    // ============ STEP 5: INDICATOR DATA ============
    const { data: indicatorData } = await supabaseAdmin
      .from("indicator")
      .select("*")
      .eq("domain", domain)
      .single();

    // If indicator doesn't exist, create default one
    // This ensures new domains automatically get indicator data
    let finalIndicator = indicatorData;
    if (!indicatorData) {
      const { data: createdIndicator } = await supabaseAdmin
        .from("indicator")
        .insert({ domain, indicator: false })
        .select()
        .single();
      finalIndicator = createdIndicator;
    }

    return NextResponse.json(
      {
        firstPreference: firstPreferenceRecruits,
        secondPreference: secondPreferenceRecruits,
        counter: counterData,
        indicator: finalIndicator,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Domain recruits fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruits" },
      { status: 500 },
    );
  }
}

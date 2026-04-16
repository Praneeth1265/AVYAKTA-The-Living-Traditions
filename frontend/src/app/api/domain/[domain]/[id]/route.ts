import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isValidDomain } from "@/lib/utils/domainValidator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string; id: string }> },
) {
  try {
    const { domain, id: recruitId } = await params;

    // Validate domain
    if (!isValidDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 404 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch recruit details
    const { data: recruit, error } = await supabaseAdmin
      .from("recruitment")
      .select("*")
      .eq("id", recruitId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Recruit not found" }, { status: 404 });
    }

    // Fetch second preference if exists
    const { data: secondPref } = await supabaseAdmin
      .from("second_preference")
      .select("*")
      .eq("recruitment_id", recruitId)
      .single();

    return NextResponse.json(
      {
        recruit,
        secondPreference: secondPref,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Recruit fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruit details" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string; id: string }> },
) {
  try {
    const { id: recruitId } = await params;
    const body = await request.json();
    const { interview, status, isSecondPreference } = body;

    const supabaseAdmin = getSupabaseAdmin();

    // If updating from second preference view, update second_preference table
    if (isSecondPreference) {
      // Get current status to avoid unnecessary trigger fires
      const { data: currentSecondPref } = await supabaseAdmin
        .from("second_preference")
        .select("interview, second_preference_status")
        .eq("recruitment_id", recruitId)
        .single();

      // PREVENT CHANGES FROM REJECTED STATUS (FINAL)
      if (currentSecondPref?.second_preference_status === "rejected") {
        return NextResponse.json(
          {
            error:
              "Cannot change status from rejected - this is a final decision",
          },
          { status: 403 },
        );
      }

      // Build update object - only include fields that actually changed
      const updateObj: Record<string, unknown> = {};
      if (
        interview !== undefined &&
        currentSecondPref?.interview !== interview
      ) {
        updateObj.interview = interview;
      }
      if (status && currentSecondPref?.second_preference_status !== status) {
        updateObj.second_preference_status = status;
      }

      // Only update if something actually changed
      if (Object.keys(updateObj).length === 0) {
        return NextResponse.json(
          { message: "No changes detected" },
          { status: 200 },
        );
      }

      const { error: updateError } = await supabaseAdmin
        .from("second_preference")
        .update(updateObj)
        .eq("recruitment_id", recruitId);

      if (updateError) {
        console.error("Error updating second preference:", updateError);
        return NextResponse.json(
          {
            error: "Failed to update second preference",
            details: updateError.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: "Second preference updated successfully" },
        { status: 200 },
      );
    }

    // Otherwise, update the recruitment table (first preference)
    // Get current status to avoid unnecessary trigger fires
    const { data: currentRecruit } = await supabaseAdmin
      .from("recruitment")
      .select("interview, first_preference_status")
      .eq("id", recruitId)
      .single();

    // PREVENT CHANGES FROM REJECTED STATUS (FINAL)
    if (currentRecruit?.first_preference_status === "rejected") {
      return NextResponse.json(
        {
          error:
            "Cannot change status from rejected - this is a final decision",
        },
        { status: 403 },
      );
    }

    // Build update object - only include fields that actually changed
    const updateObj: Record<string, unknown> = {};
    if (interview !== undefined && currentRecruit?.interview !== interview) {
      updateObj.interview = interview;
    }
    if (status && currentRecruit?.first_preference_status !== status) {
      updateObj.first_preference_status = status;
    }

    // Only update if something actually changed
    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json(
        { message: "No changes detected" },
        { status: 200 },
      );
    }

    const { data: updatedRecruit, error: updateError } = await supabaseAdmin
      .from("recruitment")
      .update(updateObj)
      .eq("id", recruitId)
      .select();

    if (updateError) {
      console.error("Error updating recruitment:", updateError);
      return NextResponse.json(
        { error: "Failed to update recruit", details: updateError.message },
        { status: 500 },
      );
    }

    // If status is rejected and second_domain_preference exists, ensure second_preference record exists
    if (
      status === "rejected" &&
      updatedRecruit &&
      updatedRecruit[0]?.second_domain_preference
    ) {
      const { data: existingSecondPref } = await supabaseAdmin
        .from("second_preference")
        .select("id")
        .eq("recruitment_id", recruitId)
        .single();

      if (!existingSecondPref) {
        // Only insert if it doesn't already exist
        const { error: insertError } = await supabaseAdmin
          .from("second_preference")
          .insert({
            recruitment_id: recruitId,
            interview: false,
            second_preference_status: "not_sure",
          });

        if (insertError) {
          console.error("Failed to add to second preference:", insertError);
        }
      }
    }

    return NextResponse.json(
      { message: "Recruit updated successfully", recruit: updatedRecruit?.[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Recruit update error:", error);
    return NextResponse.json(
      { error: "Failed to update recruit" },
      { status: 500 },
    );
  }
}

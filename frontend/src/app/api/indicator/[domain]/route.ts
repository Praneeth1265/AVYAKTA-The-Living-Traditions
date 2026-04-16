import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateAndFormatDomain } from "@/lib/utils/domainValidator";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  try {
    const { domain: domainParam } = await params;

    // Validate domain
    const domain = validateAndFormatDomain(domainParam);
    if (!domain) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 404 });
    }

    const body = await request.json();

    const supabaseAdmin = getSupabaseAdmin();

    // Try to update first
    const { data, error } = await supabaseAdmin
      .from("indicator")
      .update({ indicator: body.indicator })
      .eq("domain", domain)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update indicator" },
        { status: 500 },
      );
    }

    // If no records were updated, try to insert instead
    if (!data || data.length === 0) {
      console.log(`Indicator not found for ${domain}, creating new record`);

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from("indicator")
        .insert({ domain, indicator: body.indicator })
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to create indicator" },
          { status: 500 },
        );
      }

      return NextResponse.json(insertData[0]);
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error updating/creating indicator:", error);
    return NextResponse.json(
      { error: "Failed to update indicator" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  try {
    const { domain: domainParam } = await params;

    // Validate domain
    const domain = validateAndFormatDomain(domainParam);
    if (!domain) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 404 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("indicator")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Indicator not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching indicator:", error);
    return NextResponse.json(
      { error: "Failed to fetch indicator" },
      { status: 500 },
    );
  }
}

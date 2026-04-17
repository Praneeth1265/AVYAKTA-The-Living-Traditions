import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { retryWithBackoff } from "../../../../lib/api/retry";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch counter stats for all domains
export async function GET(request: NextRequest) {
  try {
    const result = await retryWithBackoff(async () =>
      supabase.from("counter").select("*")
    );

    const { data, error } = result;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching counter stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch counter stats" },
      { status: 500 }
    );
  }
}

// PUT - Reset counter for a specific domain or all domains
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, flushAll } = body;

    if (!domain && !flushAll) {
      return NextResponse.json(
        { success: false, error: "Domain or flushAll flag is required" },
        { status: 400 }
      );
    }

    if (flushAll) {
      // Reset all domains - need a WHERE clause for safety
      const result = await retryWithBackoff(async () =>
        supabase
          .from("counter")
          .update({
            not_sure: 0,
            approved: 0,
            rejected: 0,
          })
          .neq("domain", null)
          .select()
      );

      const { data, error } = result;
      if (error) throw new Error(error.message);

      return NextResponse.json({ success: true, data: data });
    } else {
      // Reset specific domain
      const result = await retryWithBackoff(async () =>
        supabase
          .from("counter")
          .update({
            not_sure: 0,
            approved: 0,
            rejected: 0,
          })
          .eq("domain", domain)
          .select()
      );

      const { data, error } = result;
      if (error) throw new Error(error.message);

      return NextResponse.json({ success: true, data: data?.[0] });
    }
  } catch (error) {
    console.error("Error resetting counter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset counter" },
      { status: 500 }
    );
  }
}

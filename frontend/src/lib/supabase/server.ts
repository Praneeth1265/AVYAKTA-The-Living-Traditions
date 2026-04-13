import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only admin client (has full permissions)
// Only use this in server actions and API routes
export function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in frontend/.env.local",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

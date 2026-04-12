import { createClient } from "@supabase/supabase-js";

// Server-only admin client (has full permissions)
// Only use this in server actions and API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

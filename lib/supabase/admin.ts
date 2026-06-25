import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error(
      `Missing NEXT_PUBLIC_SUPABASE_URL for admin client (have key=${Boolean(key)})`,
    );
  }
  if (!key) {
    throw new Error(
      `Missing SUPABASE_SERVICE_ROLE_KEY for admin client (have url=${Boolean(url)})`,
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

let serviceClient: ReturnType<typeof createClient<Database>> | null = null;

export function getServiceSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  serviceClient ??= createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return serviceClient;
}

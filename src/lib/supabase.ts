import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Supabase client configuration read from Vite client-side environment variables.
 * - VITE_SUPABASE_URL: The unique project URL provided by Supabase.
 * - VITE_SUPABASE_ANON_KEY: The public anonymous API key for browser client access.
 */
export const supabaseUrl: string =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://kzklkkminrhjlmzupanl.supabase.co";

export const supabaseAnonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "";

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim() !== "",
);

let clientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client singleton configured with database types and browser session persistence.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!clientInstance) {
    // If anon key is not yet set in environment, use a dummy key to prevent client instantiation crashes
    const key = supabaseAnonKey.trim() || "unconfigured-anon-key";
    clientInstance = createClient<Database>(supabaseUrl, key, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });
  }
  return clientInstance;
}

/**
 * Global typed Supabase client instance for database queries and real-time connectivity.
 */
export const supabase = getSupabaseClient();

export default supabase;

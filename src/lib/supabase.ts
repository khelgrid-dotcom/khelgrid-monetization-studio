import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://kzklkkminrhjlmzupanl.supabase.co";

export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim() !== "",
);

let clientInstance: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!clientInstance) {
    // If the anon key is not set yet, use a fallback token so module loading doesn't crash the app
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

export const supabase = getSupabaseClient();

import { useMemo } from "react";
import { supabase, isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase";

export function useSupabase() {
  return useMemo(
    () => ({
      supabase,
      isConfigured: isSupabaseConfigured,
      getClient: getSupabaseClient,
    }),
    [],
  );
}

export default useSupabase;

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TRIALS, type Trial } from "@/data/trials";
import type { Database } from "@/types/database";

export type TrialRow = Database["public"]["Tables"]["trials"]["Row"];

export interface TrialDiscoveryItem {
  id: string;
  title: string;
  academy: string;
  sport: string;
  city: string;
  venue?: string;
  date: string;
  registrationDeadline?: string;
  fee: number;
  spots: number;
  tag: string;
  ageCategory?: string;
  eligibility?: string;
  verifiedLabel?: string;
  urgencyText?: string;
  badge?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  status?: string;
  isSupabaseOrigin?: boolean;
}

/**
 * Normalizes a Supabase trial row into a TrialDiscoveryItem
 */
export function normalizeSupabaseTrial(row: TrialRow): TrialDiscoveryItem {
  return {
    id: row.id,
    title: row.title,
    academy: row.academy_name,
    sport: row.sport,
    city: row.city,
    venue: row.venue_name || undefined,
    date: row.trial_date,
    registrationDeadline: row.registration_deadline || undefined,
    fee: Number(row.fee) || 0,
    spots: row.spots_available > 0 ? row.spots_available : row.spots_total,
    tag: row.tag || "Open",
    eligibility: row.eligibility || undefined,
    verifiedLabel: row.source_label || "Verified Scouting Combine",
    urgencyText: row.reporting_time ? `Reporting at ${row.reporting_time}` : undefined,
    sourceUrl: row.source_url || undefined,
    sourceLabel: row.source_label || undefined,
    status: row.status,
    isSupabaseOrigin: true,
  };
}

/**
 * Fetches all available and active sports trials from Supabase.
 * Falls back to curated static trials if Supabase has 0 rows or is offline.
 */
export async function fetchAvailableTrialsFromSupabase(options?: {
  sport?: string;
  city?: string;
  maxLimit?: number;
}): Promise<{
  trials: TrialDiscoveryItem[];
  isSupabaseLive: boolean;
  totalCount: number;
  error?: string;
}> {
  let isSupabaseLive = false;
  const limit = options?.maxLimit || 50;

  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("trials")
        .select("*")
        .in("status", ["active", "upcoming"]);

      if (options?.sport && options.sport !== "All Sports" && options.sport !== "all") {
        query = query.eq("sport", options.sport);
      }

      if (options?.city && options.city !== "All Locations" && options.city !== "all") {
        query = query.eq("city", options.city);
      }

      const { data, error } = await query
        .order("trial_date", { ascending: true })
        .limit(limit);

      if (!error && data && data.length > 0) {
        isSupabaseLive = true;
        const normalized = data.map(normalizeSupabaseTrial);
        return {
          trials: normalized,
          isSupabaseLive: true,
          totalCount: normalized.length,
        };
      }
    } catch (err: any) {
      console.warn("Supabase trials query failed, falling back to cached trials:", err?.message);
    }
  }

  // Graceful fallback to verified curated TRIALS
  let fallbackList = TRIALS.map((t) => ({
    ...t,
    isSupabaseOrigin: false,
  }));

  if (options?.sport && options.sport !== "All Sports" && options.sport !== "all") {
    fallbackList = fallbackList.filter(
      (t) => t.sport.toLowerCase() === options.sport?.toLowerCase()
    );
  }

  if (options?.city && options.city !== "All Locations" && options.city !== "all") {
    fallbackList = fallbackList.filter(
      (t) => t.city.toLowerCase() === options.city?.toLowerCase()
    );
  }

  return {
    trials: fallbackList.slice(0, limit),
    isSupabaseLive,
    totalCount: fallbackList.length,
  };
}

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface AlertHistoryItem {
  id: string;
  category: "live_trials" | "deadlines" | "system";
  title: string;
  message: string;
  sport: string;
  city: string;
  trialId?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const ALERT_HISTORY_KEY = "khelgrid_alert_history_v1";

export const DEFAULT_ALERT_HISTORY: AlertHistoryItem[] = [
  {
    id: "alert-hist-1",
    category: "live_trials",
    title: "🎯 New Cricket Trial: BCCI State U-19 Screening Camp",
    message: "Karnataka State Cricket Association announced trials for top-order batsmen and seam bowlers in Bengaluru.",
    sport: "Cricket",
    city: "Bengaluru",
    trialId: "t-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    isRead: false,
    actionUrl: "/trials",
  },
  {
    id: "alert-hist-2",
    category: "deadlines",
    title: "⏰ Deadline Warning: 24 Hours Left for Fit India Namchi Athletics Selection",
    message: "Online registration for Namchi District Athletics trials closes tomorrow. Only 14 spots left.",
    sport: "Athletics",
    city: "Namchi",
    trialId: "t-fit-india-namchi-sikkim-2026",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    isRead: false,
    actionUrl: "/trials",
  },
  {
    id: "alert-hist-3",
    category: "live_trials",
    title: "🎯 New Football Scout Trial: BFC Youth Residential Academy",
    message: "Bengaluru FC is hosting open screening for U-17 and U-19 athletes at Bangalore Football Stadium.",
    sport: "Football",
    city: "Bengaluru",
    trialId: "t-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    isRead: true,
    actionUrl: "/trials",
  },
  {
    id: "alert-hist-4",
    category: "deadlines",
    title: "⏰ Deadline Warning: Badminton State Super League",
    message: "Registration for Smash Point Shuttle Open closes in 36 hours. Secure your spot before cutoff.",
    sport: "Badminton",
    city: "Bengaluru",
    trialId: "t-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(), // 40 hours ago
    isRead: true,
    actionUrl: "/trials",
  },
];

let memoryAlertHistory: AlertHistoryItem[] = [...DEFAULT_ALERT_HISTORY];

/**
 * Loads alert history from local storage or Supabase notification_queue
 */
export async function getAlertHistory(userId?: string | null): Promise<{
  alerts: AlertHistoryItem[];
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let items = memoryAlertHistory;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ALERT_HISTORY_KEY);
      if (stored) {
        items = JSON.parse(stored);
        memoryAlertHistory = items;
      } else {
        localStorage.setItem(ALERT_HISTORY_KEY, JSON.stringify(DEFAULT_ALERT_HISTORY));
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("notification_queue")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!error && data && data.length > 0) {
        isSupabaseLive = true;
        const mapped: AlertHistoryItem[] = data.map((row: any) => ({
          id: row.id,
          category: (row.payload?.type === "deadline_warning" ? "deadlines" : "live_trials") as "live_trials" | "deadlines",
          title: row.title || "KhelGrid Trial Alert",
          message: row.body || "New alert from sports selection network.",
          sport: row.payload?.sport || "Multi-Sport",
          city: row.payload?.city || "All India",
          trialId: row.trial_id || row.payload?.trial_id,
          timestamp: row.sent_at || row.created_at || new Date().toISOString(),
          isRead: row.status === "sent",
          actionUrl: "/trials",
        }));

        // Merge with local items avoiding duplicate IDs
        const existingIds = new Set(mapped.map((m) => m.id));
        const combined = [...mapped, ...items.filter((item) => !existingIds.has(item.id))];
        return { alerts: combined, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Failed fetching alert history from Supabase:", err);
    }
  }

  return { alerts: items, isSupabaseLive };
}

/**
 * Saves alert history to local storage and dispatches a window event
 */
export function saveAlertHistory(alerts: AlertHistoryItem[]) {
  memoryAlertHistory = alerts;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ALERT_HISTORY_KEY, JSON.stringify(alerts));
      window.dispatchEvent(new CustomEvent("khelgrid_alert_history_changed", { detail: alerts }));
    } catch (err) {
      console.warn("Failed saving alert history:", err);
    }
  }
}

/**
 * Adds a new alert to history (e.g. simulated or received live)
 */
export function addAlertToHistory(newAlert: Omit<AlertHistoryItem, "id" | "timestamp">): AlertHistoryItem {
  const item: AlertHistoryItem = {
    ...newAlert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  let current = memoryAlertHistory;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ALERT_HISTORY_KEY);
      if (stored) current = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const updated = [item, ...current];
  saveAlertHistory(updated);
  return item;
}

/**
 * Marks all alerts as read
 */
export function markAllAlertsAsRead(): AlertHistoryItem[] {
  let current = memoryAlertHistory;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ALERT_HISTORY_KEY);
      if (stored) current = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const updated = current.map((a) => ({ ...a, isRead: true }));
  saveAlertHistory(updated);
  return updated;
}

/**
 * Marks single alert as read
 */
export function markAlertAsRead(id: string): AlertHistoryItem[] {
  let current = memoryAlertHistory;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ALERT_HISTORY_KEY);
      if (stored) current = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const updated = current.map((a) => (a.id === id ? { ...a, isRead: true } : a));
  saveAlertHistory(updated);
  return updated;
}

/**
 * Clears all alert history
 */
export function clearAlertHistory(): AlertHistoryItem[] {
  saveAlertHistory([]);
  return [];
}

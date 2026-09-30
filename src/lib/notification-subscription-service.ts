import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  NotificationSubscription,
  NotificationPreferencesInput,
} from "@/types/notification-subscription";

const PREFERENCES_STORAGE_KEY = "khelgrid_notification_preferences_v1";
const memoryStorage: Record<string, NotificationPreferencesInput> = {};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferencesInput = {
  userId: "user-arjun-mehta",
  fcmToken: "fcm_browser_web_client_token",
  preferredSports: ["Cricket", "Football"],
  city: "Bengaluru",
  notifyLiveTrials: true,
  notifyDeadlines: true,
  deviceType: "web",
};

/**
 * Loads current notification preferences from Supabase or local storage
 */
export async function getNotificationPreferences(
  fcmToken: string,
  userId?: string | null
): Promise<{
  preferences: NotificationPreferencesInput;
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let cached = DEFAULT_NOTIFICATION_PREFERENCES;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        cached = { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
  }

  const memKey = fcmToken || userId || "default";
  if (memoryStorage[memKey]) {
    cached = { ...cached, ...memoryStorage[memKey] };
  }

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("notification_subscriptions").select("*");

      if (userId) {
        query = query.eq("user_id", userId);
      } else if (fcmToken) {
        query = query.eq("fcm_token", fcmToken);
      }

      const { data, error } = await query.order("updated_at", { ascending: false }).limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        isSupabaseLive = true;
        const loaded: NotificationPreferencesInput = {
          userId: row.user_id,
          fcmToken: row.fcm_token,
          preferredSports: row.preferred_sports || (row.sport ? [row.sport] : ["Cricket"]),
          city: row.city || "Bengaluru",
          notifyLiveTrials: row.notify_live_trials ?? row.notify_new_trials ?? true,
          notifyDeadlines: row.notify_deadlines ?? true,
          deviceType: row.device_type || "web",
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(loaded));
        }
        return { preferences: loaded, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Failed fetching preferences from Supabase:", err);
    }
  }

  return { preferences: cached, isSupabaseLive };
}

/**
 * Saves notification preferences to the notification_subscriptions table in Supabase.
 * Stores user_id, fcm_token, preferred_sports (array), and city (string).
 */
export async function saveNotificationPreferences(
  prefs: NotificationPreferencesInput
): Promise<{
  success: boolean;
  subscription?: NotificationSubscription;
  isSupabaseLive: boolean;
  error?: string;
}> {
  let isSupabaseLive = false;
  let subResult: NotificationSubscription = {
    id: `sub-${Date.now()}`,
    user_id: prefs.userId || null,
    fcm_token: prefs.fcmToken,
    preferred_sports: prefs.preferredSports,
    city: prefs.city,
    notify_live_trials: prefs.notifyLiveTrials,
    notify_deadlines: prefs.notifyDeadlines,
    device_type: prefs.deviceType || "web",
    is_active: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    syncedToDb: false,
  };

  if (isSupabaseConfigured) {
    try {
      const payload = {
        user_id: prefs.userId || null,
        fcm_token: prefs.fcmToken,
        preferred_sports: prefs.preferredSports,
        city: prefs.city,
        notify_live_trials: prefs.notifyLiveTrials,
        notify_deadlines: prefs.notifyDeadlines,
        device_type: prefs.deviceType || "web",
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notification_subscriptions")
        .upsert(payload, { onConflict: "fcm_token" })
        .select()
        .single();

      if (!error && data) {
        subResult = {
          ...subResult,
          id: data.id,
          syncedToDb: true,
        };
        isSupabaseLive = true;
      } else if (error) {
        // Retry with insert if upsert conflict differs
        const { data: insertData, error: insertErr } = await supabase
          .from("notification_subscriptions")
          .insert(payload)
          .select()
          .single();

        if (!insertErr && insertData) {
          subResult = {
            ...subResult,
            id: insertData.id,
            syncedToDb: true,
          };
          isSupabaseLive = true;
        } else {
          console.warn("Supabase upsert/insert warning:", error.message);
        }
      }
    } catch (err: any) {
      console.warn("Supabase save preferences failed, caching locally:", err.message);
    }
  }

  // Always cache locally for immediate UI reactivity
  const memKey = prefs.fcmToken || prefs.userId || "default";
  memoryStorage[memKey] = { ...prefs };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    subscription: subResult,
    isSupabaseLive,
  };
}

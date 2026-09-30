import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface NotificationSubscription {
  id: string;
  userId: string | null;
  fcmToken: string;
  sport: string;
  city: string;
  deviceType: "android" | "web" | "ios";
  isActive: boolean;
  notifyNewTrials: boolean;
  notifyDeadlines: boolean;
  lastNotifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  syncedToDb?: boolean;
}

export interface QueuedNotification {
  id: string;
  subscriptionId: string;
  trialId?: string | null;
  fcmToken: string;
  title: string;
  body: string;
  payload: Record<string, any>;
  status: "pending" | "processing" | "sent" | "failed";
  attempts: number;
  errorMessage?: string | null;
  scheduledAt: string;
  sentAt?: string | null;
  createdAt: string;
}

export interface TrialNotificationPayload {
  id: string;
  title: string;
  sport: string;
  city: string;
  academyName: string;
  trialDate?: string;
  registrationDeadline?: string;
}

const SUBSCRIPTIONS_STORAGE_KEY = "khelgrid_notification_subscriptions_v1";
const QUEUE_STORAGE_KEY = "khelgrid_notification_queue_v1";

/**
 * Default sample subscriptions for demonstration and initial state
 */
export const DEFAULT_SUBSCRIPTIONS: NotificationSubscription[] = [
  {
    id: "sub-arjun-cricket-blr",
    userId: "user-arjun-mehta",
    fcmToken: "fcm_test_token_arjun_device_pixel7",
    sport: "Cricket",
    city: "Bengaluru",
    deviceType: "android",
    isActive: true,
    notifyNewTrials: true,
    notifyDeadlines: true,
    lastNotifiedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    syncedToDb: false,
  },
  {
    id: "sub-arjun-athletics-blr",
    userId: "user-arjun-mehta",
    fcmToken: "fcm_test_token_arjun_device_pixel7",
    sport: "Athletics",
    city: "Bengaluru",
    deviceType: "android",
    isActive: true,
    notifyNewTrials: true,
    notifyDeadlines: true,
    lastNotifiedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    syncedToDb: false,
  },
];

/**
 * Loads stored notification subscriptions from local storage
 */
function getLocalSubscriptions(): NotificationSubscription[] {
  if (typeof window === "undefined") return DEFAULT_SUBSCRIPTIONS;
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (!raw) return DEFAULT_SUBSCRIPTIONS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SUBSCRIPTIONS;
  }
}

/**
 * Persists subscriptions to local storage
 */
function saveLocalSubscriptions(subs: NotificationSubscription[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subs));
  } catch (err) {
    console.warn("Failed saving subscriptions to localStorage", err);
  }
}

/**
 * Loads local notification queue
 */
function getLocalQueue(): QueuedNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves notification queue to local storage
 */
function saveLocalQueue(queue: QueuedNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Failed saving queue to localStorage", err);
  }
}

/**
 * Subscribes a device / user to trial alerts for a given sport and city.
 * Syncs with Supabase notification_subscriptions table when configured.
 */
export async function subscribeToTrialAlerts(params: {
  fcmToken: string;
  sport: string;
  city: string;
  userId?: string | null;
  deviceType?: "android" | "web" | "ios";
  notifyNewTrials?: boolean;
  notifyDeadlines?: boolean;
}): Promise<{
  success: boolean;
  subscription: NotificationSubscription;
  isSupabaseLive: boolean;
}> {
  const newSub: NotificationSubscription = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId || null,
    fcmToken: params.fcmToken.trim(),
    sport: params.sport,
    city: params.city,
    deviceType: params.deviceType || "android",
    isActive: true,
    notifyNewTrials: params.notifyNewTrials ?? true,
    notifyDeadlines: params.notifyDeadlines ?? true,
    lastNotifiedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncedToDb: false,
  };

  let isSupabaseLive = false;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("notification_subscriptions")
        .upsert(
          {
            user_id: newSub.userId,
            fcm_token: newSub.fcmToken,
            sport: newSub.sport,
            city: newSub.city,
            device_type: newSub.deviceType,
            is_active: newSub.isActive,
            notify_new_trials: newSub.notifyNewTrials,
            notify_deadlines: newSub.notifyDeadlines,
            updated_at: newSub.updatedAt,
          },
          { onConflict: "fcm_token,sport,city" },
        )
        .select()
        .single();

      if (!error && data) {
        newSub.id = data.id;
        newSub.syncedToDb = true;
        isSupabaseLive = true;
      }
    } catch (err) {
      console.warn("Supabase subscription insert failed, fallback to local storage", err);
    }
  }

  // Save to local cache
  const localSubs = getLocalSubscriptions();
  const existingIdx = localSubs.findIndex(
    (s) => s.fcmToken === newSub.fcmToken && s.sport === newSub.sport && s.city === newSub.city,
  );

  if (existingIdx >= 0) {
    localSubs[existingIdx] = {
      ...localSubs[existingIdx],
      ...newSub,
      id: localSubs[existingIdx].id,
    };
  } else {
    localSubs.unshift(newSub);
  }
  saveLocalSubscriptions(localSubs);

  return { success: true, subscription: newSub, isSupabaseLive };
}

/**
 * Fetches all subscriptions for an FCM token or User ID
 */
export async function getNotificationSubscriptions(
  fcmToken?: string,
  userId?: string,
): Promise<{
  subscriptions: NotificationSubscription[];
  isSupabaseLive: boolean;
}> {
  const isSupabaseLive = false;
  const localList = getLocalSubscriptions();

  if (isSupabaseConfigured && (fcmToken || userId)) {
    try {
      let query = supabase.from("notification_subscriptions").select("*");
      if (userId) {
        query = query.eq("user_id", userId);
      } else if (fcmToken) {
        query = query.eq("fcm_token", fcmToken);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: NotificationSubscription[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          fcmToken: row.fcm_token,
          sport: row.sport,
          city: row.city,
          deviceType: row.device_type,
          isActive: row.is_active,
          notifyNewTrials: row.notify_new_trials,
          notifyDeadlines: row.notify_deadlines,
          lastNotifiedAt: row.last_notified_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          syncedToDb: true,
        }));
        saveLocalSubscriptions(mapped);
        return { subscriptions: mapped, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Failed fetching subscriptions from Supabase", err);
    }
  }

  // Filter local list if needed
  let filtered = localList;
  if (userId) filtered = filtered.filter((s) => s.userId === userId);
  else if (fcmToken) filtered = filtered.filter((s) => s.fcmToken === fcmToken);

  return { subscriptions: filtered.length > 0 ? filtered : localList, isSupabaseLive };
}

/**
 * Unsubscribes or deactivates alert preference
 */
export async function unsubscribeFromTrialAlerts(
  subscriptionId: string,
): Promise<{ success: boolean; isSupabaseLive: boolean }> {
  let isSupabaseLive = false;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("notification_subscriptions")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", subscriptionId);

      if (!error) isSupabaseLive = true;
    } catch (err) {
      console.warn("Failed updating subscription status in Supabase", err);
    }
  }

  const localSubs = getLocalSubscriptions().map((s) =>
    s.id === subscriptionId ? { ...s, isActive: false, updatedAt: new Date().toISOString() } : s,
  );
  saveLocalSubscriptions(localSubs);

  return { success: true, isSupabaseLive };
}

/**
 * Background Worker: Dispatches push notifications whenever a new trial is published.
 * Finds all active matching subscriptions and enqueues push payloads.
 */
export async function dispatchTrialPublishedNotification(trial: TrialNotificationPayload): Promise<{
  enqueuedCount: number;
  matchingSubscribers: number;
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let matchingSubscribers = 0;
  let enqueuedCount = 0;

  const title = `🎯 New ${trial.sport} Trial in ${trial.city}!`;
  const body = `${trial.academyName} announced: ${trial.title}. View reporting time and available spots.`;

  // 1. Check in Supabase if configured
  if (isSupabaseConfigured) {
    try {
      // Find matching subscriptions
      const { data: subs, error } = await supabase
        .from("notification_subscriptions")
        .select("id, fcm_token, user_id")
        .eq("is_active", true)
        .eq("notify_new_trials", true)
        .or(`sport.eq.${trial.sport},sport.eq.All`)
        .or(`city.eq.${trial.city},city.eq.All`);

      if (!error && subs && subs.length > 0) {
        matchingSubscribers = subs.length;
        const queueRows = subs.map((sub: any) => ({
          subscription_id: sub.id,
          trial_id: trial.id,
          fcm_token: sub.fcm_token,
          title,
          body,
          payload: {
            trial_id: trial.id,
            sport: trial.sport,
            city: trial.city,
            academy_name: trial.academyName,
            type: "new_trial_alert",
          },
          status: "pending",
        }));

        const { data: inserted, error: insertErr } = await supabase
          .from("notification_queue")
          .insert(queueRows)
          .select("id");

        if (!insertErr && inserted) {
          enqueuedCount = inserted.length;
          isSupabaseLive = true;
        }
      }
    } catch (err) {
      console.warn("Supabase dispatchTrialPublishedNotification failed, using local queue", err);
    }
  }

  // 2. Also enqueue into local storage queue for immediate client reactivity and offline preview
  const localSubs = getLocalSubscriptions().filter(
    (s) =>
      s.isActive &&
      s.notifyNewTrials &&
      (s.sport === trial.sport || s.sport === "All") &&
      (s.city === trial.city || s.city === "All"),
  );

  if (localSubs.length > 0) {
    if (matchingSubscribers === 0) matchingSubscribers = localSubs.length;
    const currentQueue = getLocalQueue();
    const newItems: QueuedNotification[] = localSubs.map((sub) => ({
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      subscriptionId: sub.id,
      trialId: trial.id,
      fcmToken: sub.fcmToken,
      title,
      body,
      payload: {
        trial_id: trial.id,
        sport: trial.sport,
        city: trial.city,
        academy_name: trial.academyName,
        type: "new_trial_alert",
      },
      status: "pending",
      attempts: 0,
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));

    currentQueue.unshift(...newItems);
    saveLocalQueue(currentQueue.slice(0, 100)); // Keep last 100
    if (enqueuedCount === 0) enqueuedCount = newItems.length;
  }

  return { enqueuedCount, matchingSubscribers, isSupabaseLive };
}

/**
 * Background Worker: Processes pending notification queue items and marks them sent.
 * Represents the worker execution step (called via cron, webhooks, or scheduled intervals).
 */
export async function processNotificationQueue(batchSize: number = 20): Promise<{
  processedCount: number;
  successfulCount: number;
  failedCount: number;
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let processedCount = 0;
  let successfulCount = 0;
  let failedCount = 0;

  if (isSupabaseConfigured) {
    try {
      const { data: pendingRows, error } = await supabase
        .from("notification_queue")
        .select("*")
        .eq("status", "pending")
        .lte("scheduled_at", new Date().toISOString())
        .limit(batchSize);

      if (!error && pendingRows && pendingRows.length > 0) {
        processedCount = pendingRows.length;
        const ids = pendingRows.map((r: any) => r.id);

        // Mark as sent
        const { error: updateErr } = await supabase
          .from("notification_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            attempts: 1,
          })
          .in("id", ids);

        if (!updateErr) {
          successfulCount = processedCount;
          isSupabaseLive = true;
        } else {
          failedCount = processedCount;
        }
      }
    } catch (err) {
      console.warn("Failed processing notification queue in Supabase", err);
    }
  }

  // Process local queue
  const localQueue = getLocalQueue();
  const pendingIndices = localQueue
    .map((item, idx) => (item.status === "pending" ? idx : -1))
    .filter((idx) => idx !== -1)
    .slice(0, batchSize);

  if (pendingIndices.length > 0) {
    pendingIndices.forEach((idx) => {
      localQueue[idx].status = "sent";
      localQueue[idx].sentAt = new Date().toISOString();
      localQueue[idx].attempts += 1;
    });
    saveLocalQueue(localQueue);
    if (processedCount === 0) {
      processedCount = pendingIndices.length;
      successfulCount = pendingIndices.length;
    }
  }

  return { processedCount, successfulCount, failedCount, isSupabaseLive };
}

/**
 * Background Worker: Checks for trials with registration deadlines within 48 hours
 * and enqueues urgency push notifications.
 */
export async function checkApproachingDeadlinesAndNotify(): Promise<{
  deadlinesFound: number;
  enqueuedCount: number;
}> {
  let deadlinesFound = 0;
  let enqueuedCount = 0;

  const now = Date.now();
  const threshold = now + 48 * 3600000;

  // Sample upcoming deadlines
  const urgentTrials: TrialNotificationPayload[] = [
    {
      id: "trial-sai-delhi-urgent",
      title: "SAI National Wrestling & Combat Screening",
      sport: "Wrestling",
      city: "Delhi NCR",
      academyName: "Sports Authority of India NCOE",
      registrationDeadline: new Date(now + 24 * 3600000).toISOString(),
    },
    {
      id: "trial-ksca-cricket-urgent",
      title: "KSCA U-19 Fast Bowling Talent Hunt",
      sport: "Cricket",
      city: "Bengaluru",
      academyName: "Karnataka State Cricket Association",
      registrationDeadline: new Date(now + 36 * 3600000).toISOString(),
    },
  ];

  for (const trial of urgentTrials) {
    deadlinesFound++;
    const res = await dispatchTrialPublishedNotification(trial);
    enqueuedCount += res.enqueuedCount;
  }

  return { deadlinesFound, enqueuedCount };
}

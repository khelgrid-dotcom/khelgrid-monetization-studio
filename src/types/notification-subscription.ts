/**
 * TypeScript interfaces for the notification_subscriptions table in Supabase.
 * Includes user_id, fcm_token, preferred_sports (array), and city (string).
 */

export interface NotificationSubscription {
  id: string;
  user_id: string | null;
  fcm_token: string;
  preferred_sports: string[];
  city: string;
  notify_live_trials: boolean;
  notify_deadlines: boolean;
  device_type?: "web" | "android" | "ios";
  is_active?: boolean;
  last_notified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  syncedToDb?: boolean;
}

/**
 * CamelCase alias for React component ergonomics
 */
export interface NotificationSubscriptionCamel {
  id: string;
  userId: string | null;
  fcmToken: string;
  preferredSports: string[];
  city: string;
  notifyLiveTrials: boolean;
  notifyDeadlines: boolean;
  deviceType?: "web" | "android" | "ios";
  isActive?: boolean;
  lastNotifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  syncedToDb?: boolean;
}

/**
 * Payload submitted when updating or saving notification preferences
 */
export interface NotificationPreferencesInput {
  userId?: string | null;
  fcmToken: string;
  preferredSports: string[];
  city: string;
  notifyLiveTrials: boolean;
  notifyDeadlines: boolean;
  deviceType?: "web" | "android" | "ios";
}

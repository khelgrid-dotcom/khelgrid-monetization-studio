import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { NotificationPreferences } from "./NotificationPreferences";
import {
  saveNotificationPreferences,
  getNotificationPreferences,
} from "@/lib/notification-subscription-service";
import type {
  NotificationSubscription,
  NotificationPreferencesInput,
} from "@/types/notification-subscription";

// Mock router and auth
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-test-athlete",
      name: "Arjun Mehta",
      city: "Bengaluru",
      primarySport: "Cricket",
    },
  }),
}));

describe("NotificationPreferences Component & TypeScript Interface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("verifies TypeScript interface for notification_subscriptions table matches required fields", () => {
    const mockSubscription: NotificationSubscription = {
      id: "sub-test-uuid-1",
      user_id: "user-123",
      fcm_token: "fcm_test_token_sample",
      preferred_sports: ["Cricket", "Football", "Athletics"],
      city: "Bengaluru",
      notify_live_trials: true,
      notify_deadlines: true,
      device_type: "web",
      is_active: true,
    };

    expect(mockSubscription.user_id).toBe("user-123");
    expect(mockSubscription.fcm_token).toBe("fcm_test_token_sample");
    expect(Array.isArray(mockSubscription.preferred_sports)).toBe(true);
    expect(mockSubscription.preferred_sports).toContain("Cricket");
    expect(mockSubscription.city).toBe("Bengaluru");
  });

  it("renders NotificationPreferences component with alert categories, city input, and sports selection", () => {
    const html = renderToString(
      <NotificationPreferences initialCity="Bengaluru" initialSports={["Cricket", "Badminton"]} />,
    );

    // Card and title
    expect(html).toContain("Notification Preferences");
    expect(html).toContain('id="notification-preferences-card"');

    // Alert categories toggles
    expect(html).toContain("Alert Categories");
    expect(html).toContain("Live Trials");
    expect(html).toContain("Deadlines");
    expect(html).toContain('id="switch-notify-live-trials"');
    expect(html).toContain('id="switch-notify-deadlines"');

    // City input
    expect(html).toContain('id="input-notification-city"');
    expect(html).toContain("Bengaluru");

    // Preferred sports selection
    expect(html).toContain("Preferred Sports");
    expect(html).toContain("Cricket");
    expect(html).toContain("Badminton");

    // Save and test buttons
    expect(html).toContain('id="btn-save-notification-preferences"');
    expect(html).toContain("Save Preferences");
    expect(html).toContain("Send Test Push Alert");
  });

  it("saves preferences via notification-subscription-service", async () => {
    const payload: NotificationPreferencesInput = {
      userId: "user-test-athlete",
      fcmToken: "fcm_unit_test_token",
      preferredSports: ["Football", "Tennis"],
      city: "Mumbai",
      notifyLiveTrials: true,
      notifyDeadlines: false,
      deviceType: "web",
    };

    const res = await saveNotificationPreferences(payload);
    expect(res.success).toBe(true);
    expect(res.subscription).toBeDefined();
    expect(res.subscription?.city).toBe("Mumbai");
    expect(res.subscription?.preferred_sports).toEqual(["Football", "Tennis"]);
    expect(res.subscription?.notify_live_trials).toBe(true);
    expect(res.subscription?.notify_deadlines).toBe(false);

    const fetched = await getNotificationPreferences("fcm_unit_test_token", "user-test-athlete");
    expect(fetched.preferences.city).toBe("Mumbai");
    expect(fetched.preferences.preferredSports).toContain("Football");
  });
});

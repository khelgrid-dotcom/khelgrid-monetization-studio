import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  subscribeToTrialAlerts,
  getNotificationSubscriptions,
  unsubscribeFromTrialAlerts,
  dispatchTrialPublishedNotification,
  checkApproachingDeadlinesAndNotify,
  processNotificationQueue,
  DEFAULT_SUBSCRIPTIONS,
} from "./notification-worker-service";

describe("Notification Worker Service & Push Subscriptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("exports default subscriptions with valid sport and city attributes", () => {
    expect(DEFAULT_SUBSCRIPTIONS.length).toBeGreaterThan(0);
    expect(DEFAULT_SUBSCRIPTIONS[0].sport).toBe("Cricket");
    expect(DEFAULT_SUBSCRIPTIONS[0].city).toBe("Bengaluru");
    expect(DEFAULT_SUBSCRIPTIONS[0].fcmToken).toBeDefined();
    expect(DEFAULT_SUBSCRIPTIONS[0].isActive).toBe(true);
  });

  it("subscribes a device to trial alerts with sport and city targeting", async () => {
    const res = await subscribeToTrialAlerts({
      fcmToken: "fcm_test_device_token_badminton_123",
      sport: "Badminton",
      city: "Hyderabad",
      userId: "user-test-athlete",
      deviceType: "android",
    });

    expect(res.success).toBe(true);
    expect(res.subscription.sport).toBe("Badminton");
    expect(res.subscription.city).toBe("Hyderabad");
    expect(res.subscription.isActive).toBe(true);

    const { subscriptions } = await getNotificationSubscriptions(
      "fcm_test_device_token_badminton_123",
    );
    expect(subscriptions.some((s) => s.sport === "Badminton")).toBe(true);
  });

  it("dispatches push notification to matching athletes when a new trial is published", async () => {
    // 1. Subscribe athlete to Athletics in Bengaluru
    await subscribeToTrialAlerts({
      fcmToken: "fcm_token_sprinter_blr",
      sport: "Athletics",
      city: "Bengaluru",
      deviceType: "android",
    });

    // 2. Publish new Athletics trial in Bengaluru
    const dispatchRes = await dispatchTrialPublishedNotification({
      id: "trial-blr-athletics-selection",
      title: "Karnataka State Athletics 100m/200m Sprint Screening",
      sport: "Athletics",
      city: "Bengaluru",
      academyName: "Kanteerava Stadium Track Academy",
      trialDate: "2026-10-10",
    });

    expect(dispatchRes.matchingSubscribers).toBeGreaterThanOrEqual(1);
    expect(dispatchRes.enqueuedCount).toBeGreaterThanOrEqual(1);
  });

  it("scans upcoming deadlines within 48h and enqueues urgency alerts", async () => {
    const deadlineRes = await checkApproachingDeadlinesAndNotify();
    expect(deadlineRes.deadlinesFound).toBeGreaterThan(0);
    expect(typeof deadlineRes.enqueuedCount).toBe("number");
  });

  it("processes pending notification queue in batches", async () => {
    const workerRes = await processNotificationQueue(10);
    expect(workerRes.processedCount).toBeGreaterThanOrEqual(0);
    expect(workerRes.successfulCount).toBeGreaterThanOrEqual(0);
  });

  it("unsubscribes and deactivates an alert subscription", async () => {
    const res = await subscribeToTrialAlerts({
      fcmToken: "fcm_token_to_remove",
      sport: "Football",
      city: "Mumbai",
    });

    const unsubRes = await unsubscribeFromTrialAlerts(res.subscription.id);
    expect(unsubRes.success).toBe(true);
  });
});

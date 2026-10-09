import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { NotificationsDashboardTab } from "./NotificationsDashboardTab";
import {
  getAlertHistory,
  addAlertToHistory,
  markAllAlertsAsRead,
  clearAlertHistory,
  DEFAULT_ALERT_HISTORY,
} from "@/lib/alert-history-service";

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

describe("NotificationsDashboardTab Component & Alert History Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("exports default alert history with both Live Trials and Deadlines alerts", () => {
    expect(DEFAULT_ALERT_HISTORY.length).toBeGreaterThan(0);
    const liveTrialAlerts = DEFAULT_ALERT_HISTORY.filter((a) => a.category === "live_trials");
    const deadlineAlerts = DEFAULT_ALERT_HISTORY.filter((a) => a.category === "deadlines");

    expect(liveTrialAlerts.length).toBeGreaterThan(0);
    expect(deadlineAlerts.length).toBeGreaterThan(0);
    expect(liveTrialAlerts[0].title).toContain("Trial");
    expect(deadlineAlerts[0].title).toContain("Deadline");
  });

  it("renders NotificationsDashboardTab component with real-time alert categories manager and history feed", () => {
    const html = renderToString(<NotificationsDashboardTab />);

    // Header & Real-time status
    expect(html).toContain("Alerts &amp; Notifications Center");
    expect(html).toContain("Real-Time Sync Active");

    // Manage Alert Categories Card
    expect(html).toContain('id="card-alert-categories-manager"');
    expect(html).toContain("Manage Alert Categories (Real-Time)");
    expect(html).toContain("Live Trials Alerts");
    expect(html).toContain("Deadlines Urgency Alerts");
    expect(html).toContain('id="switch-dashboard-live-trials"');
    expect(html).toContain('id="switch-dashboard-deadlines"');

    // Alert History Feed
    expect(html).toContain('id="section-alert-history-feed"');
    expect(html).toContain("History of Alerts Received");
    expect(html).toContain("BCCI State U-19 Screening Camp");
  });

  it("adds a new alert to history and retrieves it", async () => {
    const newAlert = addAlertToHistory({
      category: "live_trials",
      title: "🎯 New Badminton Selection Trial in Bengaluru",
      message: "Karnataka Badminton Association open trials announced.",
      sport: "Badminton",
      city: "Bengaluru",
      isRead: false,
    });

    expect(newAlert.id).toBeDefined();
    expect(newAlert.title).toContain("Badminton Selection Trial");

    const { alerts } = await getAlertHistory("user-test-athlete");
    expect(alerts.some((a) => a.title.includes("Badminton Selection Trial"))).toBe(true);
  });

  it("marks all alerts as read", () => {
    const updated = markAllAlertsAsRead();
    expect(updated.every((a) => a.isRead === true)).toBe(true);
  });

  it("clears alert history", () => {
    const cleared = clearAlertHistory();
    expect(cleared.length).toBe(0);
  });
});

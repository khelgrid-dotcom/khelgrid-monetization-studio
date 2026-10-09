import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TrialNewsletterSignup,
  getStoredSubscriptions,
  saveSubscription,
} from "@/components/TrialNewsletterSignup";

describe("TrialNewsletterSignup Component & Persistence", () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (key: string) => mockStore[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
      length: 0,
      key: () => null,
    };
  });

  it("renders correctly with custom sport and city alert titles", () => {
    const html = renderToString(
      <TrialNewsletterSignup
        defaultSport="Athletics"
        defaultCity="Namchi"
        title="Get Automatic Alerts for Athletics Trials in Namchi"
      />,
    );

    expect(html).toContain("Get Automatic Alerts for Athletics Trials in Namchi");
    expect(html).toContain("Automatic Trial Notifications");
    expect(html).toContain("Your Email Address");
    expect(html).toContain("Get Automatic Trial Alerts");
  });

  it("renders compact mode correctly", () => {
    const html = renderToString(<TrialNewsletterSignup variant="compact" />);
    expect(html).toContain("Enter your email for trial alerts");
    expect(html).toContain("Notify Me");
  });

  it("saves and retrieves newsletter subscriptions from storage", () => {
    const sub = {
      email: "athlete@gmail.com",
      sport: "Wrestling",
      city: "Mumbai",
      subscribedAt: new Date().toISOString(),
    };

    saveSubscription(sub);
    const stored = getStoredSubscriptions();
    expect(stored.length).toBe(1);
    expect(stored[0].email).toBe("athlete@gmail.com");
    expect(stored[0].sport).toBe("Wrestling");
    expect(stored[0].city).toBe("Mumbai");
  });
});

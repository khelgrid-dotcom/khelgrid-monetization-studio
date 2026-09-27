import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { TrialSocialShare } from "@/components/TrialSocialShare";

describe("TrialSocialShare Component", () => {
  const mockTrial = {
    id: "t-fit-india-namchi-sikkim-2026",
    title: "Fit India School Games District Selection Trials (Namchi, Sikkim)",
    sport: "Athletics",
    city: "Namchi",
    date: "Sep 23 - Sep 28, 2026",
    fee: 0,
    academy: "Sports & Youth Affairs Department, Government of Sikkim",
  };

  it("renders social share buttons for WhatsApp, X (Twitter), Telegram, and Copy Link", () => {
    const html = renderToString(<TrialSocialShare trial={mockTrial} variant="banner" />);

    expect(html).toContain("Share this trial announcement");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Share"); // X (Twitter) label
    expect(html).toContain("Telegram");
    expect(html).toContain("Copy Link");
  });

  it("renders compact mode properly", () => {
    const html = renderToString(<TrialSocialShare trial={mockTrial} variant="compact" />);

    expect(html).toContain("WhatsApp");
    expect(html).toContain("Post"); // Compact X button
  });
});

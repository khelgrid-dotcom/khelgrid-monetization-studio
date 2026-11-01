import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MonetagLoader } from "./MonetagLoader";
import { MonetagBanner } from "./MonetagBanner";
import { monetagConfig } from "@/config/ads";

// Mock AdConsent context
vi.mock("./AdConsent", () => ({
  useAdConsent: () => ({
    canLoadScript: true,
    nonPersonalized: false,
    canServeAds: true,
  }),
}));

describe("MonetagLoader & MonetagBanner Components", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders MonetagLoader safely during server rendering without throwing", () => {
    const html = renderToString(<MonetagLoader />);
    expect(html).toBe("");
  });

  it("renders MonetagLoader with props during SSR cleanly", () => {
    const html = renderToString(
      <MonetagLoader zoneId="123456" scriptUrl="https://alwingulla.com/88/tag.min.js" />,
    );
    expect(html).toBe("");
  });

  it("renders MonetagBanner placeholder container during SSR to prevent layout shift", () => {
    const html = renderToString(
      <MonetagBanner zoneId="test-zone-123" minHeight={120} className="my-test-class" />,
    );

    expect(html).toContain("monetag-banner-container");
    expect(html).toContain("min-height:120px");
    expect(html).toContain("my-test-class");
  });

  it("provides valid verification token in monetagConfig", () => {
    expect(monetagConfig.verificationToken).toBe("6849cf6d9be2966239a31c15fef2755c");
  });
});

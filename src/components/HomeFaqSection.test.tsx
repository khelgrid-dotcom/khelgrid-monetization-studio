import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("HomeFaqSection", () => {
  it("renders FAQ section heading and initial questions via SSR", () => {
    const html = renderToString(<HomeFaqSection />);

    expect(html).toContain("Got questions? We have answers.");
    expect(html).toContain("Frequently Asked Questions");

    // Check first question is rendered
    expect(html).toContain(HOME_FAQ_ITEMS[0].question);
  });

  it("contains category tabs for monetization, platform, and verification", () => {
    const html = renderToString(<HomeFaqSection />);

    expect(html).toContain("All Questions");
    expect(html).toContain("Monetization &amp; Plans");
    expect(html).toContain("Platform &amp; CV");
    expect(html).toContain("Verification &amp; Safety");
  });

  it("contains accessible accordion structure and pricing callout", () => {
    const html = renderToString(<HomeFaqSection />);

    expect(html).toContain('id="faq-accordion-container"');
    expect(html).toContain("Explore Pricing Plans");
    expect(html).toContain("Trust Center");
  });
});

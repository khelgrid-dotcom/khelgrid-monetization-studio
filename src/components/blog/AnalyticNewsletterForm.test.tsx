import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AnalyticNewsletterForm } from "./AnalyticNewsletterForm";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe("AnalyticNewsletterForm", () => {
  it("renders the newsletter form with monetization and scouting value props", () => {
    const html = renderToString(
      <AnalyticNewsletterForm
        postSlug="asian-games-2026-live-updates-september-23-india-medal-tally-analysis"
        postTitle="Asian Games 2026 Day 5 Live Analysis"
      />,
    );

    // Section and header
    expect(html).toContain('id="scouting-analytics-newsletter"');
    expect(html).toContain("Get Match Analytics &amp; VIP Monetization Access");
    expect(html).toContain("Monetization &amp; Scouting Intelligence");

    // Inputs
    expect(html).toContain("Full Name / Athlete Name");
    expect(html).toContain("Email Address");
    expect(html).toContain("WhatsApp / Phone");
    expect(html).toContain("Your Primary Role");
    expect(html).toContain("Primary Sport");

    // Monetization services checkboxes
    expect(html).toContain("KhelGrid Pro Athlete");
    expect(html).toContain("Academy Trial Boost");
    expect(html).toContain("VIP Scout Combine Alerts");

    // CTA Button
    expect(html).toContain("Subscribe &amp; Claim 20% Voucher");
  });
});

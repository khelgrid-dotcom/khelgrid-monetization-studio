import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { TournamentFAQ } from "./TournamentFAQ";

describe("TournamentFAQ Component", () => {
  it("renders the FAQ section title and subtitle", () => {
    const html = renderToString(<TournamentFAQ />);
    expect(html).toContain("Tournament Registration &amp; Eligibility FAQs");
    expect(html).toContain("Tournament Knowledge Base");
  });

  it("renders category filters and questions", () => {
    const html = renderToString(<TournamentFAQ />);
    expect(html).toContain("All Questions");
    expect(html).toContain("Registration &amp; Teams");
    expect(html).toContain("Eligibility &amp; ID Verification");
    expect(html).toContain("Match Rules &amp; Kits");
    expect(html).toContain("Prizes &amp; Refunds");
    expect(html).toContain("Who is eligible to participate in KhelGrid tournaments?");
    expect(html).toContain("Can I register as an individual / solo player without a team?");
  });

  it("renders schema.org FAQPage json-ld microdata", () => {
    const html = renderToString(<TournamentFAQ />);
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"Question"');
  });

  it("renders direct contact support details", () => {
    const html = renderToString(<TournamentFAQ />);
    expect(html).toContain("tournaments@khelgrid.com");
    expect(html).toContain("Still have questions regarding brackets or eligibility?");
  });
});

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

import { WorkplacePolicy } from "./WorkplacePolicy";
import { WORKPLACE_POLICY_SECTIONS, WORKPLACE_PRINCIPLE } from "@/config/workplace-policy";

describe("WorkplacePolicy Component (Accessibility & Content)", () => {
  it("renders all 10 policy sections with accessible semantic landmarks", () => {
    const html = renderToString(<WorkplacePolicy />);

    expect(html).toContain("KhelGrid – Workplace Policy");
    expect(html).toContain(WORKPLACE_PRINCIPLE);
    expect(WORKPLACE_POLICY_SECTIONS).toHaveLength(10);

    for (const section of WORKPLACE_POLICY_SECTIONS) {
      expect(html).toContain(section.title);
      expect(html).toContain(`id="${section.id}"`);
      expect(html).toContain(`id="sec-heading-${section.id}"`);
    }

    // Accessibility landmarks
    expect(html).toContain("<article");
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('aria-label="Core Guiding Principle"');
    expect(html).toContain('aria-label="Policy Clauses"');
    expect(html).toContain('aria-labelledby="workplace-policy-heading"');
  });

  it("supports hiding breadcrumbs, share card, or related links when configured via props", () => {
    const html = renderToString(
      <WorkplacePolicy showBreadcrumbs={false} showShareCard={false} showRelatedLinks={false} />,
    );

    expect(html).not.toContain('aria-label="Breadcrumb"');
    expect(html).not.toContain('aria-label="LinkedIn policy link card"');
    expect(html).not.toContain('aria-label="Related Compliance Policies"');
    expect(html).toContain("KhelGrid – Workplace Policy");
  });
});

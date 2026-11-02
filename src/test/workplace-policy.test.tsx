import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    options: config,
    component: config.component,
    head: config.head,
  }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

import WorkplacePolicyPage, { Route } from "@/routes/workplace-policy";

describe("Workplace Policy Page (/workplace-policy)", () => {
  it("renders the page and core principle", () => {
    const html = renderToString(<WorkplacePolicyPage />);

    expect(html).toContain("KhelGrid – Workplace Policy");
    expect(html).toContain("Building a better sports ecosystem starts with building a better workplace");
    expect(html).toContain("Equal Opportunity and Inclusion");
    expect(html).toContain("Respectful Workplace");
    expect(html).toContain("Flexible and Remote Working");
    expect(html).toContain("Professional Ethics");
    expect(html).toContain("Data Privacy and Confidentiality");
    expect(html).toContain("Learning and Development");
    expect(html).toContain("Health and Safety");
    expect(html).toContain("Prevention of Sexual Harassment (POSH)");
    expect(html).toContain("Responsible Use of Technology");
    expect(html).toContain("Our Commitment");
  });

  it("contains official contact details and canonical URL for LinkedIn", () => {
    const html = renderToString(<WorkplacePolicyPage />);

    expect(html).toContain("khelgrid@gmail.com");
    expect(html).toContain("https://khelgrid.com");
    expect(html).toContain("https://khelgrid.com/workplace-policy");
  });

  it("provides valid SEO head configuration", () => {
    const headFn = (Route as any).options?.head || (Route as any).head;
    expect(headFn).toBeDefined();
    const headConfig = headFn({} as any);
    expect(headConfig).toBeDefined();
    const title = headConfig?.meta?.find(
      (m: any) => m.title || m.name === "title" || m.property === "og:title",
    );
    expect(title).toBeDefined();
  });
});

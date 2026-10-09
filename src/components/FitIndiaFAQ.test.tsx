import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { FitIndiaFAQ, FIT_INDIA_FAQS } from "@/components/FitIndiaFAQ";

describe("FitIndiaFAQ Component & FAQ Knowledge Base", () => {
  it("contains all core FAQ questions covering eligibility, documents, venues, and pathway", () => {
    expect(FIT_INDIA_FAQS.length).toBeGreaterThanOrEqual(8);

    const eligibilityFaq = FIT_INDIA_FAQS.find((f) => f.category === "Eligibility");
    expect(eligibilityFaq).toBeDefined();
    expect(eligibilityFaq?.question).toContain("eligible");
    expect(eligibilityFaq?.answer).toContain("Under-17");
    expect(eligibilityFaq?.answer).toContain("Namchi");

    const documentsFaq = FIT_INDIA_FAQS.find((f) => f.id === "mandatory-documents");
    expect(documentsFaq).toBeDefined();
    expect(documentsFaq?.category).toBe("Documents");
    expect(documentsFaq?.answer).toContain("Bonafide");
    expect(documentsFaq?.answer).toContain("Birth Certificate");
    expect(documentsFaq?.answer).toContain("Medical fitness");

    const venueFaq = FIT_INDIA_FAQS.find((f) => f.id === "venues-and-hubs");
    expect(venueFaq).toBeDefined();
    expect(venueFaq?.answer).toContain("Bhaichung Stadium");
    expect(venueFaq?.answer).toContain("Boxing Hall Car Plaza");

    const pathwayFaq = FIT_INDIA_FAQS.find((f) => f.id === "selection-pathway-gangtok");
    expect(pathwayFaq).toBeDefined();
    expect(pathwayFaq?.answer).toContain("Gangtok");
  });

  it("renders correctly to HTML string with interactive accordion structure", () => {
    const html = renderToString(
      <FitIndiaFAQ sourceUrl="https://www.sikkim.gov.in/media/news-announcement/news-info?name=District-Level+Competition+cum+Selection+Trials+for+Fit+India+School+Games+2026+Held+in+Namchi" />,
    );

    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain("Fit India School Games");
    expect(html).toContain("Who is eligible to participate");
    expect(html).toContain("What documents must student-athletes present");
    expect(html).toContain("Where are the selection trials conducted across Namchi");
    expect(html).toContain("Official Portal Circular");
    expect(html).toContain("District: Namchi");
  });
});

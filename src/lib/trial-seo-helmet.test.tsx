import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { buildSeoHead } from "@/lib/seo";
import { TRIALS } from "@/data/trials";

describe("Official Selection Trial SEO & React Helmet Integration", () => {
  const saiTrial = TRIALS.find((t) => t.id === "t-sai-wrestling-mumbai-2026")!;

  it("builds comprehensive Open Graph, Twitter, and canonical meta tags via buildSeoHead", () => {
    expect(saiTrial).toBeDefined();

    const seoResult = buildSeoHead({
      title: `${saiTrial.title} · ${saiTrial.sport} Trial in ${saiTrial.city}`,
      description: `${saiTrial.title} hosted by ${saiTrial.academy} in ${saiTrial.city}.`,
      canonicalPath: `/trial/${saiTrial.id}`,
      keywords: `${saiTrial.title}, ${saiTrial.sport} trial ${saiTrial.city}`,
      type: "website",
      image: "https://khelgrid.com/og-image.png",
      author: saiTrial.academy,
    });

    const metaList = seoResult.meta;
    expect(metaList).toBeDefined();

    // Verify Open Graph tags
    const ogTitle = metaList.find((m) => m.property === "og:title");
    expect(ogTitle?.content).toContain("SAI NCOE Wrestling Selection Trials");

    const ogDescription = metaList.find((m) => m.property === "og:description");
    expect(ogDescription?.content).toContain("Sports Authority of India");

    const ogType = metaList.find((m) => m.property === "og:type");
    expect(ogType?.content).toBe("website");

    const ogUrl = metaList.find((m) => m.property === "og:url");
    expect(ogUrl?.content).toContain("/trial/t-sai-wrestling-mumbai-2026");

    const ogImage = metaList.find((m) => m.property === "og:image");
    expect(ogImage?.content).toBe("https://khelgrid.com/og-image.png");

    const ogSiteName = metaList.find((m) => m.property === "og:site_name");
    expect(ogSiteName?.content).toBe("KhelGrid");

    // Verify Twitter Cards
    const twitterCard = metaList.find((m) => m.name === "twitter:card");
    expect(twitterCard?.content).toBe("summary_large_image");

    const twitterTitle = metaList.find((m) => m.name === "twitter:title");
    expect(twitterTitle?.content).toContain("SAI NCOE Wrestling Selection Trials");

    const twitterImage = metaList.find((m) => m.name === "twitter:image");
    expect(twitterImage?.content).toBe("https://khelgrid.com/og-image.png");

    // Canonical link
    const canonicalLink = seoResult.links.find((l) => l.rel === "canonical");
    expect(canonicalLink?.href).toContain("/trial/t-sai-wrestling-mumbai-2026");

    // SportsEvent structured data script
    const jsonLdScript = seoResult.scripts.find((s) => s.type === "application/ld+json");
    expect(jsonLdScript).toBeDefined();
    if (jsonLdScript) {
      const parsed = JSON.parse(jsonLdScript.children as string);
      expect(parsed["@graph"]).toBeDefined();
      const sportsEvent = parsed["@graph"].find((item: any) => item["@type"] === "SportsEvent");
      expect(sportsEvent).toBeDefined();
      expect(sportsEvent.name).toContain("SAI NCOE Wrestling");
    }
  });

  it("verifies HelmetProvider mounts properly in SSR/testing environment without errors", () => {
    const helmetContext = {};
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <div data-testid="helmet-app">KhelGrid SEO Shell</div>
      </HelmetProvider>,
    );

    expect(html).toContain("KhelGrid SEO Shell");
  });
});

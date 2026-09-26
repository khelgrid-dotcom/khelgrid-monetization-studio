import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { SportsNewsSection } from "@/components/SportsNewsSection";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/blog/AsianGamesAnalytics", () => ({
  AsianGamesAnalytics: () => <div data-testid="asian-games-analytics">Asian Games 2026 Medal Tally</div>,
}));

vi.mock("@/components/blog/MatchOutcomePredictor", () => ({
  MatchOutcomePredictor: () => <div data-testid="predictor">Predictor Engine</div>,
}));

vi.mock("@/components/blog/MatchStatisticsCharts", () => ({
  MatchStatisticsCharts: () => <div data-testid="match-charts">Match Charts</div>,
}));

vi.mock("@/components/blog/IndiaJapanSocialFeed", () => ({
  IndiaJapanSocialFeed: () => <div data-testid="social-feed">Social Feed</div>,
}));

describe("SportsNewsSection", () => {
  it("renders the section heading, live pulse badge, and real-time wire header", () => {
    const html = renderToString(<SportsNewsSection />);

    expect(html).toContain("Real-time Sports Wire");
    expect(html).toContain("Updated Live");
    expect(html).toContain("Sports Updates &amp; National News");
    expect(html).toContain("Breaking selection trials, Khelo India updates");
  });

  it("renders horizontally movable carousel structure for small screens", () => {
    const html = renderToString(<SportsNewsSection />);

    // Region with carousel semantics
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('aria-label="Horizontally movable sports news reel"');
    expect(html).toContain("Swipe horizontally to browse");
    expect(html).toContain("data-carousel-card");
    expect(html).toContain('aria-label="Scroll left in sports wire"');
    expect(html).toContain('aria-label="Scroll right in sports wire"');
  });

  it("embeds Google-compliant Schema.org JSON-LD structured data for NewsArticle and ItemList", () => {
    const html = renderToString(<SportsNewsSection />);

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("https://schema.org");
    expect(html).toContain("NewsArticle");
    expect(html).toContain("ItemList");
    expect(html).toContain("SportsOrganization");
    expect(html).toContain("KhelGrid");

    // Extract JSON-LD script content
    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    expect(match).not.toBeNull();
    if (match) {
      const parsed = JSON.parse(match[1]);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(Array.isArray(parsed["@graph"])).toBe(true);
      const itemList = parsed["@graph"].find((item: any) => item["@type"] === "ItemList");
      expect(itemList).toBeDefined();
      expect(itemList.itemListElement.length).toBeGreaterThan(0);
      const newsArticles = parsed["@graph"].filter((item: any) => item["@type"] === "NewsArticle");
      expect(newsArticles.length).toBeGreaterThan(0);
      expect(newsArticles[0].headline).toBeDefined();
      expect(newsArticles[0].datePublished).toBeDefined();
    }
  });

  it("includes semantic microdata itemScope and itemProp attributes for search engine crawlers", () => {
    const html = renderToString(<SportsNewsSection />);

    expect(html.toLowerCase()).toContain('itemtype="https://schema.org/collectionpage"');
    expect(html.toLowerCase()).toContain('itemtype="https://schema.org/newsarticle"');
    expect(html.toLowerCase()).toContain('itemprop="headline"');
    expect(html.toLowerCase()).toContain('itemprop="description"');
    expect(html.toLowerCase()).toContain('itemprop="datepublished"');
    expect(html.toLowerCase()).toContain('itemprop="author"');
  });

  it("renders sport category filter pills and interactive analytics hub", () => {
    const html = renderToString(<SportsNewsSection />);

    expect(html).toContain("All Sports");
    expect(html).toContain("Asian Games");
    expect(html).toContain("Cricket");
    expect(html).toContain("Football");
    expect(html).toContain("Badminton");
    expect(html).toContain("Athletics");
    expect(html).toContain("Grassroots");

    // Live analytics hub
    expect(html).toContain("High-Performance Analytics Hub");
    expect(html).toContain("Asian Games 2026");
    expect(html).toContain("Asian Games 2026 Medal Tally");
  });
});

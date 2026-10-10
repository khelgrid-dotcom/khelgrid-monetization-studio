import { describe, it, expect } from "vitest";
import { TRIALS, SPORTS, CITIES } from "@/data/trials";
import { CITIES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { SPORTS_NEWS_CATALOG } from "@/data/news";
import { BLOG_POSTS } from "@/data/blog";

describe("UP Sports Directorate Green Park Kanpur Junior Basketball Trials Integration", () => {
  it("includes the Green Park junior basketball selection trial in TRIALS dataset", () => {
    const trial = TRIALS.find(
      (t) => t.id === "t-up-sports-directorate-junior-basketball-trials-kanpur-2026",
    );
    expect(trial).toBeDefined();
    expect(trial?.sport).toBe("Basketball");
    expect(trial?.city).toBe("Kanpur");
    expect(trial?.fee).toBe(0);
    expect(trial?.ageCategory).toContain("Junior");
    expect(trial?.gender).toBe("Boys");
    expect(trial?.venue).toContain("Green Park Stadium");
    expect(trial?.sourceUrl).toBe(
      "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
    );
    expect(trial?.academy).toContain("Regional Sports Office (RSO)");
    expect(trial?.urgencyText).toContain("Oct 12 & 13");
    expect(trial?.urgencyText).toContain("Aligarh");
  });

  it("links all authentic government and official media sources", () => {
    const trial = TRIALS.find(
      (t) => t.id === "t-up-sports-directorate-junior-basketball-trials-kanpur-2026",
    );
    expect(trial?.sources).toBeDefined();
    const sourceUrls = trial?.sources?.map((s) => s.url) || [];

    // 1. Media Source: The Times of India (Kanpur Edition)
    expect(
      sourceUrls.some((u) =>
        u.includes(
          "timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants",
        ),
      ),
    ).toBe(true);

    // 2. Government Source: Sports Directorate, Department of Sports UP
    expect(sourceUrls.some((u) => u.includes("upsports.gov.in"))).toBe(true);

    // 3. Government Athlete Platform: Khel Sathi
    expect(sourceUrls.some((u) => u.includes("khelsathi.in"))).toBe(true);

    // 4. District Administration Kanpur Nagar
    expect(sourceUrls.some((u) => u.includes("kanpurnagar.nic.in"))).toBe(true);
  });

  it("includes required document criteria (Municipal Birth Certificate + Aadhaar)", () => {
    const trial = TRIALS.find(
      (t) => t.id === "t-up-sports-directorate-junior-basketball-trials-kanpur-2026",
    );
    expect(trial?.requiredDocuments).toBeDefined();
    const docs = trial?.requiredDocuments || [];
    expect(
      docs.some(
        (d) =>
          d.toLowerCase().includes("municipal corporation") ||
          d.toLowerCase().includes("nagar nigam"),
      ),
    ).toBe(true);
    expect(docs.some((d) => d.toLowerCase().includes("aadhaar"))).toBe(true);
  });

  it("registers Basketball in SPORTS catalog and SPORTS array", () => {
    const basketballCatalog = SPORTS_CATALOG.find((s) => s.slug === "basketball");
    expect(basketballCatalog).toBeDefined();
    expect(basketballCatalog?.name).toBe("Basketball");

    expect(SPORTS).toContain("Basketball");
    expect(CITIES).toContain("Kanpur");

    const kanpurCatalog = CITIES_CATALOG.find((c) => c.slug === "kanpur");
    expect(kanpurCatalog?.hubs).toContain("Green Park Stadium");
  });

  it("includes authentic news bulletin and blog analysis for the trial", () => {
    const newsItem = SPORTS_NEWS_CATALOG.find(
      (n) => n.id === "news-green-park-kanpur-junior-basketball-trials-2026",
    );
    expect(newsItem).toBeDefined();
    expect(newsItem?.sport).toBe("Basketball");
    expect(newsItem?.title).toContain("Junior Basketball Selection Trials at Green Park Stadium");
    expect(newsItem?.tags).toContain("Green Park Stadium");
    expect(newsItem?.tags).toContain("Sports Directorate");

    const blogPost = BLOG_POSTS.find(
      (b) => b.slug === "green-park-stadium-kanpur-junior-basketball-selection-trials",
    );
    expect(blogPost).toBeDefined();
    expect(blogPost?.title).toContain("Green Park Stadium Kanpur");
    expect(blogPost?.tags).toContain("Basketball");
  });
});

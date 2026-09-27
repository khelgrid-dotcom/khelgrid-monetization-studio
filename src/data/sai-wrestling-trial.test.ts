import { describe, it, expect } from "vitest";
import { TRIALS } from "@/data/trials";
import { SPORTS_CATALOG } from "@/data/catalog";
import { SPORTS_NEWS_CATALOG } from "@/data/news";

describe("SAI NCOE Wrestling Selection Trials Integration", () => {
  it("includes the SAI NCOE Mumbai wrestling selection trial in TRIALS dataset", () => {
    const saiTrial = TRIALS.find((t) => t.id === "t-sai-wrestling-mumbai-2026");
    expect(saiTrial).toBeDefined();
    expect(saiTrial?.sport).toBe("Wrestling");
    expect(saiTrial?.city).toBe("Mumbai");
    expect(saiTrial?.date).toBe("Sep 30, 2026");
    expect(saiTrial?.fee).toBe(0);
    expect(saiTrial?.sourceUrl).toContain("PRID=2314372");
    expect(saiTrial?.academy).toContain("Sports Authority of India");
    expect(saiTrial?.venue).toContain("Kandivali");
  });

  it("links correctly to the Wrestling sport catalog entry", () => {
    const wrestling = SPORTS_CATALOG.find((s) => s.slug === "wrestling");
    expect(wrestling).toBeDefined();
    expect(wrestling?.name).toBe("Wrestling");

    const wrestlingTrials = TRIALS.filter(
      (t) => t.sport.toLowerCase() === wrestling?.name.toLowerCase(),
    );
    expect(wrestlingTrials.length).toBeGreaterThanOrEqual(1);
    expect(wrestlingTrials.some((t) => t.id === "t-sai-wrestling-mumbai-2026")).toBe(true);
  });

  it("links correctly to the Mumbai city catalog trials", () => {
    const mumbaiTrials = TRIALS.filter((t) => t.city.toLowerCase() === "mumbai");
    expect(mumbaiTrials.some((t) => t.id === "t-sai-wrestling-mumbai-2026")).toBe(true);
  });

  it("includes official news coverage for the SAI NCOE wrestling trials", () => {
    const newsItem = SPORTS_NEWS_CATALOG.find(
      (n) => n.id === "news-sai-mumbai-wrestling-trials-2026",
    );
    expect(newsItem).toBeDefined();
    expect(newsItem?.sport).toBe("Wrestling");
    expect(newsItem?.title).toContain("Selection Trials for Men's and Women's Wrestling in Mumbai");
  });
});

import { describe, it, expect } from "vitest";
import { TRIALS, CITIES } from "@/data/trials";
import { CITIES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { SPORTS_NEWS_CATALOG } from "@/data/news";

describe("Kanpur Cricket Association (KCA) U-14 Selection Trials Integration", () => {
  it("includes the KCA U-14 Kanpur cricket selection trial in TRIALS dataset", () => {
    const kcaTrial = TRIALS.find((t) => t.id === "t-kca-u14-cricket-trials-kanpur-2026");
    expect(kcaTrial).toBeDefined();
    expect(kcaTrial?.sport).toBe("Cricket");
    expect(kcaTrial?.city).toBe("Kanpur");
    expect(kcaTrial?.spots).toBe(165);
    expect(kcaTrial?.fee).toBe(0);
    expect(kcaTrial?.ageCategory).toContain("Under-14");
    expect(kcaTrial?.sourceUrl).toBe(
      "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
    );
    expect(kcaTrial?.academy).toContain("Kanpur Cricket Association");
    expect(kcaTrial?.venue).toContain("Kanpur South Ground");
    expect(kcaTrial?.venue).toContain("Kidwai Nagar");

    // Selectors & Officials
    const selectorNames = kcaTrial?.organizerContacts?.map((c) => c.name);
    expect(selectorNames).toContain("Mr. Dinesh Katiyar");
    expect(selectorNames).toContain("Mr. Rakesh Tiwari");
    expect(selectorNames).toContain("Mr. Vikas Yadav");
  });

  it("registers Kanpur in the CITIES_CATALOG and CITIES list", () => {
    const kanpurCatalog = CITIES_CATALOG.find((c) => c.slug === "kanpur");
    expect(kanpurCatalog).toBeDefined();
    expect(kanpurCatalog?.name).toBe("Kanpur");
    expect(kanpurCatalog?.state).toBe("Uttar Pradesh");
    expect(kanpurCatalog?.hubs).toContain("Kanpur South Ground");

    expect(CITIES).toContain("Kanpur");
  });

  it("links correctly to the Cricket sport catalog entry", () => {
    const cricket = SPORTS_CATALOG.find((s) => s.slug === "cricket");
    expect(cricket).toBeDefined();
    expect(cricket?.name).toBe("Cricket");

    const kanpurTrials = TRIALS.filter(
      (t) => t.city.toLowerCase() === "kanpur" && t.sport.toLowerCase() === "cricket",
    );
    expect(kanpurTrials.length).toBeGreaterThanOrEqual(1);
    expect(kanpurTrials.some((t) => t.id === "t-kca-u14-cricket-trials-kanpur-2026")).toBe(true);
  });

  it("includes official news coverage for the KCA U-14 cricket trials from Times of India", () => {
    const newsItem = SPORTS_NEWS_CATALOG.find(
      (n) => n.id === "news-kca-kanpur-u14-cricket-trials-2026",
    );
    expect(newsItem).toBeDefined();
    expect(newsItem?.sport).toBe("Cricket");
    expect(newsItem?.title).toContain("KCA Conducts U-14 Selection Trials");
    expect(newsItem?.category).toBe("Trials & Selection");
    expect(newsItem?.tags).toContain("Kanpur");
    expect(newsItem?.tags).toContain("KCA");
    expect(newsItem?.blogSlug).toBe("kca-conducts-u-14-trials-for-165-aspirants-kanpur");
  });
});

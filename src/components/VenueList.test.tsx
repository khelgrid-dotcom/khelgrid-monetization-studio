import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueList, SPORT_CATEGORIES } from "./VenueList";

// Mock useSupabase to avoid network calls in SSR / unit test
vi.mock("@/hooks/use-supabase", () => ({
  useSupabase: () => ({
    supabase: {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
      }),
    },
    isConfigured: true,
  }),
}));

describe("VenueList Category Filter", () => {
  it("exports standard sport categories including Football, Cricket, and Badminton", () => {
    const categoryNames = SPORT_CATEGORIES.map((c) => c.name);
    expect(categoryNames).toContain("Football");
    expect(categoryNames).toContain("Cricket");
    expect(categoryNames).toContain("Badminton");
    expect(categoryNames).toContain("Tennis");
    expect(categoryNames).toContain("All Sports");
  });

  it("renders category filter buttons and dropdown selector", () => {
    const html = renderToString(<VenueList initialCategory="Football" />);

    // Check category section and chips
    expect(html).toContain('id="venues-category-filter-section"');
    expect(html).toContain('id="venues-category-chips"');
    expect(html).toContain('id="venues-category-dropdown"');

    // Check individual category buttons
    expect(html).toContain('id="venue-category-btn-football"');
    expect(html).toContain('id="venue-category-btn-cricket"');
    expect(html).toContain('id="venue-category-btn-badminton"');
    expect(html).toContain("Football");
    expect(html).toContain("Cricket");
    expect(html).toContain("Badminton");
  });

  it("shows active category reset button when a specific category is active", () => {
    const html = renderToString(<VenueList initialCategory="Badminton" />);
    expect(html).toContain('id="venues-clear-category-btn"');
    expect(html).toContain("Reset Category (Badminton)");
  });
});

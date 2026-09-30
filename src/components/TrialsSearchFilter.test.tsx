import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  TrialsSearchFilter,
  filterTrials,
  REGIONS,
  SPORT_TYPES,
  DATE_RANGE_OPTIONS,
  DEFAULT_FILTER_CRITERIA,
  type TrialsFilterCriteria,
} from "./TrialsSearchFilter";
import { TRIALS, type Trial } from "@/data/trials";

describe("TrialsSearchFilter Component & Filtering Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports definitions for regions, sport types, and date ranges", () => {
    expect(REGIONS.length).toBeGreaterThan(3);
    expect(REGIONS.some((r) => r.id === "north")).toBe(true);
    expect(REGIONS.some((r) => r.id === "south")).toBe(true);

    expect(SPORT_TYPES.length).toBeGreaterThan(3);
    expect(SPORT_TYPES.some((st) => st.id === "team_ball")).toBe(true);
    expect(SPORT_TYPES.some((st) => st.id === "racquet")).toBe(true);

    expect(DATE_RANGE_OPTIONS.length).toBeGreaterThan(4);
    expect(DATE_RANGE_OPTIONS.some((d) => d.id === "closing_soon")).toBe(true);
    expect(DATE_RANGE_OPTIONS.some((d) => d.id === "this_month")).toBe(true);
  });

  it("renders TrialsSearchFilter with search input, region, sport type, and date selectors", () => {
    const html = renderToString(
      <TrialsSearchFilter
        initialCriteria={{
          query: "Cricket",
          region: "south",
          sportType: "team_ball",
          dateRange: "this_month",
        }}
        totalResultsCount={14}
      />
    );

    // Root element & Search input
    expect(html).toContain('id="trials-search-filter-root"');
    expect(html).toContain('id="input-trials-search-query"');
    expect(html).toContain("Cricket");

    // Three core filter controls
    expect(html).toContain('id="filter-region-control"');
    expect(html).toContain("Specific Regions");

    expect(html).toContain('id="filter-sport-type-control"');
    expect(html).toContain("Sport Types");

    expect(html).toContain('id="filter-upcoming-dates-control"');
    expect(html).toContain("Upcoming Dates");

    // Results count
    expect(html).toContain("14 Trials Found");
  });

  it("filters trials by specific region correctly", () => {
    const mockTrials: Trial[] = [
      {
        id: "t-1",
        title: "Delhi Trial",
        academy: "Delhi Academy",
        sport: "Cricket",
        city: "Delhi",
        date: "Sep 28, 2026",
        fee: 0,
        spots: 20,
        tag: "Open",
      },
      {
        id: "t-2",
        title: "Bengaluru Trial",
        academy: "Bangalore Academy",
        sport: "Football",
        city: "Bengaluru",
        date: "Oct 10, 2026",
        fee: 0,
        spots: 30,
        tag: "Elite",
      },
    ];

    // Filter by South Zone (should match Bengaluru, not Delhi)
    const criteriaSouth: TrialsFilterCriteria = {
      ...DEFAULT_FILTER_CRITERIA,
      region: "south",
    };
    const southResults = filterTrials(mockTrials, criteriaSouth);
    expect(southResults.length).toBe(1);
    expect(southResults[0].city).toBe("Bengaluru");

    // Filter by North Zone (should match Delhi, not Bengaluru)
    const criteriaNorth: TrialsFilterCriteria = {
      ...DEFAULT_FILTER_CRITERIA,
      region: "north",
    };
    const northResults = filterTrials(mockTrials, criteriaNorth);
    expect(northResults.length).toBe(1);
    expect(northResults[0].city).toBe("Delhi");
  });

  it("filters trials by sport types correctly", () => {
    const mockTrials: Trial[] = [
      {
        id: "t-cricket",
        title: "Cricket Combine",
        academy: "Cricket Academy",
        sport: "Cricket",
        city: "Delhi",
        date: "Oct 1, 2026",
        fee: 0,
        spots: 20,
        tag: "Open",
      },
      {
        id: "t-badminton",
        title: "Badminton Open",
        academy: "Shuttle Academy",
        sport: "Badminton",
        city: "Bengaluru",
        date: "Oct 5, 2026",
        fee: 0,
        spots: 16,
        tag: "Open",
      },
      {
        id: "t-wrestling",
        title: "Wrestling Camp",
        academy: "SAI Wrestling",
        sport: "Wrestling",
        city: "Mumbai",
        date: "Oct 12, 2026",
        fee: 0,
        spots: 25,
        tag: "Open",
      },
    ];

    // Team & Ball sports (includes Cricket)
    const teamResults = filterTrials(mockTrials, {
      ...DEFAULT_FILTER_CRITERIA,
      sportType: "team_ball",
    });
    expect(teamResults.length).toBe(1);
    expect(teamResults[0].sport).toBe("Cricket");

    // Racquet sports (includes Badminton)
    const racquetResults = filterTrials(mockTrials, {
      ...DEFAULT_FILTER_CRITERIA,
      sportType: "racquet",
    });
    expect(racquetResults.length).toBe(1);
    expect(racquetResults[0].sport).toBe("Badminton");

    // Combat sports (includes Wrestling)
    const combatResults = filterTrials(mockTrials, {
      ...DEFAULT_FILTER_CRITERIA,
      sportType: "combat",
    });
    expect(combatResults.length).toBe(1);
    expect(combatResults[0].sport).toBe("Wrestling");
  });

  it("filters trials by upcoming dates correctly", () => {
    const mockTrials: Trial[] = [
      {
        id: "t-closing",
        title: "Closing Soon Trial",
        academy: "Academy A",
        sport: "Cricket",
        city: "Delhi",
        date: "Sep 30, 2026",
        badge: "Closing Soon",
        fee: 0,
        spots: 10,
        tag: "Open",
      },
      {
        id: "t-december",
        title: "December Trial",
        academy: "Academy B",
        sport: "Hockey",
        city: "Bengaluru",
        date: "Dec 20, 2026",
        fee: 0,
        spots: 20,
        tag: "Open",
      },
    ];

    // Closing soon filter
    const closingResults = filterTrials(mockTrials, {
      ...DEFAULT_FILTER_CRITERIA,
      dateRange: "closing_soon",
    });
    expect(closingResults.some((t) => t.id === "t-closing")).toBe(true);

    // December 2026 filter
    const decResults = filterTrials(mockTrials, {
      ...DEFAULT_FILTER_CRITERIA,
      dateRange: "dec_2026",
    });
    expect(decResults.length).toBe(1);
    expect(decResults[0].id).toBe("t-december");
  });

  it("filters trials by query string across title, venue, and academy", () => {
    const results = filterTrials(TRIALS, {
      ...DEFAULT_FILTER_CRITERIA,
      query: "Sikkim",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city).toBe("Namchi");
  });
});

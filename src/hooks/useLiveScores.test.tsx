import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { useLiveScores } from "./useLiveScores";
import { SPORTS_FILTER_LIST } from "@/services/SportsDataService";

function LiveScoresTestConsumer() {
  const { matches, allMatches, selectedSport, sportsList, isCollapsed, liveCount, sourceSummary } =
    useLiveScores({
      enableSimulation: false,
      refreshIntervalMs: 0,
    });

  return (
    <div>
      <span id="selected-sport">{selectedSport}</span>
      <span id="collapsed-state">{String(isCollapsed)}</span>
      <span id="sports-list">{sportsList.join(",")}</span>
      <span id="match-count">{matches.length}</span>
      <span id="all-match-count">{allMatches.length}</span>
      <span id="live-count">{liveCount}</span>
      <span id="source-summary">{sourceSummary}</span>
    </div>
  );
}

describe("useLiveScores Hook", () => {
  it("exports all standard sport filter categories", () => {
    expect(SPORTS_FILTER_LIST).toContain("All");
    expect(SPORTS_FILTER_LIST).toContain("Cricket");
    expect(SPORTS_FILTER_LIST).toContain("Football");
    expect(SPORTS_FILTER_LIST).toContain("Badminton");
    expect(SPORTS_FILTER_LIST).toContain("Kabaddi");
    expect(SPORTS_FILTER_LIST).toContain("Hockey");
    expect(SPORTS_FILTER_LIST).toContain("Tennis");
  });

  it("renders with initial sports data and exposes standardized properties", () => {
    const html = renderToString(<LiveScoresTestConsumer />);
    expect(html).toContain("All");
    expect(html).toContain("false");
    expect(html).toContain("Cricket,Football,Badminton");
    expect(html).toContain("Google Sports");
  });
});

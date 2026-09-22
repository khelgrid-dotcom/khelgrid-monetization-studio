import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { useLiveSports, SPORTS_FILTER_LIST } from "./use-live-sports";

function HookTestConsumer() {
  const { matches, selectedSport, sportsFilterList, isCollapsed } = useLiveSports({
    enableSimulation: false,
    refreshIntervalMs: 0,
  });

  return (
    <div>
      <span id="selected-sport">{selectedSport}</span>
      <span id="collapsed-state">{String(isCollapsed)}</span>
      <span id="filters">{sportsFilterList.join(",")}</span>
      <span id="match-count">{matches.length}</span>
    </div>
  );
}

describe("useLiveSports Hook and Filters", () => {
  it("exports sports filter definitions including core sports", () => {
    expect(SPORTS_FILTER_LIST).toContain("All");
    expect(SPORTS_FILTER_LIST).toContain("Cricket");
    expect(SPORTS_FILTER_LIST).toContain("Football");
    expect(SPORTS_FILTER_LIST).toContain("Badminton");
    expect(SPORTS_FILTER_LIST).toContain("Kabaddi");
  });

  it("renders inside a React component with valid initial state and match count", () => {
    const html = renderToString(<HookTestConsumer />);
    expect(html).toContain("All");
    expect(html).toContain("false");
    expect(html).toContain("Cricket,Football,Badminton");
  });
});

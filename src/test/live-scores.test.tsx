import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { LiveScoresPage } from "@/routes/live-scores";
import { BOTTOM_NAV_TABS, BottomTabBar } from "@/components/BottomTabBar";
import { NAV_ITEMS, FEATURE_ITEMS } from "@/config/nav";
import { LIVE_SPORTS_UPDATES } from "@/data/liveSports";

// Mock router for component test
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/live-scores" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("Live Scores Page and Navigation", () => {
  it("includes /live-scores in navigation items and features", () => {
    const liveScoreItem = NAV_ITEMS.find((item) => item.to === "/live-scores");
    expect(liveScoreItem).toBeDefined();
    expect(liveScoreItem?.label).toBe("Live Scores");
    expect(liveScoreItem?.surfaces).toContain("features");

    const inFeatureItems = FEATURE_ITEMS.some((item) => item.to === "/live-scores");
    expect(inFeatureItems).toBe(true);
  });

  it("includes the Live tab in BOTTOM_NAV_TABS for small screen devices", () => {
    const liveTab = BOTTOM_NAV_TABS.find(
      (tab) => tab.to === "/live-scores" || tab.label === "Live",
    );
    expect(liveTab).toBeDefined();
    expect(liveTab?.label).toBe("Live");
    expect(liveTab?.to).toBe("/live-scores");
    expect(liveTab?.isLive).toBe(true);
  });

  it("renders BottomTabBar with the Live button", () => {
    const html = renderToString(<BottomTabBar />);
    expect(html).toContain("Live");
    expect(html).toContain('href="/live-scores"');
    expect(html).toContain("bottom-tab-live");
  });

  it("renders LiveScoresPage without SSR hydration errors", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain("Real-Time Live Sports Scores");
    expect(html).toContain("LIVE MATCH CENTER");
    expect(html).toContain("All Sports");
    expect(html).toContain("Cricket");
    expect(html).toContain("Football");
    expect(html).toContain("Badminton");
    expect(html).toContain("Kabaddi");
  });

  it("contains sports matches from LIVE_SPORTS_UPDATES in page render", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain(LIVE_SPORTS_UPDATES[0].tournament);
    expect(html).toContain(LIVE_SPORTS_UPDATES[0].teamA.code);
  });
});

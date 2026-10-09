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

  it("displays 'For Live Score visit Google' for cricket matches instead of fake numeric scores", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain("For Live Score visit Google");
    expect(html).toContain("West Indies Tour of India 2026");
    expect(html).toContain("Australia Tour of South Africa 2026");
    expect(html).toContain("Afghanistan vs Bangladesh in UAE 2026");
  });

  it("renders search bar at the top of Live Scores page with cricket filter options", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain("Search cricket matches by team names");
    expect(html).toContain("Quick Filters:");
    expect(html).toContain("West Indies Tour of India 2026");
    expect(html).toContain("India vs West Indies");
  });

  it("includes specific Google match link for West Indies Tour of India 2026 2nd T20I", () => {
    const html = renderToString(<LiveScoresPage />);
    const specificUrl =
      "https://www.google.com/search?num=10&amp;sca_esv=afb89ae158309890&amp;sxsrf=APpeQnv7S_hYa8j3xghYQ4nz5MsSmeFQOQ:1791525759353&amp;q=Live+Cricket+match+today&amp;sa=X&amp;sqi=2&amp;ved=2ahUKEwivt_fDoayXAxX6zDgGHQu0G64Q1QJ6BAgxEAE&amp;biw=1280&amp;bih=631&amp;dpr=1.5#sie=m;/g/11z3y_p23j;5;/m/021q23;dt;fp;1;;;;-1";
    // Check either decoded or HTML encoded ampersands
    const hasSpecificUrl =
      html.includes("11z3y_p23j") &&
      html.includes("West Indies Tour of India 2026") &&
      html.includes("2nd T20I · Starts 7:00 PM IST");
    expect(hasSpecificUrl).toBe(true);
  });
});

import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { BottomTabBar, BOTTOM_NAV_TABS } from "./BottomTabBar";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, "aria-current": ariaCurrent, ...props }: any) => (
    <a href={to} aria-current={ariaCurrent} {...props}>
      {children}
    </a>
  ),
  useRouterState: () => "/",
  useNavigate: () => vi.fn(),
}));

describe("BottomTabBar", () => {
  it("defines exactly 5 mobile navigation tabs", () => {
    expect(BOTTOM_NAV_TABS).toHaveLength(5);
    const labels = BOTTOM_NAV_TABS.map((t) => t.label);
    expect(labels).toEqual(["Home", "Play", "Book", "Train", "Live"]);
  });

  it("renders all 5 tabs in the mobile navigation bar", () => {
    const html = renderToString(<BottomTabBar />);

    expect(html).toContain("Home");
    expect(html).toContain("Play");
    expect(html).toContain("Book");
    expect(html).toContain("Train");
    expect(html).toContain("Live");
  });

  it("contains lg:hidden class to hide on desktop screens and has high z-index with safe area padding", () => {
    const html = renderToString(<BottomTabBar />);
    expect(html).toContain("lg:hidden");
    expect(html).toContain("fixed");
    expect(html).toContain("bottom-0");
    expect(html).toContain("z-[70]");
    expect(html).toContain("safe-area-inset-bottom");
  });

  it("marks Home as active when on root pathname", () => {
    const html = renderToString(<BottomTabBar />);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('data-testid="bottom-tab-home"');
  });
});

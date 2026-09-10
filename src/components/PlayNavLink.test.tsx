import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { PlayNavLink } from "./PlayNavLink";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, "aria-current": ariaCurrent, ...props }: any) => (
    <a href={to} aria-current={ariaCurrent} {...props}>
      {children}
    </a>
  ),
}));

function classesOf(source: "sidebar_desktop" | "sidebar_mobile", active: boolean) {
  const html = renderToString(<PlayNavLink active={active} source={source} />);
  const className = html.match(/class="([^"]+)"/)?.[1] ?? "";
  return className.trim().split(/\s+/);
}

describe("PlayNavLink shared rendering", () => {
  it("renders identical classes for /play on desktop and mobile", () => {
    const desktop = classesOf("sidebar_desktop", false);
    const mobile = classesOf("sidebar_mobile", false);
    expect(mobile).toEqual(desktop);
  });

  it("renders identical active classes for /play on desktop and mobile", () => {
    const desktop = classesOf("sidebar_desktop", true);
    const mobile = classesOf("sidebar_mobile", true);
    expect(mobile).toEqual(desktop);
  });

  it("keeps the same tap-friendly padding token on both surfaces", () => {
    const desktop = classesOf("sidebar_desktop", false);
    const mobile = classesOf("sidebar_mobile", false);
    expect(desktop).toContain("py-3.5");
    expect(mobile).toContain("py-3.5");
    expect(desktop).toContain("sm:py-2.5");
    expect(mobile).toContain("sm:py-2.5");
  });

  it("uses the same horizontal padding and gap on both surfaces", () => {
    const desktop = classesOf("sidebar_desktop", false);
    const mobile = classesOf("sidebar_mobile", false);
    expect(desktop).toContain("px-3");
    expect(mobile).toContain("px-3");
    expect(desktop).toContain("gap-3");
    expect(mobile).toContain("gap-3");
  });
});

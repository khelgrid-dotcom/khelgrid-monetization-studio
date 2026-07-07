import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { NavLink } from "./NavLink";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, "aria-current": ariaCurrent, ...props }: any) => (
    <a href={to} aria-current={ariaCurrent} {...props}>
      {children}
    </a>
  ),
}));

const MockIcon = ({ className }: { className?: string }) => (
  <svg className={className} />
);

const playItem = {
  to: "/play",
  label: "Play · Find games",
  icon: MockIcon,
  surfaces: ["primary", "features"] as Array<"primary" | "features">,
};

describe("NavLink aria-current", () => {
  it("renders aria-current=page for the active /play link", () => {
    const html = renderToString(
      <NavLink item={playItem} active source="sidebar_desktop" />,
    );
    expect(html).toContain('aria-current="page"');
  });

  it("omits aria-current when the link is not active", () => {
    const html = renderToString(
      <NavLink item={playItem} active={false} source="sidebar_desktop" />,
    );
    expect(html).not.toContain('aria-current="page"');
  });
});

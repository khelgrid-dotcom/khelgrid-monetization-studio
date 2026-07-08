import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { NavDrawer } from "./NavDrawer";
import { useRouterState } from "@tanstack/react-router";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouterState: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ plan: "free", wallet: 0 }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <>{children}</>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetTrigger: ({ children }: any) => <>{children}</>,
}));

function findPlayAnchors(html: string): Array<{ anchorClass: string; iconClass: string }> {
  const anchorRe = /<a\b(?=[^>]*\bhref="\/play")(?=[^>]*\bclass="([^"]*)")[^>]*>(.*?)<\/a>/g;
  return [...html.matchAll(anchorRe)].map((match) => {
    const inner = match[2];
    const iconMatch = inner.match(/<svg\b[^>]*\bclass="([^"]*)"/);
    return { anchorClass: match[1], iconClass: iconMatch?.[1] ?? "" };
  });
}

describe("NavDrawer /play active styling", () => {
  it("applies active styling to the /play entry on the /play route", () => {
    vi.mocked(useRouterState).mockReturnValue({ location: { pathname: "/play" } } as any);

    const html = renderToString(<NavDrawer />);
    const links = findPlayAnchors(html);

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.anchorClass).toContain("bg-secondary");
      expect(link.anchorClass).toContain("text-foreground");
      expect(link.iconClass).toContain("text-primary");
    }
  });

  it("does not apply active styling to /play on unrelated routes", () => {
    vi.mocked(useRouterState).mockReturnValue({ location: { pathname: "/dashboard" } });

    const html = renderToString(<NavDrawer />);
    const links = findPlayAnchors(html);

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.anchorClass).not.toContain("bg-secondary");
      expect(link.iconClass).not.toContain("text-primary");
    }
  });
});

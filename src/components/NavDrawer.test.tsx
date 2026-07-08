import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { NavDrawer } from "./NavDrawer";
import * as TanStackRouter from "@tanstack/react-router";

const router = TanStackRouter as any;

vi.mock("@tanstack/react-router", () => {
  let pathname = "/";

  return {
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    setRouterPathname: (p: string) => {
      pathname = p;
    },
    useRouterState: ({ select }: any = {}) => {
      const state = {
        location: {
          pathname,
          href: "",
          search: {},
          searchStr: "",
          state: {},
          hash: "",
          maskedLocation: undefined,
        },
      };
      return select ? select(state) : state;
    },
  };
});

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
    router.setRouterPathname("/play");

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
    router.setRouterPathname("/dashboard");

    const html = renderToString(<NavDrawer />);
    const links = findPlayAnchors(html);

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.anchorClass).not.toContain("bg-secondary");
      expect(link.iconClass).not.toContain("text-primary");
    }
  });
});

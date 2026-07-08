import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { Navbar } from "./Navbar";
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
  Button: ({ asChild, size, variant, children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/NavDrawer", () => ({
  NavDrawer: () => <button aria-label="Open menu">Menu</button>,
}));

function findAnchorByHref(html: string, href: string): string | null {
  const regex = new RegExp(
    `<a\\b(?=[^>]*\\bhref="${href.replace(/\//g, "\\/")}")(?=[^>]*\\bclass="([^"]*)")[^>]*>`,
    "g",
  );
  const match = regex.exec(html);
  return match?.[1] ?? null;
}

function hasToken(className: string, token: string) {
  return className.trim().split(/\s+/).includes(token);
}

describe("Navbar /play active highlighting", () => {
  it("highlights the Play link on /play sub-routes", () => {
    (useRouterState as any).mockReturnValue("/play/host");

    const html = renderToString(<Navbar />);
    const playClass = findAnchorByHref(html, "/play");

    expect(playClass).toBeTruthy();
    expect(hasToken(playClass!, "bg-secondary")).toBe(true);
    expect(hasToken(playClass!, "text-foreground")).toBe(true);
  });

  it("does not highlight the Play link on unrelated routes", () => {
    (useRouterState as any).mockReturnValue("/dashboard");

    const html = renderToString(<Navbar />);
    const playClass = findAnchorByHref(html, "/play");

    expect(playClass).toBeTruthy();
    expect(hasToken(playClass!, "bg-secondary")).toBe(false);
  });
});

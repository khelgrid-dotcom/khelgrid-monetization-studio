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
  useNavigate: () => vi.fn(),
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

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => <>{children}</>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, asChild }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
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

  it("renders the settings trigger button in the navbar", () => {
    (useRouterState as any).mockReturnValue("/");
    const html = renderToString(<Navbar />);
    expect(html).toContain('id="navbar-settings-btn"');
    expect(html).toContain("Settings &amp; Appearance");
  });

  it("renders Careers and Partner with Us in the settings menu", () => {
    (useRouterState as any).mockReturnValue("/");
    const html = renderToString(<Navbar />);
    expect(html).toContain('id="navbar-careers-btn"');
    expect(html).toContain('href="/careers"');
    expect(html).toContain("Careers");
    expect(html).toContain('id="navbar-partner-btn"');
    expect(html).toContain('href="/partner"');
    expect(html).toContain("Partner with Us");
  });
});

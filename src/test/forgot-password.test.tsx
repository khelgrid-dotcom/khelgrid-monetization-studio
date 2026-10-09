import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ForgotPasswordPage, { Route } from "@/routes/forgot-password";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
    useSearch: () => ({ mode: "request", email: undefined }),
  }),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    resetPassword: vi.fn(async () => ({ success: true })),
    updatePassword: vi.fn(async () => ({ success: true })),
  }),
}));

describe("ForgotPasswordPage Route & SEO Head", () => {
  it("renders page header and ForgotPasswordForm", () => {
    const html = renderToString(<ForgotPasswordPage />);

    expect(html).toContain("Khel");
    expect(html).toContain("Grid");
    expect(html).toContain("Forgot Password");
    expect(html).toContain("Back to Sports Portal Login");
  });

  it("exports valid SEO head with noindex for sensitive recovery page", () => {
    const headFn = (Route as any).head;
    expect(headFn).toBeDefined();
    const headResult = headFn();

    const titleEntry = headResult.meta?.find((m: any) => m.title);
    expect(titleEntry?.title).toContain("Reset Your Password");
    expect(titleEntry?.title).toContain("KhelGrid");

    const robotsTag = headResult.meta?.find((m: any) => m.name === "robots");
    expect(robotsTag?.content).toContain("noindex");
  });
});

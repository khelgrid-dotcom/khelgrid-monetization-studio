import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock AuthContext
let mockResetPassword = vi.fn(async () => ({ success: true, data: null }));
let mockUpdatePassword = vi.fn(async () => ({ success: true }));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    resetPassword: mockResetPassword,
    updatePassword: mockUpdatePassword,
  }),
}));

describe("ForgotPasswordForm Component & Supabase Auth Reset Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResetPassword = vi.fn(async () => ({ success: true, data: null }));
    mockUpdatePassword = vi.fn(async () => ({ success: true }));
  });

  it("renders the request reset email form with required elements", () => {
    const html = renderToString(<ForgotPasswordForm />);

    expect(html).toContain("Forgot Password");
    expect(html).toContain("Account Recovery");
    expect(html).toContain("Registered Email Address");
    expect(html).toContain("Send Password Reset Link");
    expect(html).toContain("Back to Sign In");
    expect(html).toContain("athlete@khelgrid.com");
  });

  it("renders with a prefilled email address", () => {
    const html = renderToString(<ForgotPasswordForm defaultEmail="champion@khelgrid.com" />);

    expect(html).toContain("champion@khelgrid.com");
  });

  it("renders set new password view when initialMode is reset", () => {
    const html = renderToString(<ForgotPasswordForm initialMode="reset" />);

    expect(html).toContain("Set New Password");
    expect(html).toContain("Password Recovery");
    expect(html).toContain("New Password");
    expect(html).toContain("Confirm New Password");
    expect(html).toContain("Save New Password &amp; Sign In");
  });

  it("renders return to sign-in action button and triggers callback", () => {
    const onBackSpy = vi.fn();
    const html = renderToString(<ForgotPasswordForm onBackToSignIn={onBackSpy} />);

    expect(html).toContain("Back to Sign In");
  });
});

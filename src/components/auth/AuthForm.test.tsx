import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { AuthForm } from "./AuthForm";

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

// Mock AuthContext state
let mockAuthState = {
  isAuthenticated: false,
  user: null as any,
  role: "user",
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
};

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

describe("AuthForm Component with Shadcn UI and AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      isAuthenticated: false,
      user: null as any,
      role: "user",
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
    };
  });

  it("renders Sign In tab by default with role selectors and input fields", () => {
    const html = renderToString(<AuthForm />);

    expect(html).toContain("Welcome to KhelGrid");
    expect(html).toContain("Sign In");
    expect(html).toContain("Create Account");
    expect(html).toContain("Athlete / Player");
    expect(html).toContain("Coach / Trainer");
    expect(html).toContain("Academy / Club");
    expect(html).toContain("Log in to KhelGrid");
    expect(html).toContain("Mobile OTP");
    expect(html).toContain("Password");
  });

  it("renders with custom title and description when provided", () => {
    const html = renderToString(
      <AuthForm
        title="Member Portal Login"
        description="Access verified athlete records and trials"
      />,
    );

    expect(html).toContain("Member Portal Login");
    expect(html).toContain("Access verified athlete records and trials");
  });

  it("renders Sign Up tab when defaultTab is set to signup", () => {
    const html = renderToString(<AuthForm defaultTab="signup" />);

    expect(html).toContain("Full Name");
    expect(html).toContain("Email Address");
    expect(html).toContain("Primary Sport");
    expect(html).toContain("Complete Registration");
  });

  it("displays demo test accounts when showDemoAccounts is true", () => {
    const html = renderToString(<AuthForm showDemoAccounts={true} />);

    expect(html).toContain("Instant Demo Test Drive");
    expect(html).toContain("Arjun Mehta");
    expect(html).toContain("Coach Rajesh");
    expect(html).toContain("Apex Sports");
  });

  it("renders active session card when user is already authenticated", () => {
    mockAuthState = {
      ...mockAuthState,
      isAuthenticated: true,
      user: {
        id: "coach-rajesh",
        name: "Coach Rajesh Sharma",
        email: "coach.rajesh@khelgrid.com",
        phone: "+919876543210",
        role: "coach",
      },
      role: "coach",
    };

    const html = renderToString(<AuthForm />);

    expect(html).toContain("Currently signed in");
    expect(html).toContain("Coach Rajesh Sharma");
    expect(html).toContain("Go to Portal");
    expect(html).toContain("Sign Out / Switch Account");
  });
});

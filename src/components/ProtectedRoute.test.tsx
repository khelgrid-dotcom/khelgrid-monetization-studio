import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { ProtectedRoute } from "./ProtectedRoute";

// Mock hooks & modules
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ pathname: "/dashboard", searchStr: "" }),
  Link: ({ to, search, children, ...props }: any) => (
    <a href={`${to}${search?.redirect ? `?redirect=${search.redirect}` : ""}`} {...props}>
      {children}
    </a>
  ),
}));

let mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  role: "user",
  user: {
    id: "user-1",
    name: "Test Athlete",
    email: "test@khelgrid.com",
    phone: "+919876543210",
    role: "user",
  },
};

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("ProtectedRoute component", () => {
  it("renders children when user is authenticated and no role restrictions are set", () => {
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      role: "user",
      user: {
        id: "user-1",
        name: "Test Athlete",
        email: "test@khelgrid.com",
        phone: "+919876543210",
        role: "user",
      },
    };

    const html = renderToString(
      <ProtectedRoute>
        <div id="secret-member-content">Member-Only Content</div>
      </ProtectedRoute>,
    );

    expect(html).toContain("secret-member-content");
    expect(html).toContain("Member-Only Content");
  });

  it("renders unauthenticated fallback card when user is not authenticated", () => {
    mockAuthState = {
      isAuthenticated: false,
      isLoading: false,
      role: "user",
      user: null as any,
    };

    const html = renderToString(
      <ProtectedRoute message="Sign in to view your dashboard.">
        <div id="secret-member-content">Member-Only Content</div>
      </ProtectedRoute>,
    );

    expect(html).not.toContain("secret-member-content");
    expect(html).toContain("Sign In Required");
    expect(html).toContain("Sign in to view your dashboard.");
    expect(html).toContain("Log In to Continue");
  });

  it("renders loading indicator when auth state is loading", () => {
    mockAuthState = {
      isAuthenticated: false,
      isLoading: true,
      role: "user",
      user: null as any,
    };

    const html = renderToString(
      <ProtectedRoute>
        <div id="secret-member-content">Member-Only Content</div>
      </ProtectedRoute>,
    );

    expect(html).not.toContain("secret-member-content");
    expect(html).toContain("protected-route-loading");
    expect(html).toContain("Verifying member credentials...");
  });

  it("renders role restricted screen when user has an unauthorized role", () => {
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      role: "user",
      user: {
        id: "user-1",
        name: "Test Athlete",
        email: "test@khelgrid.com",
        phone: "+919876543210",
        role: "user",
      },
    };

    const html = renderToString(
      <ProtectedRoute allowedRoles={["recruiter"]}>
        <div id="recruiter-content">Recruiter Private Assessments</div>
      </ProtectedRoute>,
    );

    expect(html).not.toContain("recruiter-content");
    expect(html).toContain("Specialized Access Required");
    expect(html).toContain("Switch Account");
  });

  it("renders custom unauthorizedFallback when user lacks required role", () => {
    mockAuthState = {
      isAuthenticated: true,
      isLoading: false,
      role: "user",
      user: {
        id: "user-1",
        name: "Test Athlete",
        email: "test@khelgrid.com",
        phone: "+919876543210",
        role: "user",
      },
    };

    const html = renderToString(
      <ProtectedRoute
        allowedRoles={["recruiter"]}
        unauthorizedFallback={<div id="custom-fallback">Custom Access Denied Notice</div>}
      >
        <div id="recruiter-content">Recruiter Content</div>
      </ProtectedRoute>,
    );

    expect(html).not.toContain("recruiter-content");
    expect(html).toContain("custom-fallback");
    expect(html).toContain("Custom Access Denied Notice");
  });
});

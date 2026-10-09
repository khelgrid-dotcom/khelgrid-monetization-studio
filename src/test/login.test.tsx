import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import LoginPage, { Route } from "@/routes/login";
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS, normalizeRole } from "@/types/auth";
import { recordUserLoginInDatabase } from "@/lib/user-profile-service";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
    useSearch: () => ({ redirect: undefined }),
  }),
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock AuthContext
let mockAuthState: any = {
  isAuthenticated: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  role: "user",
};

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

describe("Login Portal, Role Switching & Database Sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      role: "user",
    };
  });

  describe("SEO & Search Engine Optimization", () => {
    it("exports SEO head metadata that is search engine friendly (noindex is false)", () => {
      const headFn = (Route as any).head;
      expect(headFn).toBeDefined();
      const headResult = headFn();

      // Check title contains portal keywords
      const titleEntry = headResult.meta?.find((m: any) => m.title);
      expect(titleEntry?.title).toContain("KhelGrid");
      expect(titleEntry?.title).toContain("Athlete, Coach & Academy");

      // Check description
      const descEntry = headResult.meta?.find((m: any) => m.name === "description");
      expect(descEntry?.content).toContain("athletes, certified coaches, and sports academies");

      // Search engine friendly: noindex must NOT be true
      const robotsTag = headResult.meta?.find((m: any) => m.name === "robots");
      expect(robotsTag?.content).toContain("index, follow");
      expect(robotsTag?.content).not.toContain("noindex");

      // Canonical link exists
      const canonical = headResult.links?.find((l: any) => l.rel === "canonical");
      expect(canonical).toBeDefined();
      expect(canonical?.href).toContain("/login");
    });
  });

  describe("Role Definitions & Presets", () => {
    it("defines distinct configurations for user, coach, and academy", () => {
      expect(ROLE_DEFINITIONS.user.label).toContain("Athlete");
      expect(ROLE_DEFINITIONS.coach.label).toContain("Coach");
      expect(ROLE_DEFINITIONS.academy.label).toContain("Academy");

      expect(DEMO_ACCOUNTS.user.name).toBe("Arjun Mehta");
      expect(DEMO_ACCOUNTS.coach.name).toBe("Coach Rajesh Sharma");
      expect(DEMO_ACCOUNTS.academy.name).toBe("Apex Sports Arena & Academy");

      expect(normalizeRole("athlete")).toBe("user");
      expect(normalizeRole("recruiter")).toBe("coach");
      expect(normalizeRole("organizer")).toBe("academy");
    });
  });

  describe("Database Login Sync Service", () => {
    it("successfully records login in database/local storage and marks synced", async () => {
      const result = await recordUserLoginInDatabase({
        id: "coach-rajesh-sharma",
        name: "Coach Rajesh Sharma",
        email: "coach.rajesh@khelgrid.com",
        role: "coach",
        city: "Delhi NCR",
        primarySport: "Cricket & Athletics",
      });

      expect(result.success).toBe(true);
      expect(result.profile.fullName).toBe("Coach Rajesh Sharma");
      expect(result.profile.skillLevel).toBe("Certified Coach");
      expect(result.profile.membershipTier).toBe("Coach Pro Pass");
    });
  });

  describe("Responsive Component Rendering", () => {
    it("renders the login portal with role options and 1-click test drives", () => {
      const html = renderToString(<LoginPage />);

      expect(html).toContain("Log in to KhelGrid");
      expect(html).toContain("Athlete / Player");
      expect(html).toContain("Coach / Trainer");
      expect(html).toContain("Academy / Club");
      expect(html).toContain("Mobile OTP");
      expect(html).toContain("Password");
      expect(html).toContain("Coach Rajesh");
      expect(html).toContain("Apex Sports");
    });

    it("renders active session card when already authenticated", () => {
      mockAuthState = {
        isAuthenticated: true,
        user: {
          id: "coach-rajesh",
          name: "Coach Rajesh Sharma",
          email: "coach.rajesh@khelgrid.com",
          role: "coach",
          targetRoute: "/scout-portal",
        },
        login: vi.fn(),
        logout: vi.fn(),
        role: "coach",
      };

      const html = renderToString(<LoginPage />);
      expect(html).toContain("Currently signed in");
      expect(html).toContain("Coach Rajesh Sharma");
      expect(html).toContain("Go to Portal");
    });
  });
});

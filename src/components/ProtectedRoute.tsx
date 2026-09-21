import { ReactNode, useEffect, useRef } from "react";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ShieldAlert, Loader2, Lock, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProtectedRouteProps {
  /**
   * The protected content to render when authenticated.
   */
  children: ReactNode;
  /**
   * Target destination to redirect unauthenticated users. Defaults to "/login".
   */
  redirectTo?: string;
  /**
   * Permitted roles for role-restricted areas (e.g. ['coach', 'recruiter']).
   */
  allowedRoles?: string[];
  /**
   * Single required role if only one specific role is permitted.
   */
  requiredRole?: string;
  /**
   * Custom notification message displayed when redirecting to login.
   */
  message?: string;
  /**
   * Custom fallback view rendered when the user is logged in but lacks the required role.
   */
  unauthorizedFallback?: ReactNode;
  /**
   * Whether to show a toast message when redirecting. Defaults to true.
   */
  showToast?: boolean;
}

/**
 * ProtectedRoute Wrapper
 * Enforces authentication and role-based permissions on member-only content.
 * Redirects unauthenticated visitors to the login page with a return URL.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
  requiredRole,
  message,
  unauthorizedFallback,
  showToast = true,
}: ProtectedRouteProps) {
  const auth = useAuth();
  const { isAuthenticated, isLoading, role, user } = auth;
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;
  const currentSearch = location.searchStr || "";
  const fullCurrentUrl = `${currentPath}${currentSearch ? `?${currentSearch}` : ""}`;
  const redirectedRef = useRef(false);

  // Normalize allowed roles list
  const rolesList = allowedRoles || (requiredRole ? [requiredRole] : undefined);
  const isRoleAuthorized = !rolesList || rolesList.length === 0 || rolesList.includes(role);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      const defaultMsg = message || "Please sign in to access member-only content.";
      if (showToast) {
        toast.info(defaultMsg, { id: "protected-route-redirect" });
      }

      const redirectParam =
        fullCurrentUrl && fullCurrentUrl !== "/" && fullCurrentUrl !== "/login"
          ? fullCurrentUrl
          : undefined;

      navigate({
        to: redirectTo,
        search: redirectParam ? { redirect: redirectParam } : undefined,
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, fullCurrentUrl, message, showToast]);

  // While checking authentication state from localStorage / session
  if (isLoading) {
    return (
      <main
        id="protected-route-loading"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Verifying member credentials...</p>
      </main>
    );
  }

  // If not authenticated, render prompt with direct action button while redirect triggers
  if (!isAuthenticated) {
    const redirectParam =
      fullCurrentUrl && fullCurrentUrl !== "/" && fullCurrentUrl !== "/login"
        ? fullCurrentUrl
        : undefined;

    return (
      <main
        id="protected-route-unauthenticated"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
      >
        <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>

          <Badge
            variant="outline"
            className="mt-4 border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary"
          >
            Member-Only Area
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Sign In Required
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {message ||
              "This section contains member-exclusive content and services. Please sign in to continue."}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              id="protected-route-login-btn"
              asChild
              className="rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Link
                to={redirectTo}
                search={redirectParam ? { redirect: redirectParam } : undefined}
              >
                Log In to Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border text-foreground hover:bg-secondary"
            >
              <Link to="/">Explore KhelGrid</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // If authenticated but lacks role
  if (!isRoleAuthorized) {
    if (unauthorizedFallback) {
      return <>{unauthorizedFallback}</>;
    }

    return (
      <main
        id="protected-route-unauthorized-role"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
      >
        <div className="rounded-2xl border border-amber-500/30 bg-card p-6 shadow-sm sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <Badge
            variant="outline"
            className="mt-4 border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            Role Restricted
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Specialized Access Required
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This section requires {rolesList.map((r) => `"${r}"`).join(" or ")} privileges. You are
            currently signed in as{" "}
            <span className="font-semibold text-foreground">
              {user?.name || "Athlete"} ({role})
            </span>
            .
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Link to="/login">
                <UserCheck className="mr-1.5 h-4 w-4" />
                Switch Account
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border text-foreground hover:bg-secondary"
            >
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}

export default ProtectedRoute;

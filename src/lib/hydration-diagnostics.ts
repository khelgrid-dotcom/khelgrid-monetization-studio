// Dev-only hydration diagnostics.
//
// Blank screens in this app have historically come from two sources:
//  1. duplicate/mismatched @tanstack/router-core copies, which leave the
//     router store shape incomplete (e.g. `router.stores.matchesId` undefined)
//  2. React hydration mismatches (#418 / #423 / #425) that blow away the tree
//
// These helpers detect both from plain data so they can be unit-tested, and
// `HydrationDiagnostics` renders the findings.

export type DiagnosticSeverity = "error" | "warning";

export type Diagnostic = {
  id: string;
  severity: DiagnosticSeverity;
  title: string;
  detail: string;
};

/** Store keys the router must expose for the client tree to hydrate. */
export const REQUIRED_ROUTER_STORE_KEYS = ["matchesId", "location"] as const;

type RouterLike = {
  stores?: Record<string, unknown> | undefined;
  state?: { matches?: unknown } | undefined;
};

/** Detects an incomplete router store, the classic duplicate-package symptom. */
export function inspectRouterStores(router: RouterLike | null | undefined): Diagnostic[] {
  if (!router) {
    return [
      {
        id: "router-missing",
        severity: "error",
        title: "Router unavailable",
        detail: "useRouter() returned nothing — the app is rendering outside the router tree.",
      },
    ];
  }

  const stores = router.stores;
  if (!stores || typeof stores !== "object") {
    return [
      {
        id: "router-stores-missing",
        severity: "error",
        title: "Router stores missing",
        detail:
          "router.stores is undefined. This usually means two copies of @tanstack/router-core are installed. Pin a single version via overrides/resolutions.",
      },
    ];
  }

  const missing = REQUIRED_ROUTER_STORE_KEYS.filter(
    (key) => (stores as Record<string, unknown>)[key] === undefined,
  );

  if (missing.length > 0) {
    return [
      {
        id: "router-stores-incomplete",
        severity: "error",
        title: "Router store shape mismatch",
        detail: `Missing store(s): ${missing.join(", ")}. Version skew between @tanstack/react-router, @tanstack/react-start and @tanstack/router-core.`,
      },
    ];
  }

  return [];
}

const HYDRATION_ERROR_CODES = ["418", "422", "423", "425"];

/** True when a console.error payload looks like a React hydration failure. */
export function isHydrationErrorMessage(message: string): boolean {
  const lower = message.toLowerCase();
  if (lower.includes("hydrat")) return true;
  if (lower.includes("text content does not match")) return true;
  if (lower.includes("did not match")) return true;
  return HYDRATION_ERROR_CODES.some((code) => message.includes(`react.dev/errors/${code}`));
}

export function toDiagnostic(message: string, index: number): Diagnostic {
  return {
    id: `hydration-${index}`,
    severity: "warning",
    title: "Hydration mismatch",
    detail: message.slice(0, 400),
  };
}

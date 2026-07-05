import { Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/search": "Search trials",
  "/trials": "Live Trials",
  "/opportunities": "Opportunities",
  "/resources": "Resources",
  "/sports": "Sports",
  "/cities": "Cities",
  "/guides": "Guides",
  "/tools": "Tools & calculators",
  "/play": "Play · Find games",
  "/book": "Book venues",
  "/train": "Train · Coaching",
  "/events": "Events & tournaments",
  "/memberships": "Memberships",
  "/dashboard": "My Dashboard",
  "/login": "Log in",
  "/pricing": "Pricing",
  "/start-from-zero": "Start From Zero",
  "/ai-guide": "AI Guide",
  "/verify": "Verify",
  "/talent-scanner": "Talent Scanner",
  "/community": "Community",
  "/learning-hub": "Learning Hub",
  "/coaches": "Coaches",
  "/academy": "For Academies",
  "/mobile-app": "Mobile App",
  "/about": "About",
  "/sports/$slug": "Sport",
  "/city/$slug": "City",
  "/guide/$slug": "Guide",
  "/tool/$slug": "Tool",
  "/sport-in-city/$slug": "Sport in city",
  "/top-guides/$category": "Top guides",
  "/best-tools/$category": "Best tools",
};

function labelFor(match: { routeId: string; pathname: string }) {
  if (ROUTE_LABELS[match.routeId]) return ROUTE_LABELS[match.routeId];
  // Fallback: use the last path segment, prettified.
  const segment = match.pathname.split("/").filter(Boolean).pop() ?? "";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function Breadcrumbs() {
  const matches = useRouterState({
    select: s => s.matches.map(m => ({ routeId: m.routeId, pathname: m.pathname })),
  });

  const crumbs = matches.filter(m => m.routeId !== "__root__");
  if (crumbs.length <= 1 && crumbs[0]?.routeId === "/") return null;

  return (
    <Breadcrumb className="mx-auto max-w-7xl px-4 py-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((match, idx) => {
          const isLast = idx === crumbs.length - 1;
          const label = labelFor(match);
          return (
            <BreadcrumbItem key={match.routeId} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={match.pathname}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

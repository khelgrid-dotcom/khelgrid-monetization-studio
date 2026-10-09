import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, CalendarCheck, Swords, GraduationCap, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface NavTabItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact: boolean;
  isLive?: boolean;
}

export const BOTTOM_NAV_TABS: readonly NavTabItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/play", label: "Play", icon: Swords, exact: false },
  { to: "/book", label: "Book", icon: CalendarCheck, exact: false },
  { to: "/train", label: "Train", icon: GraduationCap, exact: false },
  { to: "/live-scores", label: "Live", icon: Radio, exact: false, isLive: true },
] as const;

export function BottomTabBar() {
  const rawPath = useRouterState({ select: (s) => s.location.pathname });
  const path =
    typeof rawPath === "string"
      ? rawPath
      : (rawPath as { location?: { pathname?: string } })?.location?.pathname || "/";
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (path === "/") {
      if (typeof window !== "undefined" && window.location.hash) {
        try {
          window.history.replaceState(null, "", "/");
        } catch {
          // ignore
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      e.preventDefault();
      navigate({ to: "/", search: {} });
    }
  };

  const handleTabClick = (e: React.MouseEvent, t: NavTabItem) => {
    if (t.isLive || t.to === "/live-scores") {
      e.preventDefault();
      navigate({ to: "/live-scores", search: {} });
    } else if (t.to === "/") {
      handleHomeClick(e);
    }
  };

  const isLiveRoute = path === "/live-scores" || path === "/live";

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-[70] pointer-events-auto border-t border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/85 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),10px)] backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.7)] lg:hidden select-none transition-all touch-manipulation transform-gpu"
    >
      <ul className="grid grid-cols-5 items-center px-1">
        {BOTTOM_NAV_TABS.map((t) => {
          const isLiveTab = t.isLive;
          const active = isLiveTab
            ? isLiveRoute
            : !isLiveRoute &&
              (t.exact
                ? path === t.to
                : t.to === "/train"
                  ? path === "/train" ||
                    path.startsWith("/train/") ||
                    path === "/coaches" ||
                    path.startsWith("/coaches/") ||
                    path === "/academy" ||
                    path.startsWith("/academy/")
                  : path === t.to || path.startsWith(t.to + "/"));

          return (
            <li key={t.label} className="relative flex justify-center">
              <Link
                to={t.to}
                search={{}}
                onClick={(e) => handleTabClick(e, t)}
                className={cn(
                  "relative flex min-h-[56px] w-full flex-col items-center justify-center py-1 text-[11px] transition-all active:scale-95",
                  active
                    ? "font-bold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
                data-testid={`bottom-tab-${t.label.toLowerCase()}`}
              >
                {/* Active Indicator Micro-pill */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-[2.5px] w-8 rounded-full bg-primary shadow-[0_0_8px_var(--neon-glow)] animate-in fade-in zoom-in-75 duration-200"
                  />
                )}

                {/* Tab Icon Container */}
                <span
                  className={cn(
                    "relative grid h-7 w-12 place-items-center rounded-full transition-all duration-200",
                    active
                      ? "bg-primary/15 text-primary scale-105 shadow-xs"
                      : isLiveTab
                        ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                        : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <t.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {isLiveTab && (
                    <span className="absolute top-0.5 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </span>

                {/* Tab Label */}
                <span className="leading-tight tracking-tight mt-0.5 text-[10px] sm:text-[11px]">
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

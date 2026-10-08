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
  { to: "/", label: "Live", icon: Radio, exact: false, isLive: true },
] as const;

export function BottomTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [isLiveActive, setIsLiveActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      setIsLiveActive(window.location.hash === "#live-scores");
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [path]);

  const handleLiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiveActive(true);
    if (path === "/") {
      const el = document.getElementById("live-scores") || document.getElementById("match-center");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        try {
          window.history.replaceState(null, "", "/#live-scores");
        } catch {
          // ignore
        }
      }
    } else {
      navigate({ to: "/", search: {} }).then(() => {
        setTimeout(() => {
          const el =
            document.getElementById("live-scores") || document.getElementById("match-center");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            try {
              window.history.replaceState(null, "", "/#live-scores");
            } catch {
              // ignore
            }
          }
        }, 120);
      });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsLiveActive(false);
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
    if (t.isLive) {
      handleLiveClick(e);
    } else if (t.to === "/") {
      handleHomeClick(e);
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-[70] pointer-events-auto border-t border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/85 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),10px)] backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.7)] lg:hidden select-none transition-all touch-manipulation transform-gpu"
    >
      <ul className="grid grid-cols-5 items-center px-1">
        {BOTTOM_NAV_TABS.map((t) => {
          const isLiveTab = t.isLive;
          const active = isLiveTab
            ? path === "/" && isLiveActive
            : !isLiveActive &&
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

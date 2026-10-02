import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, CalendarCheck, Swords, GraduationCap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/play", label: "Play", icon: Swords, exact: false },
  { to: "/book", label: "Book", icon: CalendarCheck, exact: false },
  { to: "/train", label: "Train", icon: GraduationCap, exact: false },
  { to: "/#live-scores", label: "Live", icon: Radio, exact: false, isLive: true },
] as const;

export function BottomTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLiveClick = (e: React.MouseEvent) => {
    if (path === "/") {
      e.preventDefault();
      const el = document.getElementById("live-scores") || document.getElementById("match-center");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.45)] lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {TABS.map((t) => {
          const isLiveTab = "isLive" in t && t.isLive;
          const active =
            !isLiveTab && (t.exact ? path === t.to : path === t.to || path.startsWith(t.to + "/"));

          return (
            <li key={t.label} className="relative flex justify-center">
              <Link
                to={t.to}
                onClick={isLiveTab ? handleLiveClick : undefined}
                className={cn(
                  "relative flex min-h-[52px] w-full flex-col items-center justify-center gap-1 py-1 text-[11px] transition-all active:scale-90",
                  active
                    ? "font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {/* Active Indicator Micro-pill */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 h-0.5 w-6 rounded-full bg-primary shadow-xs"
                  />
                )}

                {/* Tab Icon Container */}
                <span
                  className={cn(
                    "relative grid h-8 w-12 place-items-center rounded-full transition-colors",
                    active
                      ? "bg-primary/15 text-primary shadow-xs"
                      : isLiveTab
                        ? "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500"
                        : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <t.icon className="h-[19px] w-[19px] shrink-0" aria-hidden="true" />
                  {isLiveTab && (
                    <span className="absolute top-1 right-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </span>

                {/* Tab Label */}
                <span className="leading-none tracking-tight flex items-center gap-0.5">
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

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, CalendarCheck, Swords, GraduationCap, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/play", label: "Play", icon: Swords, exact: false },
  { to: "/book", label: "Book", icon: CalendarCheck, exact: false },
  { to: "/train", label: "Train", icon: GraduationCap, exact: false },
  { to: "/dashboard", label: "Me", icon: User, exact: false },
] as const;

export function BottomTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const auth = useAuth();
  const { isAuthenticated, name, user } = auth;
  const isAuth = Boolean(isAuthenticated);
  const userName = name || user?.name;
  const initial = isAuth && userName ? userName.trim()[0]?.toUpperCase() : null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.45)] lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {TABS.map((t) => {
          const active = t.exact ? path === t.to : path === t.to || path.startsWith(t.to + "/");
          return (
            <li key={t.to} className="relative flex justify-center">
              <Link
                to={t.to}
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
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {t.to === "/dashboard" && initial ? (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {initial}
                    </span>
                  ) : (
                    <t.icon className="h-[19px] w-[19px] shrink-0" aria-hidden="true" />
                  )}
                </span>

                {/* Tab Label */}
                <span className="leading-none tracking-tight">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

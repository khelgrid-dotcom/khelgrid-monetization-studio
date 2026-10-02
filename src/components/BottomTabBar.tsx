import { Link, useRouterState } from "@tanstack/react-router";
import { Home, CalendarCheck, Swords, Trophy, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const TABS = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    isActive: (p: string) => p === "/",
  },
  {
    to: "/play",
    label: "Play",
    icon: Swords,
    isActive: (p: string) => p === "/play" || p.startsWith("/play/"),
  },
  {
    to: "/book",
    label: "Book",
    icon: CalendarCheck,
    isActive: (p: string) => p === "/book" || p.startsWith("/book/"),
  },
  {
    to: "/search",
    label: "Trials",
    icon: Trophy,
    isActive: (p: string) =>
      p === "/search" ||
      p.startsWith("/search/") ||
      p === "/trials" ||
      p.startsWith("/trials/") ||
      p.startsWith("/trial/") ||
      p === "/events" ||
      p.startsWith("/events/"),
  },
  {
    to: "/dashboard",
    label: "Me",
    icon: User,
    isActive: (p: string) =>
      p === "/dashboard" ||
      p.startsWith("/dashboard/") ||
      p === "/profile" ||
      p.startsWith("/profile/") ||
      p === "/onboarding" ||
      p === "/settings" ||
      p === "/login",
  },
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
      aria-label="Mobile Bottom App Bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),10px)] backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)] lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {TABS.map((t) => {
          const active = t.isActive(path);
          return (
            <li key={t.to} className="relative flex justify-center">
              <Link
                to={t.to}
                className={cn(
                  "relative flex min-h-[50px] w-full flex-col items-center justify-center gap-1 py-0.5 text-[10px] transition-all active:scale-90",
                  active
                    ? "font-bold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {/* Active Indicator Top Micro-Bar */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 h-0.5 w-7 rounded-full bg-primary shadow-xs"
                  />
                )}

                {/* Tab Icon Pill */}
                <span
                  className={cn(
                    "relative grid h-8 w-12 place-items-center rounded-full transition-all duration-150",
                    active
                      ? "bg-primary/15 text-primary shadow-xs"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {t.to === "/dashboard" && initial ? (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary ring-1 ring-primary/40">
                      {initial}
                    </span>
                  ) : (
                    <t.icon
                      className={cn(
                        "h-[19px] w-[19px] shrink-0 transition-transform",
                        active ? "scale-105" : "",
                      )}
                      aria-hidden="true"
                    />
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

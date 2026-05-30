import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Compass, User, Crown } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/search", label: "Search", icon: Search, exact: false },
  { to: "/opportunities", label: "Opps", icon: Compass, exact: false },
  { to: "/pricing", label: "Pro", icon: Crown, exact: false },
  { to: "/dashboard", label: "Me", icon: User, exact: false },
] as const;

export function BottomTabBar() {
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(t => {
          const active = t.exact ? path === t.to : path === t.to || path.startsWith(t.to + "/");
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${
                    active ? "bg-primary/15" : ""
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

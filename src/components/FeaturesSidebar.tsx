import { useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FEATURE_ITEMS, isActivePath, type NavItem } from "@/config/nav";
import { NavLink } from "@/components/NavLink";

// Re-exported for tests and any callers that imported the array directly.
export const FEATURES: readonly NavItem[] = FEATURE_ITEMS;

export function FeaturesSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FEATURES.slice();
    return FEATURES.filter((f) => f.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <aside
      className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-border/60 bg-background/40 backdrop-blur-xl transition-all md:flex ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Features
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search features…"
              className="w-full rounded-md border border-border bg-secondary/40 py-1.5 pl-8 pr-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4">
        {filtered.map((f) => (
          <NavLink
            key={f.to}
            item={f}
            active={isActivePath(path, f.to)}
            source="sidebar_desktop"
            showLabel={!collapsed}
          />
        ))}
        {filtered.length === 0 && !collapsed && (
          <p className="px-3 py-2 text-xs text-muted-foreground">No matches found</p>
        )}
      </nav>
    </aside>
  );
}

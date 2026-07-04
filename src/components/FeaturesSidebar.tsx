import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles, Bot, ShieldCheck, ScanLine, Users, BookOpen, Crown,
  GraduationCap, Smartphone, Info, ChevronLeft, ChevronRight,
  CalendarCheck, CalendarDays, Star, Search, Trophy, MapPin, Wrench,
  Swords,
} from "lucide-react";

export const FEATURES = [
  { to: "/search", label: "Search trials", icon: Search },
  { to: "/sports", label: "Sports", icon: Trophy },
  { to: "/cities", label: "Cities", icon: MapPin },
  { to: "/guides", label: "Guides", icon: BookOpen },
  { to: "/tools", label: "Tools & calculators", icon: Wrench },
  { to: "/play", label: "Play · Find games", icon: Swords },
  { to: "/book", label: "Book venues", icon: CalendarCheck },
  { to: "/train", label: "Train · Coaching", icon: GraduationCap },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/memberships", label: "Memberships", icon: Star },
  { to: "/start-from-zero", label: "Start From Zero", icon: Sparkles },
  { to: "/ai-guide", label: "AI Guide", icon: Bot },
  { to: "/verify", label: "Verify", icon: ShieldCheck },
  { to: "/talent-scanner", label: "Talent Scanner", icon: ScanLine },
  { to: "/community", label: "Community", icon: Users },
  { to: "/learning-hub", label: "Learning Hub", icon: BookOpen },
  { to: "/pricing", label: "Pricing", icon: Crown },
  { to: "/coaches", label: "Coaches", icon: GraduationCap },
  { to: "/mobile-app", label: "Mobile App", icon: Smartphone },
  { to: "/about", label: "About", icon: Info },
] as const;

export function FeaturesSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const path = useRouterState({ select: s => s.location.pathname });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FEATURES.slice();
    return FEATURES.filter(f => f.label.toLowerCase().includes(q));
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
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search features…"
              className="w-full rounded-md border border-border bg-secondary/40 py-1.5 pl-8 pr-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4">
        {filtered.map(f => {
          const active = path === f.to;
          return (
            <Link
              key={f.to}
              to={f.to}
              title={f.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <f.icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{f.label}</span>}
            </Link>
          );
        })}
        {filtered.length === 0 && !collapsed && (
          <p className="px-3 py-2 text-xs text-muted-foreground">No matches found</p>
        )}
      </nav>
    </aside>
  );
}

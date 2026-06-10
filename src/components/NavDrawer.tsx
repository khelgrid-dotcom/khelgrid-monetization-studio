import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Trophy,
  Sparkles,
  Bot,
  ShieldCheck,
  ScanLine,
  Users,
  BookOpen,
  Crown,
  GraduationCap,
  Smartphone,
  Info,
  Home,
  Search,
  Compass,
  User,
  Wallet,
  LogIn,
  Zap,
  CalendarCheck,
  CalendarDays,
  Star,
} from "lucide-react";

const PRIMARY = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search trials", icon: Search },
  { to: "/sports", label: "Sports", icon: Trophy },
  { to: "/cities", label: "Cities", icon: Compass },
  { to: "/guides", label: "Guides", icon: BookOpen },
  { to: "/tools", label: "Tools & calculators", icon: Zap },
  { to: "/play", label: "Play · Find games", icon: Users },
  { to: "/book", label: "Book venues", icon: CalendarCheck },
  { to: "/train", label: "Train · Coaching", icon: GraduationCap },
  { to: "/events", label: "Events & tournaments", icon: CalendarDays },
  { to: "/memberships", label: "Memberships", icon: Star },
  { to: "/dashboard", label: "My Dashboard", icon: User },
] as const;

const FEATURES = [
  { to: "/start-from-zero", label: "Start From Zero", icon: Sparkles },
  { to: "/ai-guide", label: "AI Guide", icon: Bot },
  { to: "/verify", label: "Verify", icon: ShieldCheck },
  { to: "/talent-scanner", label: "Talent Scanner", icon: ScanLine },
  { to: "/community", label: "Community", icon: Users },
  { to: "/learning-hub", label: "Learning Hub", icon: BookOpen },
  { to: "/coaches", label: "Coaches", icon: GraduationCap },
  { to: "/academy", label: "For Academies", icon: Trophy },
  { to: "/mobile-app", label: "Mobile App", icon: Smartphone },
  { to: "/about", label: "About", icon: Info },
] as const;

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { plan, wallet } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [path]);

  const filteredPrimary = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? PRIMARY.filter(i => i.label.toLowerCase().includes(q)) : PRIMARY.slice();
  }, [query]);
  const filteredFeatures = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? FEATURES.filter(i => i.label.toLowerCase().includes(q)) : FEATURES.slice();
  }, [query]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-card/60 text-foreground hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0 pb-[env(safe-area-inset-bottom)] sm:max-w-sm">
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Khel<span className="text-primary">Grid</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Account strip */}
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {plan === "pro" ? "Pro Athlete" : "Guest Athlete"}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Wallet className="h-3 w-3" /> ₹{wallet} wallet
                </div>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
              <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" /> Log in</Link>
            </Button>
          </div>
        </div>

        {/* Sticky search */}
        <div className="sticky top-0 z-10 border-b border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search features…"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {filteredPrimary.length > 0 && (
            <Section title="Navigate">
              {filteredPrimary.map(i => (
                <DrawerLink key={i.to} to={i.to} label={i.label} icon={i.icon} active={path === i.to} />
              ))}
            </Section>
          )}

          {filteredFeatures.length > 0 && (
            <Section title="Features">
              {filteredFeatures.map(i => (
                <DrawerLink key={i.to} to={i.to} label={i.label} icon={i.icon} active={path === i.to} />
              ))}
            </Section>
          )}

          {filteredPrimary.length === 0 && filteredFeatures.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">No matches found</p>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
          <Button asChild className="w-full rounded-xl bg-gradient-hero text-primary-foreground hover:opacity-95">
            <Link to="/pricing">
              <Zap className="mr-1 h-4 w-4" /> {plan === "pro" ? "Manage Pro" : "Go Pro · ₹499/mo"}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function DrawerLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

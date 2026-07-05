import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, CalendarCheck, GraduationCap, CalendarDays, Globe, Zap, Trophy, Wallet, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { NavDrawer } from "@/components/NavDrawer";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/play", label: "Play", icon: Users },
  { to: "/book", label: "Book", icon: CalendarCheck },
  { to: "/train", label: "Train", icon: GraduationCap },
  { to: "/events", label: "Events", icon: CalendarDays },
] as const;

export function Navbar() {
  const { plan, wallet } = useAuth();
  const { unreadCount } = useNotifications();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Mobile: drawer */}
        <div className="md:hidden">
          <NavDrawer />
        </div>

        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            Khel<span className="text-primary">Grid</span>
          </span>
        </Link>

        {/* Desktop primary nav */}
        <nav className="ml-2 hidden items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 md:flex">
          {NAV.map(n => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Button asChild variant="ghost" size="sm" className="relative rounded-full md:px-3">
            <Link to="/recommendations" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>

          {/* Mobile: compact wallet pill */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground md:hidden"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />
            ₹{wallet}
          </Link>

          {/* Desktop only */}
          <button className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground lg:inline-flex">
            <Globe className="h-4 w-4" /> English
          </button>
          <Button asChild variant="ghost" size="sm" className="hidden rounded-full px-4 md:inline-flex">
            <Link to="/login">Log In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary md:inline-flex"
          >
            <Link to="/pricing">
              <Zap className="mr-1 h-4 w-4" /> {plan === "pro" ? "Pro" : "Go Pro"}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden rounded-full bg-secondary text-foreground hover:bg-secondary/80 lg:inline-flex"
          >
            <Link to="/academy">Academy</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

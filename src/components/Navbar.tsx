import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Users,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  Zap,
  Wallet,
  Bell,
  User,
  LogIn,
  Newspaper,
  MoreHorizontal,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { NavDrawer } from "@/components/NavDrawer";
import { SportsLauncher } from "@/components/SportsLauncher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FeedbackSupportDialog } from "@/components/FeedbackSupportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isActivePath } from "@/config/nav";

// Most important core navigation features
const PRIMARY_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/play", label: "Play", icon: Users },
  { to: "/book", label: "Book", icon: CalendarCheck },
  { to: "/train", label: "Train", icon: GraduationCap },
  { to: "/events", label: "Events", icon: CalendarDays },
] as const;

// Secondary items accessible via clean dropdown to prevent top bar overflow
const SECONDARY_NAV = [
  { to: "/community", label: "Community", icon: Users },
  { to: "/blog", label: "Blog", icon: Newspaper },
] as const;

export function Navbar() {
  const auth = useAuth();
  const { plan, wallet } = auth;
  const isAuth = Boolean(auth.isAuthenticated);
  const role = auth.role || "user";
  const userName = auth.name || auth.user?.name || "Athlete";

  const { unreadCount } = useNotifications();
  const [sportsLauncherOpen, setSportsLauncherOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Mobile: drawer */}
        <div className="lg:hidden">
          <NavDrawer />
        </div>

        <button
          onClick={() => setSportsLauncherOpen(true)}
          className="flex shrink-0 items-center gap-2 transition hover:opacity-80"
          title="Open Sports Selector"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fbb0e1ceb11294a31a719df6ba93a7331%2Fc8513d4ae3bd4939b4defe6841f88dd7?format=webp&width=800&height=1200"
            alt="KhelGrid"
            className="h-8 w-8 cursor-pointer"
          />
          <span className="text-base font-bold tracking-tight sm:text-xl">
            Khel<span className="text-primary">Grid</span>
          </span>
        </button>

        {/* Desktop primary nav - Essential core features only */}
        <nav className="ml-2 hidden shrink-0 items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 lg:flex">
          {PRIMARY_NAV.map((n) => {
            const active = isActivePath(path, n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}

          {/* More menu for secondary links so they never overflow */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors ${
                  SECONDARY_NAV.some((s) => isActivePath(path, s.to))
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="More options"
                aria-label="More navigation items"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
              {SECONDARY_NAV.map((item) => (
                <DropdownMenuItem key={item.to} asChild className="cursor-pointer rounded-lg">
                  <Link to={item.to} className="flex items-center gap-2.5 px-2.5 py-2 text-sm">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right cluster - Most important actions only */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
          >
            <Link to="/recommendations" title="Notifications" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          </Button>

          {/* Settings Menu with Theme Switcher inside */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="navbar-settings-btn"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground sm:h-9 sm:w-9"
                title="Settings & Appearance"
                aria-label="Settings and Appearance"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-lg">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Appearance
              </div>
              <div className="px-1 pb-1" onClick={(e) => e.stopPropagation()}>
                <ThemeSwitcher
                  id="navbar-settings-theme-switcher"
                  variant="segmented"
                  className="flex w-full"
                />
              </div>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                id="navbar-feedback-btn"
                onSelect={() => setFeedbackOpen(true)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium"
              >
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                <span>Feedback & Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>All Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile/Tablet: compact wallet pill */}
          <Link
            to="/dashboard"
            className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground sm:flex xl:hidden"
            title="Wallet balance"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />₹{wallet}
          </Link>

          {/* Single Unified Auth/Account Control */}
          {isAuth ? (
            <Link
              to={role === "coach" ? "/scout-portal" : role === "academy" ? "/academy" : "/profile"}
              title={`Signed in as ${userName} (${role})`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-muted/60 sm:gap-2 sm:px-3"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  role === "coach"
                    ? "bg-blue-500"
                    : role === "academy"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
                {role === "coach" ? "Coach" : role === "academy" ? "Academy" : "Athlete"}
              </span>
              <span className="max-w-[70px] truncate font-bold text-foreground sm:max-w-[85px]">
                {userName.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
              id="navbar-login-btn"
              className="h-8 w-8 shrink-0 rounded-full text-foreground hover:bg-muted/60 sm:h-9 sm:w-9"
            >
              <Link to="/login" title="Log In" aria-label="Log In">
                <LogIn className="h-4 w-4 text-primary" />
                <span className="sr-only">Log In</span>
              </Link>
            </Button>
          )}

          {/* Go Pro CTA */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary sm:inline-flex"
          >
            <Link to="/pricing">
              <Zap className="mr-1 h-3.5 w-3.5" /> {plan === "pro" ? "Pro" : "Go Pro"}
            </Link>
          </Button>
        </div>
      </div>

      <SportsLauncher open={sportsLauncherOpen} onOpenChange={setSportsLauncherOpen} />
      <FeedbackSupportDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </header>
  );
}

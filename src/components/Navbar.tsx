import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Compass, BookOpen, Globe, Zap, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/opportunities", label: "Opportunities", icon: Compass },
  { to: "/resources", label: "Resources", icon: BookOpen },
] as const;

export function Navbar() {
  const { plan } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Khel<span className="text-primary">Grid</span>
          </span>
        </Link>

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

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
            <Globe className="h-4 w-4" /> English
          </button>
          <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full border-primary/60 text-primary hover:bg-primary/10 hover:text-primary">
            <Link to="/pricing">
              <Zap className="mr-1 h-4 w-4" /> {plan === "pro" ? "Pro" : "Go Pro"}
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-secondary text-foreground hover:bg-secondary/80">
            <Link to="/academy">Academy</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

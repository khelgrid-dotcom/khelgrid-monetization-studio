import { Link, useRouterState } from "@tanstack/react-router";
import { Wallet, Trophy, LayoutDashboard, Flame, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { wallet, plan, role, setRole } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });

  const nav = [
    { to: "/", label: "Home", icon: Sparkles },
    { to: "/trials", label: "Live Trials", icon: Trophy },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Flame className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">KhelGrid</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">India's sports grid</div>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map(n => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setRole(role === "athlete" ? "organizer" : "athlete")}
            className="hidden rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
            title="Toggle simulator role"
          >
            View as: <span className="ml-1 capitalize text-foreground">{role}</span>
          </button>

          {plan === "pro" ? (
            <Badge className="bg-gradient-gold text-primary-foreground border-0 shadow-sm">PRO</Badge>
          ) : (
            <Badge variant="secondary" className="border-border">Free</Badge>
          )}

          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">₹{wallet.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

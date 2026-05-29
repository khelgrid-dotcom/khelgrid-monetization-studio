import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { TRIALS } from "@/data/trials";
import { SportsCV } from "@/components/SportsCV";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, Crown, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · KhelGrid" },
      { name: "description", content: "Track your applications, wallet balance, and unlock your Verified Sports CV." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { name, wallet, plan, applications, paidApplications, topUpWallet, freeLimit, remainingFree, reset, upgradeToPro } = useAuth();
  const applied = TRIALS.filter(t => applications.includes(t.id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">Your athlete control room.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { reset(); toast.success("Simulator reset"); }}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset simulator
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>Wallet balance</span><Wallet className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold">₹{wallet.toLocaleString("en-IN")}</div>
          <Button onClick={() => { topUpWallet(500); toast.success("₹500 added to wallet"); }} variant="outline" size="sm" className="mt-3">
            <Plus className="mr-1 h-3.5 w-3.5" /> Top up ₹500
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>Applications</span><Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold">{applications.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {plan === "pro" ? "Unlimited on Pro" : `${remainingFree} / ${freeLimit} free remaining · ${paidApplications.length} paid`}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${plan === "pro" ? "border-primary/40 bg-gradient-hero text-primary-foreground" : "border-border bg-gradient-card"}`}>
          <div className="flex items-center justify-between text-xs uppercase tracking-wider opacity-80">
            <span>Plan</span><Crown className="h-4 w-4" />
          </div>
          <div className="mt-2 text-3xl font-bold capitalize">{plan === "pro" ? "Pro" : "Free"}</div>
          {plan === "free" ? (
            <Button onClick={() => { upgradeToPro(); toast.success("Welcome to Pro 🎉"); }} size="sm" className="mt-3 bg-gradient-gold text-primary-foreground hover:opacity-90">
              Upgrade · ₹499/mo
            </Button>
          ) : (
            <Badge className="mt-3 bg-black/30 border-0 text-white">Renews monthly</Badge>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="mb-3 text-lg font-semibold">My applications</h2>
          {applied.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No applications yet.{" "}
              <Link to="/trials" className="text-primary underline-offset-4 hover:underline">Browse live trials →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applied.map(t => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-gradient-card p-4">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.academy} · {t.city} · {t.date}</div>
                  </div>
                  {paidApplications.includes(t.id) ? (
                    <Badge className="bg-gradient-gold text-primary-foreground border-0">Paid · ₹49</Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Verified Sports CV</h2>
          <SportsCV />
        </div>
      </div>
    </main>
  );
}

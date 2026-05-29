import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturesSidebar } from "@/components/FeaturesSidebar";
import { Search, Trophy, MapPin, ChevronDown, ArrowRight, Crown, Flame, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KhelGrid · India's Sports Opportunity Network" },
      { name: "description", content: "Find trials, tournaments, leagues, camps, scholarships, fitness events, and online competitions across India." },
    ],
  }),
  component: Home,
});

const SPORTS = ["All Sports", "Cricket", "Football", "Badminton", "Athletics", "Hockey", "Tennis"];
const LOCATIONS = ["All Locations", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chandigarh", "Pune"];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All Sports");
  const [location, setLocation] = useState("All Locations");

  const submit = () =>
    navigate({
      to: "/search",
      search: { q: query, sport, city: location, sort: "Soonest", free: false },
    });

  return (
    <div className="flex">
      <FeaturesSidebar />

      <main className="min-w-0 flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-10%,oklch(0.78_0.19_155/0.18),transparent_70%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:pt-24 text-center">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              KhelGrid — India's Sports Opportunity Network
            </Badge>

            <h1 className="mt-8 text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
              <span className="block">Discover.</span>
              <span className="block bg-gradient-to-r from-[oklch(0.78_0.18_55)] via-[oklch(0.82_0.18_95)] to-[oklch(0.78_0.19_155)] bg-clip-text text-transparent">
                Participate. Compete.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Find trials, tournaments, leagues, camps, scholarships, fitness events, and online competitions. Start where you are and build your sports journey.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder="Sport, event, organizer, venue…"
                  className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/40 sm:w-44">
                  <Trophy className="mr-1 h-4 w-4 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/40 sm:w-44">
                  <MapPin className="mr-1 h-4 w-4 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>

              <Button onClick={submit} size="lg" className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95">
                Find Matches <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div>🏆 1,200+ live opportunities</div>
              <div>🛡️ 86k verified athletes</div>
              <div>👑 240 partner academies</div>
            </div>
          </div>
        </section>

        {/* Monetization cards */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">Built for athletes. Powered by academies.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: "Micropayments", price: "₹49 per application", desc: "Free users get 2 applications. Unlock more via wallet or UPI.", to: "/trials" },
              { icon: Crown, title: "KhelGrid Pro", price: "₹499 / month", desc: "Unlimited applications, Verified Sports CV, priority scouting.", highlight: true, to: "/pricing" },
              { icon: Flame, title: "Academy Boost", price: "₹1,500 / 7 days", desc: "Pin your trial to the top with a glowing Featured row.", to: "/trials" },
            ].map(card => (
              <Link
                key={card.title}
                to={card.to}
                className={`group rounded-2xl border bg-gradient-card p-6 transition-all hover:-translate-y-1 ${
                  card.highlight ? "border-primary/40 animate-pulse-glow" : "border-border hover:border-border/80"
                }`}
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${card.highlight ? "bg-gradient-hero" : "bg-secondary"}`}>
                  <card.icon className={`h-5 w-5 ${card.highlight ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                <div className="text-sm text-primary">{card.price}</div>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
                <div className="mt-4 inline-flex items-center text-xs text-muted-foreground group-hover:text-foreground">
                  Learn more <ChevronDown className="ml-1 h-3 w-3 -rotate-90" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

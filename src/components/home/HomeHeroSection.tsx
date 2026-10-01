import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Trophy,
  MapPin,
  ArrowRight,
  Swords,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SPORTS = [
  "All Sports",
  "Cricket",
  "Football",
  "Badminton",
  "Athletics",
  "Hockey",
  "Tennis",
  "Wrestling",
] as const;

export const LOCATIONS = [
  "All Locations",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Pune",
] as const;

export const CATEGORY_CARDS = [
  { to: "/play", label: "Play", desc: "Find games", icon: Swords },
  { to: "/book", label: "Book", desc: "Venues & turfs", icon: CalendarCheck },
  { to: "/train", label: "Train", desc: "Coaching", icon: GraduationCap },
  { to: "/events", label: "Events", desc: "Tournaments", icon: CalendarDays },
  { to: "/memberships", label: "Memberships", desc: "Perks & passes", icon: Star },
] as const;

export function HomeHeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>("All Sports");
  const [location, setLocation] = useState<string>("All Locations");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: query.trim(),
        sport: sport === "All Sports" ? undefined : sport,
        city: location === "All Locations" ? undefined : location,
        sort: "Soonest",
        free: false,
      },
    });
  };

  return (
    <section
      aria-label="Hero Discovery and Search"
      className="relative overflow-hidden pt-6 pb-6 sm:pt-10 sm:pb-10"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_350px_at_50%_-10%,oklch(0.78_0.19_155/0.14),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="sr-only">
          KhelGrid · India&apos;s Sports Opportunity Network · Discover trials, book venues, join
          games
        </h1>

        {/* Central Search Card — Stacked on mobile, row on tablet/desktop */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/90 p-2 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center"
        >
          {/* Text Input */}
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sport, event, organizer, venue…"
              aria-label="Search trials, venues, or sports events"
              className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 gap-2 sm:contents">
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger
                aria-label="Filter by sport"
                className="h-11 rounded-xl border-border bg-secondary/40 sm:w-44"
              >
                <Trophy className="mr-1 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger
                aria-label="Filter by city or location"
                className="h-11 rounded-xl border-border bg-secondary/40 sm:w-44"
              >
                <MapPin className="mr-1 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            size="lg"
            className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
          >
            <span>Find Matches</span>
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        {/* Verification and Value Trust Indicators */}
        <div className="my-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:my-6 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true">🏆</span>
            <span>Curated opportunity listings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true">🛡️</span>
            <span>Verification-first discovery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true">👑</span>
            <span>Built for athletes and academies</span>
          </div>
        </div>

        {/* 5 Quick Action Category Cards */}
        <nav
          aria-label="Quick sports categories"
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:p-0"
        >
          {CATEGORY_CARDS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex min-w-[130px] flex-1 shrink-0 snap-start flex-col items-start rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs active:scale-[0.98] sm:min-w-0 sm:shrink"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                <t.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold text-foreground sm:text-base">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

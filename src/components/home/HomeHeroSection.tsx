import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Trophy,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
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
  "Kabaddi",
  "Basketball",
] as const;

export const LOCATIONS = [
  "All Locations",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Pune",
  "Kolkata",
  "Chennai",
] as const;

export const QUICK_TAGS = [
  { label: "SAI Trials", sport: "Athletics", q: "SAI" },
  { label: "Cricket Selections", sport: "Cricket", q: "Cricket" },
  { label: "Football Turf", sport: "Football", q: "Turf" },
  { label: "Badminton Courts", sport: "Badminton", q: "Badminton" },
  { label: "State Wrestling", sport: "Wrestling", q: "Wrestling" },
] as const;

export const HERO_STATS = [
  { value: "350+", label: "Verified Trials", icon: Trophy },
  { value: "1,200+", label: "Turfs & Venues", icon: Building2 },
  { value: "16+", label: "Sports Covered", icon: Compass },
  { value: "28", label: "States & UTs", icon: Users },
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

  const handleQuickTagClick = (tag: (typeof QUICK_TAGS)[number]) => {
    navigate({
      to: "/search",
      search: {
        q: tag.q,
        sport: tag.sport,
        sort: "Soonest",
        free: false,
      },
    });
  };

  return (
    <section
      id="hero"
      aria-label="Hero Discovery and Search"
      className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16"
    >
      {/* Background ambient gradient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_450px_at_50%_-5%,oklch(0.56_0.22_275/0.14),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Eyebrow & Main Title */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>India&apos;s Verified Sports Ecosystem</span>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <span className="text-primary font-semibold">SAI, Federations & Clubs</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Find the right sports opportunity across <span className="text-gradient">India</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg max-w-2xl mx-auto text-balance">
            Discover verified trials, book high-grade venues, join competitive pickup games, enroll in coaching academies, and build your athlete Sports CV.
          </p>
        </div>

        {/* Central Search Card */}
        <div className="mx-auto mt-8 max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center"
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
                placeholder="Search trial, turf name, academy, or city…"
                aria-label="Search trials, venues, or sports events"
                className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 gap-2 sm:contents">
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger
                  aria-label="Filter by sport"
                  className="h-11 rounded-xl border-border bg-secondary/50 sm:w-44 text-sm"
                >
                  <Trophy className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
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
                  className="h-11 rounded-xl border-border bg-secondary/50 sm:w-44 text-sm"
                >
                  <MapPin className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
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
              className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95 cursor-pointer shadow-sm active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Popular:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Athletic Spotlight & Quantitative Impact Strip */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-muted">
            <img
              src="/src/assets/images/khelgrid_hero_athletes_1790836288244.jpg"
              alt="Young Indian athletes sprinting on a modern training track"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* Contrast scrim overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  Grassroots to Podium
                </p>
                <p className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                  Connecting over 50,000+ emerging athletes across 28 states
                </p>
              </div>
              <Link
                to="/start-from-zero"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
              >
                <span>Read the Athlete Pathway Guide</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 divide-border/60 bg-card sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="p-4 text-center sm:p-5">
                <div className="flex items-center justify-center gap-1.5 text-primary">
                  <stat.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

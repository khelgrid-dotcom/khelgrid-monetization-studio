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
  SlidersHorizontal,
  ChevronDown,
  Building2,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { MetroCityPickerModal } from "./MetroCityPickerModal";

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
  {
    to: "/play",
    label: "Play",
    desc: "Find games",
    icon: Swords,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    to: "/book",
    label: "Book",
    desc: "Venues & turfs",
    icon: CalendarCheck,
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    to: "/train",
    label: "Train",
    desc: "Coaching",
    icon: GraduationCap,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    to: "/events",
    label: "Events",
    desc: "Tournaments",
    icon: CalendarDays,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    to: "/memberships",
    label: "Memberships",
    desc: "Perks & passes",
    icon: Star,
    color: "text-rose-500 bg-rose-500/10",
  },
] as const;

export const POPULAR_SPORT_PILLS = [
  { name: "Cricket", emoji: "🏏" },
  { name: "Football", emoji: "⚽" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Athletics", emoji: "🏃" },
  { name: "Tennis", emoji: "🎾" },
  { name: "Wrestling", emoji: "🤼" },
] as const;

export function HomeHeroSection() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { isAuthenticated, name, user, role } = auth;
  const isAuth = Boolean(isAuthenticated);
  const userName = name || user?.name || "Athlete";

  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>("All Sports");
  const [location, setLocation] = useState<string>("All Locations");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [metroPickerOpen, setMetroPickerOpen] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: query.trim() || undefined,
        sport: sport === "All Sports" ? undefined : sport,
        city: location === "All Locations" ? undefined : location,
        sort: "Soonest",
        free: false,
      },
    });
  };

  const handleSportPillClick = (selectedSport: string) => {
    setSport(selectedSport);
    navigate({
      to: "/search",
      search: {
        sport: selectedSport,
        city: location === "All Locations" ? undefined : location,
        sort: "Soonest",
        free: false,
      },
    });
  };

  return (
    <section
      aria-label="Hero Discovery and Search"
      className="relative overflow-hidden pt-3 pb-6 sm:pt-8 sm:pb-10"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_350px_at_50%_-10%,oklch(0.78_0.19_155/0.14),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-3.5 sm:px-6">
        <h1 className="sr-only">
          KhelGrid · India&apos;s Sports Opportunity Network · Discover trials, book venues, join
          games
        </h1>

        {/* ========================================================================= */}
        {/* PERSONALIZED ATHLETE GREETING (Authenticated) or BRAND STRIP (Guest)       */}
        {/* ========================================================================= */}
        {isAuth ? (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">
                👋
              </span>
              <div>
                <span className="font-bold text-foreground">Welcome back, {userName}!</span>
                <span className="hidden sm:inline text-muted-foreground ml-1">
                  · Exploring verified {role || "athlete"} opportunities in{" "}
                  {location !== "All Locations" ? location : "India"}.
                </span>
              </div>
            </div>
            <Link
              to="/profile"
              className="text-[11px] font-bold text-primary hover:underline shrink-0"
            >
              My Sports CV →
            </Link>
          </div>
        ) : null}

        {/* ========================================================================= */}
        {/* MOBILE APP HEADER STRIP (< sm): City Selector Modal, Live Matches Pill    */}
        {/* ========================================================================= */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:hidden">
          {/* Quick Location Selector Pill with Bottom Sheet */}
          <button
            type="button"
            onClick={() => setMetroPickerOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 cursor-pointer active:scale-95 transition-transform"
          >
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[120px]">{location}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>

          {/* Quick Live Scores Match Center Link */}
          <a
            href="#live-scores"
            className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 active:scale-95 transition-transform"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE MATCHES</span>
          </a>
        </div>

        {/* Metro City Picker Dialog */}
        <MetroCityPickerModal
          open={metroPickerOpen}
          onOpenChange={setMetroPickerOpen}
          selectedCity={location}
          onSelectCity={setLocation}
        />

        {/* ========================================================================= */}
        {/* UNIFIED SEARCH INTERFACE: App Search on Mobile (< sm), Bar on Desktop     */}
        {/* ========================================================================= */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/90 p-2 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center"
        >
          {/* Text Input with Search Icon */}
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trials, venues, coaches, sports…"
              aria-label="Search trials, venues, or sports events"
              className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Mobile Filter Toggle Button + Submit Button (< sm) */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className={cn(
                "h-10 flex-1 rounded-xl border-border text-xs font-semibold gap-1.5 cursor-pointer",
                (sport !== "All Sports" || location !== "All Locations") &&
                  "border-primary text-primary bg-primary/5",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{sport !== "All Sports" ? sport : "Filters"}</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              className="h-10 px-5 rounded-xl bg-gradient-hero text-xs font-bold text-primary-foreground shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>

          {/* Expandable filters on mobile when user toggles Filters */}
          {showFiltersModal && (
            <div className="grid grid-cols-2 gap-2 pt-1 sm:hidden">
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger aria-label="Filter by sport" className="h-10 rounded-xl text-xs">
                  <Trophy className="mr-1 h-3.5 w-3.5 text-primary shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => setMetroPickerOpen(true)}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground hover:bg-secondary/40 cursor-pointer"
              >
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-50 shrink-0" />
              </button>
            </div>
          )}

          {/* Desktop Dropdown Filters (>= sm) */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
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

            {/* Desktop Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
            >
              <span>Find Matches</span>
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>

        {/* Trending Sport Quick Pills (< sm) */}
        <div
          role="region"
          aria-label="Popular sports shortcuts"
          className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 sm:hidden -mx-3.5 px-3.5"
        >
          {POPULAR_SPORT_PILLS.map((sp) => (
            <button
              key={sp.name}
              type="button"
              onClick={() => handleSportPillClick(sp.name)}
              className="flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/50 hover:bg-secondary/70 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              <span>{sp.emoji}</span>
              <span>{sp.name}</span>
            </button>
          ))}
        </div>

        {/* Verification and Value Trust Indicators */}
        <div className="my-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground sm:my-6 sm:text-sm">
          <div className="flex items-center gap-1">
            <span aria-hidden="true">🏆</span>
            <span>Curated opportunity listings</span>
          </div>
          <div className="flex items-center gap-1">
            <span aria-hidden="true">🛡️</span>
            <span>Verification-first discovery</span>
          </div>
          <div className="flex items-center gap-1">
            <span aria-hidden="true">👑</span>
            <span>Built for athletes & academies</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5 APP QUICK ACTIONS: App Grid on Mobile (< sm), Cards on Desktop (>= sm)  */}
        {/* ========================================================================= */}
        <nav aria-label="Core sports navigation" className="mt-2">
          {/* Mobile Grid Layout (< sm): 5 columns, native app icon tiles */}
          <div className="grid grid-cols-5 gap-1.5 sm:hidden">
            {CATEGORY_CARDS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 py-2.5 px-1 text-center transition-all hover:border-primary/40 active:scale-90 shadow-2xs"
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                    t.color,
                  )}
                >
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="mt-1.5 text-[11px] font-bold text-foreground leading-tight">
                  {t.label}
                </span>
                <span className="text-[9px] text-muted-foreground truncate w-full">{t.desc}</span>
              </Link>
            ))}
          </div>

          {/* Desktop & Tablet Layout (>= sm): 5 rich interactive cards */}
          <div className="hidden sm:grid sm:grid-cols-5 sm:gap-3">
            {CATEGORY_CARDS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex flex-col items-start rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs active:scale-[0.98]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="mt-3">
                  <div className="text-base font-semibold text-foreground">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* ========================================================================= */}
        {/* SPORTS CV QUICK START BANNER (Guest Athletes)                             */}
        {/* ========================================================================= */}
        {!isAuth ? (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary shadow-xs">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Ready for tryouts? Build your Verified Sports CV
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Apply for SAI, state federation & private academy trials with 1-click verified
                  credentials.
                </p>
              </div>
            </div>
            <Link
              to="/onboarding"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-95 transition-all shrink-0"
            >
              <span>Build Sports CV</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}

        {/* ========================================================================= */}
        {/* DUAL-SIDED MARKETPLACE INGRESS: "Post a Trial" for Academies & Organizers */}
        {/* ========================================================================= */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/60 px-3.5 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong className="text-foreground font-semibold">
                Running an Academy or Tournament?
              </strong>{" "}
              Reach 50,000+ verified athletes.
            </span>
          </div>
          <Link
            to="/partner"
            className="font-bold text-primary hover:underline shrink-0 flex items-center gap-1"
          >
            <span>Post a Trial</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

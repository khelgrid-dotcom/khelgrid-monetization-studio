import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FeaturesSidebar } from "@/components/FeaturesSidebar";
import {
  Search,
  Trophy,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Crown,
  Flame,
  Zap,
  Users,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BannerAd, ResponsiveAd } from "@/components/ads";
import { GUIDES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { TRIALS } from "@/data/trials";
import { SportsNewsSection } from "@/components/SportsNewsSection";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "KhelGrid · India's Sports Opportunity Network",
      description:
        "India's premier sports platform for discovery and development. Find trials, tournaments, leagues, verified academies, sports turf venues, and amateur pickup games across 16+ sports.",
      canonicalPath: "/",
      keywords:
        "sports trials India, sports academies near me, book turf, pickup sports games, badminton courts, cricket trials, football tournament, athletics scholarship",
      type: "website",
    }),
  component: Home,
});

const SPORTS = ["All Sports", "Cricket", "Football", "Badminton", "Athletics", "Hockey", "Tennis"];
const LOCATIONS = [
  "All Locations",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Pune",
];
const FEATURED_TRIALS = TRIALS.slice(0, 12);
const FEATURED_GUIDES = GUIDES_CATALOG.slice(0, 8);
const FEATURED_SPORTS = SPORTS_CATALOG.filter((sport) =>
  [
    "cricket",
    "football",
    "athletics",
    "badminton",
    "wrestling",
    "boxing",
    "swimming",
    "basketball",
  ].includes(sport.slug),
);

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All Sports");
  const [location, setLocation] = useState("All Locations");
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  const scrollOpportunities = (direction: "left" | "right") => {
    if (opportunitiesRef.current) {
      const scrollAmount = 300;
      opportunitiesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const submit = () =>
    navigate({
      to: "/search",
      search: { q: query, sport, city: location, sort: "Soonest", free: false },
    });

  return (
    <div className="flex">
      <FeaturesSidebar />

      <main className="min-w-0 flex-1">
        {/* Hero Section matching Image 2 */}
        <section className="relative overflow-hidden pt-6 pb-6 sm:pt-8 sm:pb-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_350px_at_50%_-10%,oklch(0.78_0.19_155/0.14),transparent_70%)]" />
          <div className="relative mx-auto max-w-5xl px-4">
            <h1 className="sr-only">
              KhelGrid · India&apos;s Sports Opportunity Network · Discover trials, book venues,
              join games
            </h1>

            {/* Search bar — stacked on mobile */}
            <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/90 p-2 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Sport, event, organizer, venue…"
                  className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:contents">
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger className="h-11 rounded-xl border-border bg-secondary/40 sm:w-44">
                    <Trophy className="mr-1 h-4 w-4 text-primary" />
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
                  <SelectTrigger className="h-11 rounded-xl border-border bg-secondary/40 sm:w-44">
                    <MapPin className="mr-1 h-4 w-4 text-primary" />
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

              <Button
                onClick={submit}
                size="lg"
                className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95"
              >
                Find Matches <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Trust points */}
            <div className="my-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:my-6 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span>🏆</span>
                <span>Curated opportunity listings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Verification-first discovery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👑</span>
                <span>Built for athletes and academies</span>
              </div>
            </div>

            {/* 5 Category Cards */}
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:p-0">
              {[
                { to: "/play", label: "Play", desc: "Find games", icon: Users },
                { to: "/book", label: "Book", desc: "Venues & turfs", icon: CalendarCheck },
                { to: "/train", label: "Train", desc: "Coaching", icon: GraduationCap },
                { to: "/events", label: "Events", desc: "Tournaments", icon: CalendarDays },
                { to: "/memberships", label: "Memberships", desc: "Perks & passes", icon: Star },
              ].map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className="group flex min-w-[130px] flex-1 shrink-0 snap-start flex-col items-start rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs active:scale-[0.98] sm:min-w-0 sm:shrink"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-foreground sm:text-base">
                      {t.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ad · below the fold, lazy-loaded, height reserved to avoid layout shift */}
        <div className="mx-auto max-w-7xl px-4">
          <BannerAd adSlot="homeBelowHero" minHeight={100} />
        </div>

        {/* Editorial discovery content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Sports opportunities in India
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Find the next practical step in your sports journey
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              KhelGrid brings trials, camps, tournaments, scholarships, training resources and
              preparation guidance together for athletes and families. Each listing shows what is
              known, what still needs confirmation, and where to check the organizer&apos;s latest
              instructions.
            </p>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Latest opportunities</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:hidden">
                  Swipe ↔
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Review the details before you apply, travel or pay.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 sm:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-border/80 bg-background/80"
                  onClick={() => scrollOpportunities("left")}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-border/80 bg-background/80"
                  onClick={() => scrollOpportunities("right")}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Link to="/search" className="text-sm font-semibold text-primary hover:underline">
                Browse all →
              </Link>
            </div>
          </div>

          <div
            ref={opportunitiesRef}
            className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:p-0 lg:grid-cols-4"
          >
            {FEATURED_TRIALS.map((trial) => (
              <Link
                key={trial.id}
                to="/trial/$id"
                params={{ id: trial.id }}
                className="group flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-gradient-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:scale-[0.99] sm:w-auto sm:shrink"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {trial.sport} · {trial.tag}
                    </span>
                    <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground">
                      {trial.fee === 0 ? "Free entry" : `₹${trial.fee}`}
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {trial.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
                    {trial.academy}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary/70 shrink-0" />
                    <span className="max-w-[120px] truncate">{trial.city}</span>
                  </span>
                  <span className="text-[11px] font-medium text-foreground/80">{trial.date}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Real-time Sports Wire & National Updates (SEO Optimized News Section) */}
          <SportsNewsSection />

          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Sports guides</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Practical reading for athletes, parents and coaches.
              </p>
            </div>
            <Link to="/guides" className="text-sm font-semibold text-primary hover:underline">
              Open Learning Hub →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                to="/guide/$slug"
                params={{ slug: guide.slug }}
                className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {guide.category} · {guide.readMins} min
                </div>
                <h3 className="mt-2 text-sm font-semibold">{guide.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {guide.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold tracking-tight">Sports pathways</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Start with the sport page for an overview, current listings, city links and
              preparation resources.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_SPORTS.map((sport) => (
                <Link
                  key={sport.slug}
                  to="/sport/$slug"
                  params={{ slug: sport.slug }}
                  className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sport.emoji}</span>
                    <span className="font-semibold">{sport.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{sport.tagline}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-6">
            <h2 className="text-xl font-semibold">How KhelGrid verifies opportunity information</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              We record the source used for a listing, separate organizer information from KhelGrid
              guidance, and ask users to confirm dates, venues, eligibility and fees with the latest
              official notice. Verification is context for safer research, not a guarantee of
              selection or event completion.
            </p>
            <Link
              to="/trust-center"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Read the Trust Center →
            </Link>
          </div>
        </section>

        {/* Monetization cards */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
          <h2 className="mb-5 text-center text-xl font-bold tracking-tight sm:mb-6 sm:text-2xl">
            Built for athletes. Powered by academies.
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Micropayments",
                price: "₹49 per application",
                desc: "Free users get 2 applications. Unlock more via wallet or UPI.",
                to: "/trials",
              },
              {
                icon: Crown,
                title: "KhelGrid Pro",
                price: "₹499 / month",
                desc: "Unlimited applications, Verified Sports CV, priority scouting.",
                highlight: true,
                to: "/pricing",
              },
              {
                icon: Flame,
                title: "Academy Boost",
                price: "₹1,500 / 7 days",
                desc: "Pin your trial to the top with a glowing Featured row.",
                to: "/trials",
              },
            ].map((card) => (
              <Link
                key={card.title}
                to={card.to}
                className={`group rounded-2xl border bg-gradient-card p-5 transition-all hover:-translate-y-1 sm:p-6 ${
                  card.highlight
                    ? "border-primary/40 animate-pulse-glow"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl ${card.highlight ? "bg-gradient-hero" : "bg-secondary"}`}
                >
                  <card.icon
                    className={`h-5 w-5 ${card.highlight ? "text-primary-foreground" : "text-primary"}`}
                  />
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

        {/* Ad · end of page */}
        <div className="mx-auto max-w-7xl px-4 pb-16">
          <ResponsiveAd adSlot="homeFooter" minHeight={250} />
        </div>
      </main>
    </div>
  );
}

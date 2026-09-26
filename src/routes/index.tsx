import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
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
  ShieldCheck,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageCircle,
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
import { TRIALS, type Trial } from "@/data/trials";
import { getRealtimeOpportunityBadge } from "@/lib/opportunity-badge";
import { SportsNewsSection } from "@/components/SportsNewsSection";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { buildSeoHead } from "@/lib/seo";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "KhelGrid · India's Sports Opportunity Network",
      description:
        "India's premier sports platform for discovery and development. Find trials, tournaments, leagues, verified academies, sports turf venues, and amateur pickup games across 16+ sports.",
      canonicalPath: "/",
      keywords:
        "sports trials India, sports academies near me, book turf, pickup sports games, badminton courts, cricket trials, football tournament, athletics scholarship, real-time sports wire, sports updates national news, Asian Games medal tally",
      type: "website",
      customSchema: {
        "@type": "FAQPage",
        mainEntity: HOME_FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
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

const SPORT_FILTER_CHIPS = [
  { id: "All", label: "All Sports", icon: Trophy },
  { id: "Cricket", label: "Cricket" },
  { id: "Football", label: "Football" },
  { id: "Badminton", label: "Badminton" },
  { id: "Athletics", label: "Athletics" },
  { id: "Hockey", label: "Hockey" },
  { id: "Tennis", label: "Tennis" },
] as const;

function getSportBadgeStyle(sport: string) {
  switch (sport.toLowerCase()) {
    case "cricket":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "football":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "badminton":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "athletics":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "hockey":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "tennis":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

type OpportunityBadgeType = "New" | "Closing Soon" | "High Demand" | "Scouted" | "Popular";

function getOpportunityStatusBadge(badge?: OpportunityBadgeType | string) {
  if (!badge) return null;

  switch (badge) {
    case "New":
      return {
        label: "New",
        icon: Sparkles,
        style:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-xs",
        dotStyle: "bg-emerald-500 animate-pulse",
      };
    case "Closing Soon":
      return {
        label: "Closing Soon",
        icon: Clock,
        style: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 shadow-xs",
        dotStyle: "bg-rose-500",
      };
    case "High Demand":
      return {
        label: "High Demand",
        icon: Flame,
        style: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-xs",
        dotStyle: "bg-amber-500",
      };
    case "Scouted":
      return {
        label: "Scouted",
        icon: Star,
        style:
          "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 shadow-xs",
        dotStyle: "bg-indigo-500",
      };
    case "Popular":
      return {
        label: "Popular",
        icon: Trophy,
        style: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 shadow-xs",
        dotStyle: "bg-sky-500",
      };
    default:
      return null;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Home() {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All Sports");
  const [location, setLocation] = useState("All Locations");
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>("All");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  const filteredOpportunities = useMemo(() => {
    if (selectedSportFilter === "All") {
      return TRIALS;
    }
    return TRIALS.filter((t) => t.sport.toLowerCase() === selectedSportFilter.toLowerCase());
  }, [selectedSportFilter]);

  const handleOpportunitiesScroll = () => {
    if (!opportunitiesRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = opportunitiesRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
    const cardWidth = 292;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveScrollIndex(Math.max(0, Math.min(index, filteredOpportunities.length - 1)));
  };

  const scrollOpportunities = (direction: "left" | "right") => {
    if (opportunitiesRef.current) {
      const scrollAmount = 300;
      opportunitiesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (opportunitiesRef.current) {
      opportunitiesRef.current.scrollTo({
        left: index * 292,
        behavior: "smooth",
      });
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
    const shareUrl = `${origin}/trial/${trial.id}`;
    const text = `🏆 *${trial.sport.toUpperCase()} TRIAL NOTICE: ${trial.title}*\n\n📍 *Academy:* ${trial.academy}, ${trial.city}\n🗓️ *Date:* ${trial.date}\n🎟️ *Fee:* ${trial.fee === 0 ? "Free Entry" : "₹" + trial.fee}\n🛡️ *Verification:* ${trial.verifiedLabel || "Verified Organizer"}\n🎯 *Eligibility:* ${trial.ageCategory || "Open"} · ${trial.gender || "All"}\n\n👉 *View details & register on KhelGrid:* ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp to share trial notice!");
  };

  const handleToggleBookmark = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const currentlySaved = isSaved(trial.id);
    toggleSaved(trial.id);
    if (!currentlySaved) {
      toast.success(`Saved "${trial.title}" to your shortlist`);
    } else {
      toast.info(`Removed "${trial.title}" from saved trials`);
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

          <section aria-labelledby="latest-opportunities-heading" className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="latest-opportunities-heading"
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                  >
                    Latest opportunities
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                    aria-label="Verified listings only"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Verified
                    Listings
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:hidden"
                    aria-hidden="true"
                  >
                    Swipe ↔
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Review eligibility, age cutoffs & verified organizer badges before you apply,
                  travel or pay.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5"
                  role="group"
                  aria-label="Carousel navigation controls"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30"
                    onClick={() => scrollOpportunities("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous opportunity cards"
                    aria-controls="opportunities-carousel"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30"
                    onClick={() => scrollOpportunities("right")}
                    disabled={!canScrollRight}
                    aria-label="Next opportunity cards"
                    aria-controls="opportunities-carousel"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <Link
                  to="/search"
                  className="text-sm font-semibold text-primary hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  aria-label={`Browse all ${TRIALS.length} sports opportunities`}
                >
                  Browse all ({TRIALS.length}) →
                </Link>
              </div>
            </div>

            {/* Sport Filter Chips with tablist accessibility */}
            <div
              role="tablist"
              aria-label="Filter opportunities by sport"
              className="-mx-4 mt-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar sm:mx-0 sm:flex-wrap"
            >
              {SPORT_FILTER_CHIPS.map((chip) => {
                const count =
                  chip.id === "All"
                    ? TRIALS.length
                    : TRIALS.filter((t) => t.sport.toLowerCase() === chip.id.toLowerCase()).length;
                const isActive = selectedSportFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    role="tab"
                    id={`filter-tab-${chip.id.toLowerCase()}`}
                    aria-selected={isActive}
                    aria-controls="opportunities-carousel"
                    onClick={() => {
                      setSelectedSportFilter(chip.id);
                      if (opportunitiesRef.current) {
                        opportunitiesRef.current.scrollTo({ left: 0, behavior: "smooth" });
                      }
                    }}
                    className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                        : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground active:scale-95"
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span
                      aria-label={`${count} available`}
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live region announcing filtered count to screen readers */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              Showing {filteredOpportunities.length} opportunities for{" "}
              {selectedSportFilter === "All" ? "all sports" : selectedSportFilter}
            </div>

            {/* Horizontally movable opportunities carousel */}
            <div
              id="opportunities-carousel"
              ref={opportunitiesRef}
              onScroll={handleOpportunitiesScroll}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Latest sports opportunities and trials"
              className="-mx-4 mt-3 flex gap-3.5 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory scroll-smooth focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:p-0 lg:grid-cols-4"
            >
              {filteredOpportunities.map((trial, index) => {
                const saved = isSaved(trial.id);
                const sportStyle = getSportBadgeStyle(trial.sport);
                const initials = getInitials(trial.academy);
                const statusBadge = getRealtimeOpportunityBadge(trial);
                const cardTitleId = `trial-title-${trial.id}`;
                const cardDescId = `trial-meta-${trial.id}`;

                return (
                  <article
                    key={trial.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Opportunity ${index + 1} of ${filteredOpportunities.length}: ${trial.title}${statusBadge ? ` (${statusBadge.label})` : ""}`}
                    aria-labelledby={cardTitleId}
                    aria-describedby={cardDescId}
                    className={`group relative flex w-[285px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border/80 bg-gradient-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg active:scale-[0.99] sm:w-auto sm:shrink ${
                      statusBadge?.isExpired ? "opacity-80 grayscale-[0.25]" : ""
                    }`}
                  >
                    <div>
                      {/* Top Organizer Branding, Status Badge & Action Bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            aria-hidden="true"
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${sportStyle}`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground">
                              {trial.academy}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">{trial.verifiedLabel || "Verified"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bookmark & WhatsApp Share Actions */}
                        <div
                          className="flex items-center gap-1 shrink-0"
                          role="group"
                          aria-label={`Actions for ${trial.title}`}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(e, trial)}
                            title={saved ? "Remove from saved" : "Bookmark trial"}
                            aria-label={
                              saved
                                ? `Remove ${trial.title} from saved trials`
                                : `Save ${trial.title} to bookmarks`
                            }
                            aria-pressed={saved}
                            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                              saved
                                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                : "border-border/80 bg-background/80 text-muted-foreground hover:border-primary/50 hover:text-primary"
                            }`}
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`}
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleWhatsAppShare(e, trial)}
                            title="Share notice on WhatsApp"
                            aria-label={`Share trial notice for ${trial.title} on WhatsApp`}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Visual Indicator Status Badge (Real-time Date Based: Closed, Closing Soon, High Demand, etc.) */}
                      {statusBadge && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadge.style}`}
                            aria-label={`Status: ${statusBadge.label}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusBadge.dotStyle}`}
                              aria-hidden="true"
                            />
                            <statusBadge.icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{statusBadge.label}</span>
                          </span>
                          {statusBadge.sublabel && (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {statusBadge.sublabel}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Trial Title with link */}
                      <h3
                        id={cardTitleId}
                        className={`${statusBadge ? "mt-2" : "mt-3"} line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary`}
                      >
                        <Link
                          to="/trial/$id"
                          params={{ id: trial.id }}
                          className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                          aria-label={`${trial.title}, organized by ${trial.academy}`}
                        >
                          {trial.title}
                        </Link>
                      </h3>

                      {/* Eligibility & Category Tags (Age, Gender, Sport) */}
                      <div
                        id={cardDescId}
                        className="mt-2.5 flex flex-wrap items-center gap-1.5"
                        aria-label="Trial categories and eligibility"
                      >
                        <span className="inline-flex items-center rounded-md bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                          {trial.sport}
                        </span>
                        {trial.ageCategory && (
                          <span
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                            aria-label={`Age category: ${trial.ageCategory}`}
                          >
                            {trial.ageCategory}
                          </span>
                        )}
                        {trial.gender && (
                          <span
                            className="inline-flex items-center rounded-md border border-border/80 bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            aria-label={`Gender eligibility: ${trial.gender}`}
                          >
                            {trial.gender}
                          </span>
                        )}
                      </div>

                      {/* Urgency / Cutoff Alert */}
                      {trial.urgencyText && (
                        <div
                          role="status"
                          className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"
                          aria-label={`Urgency alert: ${trial.urgencyText}`}
                        >
                          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">{trial.urgencyText}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer with Location, Date & Fee */}
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin
                            className="h-3.5 w-3.5 text-primary/70 shrink-0"
                            aria-hidden="true"
                          />
                          <span
                            className="max-w-[110px] truncate"
                            aria-label={`Location: ${trial.city}`}
                          >
                            {trial.city}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 font-medium text-foreground/80">
                          <CalendarDays
                            className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                            aria-hidden="true"
                          />
                          <span aria-label={`Date: ${trial.date}`}>{trial.date}</span>
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div>
                          {trial.fee === 0 ? (
                            <span
                              className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                              aria-label="Registration fee: Free entry"
                            >
                              Free entry
                            </span>
                          ) : (
                            <span
                              className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-foreground"
                              aria-label={`Registration fee: ₹${trial.fee}`}
                            >
                              ₹{trial.fee}
                            </span>
                          )}
                        </div>

                        <Link
                          to="/trial/$id"
                          params={{ id: trial.id }}
                          className={`inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs ${
                            statusBadge?.isExpired
                              ? "text-muted-foreground hover:text-foreground"
                              : "text-primary"
                          }`}
                          aria-label={`View full details for ${trial.title}${statusBadge?.isExpired ? " (Registration Closed)" : ""}`}
                        >
                          {statusBadge?.isExpired ? "View Archive" : "Details"}{" "}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mobile Carousel Indicators (Progress dots & count) */}
            <div
              className="mt-3 flex items-center justify-between px-1 sm:hidden"
              role="group"
              aria-label="Carousel pagination"
            >
              <span className="text-[11px] font-medium text-muted-foreground" aria-live="polite">
                Showing {filteredOpportunities.length} opportunities · Swipe horizontally
              </span>

              <div
                className="flex items-center gap-1"
                role="tablist"
                aria-label="Opportunity slide indicators"
              >
                {filteredOpportunities
                  .slice(0, Math.min(6, filteredOpportunities.length))
                  .map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={activeScrollIndex === i}
                      aria-label={`Go to slide ${i + 1} of ${Math.min(6, filteredOpportunities.length)}`}
                      onClick={() => scrollToIndex(i)}
                      className={`h-1.5 rounded-full transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                        activeScrollIndex === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
              </div>
            </div>
          </section>

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

        {/* FAQ Accordion Section: Monetization, Platform Usage & Trust */}
        <div className="mx-auto max-w-7xl px-4 pb-16">
          <HomeFaqSection />
        </div>

        {/* Ad · end of page */}
        <div className="mx-auto max-w-7xl px-4 pb-16">
          <ResponsiveAd adSlot="homeFooter" minHeight={250} />
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Fragment, useMemo, useState, useRef } from "react";
import { BannerAd, InFeedAd } from "@/components/ads";
import { TRIALS, SPORTS, CITIES, type Trial } from "@/data/trials";
import { TrialCard } from "@/components/TrialCard";
import { TrialNewsletterSignup } from "@/components/TrialNewsletterSignup";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BoostModal } from "@/components/BoostModal";
import { useAuth } from "@/context/AuthContext";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import {
  TrialsSearchFilter,
  REGIONS,
  SPORT_TYPES,
  DATE_RANGE_OPTIONS,
  parseTrialDate,
  type DateRangeOption,
} from "@/components/TrialsSearchFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search as SearchIcon,
  MapPin,
  Trophy,
  X,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  IndianRupee,
  Check,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Share2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Heart,
  CheckCircle2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

const ALL_SPORT = "All Sports";
const ALL_CITY = "All Locations";
const ALL_CATEGORY = "All Categories";

const SORTS = ["Soonest", "Most spots", "Lowest fee", "Highest spots"] as const;
type SortKey = (typeof SORTS)[number];

const CATEGORIES = [
  ALL_CATEGORY,
  "U-14 / Sub-Junior",
  "U-16 / Junior",
  "U-19 / Youth",
  "U-23 / Emerging",
  "Senior Open",
] as const;
type CategoryKey = (typeof CATEGORIES)[number];

const SPORT_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Badminton: "🏸",
  Athletics: "🏃",
  Tennis: "🎾",
  Kabaddi: "🤼",
  Swimming: "🏊",
  Hockey: "🏑",
  "Table Tennis": "🏓",
  Volleyball: "🏐",
  Chess: "♟️",
  Shooting: "🎯",
  Archery: "🏹",
  Boxing: "🥊",
  Wrestling: "🤼",
};

const POPULAR_SEARCHES = [
  { label: "❤️ My Favorites", savedOnly: true },
  { label: "U-19 Cricket", query: "Cricket", sport: "Cricket" },
  { label: "Football Combine", query: "Combine", sport: "Football" },
  { label: "Badminton Hyderabad", query: "Gopichand", city: "Hyderabad" },
  { label: "State Athletics", query: "Athletics", sport: "Athletics" },
  { label: "Free Entry", free: true },
  { label: "Official Trials", officialOnly: true },
];

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sport: fallback(z.string(), ALL_SPORT).default(ALL_SPORT),
  city: fallback(z.string(), ALL_CITY).default(ALL_CITY),
  region: fallback(z.string(), "all").default("all"),
  sportType: fallback(z.string(), "all").default("all"),
  dateRange: fallback(z.string(), "all").default("all"),
  category: fallback(z.string(), ALL_CATEGORY).default(ALL_CATEGORY),
  sort: fallback(z.enum(SORTS), "Soonest").default("Soonest"),
  free: fallback(z.boolean(), false).default(false),
  officialOnly: fallback(z.boolean(), false).default(false),
  savedOnly: fallback(z.boolean(), false).default(false),
  view: fallback(z.enum(["grid", "list"]), "grid").default("grid"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: ({ search }) => {
    const sSport = search?.sport && search.sport !== ALL_SPORT ? search.sport : "";
    const sCity = search?.city && search.city !== ALL_CITY ? search.city : "";
    const sQ = search?.q ? `"${search.q}"` : "";

    let pageTitle = "Find Sports Trials, Tournaments & Academy Selections in India · KhelGrid";
    let metaDesc =
      "Filter and discover open sports trials, tournaments, coaching camps, and academy opportunities across India by sport, age group, and city.";

    if (sSport && sCity) {
      pageTitle = `${sSport} Trials & Selections in ${sCity} (2026) · KhelGrid`;
      metaDesc = `Discover verified ${sSport} selection trials, academy combines, and state tournaments in ${sCity}. Check venue details, age eligibility, and registration dates on KhelGrid.`;
    } else if (sSport) {
      pageTitle = `${sSport} Trials & Selections Across India (2026) · KhelGrid`;
      metaDesc = `Find upcoming ${sSport} selection trials, junior state camps, and club academy trials across India. Verified dates, eligibility criteria, and open spots on KhelGrid.`;
    } else if (sCity) {
      pageTitle = `Sports Selection Trials in ${sCity} (2026) · KhelGrid`;
      metaDesc = `Browse open sports selection trials, tournaments, and coaching combines in ${sCity} across Cricket, Football, Badminton, Athletics, and more.`;
    } else if (sQ) {
      pageTitle = `Search Results for ${sQ} · Sports Trials on KhelGrid`;
    }

    const searchUrl = "https://khelgrid.com/search";
    const structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "KhelGrid Sports Trials Portal",
        url: searchUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${searchUrl}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://khelgrid.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Search Trials",
            item: searchUrl,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can athletes apply for sports selection trials on KhelGrid?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Athletes can filter opportunities by sport and city, review age eligibility and venue dates, and register directly or download trial confirmation passes.",
            },
          },
          {
            "@type": "Question",
            name: "Are sports trials on KhelGrid free to attend?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Many government, state association, and academy trials are free (₹0 entry fee). Filter by 'Free Entry' to discover zero-fee selection camps.",
            },
          },
          {
            "@type": "Question",
            name: "What documents are required for state sports trials in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Candidates typically need age verification proof (Aadhaar or birth certificate), previous competition certificates, medical fitness slip, and their KhelGrid Sports CV.",
            },
          },
        ],
      },
    ];

    return buildSeoHead({
      title: pageTitle,
      description: metaDesc,
      canonicalPath: "/search",
      noindex: false,
      keywords: `${sSport ? sSport + " trials, " : ""}sports trials India, cricket selection trials, football academy combine, athletics trials, badminton state selections, open sports trials 2026, sports opportunities India`,
      type: "website",
      customSchema: structuredData,
    });
  },
  component: SearchPage,
});

function SearchPage() {
  const auth = useAuth();
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { savedIds: rawSavedIds = [] } = useSavedOpportunities();
  const savedIds = useMemo(() => (Array.isArray(rawSavedIds) ? rawSavedIds : []), [rawSavedIds]);
  const [checkout, setCheckout] = useState<Trial | null>(null);
  const [boost, setBoost] = useState<Trial | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const update = (patch: Partial<typeof params>) =>
    navigate({ search: (prev: typeof params) => ({ ...prev, ...patch }), replace: true });

  // Count trials per sport for badges
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_SPORT]: TRIALS.length };
    for (const s of SPORTS) counts[s] = 0;
    for (const t of TRIALS) {
      if (counts[t.sport] !== undefined) counts[t.sport]++;
      else counts[t.sport] = 1;
    }
    return counts;
  }, []);

  // Filtered and sorted results
  const results = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    let list = TRIALS.filter((t) => {
      if (params.sport !== ALL_SPORT && t.sport !== params.sport) return false;
      if (params.city !== ALL_CITY && t.city !== params.city) return false;
      if (params.free && t.fee > 0) return false;
      if (params.officialOnly && !t.tag.toLowerCase().includes("official")) return false;
      if (params.savedOnly && !savedIds.includes(t.id)) return false;

      // Region Filter
      if (params.region && params.region !== "all") {
        const reg = REGIONS.find((r) => r.id === params.region);
        if (reg && reg.cities.length > 0) {
          const matchCity = reg.cities.some((c) => t.city.toLowerCase().includes(c.toLowerCase()));
          if (!matchCity) return false;
        }
      }

      // Sport Type Filter
      if (params.sportType && params.sportType !== "all") {
        const st = SPORT_TYPES.find((s) => s.id === params.sportType);
        if (st && st.sports.length > 0) {
          const matchSport = st.sports.some((s) => s.toLowerCase() === t.sport.toLowerCase());
          if (!matchSport) return false;
        }
      }

      // Upcoming Dates Filter
      if (params.dateRange && params.dateRange !== "all") {
        const trialDate = parseTrialDate(t.date);
        const regDeadline = t.registrationDeadline
          ? parseTrialDate(t.registrationDeadline)
          : trialDate;
        const targetDate = trialDate || regDeadline;

        if (targetDate) {
          const now = new Date("2026-09-29T21:00:00Z");
          const diffMs = targetDate.getTime() - now.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          const diffDays = diffHours / 24;

          if (params.dateRange === "closing_soon") {
            const hasClosingBadge =
              t.badge === "Closing Soon" ||
              (t.urgencyText && t.urgencyText.toLowerCase().includes("closing"));
            if (!hasClosingBadge && (diffHours < 0 || diffHours > 48)) return false;
          } else if (params.dateRange === "this_week") {
            if (diffDays < 0 || diffDays > 7) return false;
          } else if (params.dateRange === "this_month") {
            if (diffDays < 0 || diffDays > 30) return false;
          } else if (params.dateRange === "next_quarter") {
            if (diffDays < 0 || diffDays > 90) return false;
          } else if (params.dateRange === "sep_2026") {
            if (targetDate.getMonth() !== 8 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "oct_2026") {
            if (targetDate.getMonth() !== 9 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "nov_2026") {
            if (targetDate.getMonth() !== 10 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "dec_2026") {
            if (targetDate.getMonth() !== 11 || targetDate.getFullYear() !== 2026) return false;
          }
        }
      }

      // Category filter matching
      if (params.category !== ALL_CATEGORY) {
        const catStr = params.category.toLowerCase();
        const trialText = `${t.title} ${t.tag} ${t.eligibility || ""}`.toLowerCase();
        if (
          catStr.includes("u-14") &&
          !trialText.includes("u-14") &&
          !trialText.includes("sub-junior")
        )
          return false;
        if (catStr.includes("u-16") && !trialText.includes("u-16") && !trialText.includes("junior"))
          return false;
        if (catStr.includes("u-19") && !trialText.includes("u-19") && !trialText.includes("youth"))
          return false;
        if (
          catStr.includes("u-23") &&
          !trialText.includes("u-23") &&
          !trialText.includes("emerging")
        )
          return false;
        if (
          catStr.includes("senior") &&
          !trialText.includes("senior") &&
          !trialText.includes("open")
        )
          return false;
      }

      // Free-text query across multiple metadata fields
      if (
        q &&
        !`${t.title} ${t.academy} ${t.sport} ${t.city} ${t.tag} ${t.venue || ""} ${t.eligibility || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });

    const dateKey = (t: Trial) => new Date(t.date).getTime();
    if (params.sort === "Soonest") list = [...list].sort((a, b) => dateKey(a) - dateKey(b));
    else if (params.sort === "Most spots") list = [...list].sort((a, b) => b.spots - a.spots);
    else if (params.sort === "Highest spots") list = [...list].sort((a, b) => b.spots - a.spots);
    else if (params.sort === "Lowest fee") list = [...list].sort((a, b) => a.fee - b.fee);

    const boosted = list.filter((t) => auth.boostedTrials.includes(t.id));
    const regular = list.filter((t) => !auth.boostedTrials.includes(t.id));
    return { boosted, regular, total: list.length, all: list };
  }, [params, auth.boostedTrials, savedIds]);

  const handleApply = (trial: Trial) => {
    if (auth.applications.includes(trial.id)) return;
    if (auth.canApply(trial.id)) {
      auth.applyToTrial(trial.id);
      toast.success(`Applied to ${trial.title}`);
      return;
    }
    setCheckout(trial);
  };

  const showBoostAction = auth.role === "organizer";

  // Active filter indicators
  const activePills: { key: string; label: string; icon: React.ReactNode; onClear: () => void }[] =
    [];
  if (params.q)
    activePills.push({
      key: "q",
      label: `"${params.q}"`,
      icon: <SearchIcon className="h-3 w-3" />,
      onClear: () => update({ q: "" }),
    });
  if (params.savedOnly)
    activePills.push({
      key: "savedOnly",
      label: `Favorites (${savedIds.length})`,
      icon: <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />,
      onClear: () => update({ savedOnly: false }),
    });
  if (params.sport !== ALL_SPORT)
    activePills.push({
      key: "sport",
      label: params.sport,
      icon: <Trophy className="h-3 w-3" />,
      onClear: () => update({ sport: ALL_SPORT }),
    });
  if (params.city !== ALL_CITY)
    activePills.push({
      key: "city",
      label: params.city,
      icon: <MapPin className="h-3 w-3" />,
      onClear: () => update({ city: ALL_CITY }),
    });
  if (params.region && params.region !== "all") {
    const reg = REGIONS.find((r) => r.id === params.region);
    if (reg) {
      activePills.push({
        key: "region",
        label: `Region: ${reg.name}`,
        icon: <MapPin className="h-3 w-3" />,
        onClear: () => update({ region: "all" }),
      });
    }
  }
  if (params.sportType && params.sportType !== "all") {
    const st = SPORT_TYPES.find((s) => s.id === params.sportType);
    if (st) {
      activePills.push({
        key: "sportType",
        label: `Type: ${st.name}`,
        icon: <Trophy className="h-3 w-3" />,
        onClear: () => update({ sportType: "all" }),
      });
    }
  }
  if (params.dateRange && params.dateRange !== "all") {
    const dOpt = DATE_RANGE_OPTIONS.find((d) => d.id === params.dateRange);
    if (dOpt) {
      activePills.push({
        key: "dateRange",
        label: `Date: ${dOpt.label}`,
        icon: <Calendar className="h-3 w-3" />,
        onClear: () => update({ dateRange: "all" }),
      });
    }
  }
  if (params.category !== ALL_CATEGORY)
    activePills.push({
      key: "category",
      label: params.category,
      icon: <Award className="h-3 w-3" />,
      onClear: () => update({ category: ALL_CATEGORY }),
    });
  if (params.free)
    activePills.push({
      key: "free",
      label: "Free Entry (₹0)",
      icon: <IndianRupee className="h-3 w-3" />,
      onClear: () => update({ free: false }),
    });
  if (params.officialOnly)
    activePills.push({
      key: "officialOnly",
      label: "Official Verified",
      icon: <ShieldCheck className="h-3 w-3" />,
      onClear: () => update({ officialOnly: false }),
    });
  if (params.sort !== "Soonest")
    activePills.push({
      key: "sort",
      label: `Sort: ${params.sort}`,
      icon: <ArrowUpDown className="h-3 w-3" />,
      onClear: () => update({ sort: "Soonest" }),
    });

  const clearAll = () =>
    navigate({
      search: {
        q: "",
        sport: ALL_SPORT,
        city: ALL_CITY,
        region: "all",
        sportType: "all",
        dateRange: "all",
        category: ALL_CATEGORY,
        sort: "Soonest",
        free: false,
        officialOnly: false,
        savedOnly: false,
        view: params.view,
      },
      replace: true,
    });

  const handleShareSearch = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Filtered search link copied to clipboard!");
    }
  };

  return (
    <main
      id="search-trials-page"
      className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 w-full min-w-0 max-w-full overflow-x-hidden"
    >
      {/* Sleek Compact Header (No wasted vertical space) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 w-full min-w-0 max-w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
            Search Sports Selection Trials in India
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified</span>
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            ({results.total} trials available)
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShareSearch}
            className="h-8 gap-1.5 text-xs font-medium border-border cursor-pointer"
            title="Share this search"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold text-xs shadow-xs"
          >
            <Link to="/onboarding">
              <Sparkles className="h-3.5 w-3.5" /> Sports CV
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Responsive Grid Layout: Filter Sidebar (Desktop) + Results Content */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12 items-start w-full min-w-0 max-w-full">
        {/* DESKTOP FILTER SIDEBAR (Visible on lg >= 1024px) */}
        <aside
          id="desktop-filter-sidebar"
          className="hidden lg:block lg:col-span-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-6 sticky top-20"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Refine Trials</span>
            </div>
            {activePills.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Favorites / Saved Trials Filter Card */}
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Heart
                  className={`h-3.5 w-3.5 ${
                    savedIds.length > 0 ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                  }`}
                />
                <span>Saved Favorites</span>
              </div>
              <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                {savedIds.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => update({ savedOnly: !params.savedOnly })}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                params.savedOnly
                  ? "bg-rose-500 text-white shadow-xs"
                  : "border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${params.savedOnly ? "fill-white" : ""}`} />
              <span>
                {params.savedOnly ? "Show All Trials" : `View Favorites (${savedIds.length})`}
              </span>
            </button>
          </div>

          {/* Filter 1: Location & Region */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Location & Zone</span>
            </label>
            <div className="space-y-2">
              <select
                aria-label="Filter by Geographic Region"
                value={params.region || "all"}
                onChange={(e) => update({ region: e.target.value })}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by City"
                value={params.city}
                onChange={(e) => update({ city: e.target.value })}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {[ALL_CITY, ...CITIES].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 2: Sport Selection */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span>Sport</span>
              </span>
              <span className="font-mono text-[11px]">{results.total} Available</span>
            </label>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {[ALL_SPORT, ...SPORTS].map((s) => {
                const count = sportCounts[s] ?? 0;
                const isSelected = params.sport === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ sport: s })}
                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                      <span>{s}</span>
                    </span>
                    <span className="font-mono text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 3: Age Category */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Age Band</span>
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = params.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => update({ category: cat })}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 4: Upcoming Dates */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Upcoming Dates</span>
            </label>
            <select
              aria-label="Filter by Upcoming Dates"
              value={params.dateRange || "all"}
              onChange={(e) => update({ dateRange: e.target.value })}
              className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
            >
              {DATE_RANGE_OPTIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 5: Entry Fee & Federation Verification */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Participation Criteria
            </label>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={params.free}
                  onChange={(e) => update({ free: e.target.checked })}
                  className="rounded border-border accent-primary h-4 w-4"
                />
                <span>Free Entry Only (₹0)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={params.officialOnly}
                  onChange={(e) => update({ officialOnly: e.target.checked })}
                  className="rounded border-border accent-primary h-4 w-4"
                />
                <span>Official Federation Verified</span>
              </label>
            </div>
          </div>

          {/* Filter 6: Sort By */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              <span>Sort Order</span>
            </label>
            <select
              aria-label="Sort order"
              value={params.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* RESULTS & SEARCH WORKSPACE (9 cols on desktop, full width on mobile) */}
        <div className="w-full min-w-0 max-w-full lg:col-span-9 space-y-3">
          {/* Primary Search Bar + Responsive Controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full min-w-0 max-w-full">
            {/* Unified Search Input */}
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="search-trials-input"
                value={params.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search by trial title, academy, venue, sport, or keyword..."
                className="h-10 sm:h-11 w-full rounded-xl border border-border bg-card/70 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
              />
              {params.q && (
                <button
                  type="button"
                  onClick={() => update({ q: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Bar: Saved Favorites Toggle, View Mode, Mobile Filter Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick Saved Favorites Filter Toggle */}
              <Button
                type="button"
                variant={params.savedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => update({ savedOnly: !params.savedOnly })}
                className={`h-10 sm:h-11 gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-bold transition-all cursor-pointer ${
                  params.savedOnly
                    ? "bg-rose-500 text-white shadow-xs hover:bg-rose-600"
                    : "border-border bg-card text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                }`}
                title={params.savedOnly ? "Show all selection trials" : "Show My Saved Favorites"}
              >
                <Heart
                  className={`h-3.5 w-3.5 shrink-0 ${params.savedOnly || savedIds.length > 0 ? "fill-current" : ""}`}
                />
                <span className="hidden sm:inline">My Saved Favorites</span>
                <span className="sm:hidden">Saved</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    params.savedOnly ? "bg-white/20 text-white" : "bg-rose-500/15"
                  }`}
                >
                  {savedIds.length}
                </span>
              </Button>

              {/* Desktop View Mode Toggle (Grid vs List) */}
              <div className="hidden sm:flex items-center rounded-xl border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => update({ view: "grid" })}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    params.view === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => update({ view: "list" })}
                  title="List View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    params.view === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button (Opens Bottom Sheet / Vertical Filter) */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 sm:h-11 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold lg:hidden cursor-pointer"
                    aria-label="Open filter sheet"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>Filters</span>
                    {activePills.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {activePills.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 z-[80]"
                >
                  <SheetHeader className="text-left border-b border-border/60 pb-3">
                    <SheetTitle className="flex items-center justify-between text-base">
                      <span>Filter Selection Trials</span>
                      {activePills.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs font-medium text-primary hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-5">
                    {/* Quick Saved Favorites Filter */}
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">My Saved Favorites</p>
                          <p className="text-[11px] text-muted-foreground">
                            {savedIds.length} bookmarked favorites
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => update({ savedOnly: !params.savedOnly })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          params.savedOnly
                            ? "bg-rose-500 text-white shadow-xs"
                            : "border border-border bg-card text-foreground hover:bg-secondary"
                        }`}
                      >
                        {params.savedOnly ? "Saved Only ✓" : "View Saved"}
                      </button>
                    </div>

                    {/* Sport Selection (Vertical Filter List) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-primary" /> Sport Selection
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {results.total} trials
                        </span>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {[ALL_SPORT, ...SPORTS].map((s) => {
                          const isSelected = params.sport === s;
                          const count = sportCounts[s] ?? 0;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => update({ sport: s })}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              }`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                                <span>{s}</span>
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location & Region */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> Location & Zone
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          aria-label="Filter by Geographic Region (Mobile)"
                          value={params.region || "all"}
                          onChange={(e) => update({ region: e.target.value })}
                          className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                        >
                          {REGIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Filter by City (Mobile)"
                          value={params.city}
                          onChange={(e) => update({ city: e.target.value })}
                          className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                        >
                          {[ALL_CITY, ...CITIES].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Age Category */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Award className="h-3.5 w-3.5 text-primary" /> Age Band
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => update({ category: cat })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                              params.category === cat
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Dates */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Upcoming Dates
                      </span>
                      <select
                        aria-label="Filter by Upcoming Dates (Mobile)"
                        value={params.dateRange || "all"}
                        onChange={(e) => update({ dateRange: e.target.value })}
                        className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                      >
                        {DATE_RANGE_OPTIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Criteria toggles */}
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground py-1">
                        <input
                          type="checkbox"
                          checked={params.free}
                          onChange={(e) => update({ free: e.target.checked })}
                          className="rounded border-border accent-primary h-4 w-4"
                        />
                        <span>Free Entry Trials Only (₹0)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground py-1">
                        <input
                          type="checkbox"
                          checked={params.officialOnly}
                          onChange={(e) => update({ officialOnly: e.target.checked })}
                          className="rounded border-border accent-primary h-4 w-4"
                        />
                        <span>Official Federation Trials Only</span>
                      </label>
                    </div>

                    {/* Sort */}
                    <div className="border-t border-border/60 pt-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Sort By
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SORTS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => update({ sort: s })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                              params.sort === s
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="mt-6 flex-row gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearAll}
                      className="flex-1 text-xs"
                    >
                      Reset All
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSheetOpen(false)}
                      className="flex-1 text-xs font-bold bg-primary text-primary-foreground"
                    >
                      Show {results.total} Trials
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Popular Search Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground w-full min-w-0">
            <span className="text-[11px] font-semibold text-foreground/80">Trending Searches:</span>
            {POPULAR_SEARCHES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  update({
                    q: item.query || "",
                    sport: item.sport || ALL_SPORT,
                    city: item.city || ALL_CITY,
                    free: item.free ?? false,
                    officialOnly: item.officialOnly ?? false,
                    savedOnly: item.savedOnly ?? false,
                  })
                }
                className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-0.5 text-[11px] hover:border-primary/50 hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs w-full min-w-0 max-w-full">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground">
                {params.savedOnly
                  ? `❤️ ${results.total} Saved ${results.total === 1 ? "Trial" : "Trials"}`
                  : `${results.total} ${results.total === 1 ? "Trial" : "Trials"} Found`}
              </span>

              {activePills.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  {activePills.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={p.onClear}
                      className="group inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {p.icon}
                      <span>{p.label}</span>
                      <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground hidden sm:block">
              {params.sport !== ALL_SPORT ? params.sport : "All Sports"} in{" "}
              {params.city !== ALL_CITY ? params.city : "India"}
            </div>
          </div>

          {/* FEATURED / BOOSTED TRIALS */}
          {results.boosted.length > 0 && (
            <section className="space-y-3 pt-2 w-full min-w-0 max-w-full">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Flame className="h-4 w-4" />
                <span>Featured Recruitment Combines</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0 max-w-full">
                {results.boosted.map((t) => (
                  <TrialCard
                    key={t.id}
                    trial={t}
                    boosted
                    onApply={() => handleApply(t)}
                    onBoost={() => setBoost(t)}
                    showBoostAction={showBoostAction}
                  />
                ))}
              </div>
            </section>
          )}

          {/* REGULAR TRIALS GRID OR COMPACT LIST */}
          <section className="space-y-4 pt-2 w-full min-w-0 max-w-full">
            {results.regular.length === 0 && results.boosted.length === 0 ? (
              params.savedOnly ? (
                /* DEDICATED EMPTY STATE FOR SAVED FAVORITES */
                <div className="rounded-2xl border border-dashed border-rose-500/40 bg-rose-500/5 p-8 sm:p-12 text-center space-y-4 w-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Heart className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      No Saved Trials Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Tap the <strong>Save</strong> or <strong>Heart (❤️)</strong> button on any
                      selection trial card to bookmark your favorite combines and review them here
                      in your personalized list.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      type="button"
                      onClick={() => update({ savedOnly: false })}
                      className="gap-2 text-xs bg-primary text-primary-foreground font-semibold cursor-pointer"
                    >
                      <Trophy className="h-3.5 w-3.5" /> Browse All Selection Trials
                    </Button>
                  </div>
                </div>
              ) : (
                /* GENERAL EMPTY STATE WITH HELPFUL NEXT STEPS */
                <div className="rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-4 w-full">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <SearchIcon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                      No Trials Found Matching Filters
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      We couldn&apos;t find open selection trials matching your current combination
                      of filters. Try expanding your search criteria or resetting filters.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                      className="gap-1.5 text-xs cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => update({ sport: ALL_SPORT, city: ALL_CITY, savedOnly: false })}
                      className="gap-1.5 text-xs bg-primary text-primary-foreground cursor-pointer"
                    >
                      View All Sports & Locations
                    </Button>
                  </div>
                </div>
              )
            ) : params.view === "list" ? (
              /* COMPACT LIST VIEW */
              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm w-full min-w-0 max-w-full">
                <div className="divide-y divide-border/60">
                  {results.regular.map((t, idx) => (
                    <div
                      key={t.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            {t.sport}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {t.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {t.city}
                          </span>
                          {t.tag === "Official" && (
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ✓ Official
                            </span>
                          )}
                        </div>

                        <Link
                          to="/trial/$id"
                          params={{ id: t.id }}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {t.title}
                        </Link>

                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>{t.academy}</span>
                          <span>·</span>
                          <span>{t.spots} spots remaining</span>
                          <span>·</span>
                          <span className="font-semibold text-foreground">
                            {t.fee === 0 ? "Free Entry" : `₹${t.fee}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-border"
                        >
                          <Link to="/trial/$id" params={{ id: t.id }}>
                            Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApply(t)}
                          disabled={auth.applications.includes(t.id)}
                          className={`h-8 text-xs font-semibold ${
                            auth.applications.includes(t.id)
                              ? "bg-secondary text-muted-foreground"
                              : "bg-primary text-primary-foreground shadow-sm"
                          }`}
                        >
                          {auth.applications.includes(t.id) ? "Applied ✓" : "Register"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0 max-w-full">
                {results.regular.map((t, i) => (
                  <Fragment key={t.id}>
                    <TrialCard
                      trial={t}
                      onApply={() => handleApply(t)}
                      onBoost={() => setBoost(t)}
                      showBoostAction={showBoostAction}
                    />
                    {i > 0 && (i + 1) % 6 === 0 && (
                      <InFeedAd adSlot="searchInline" minHeight={250} />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </section>

          {/* Ad Slot */}
          <div className="pt-4">
            <BannerAd adSlot="listingInline" minHeight={100} />
          </div>

          {/* Automatic Trial Alerts Newsletter Subscription */}
          <section className="mt-8" aria-label="Subscribe to Trial Alerts">
            <TrialNewsletterSignup
              defaultSport={params.sport}
              defaultCity={params.city}
              title={`Get Instant Notifications for ${
                params.sport !== ALL_SPORT ? params.sport : "Sports"
              } Trials${params.city !== ALL_CITY ? ` in ${params.city}` : ""}`}
              subtitle="Never miss an upcoming selection camp or registration deadline. Set your email alert to receive new trial notifications automatically."
            />
          </section>

          {/* SEO Structured Content & FAQ Section */}
          <section className="mt-10 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-border/60 pb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                About Sports Selection Trials on KhelGrid
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                KhelGrid aggregates and independently verifies competitive sporting trials across
                India. Athletes can discover certified state association trials, national federation
                combines, and private academy talent hunts for junior, youth, and senior age
                divisions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Verified Trial Criteria
                </div>
                <p className="leading-relaxed">
                  Every listed selection trial includes confirmed dates, age cutoffs (e.g. U-16,
                  U-19), selection committees, and transparent entry criteria.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  Direct Scout Access
                </div>
                <p className="leading-relaxed">
                  Recruiters and state talent identification scouts review applied candidate
                  profiles and verified performance telemetry directly on KhelGrid.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Instant Digital Sports CV
                </div>
                <p className="leading-relaxed">
                  Link your certified trial achievements, speed benchmarks, and match footage
                  directly to your Sports CV for verified scouting.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {checkout && (
        <CheckoutModal
          open={!!checkout}
          onOpenChange={(o) => !o && setCheckout(null)}
          trialId={checkout.id}
          trialTitle={checkout.title}
          onPaid={() => auth.applyToTrial(checkout.id)}
        />
      )}
      {boost && (
        <BoostModal
          open={!!boost}
          onOpenChange={(o) => !o && setBoost(null)}
          trialId={boost.id}
          trialTitle={boost.title}
        />
      )}
    </main>
  );
}

export default SearchPage;

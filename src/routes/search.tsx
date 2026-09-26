import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Fragment, useEffect, useMemo, useState } from "react";
import { BannerAd, InFeedAd } from "@/components/ads";
import { SPORTS, CITIES, type Trial } from "@/data/trials";
import { TrialCard } from "@/components/TrialCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BoostModal } from "@/components/BoostModal";
import { useAuth } from "@/context/AuthContext";
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
  ChevronRight,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import { getLiveTrials } from "@/lib/opportunity-service";

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
  category: fallback(z.string(), ALL_CATEGORY).default(ALL_CATEGORY),
  sort: fallback(z.enum(SORTS), "Soonest").default("Soonest"),
  free: fallback(z.boolean(), false).default(false),
  officialOnly: fallback(z.boolean(), false).default(false),
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
  const [checkout, setCheckout] = useState<Trial | null>(null);
  const [boost, setBoost] = useState<Trial | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [liveTrials, setLiveTrials] = useState<Trial[]>([]);
  const [loadingTrials, setLoadingTrials] = useState(true);

  useEffect(() => {
    let mounted = true;
    getLiveTrials().then((items) => { if (mounted) setLiveTrials(items as Trial[]); }).catch((error) => {
      console.error("Failed to load live opportunities", error);
      if (mounted) toast.error("Could not load live opportunities. Please try again.");
    }).finally(() => { if (mounted) setLoadingTrials(false); });
    return () => { mounted = false; };
  }, []);

  const update = (patch: Partial<typeof params>) =>
    navigate({ search: (prev: typeof params) => ({ ...prev, ...patch }), replace: true });

  // Count trials per sport for badges
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_SPORT]: liveTrials.length };
    for (const s of SPORTS) counts[s] = 0;
    for (const t of liveTrials) {
      if (counts[t.sport] !== undefined) counts[t.sport]++;
      else counts[t.sport] = 1;
    }
    return counts;
  }, []);

  // Filtered and sorted results
  const results = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    let list = liveTrials.filter((t) => {
      if (params.sport !== ALL_SPORT && t.sport !== params.sport) return false;
      if (params.city !== ALL_CITY && t.city !== params.city) return false;
      if (params.free && t.fee > 0) return false;
      if (params.officialOnly && t.tag !== "Official") return false;

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
  }, [params, auth.boostedTrials, liveTrials]);

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
        category: ALL_CATEGORY,
        sort: "Soonest",
        free: false,
        officialOnly: false,
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
    <main id="search-trials-page" className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* Top Banner & Heading */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified Talent Recruitment Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Search Sports Selection Trials in India
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Discover upcoming selection trials, academy combines, state championship screening
            camps, and scholarship opportunities across India. Verified by state associations and
            talent scouts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShareSearch}
            className="h-9 gap-1.5 text-xs font-medium border-border"
            title="Share this search"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Share Search</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 gap-1.5 bg-primary text-primary-foreground font-semibold text-xs shadow-sm"
          >
            <Link to="/onboarding">
              <Sparkles className="h-3.5 w-3.5" /> Set Up Sports CV
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Responsive Grid Layout: Filter Sidebar (Desktop) + Results Content */}
      <div className="mt-6 grid gap-8 lg:grid-cols-12 items-start">
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
                className="text-xs font-medium text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Filter 1: Sport Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Sport</span>
              <span className="font-mono text-[11px]">{results.total} Available</span>
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
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

          {/* Filter 2: Location */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Location / City</span>
            </label>
            <select
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

          {/* Filter 3: Age Category */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
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
                    className={`w-full text-left rounded-lg px-2.5 py-1 text-xs transition-colors ${
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

          {/* Filter 4: Entry Fee & Federation Verification */}
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

          {/* Filter 5: Sort By */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort Order</span>
            </label>
            <select
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
        <div className="lg:col-span-9 space-y-5">
          {/* Search Bar + Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Primary Search Input */}
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="search-trials-input"
                value={params.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search by trial title, academy, venue, sport, or keyword..."
                className="h-11 w-full rounded-xl border border-border bg-card/70 pl-10 pr-9 text-sm text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
              />
              {params.q && (
                <button
                  type="button"
                  onClick={() => update({ q: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Bar: Sort, View Toggle, Mobile Filter Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop View Mode Toggle (Grid vs List) */}
              <div className="hidden sm:flex items-center rounded-xl border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => update({ view: "grid" })}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all ${
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
                  className={`p-1.5 rounded-lg transition-all ${
                    params.view === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button (Opens Bottom Sheet) */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 gap-2 rounded-xl border-border px-3.5 text-xs font-semibold lg:hidden"
                    aria-label="Open filter sheet"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
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
                  className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-5"
                >
                  <SheetHeader className="text-left border-b border-border/60 pb-3">
                    <SheetTitle className="flex items-center justify-between text-base">
                      <span>Filter Opportunities</span>
                      {activePills.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs font-medium text-primary"
                        >
                          Clear All
                        </button>
                      )}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-5">
                    {/* Sport Selection */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Trophy className="h-3.5 w-3.5" /> Sport
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[ALL_SPORT, ...SPORTS].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => update({ sport: s })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                              params.sport === s
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <MapPin className="h-3.5 w-3.5" /> Location
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[ALL_CITY, ...CITIES].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => update({ city: c })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                              params.city === c
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age Category */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Award className="h-3.5 w-3.5" /> Age Category
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => update({ category: cat })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
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
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
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

          {/* Quick Swipeable Horizontal Sport Bar (All Screens) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[ALL_SPORT, ...SPORTS].map((s) => {
              const isSelected = params.sport === s;
              const count = sportCounts[s] ?? 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ sport: s })}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                      : "border-border/80 bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                  <span>{s}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Popular Search Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
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
                  })
                }
                className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-0.5 text-[11px] hover:border-primary/50 hover:bg-secondary hover:text-foreground transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">
                {results.total} {results.total === 1 ? "Trial" : "Trials"} Found
              </span>

              {activePills.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  {activePills.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={p.onClear}
                      className="group inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      {p.icon}
                      <span>{p.label}</span>
                      <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
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

          {/* FEATURED / BOOSTED liveTrials */}
          {results.boosted.length > 0 && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Flame className="h-4 w-4" />
                <span>Featured Recruitment Combines</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

          {/* REGULAR liveTrials GRID OR COMPACT LIST */}
          <section className="space-y-4 pt-2">
            {results.regular.length === 0 && results.boosted.length === 0 ? (
              /* EMPTY STATE WITH HELPFUL NEXT STEPS */
              <div className="rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <SearchIcon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    No Trials Found Matching Filters
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    We couldn&apos;t find open selection trials matching your current combination of
                    filters. Try expanding your search criteria or resetting filters.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="gap-1.5 text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => update({ sport: ALL_SPORT, city: ALL_CITY })}
                    className="gap-1.5 text-xs bg-primary text-primary-foreground"
                  >
                    View All Sports & Locations
                  </Button>
                </div>
              </div>
            ) : params.view === "list" ? (
              /* COMPACT LIST VIEW */
              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

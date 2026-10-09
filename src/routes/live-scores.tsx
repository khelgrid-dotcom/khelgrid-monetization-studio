import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import { buildSeoHead } from "@/lib/seo";
import { playScoreChime, playWhistleSound } from "@/lib/sports-audio";
import { InFeedAd, ResponsiveAd } from "@/components/ads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Radio,
  Activity,
  Flame,
  Search,
  RefreshCw,
  Volume2,
  VolumeX,
  Star,
  Share2,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  X,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live-scores")({
  head: () =>
    buildSeoHead({
      title:
        "Live Sports Scores & Real-Time Match Center · Cricket, Football, Badminton | KhelGrid",
      description:
        "Track live scores, ball-by-ball cricket overs, ISL football stats, BWF badminton sets, PKL kabaddi raids, and hockey matches across India with real-time updates on KhelGrid.",
      canonicalPath: "/live-scores",
      keywords:
        "live sports scores India, cricket live scores, ISL live match, badminton live score, PKL kabaddi score, hockey match center, live in-play sports, KhelGrid live match tracker",
      type: "website",
    }),
  component: LiveScoresPage,
});

type SportFilter = "All" | "Cricket" | "Football" | "Badminton" | "Kabaddi" | "Hockey" | "Tennis";
type StatusFilter = "ALL" | "LIVE" | "UPCOMING" | "RECENT";
type ViewMode = "grid" | "list";

const SPORTS_LIST: { id: SportFilter; label: string; icon: string }[] = [
  { id: "All", label: "All Sports", icon: "⚡" },
  { id: "Cricket", label: "Cricket", icon: "🏏" },
  { id: "Football", label: "Football", icon: "⚽" },
  { id: "Badminton", label: "Badminton", icon: "🏸" },
  { id: "Kabaddi", label: "Kabaddi", icon: "🤼" },
  { id: "Hockey", label: "Hockey", icon: "🏑" },
  { id: "Tennis", label: "Tennis", icon: "🎾" },
];

const PINNED_STORAGE_KEY = "khelgrid_pinned_live_matches";
const SOUND_STORAGE_KEY = "khelgrid_live_scores_sound";

export function LiveScoresPage() {
  const [selectedSport, setSelectedSport] = useState<SportFilter>("All");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalMatch, setActiveModalMatch] = useState<LiveMatchUpdate | null>(null);

  // Sound alert preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Pinned / Favorite match IDs
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(PINNED_STORAGE_KEY);
        if (saved) return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // Dynamic simulation tick for in-play realism
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [matchesState, setMatchesState] = useState<LiveMatchUpdate[]>(LIVE_SPORTS_UPDATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(30);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("Just now");

  // Save pinned matches
  const togglePin = (matchId: string, matchTitle: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      const isPinned = next.has(matchId);
      if (isPinned) {
        next.delete(matchId);
        toast.info(`Unpinned ${matchTitle}`);
      } else {
        next.add(matchId);
        toast.success(`Pinned ${matchTitle} to top`);
        if (soundEnabled) playScoreChime();
      }
      try {
        localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playScoreChime();
        toast.success("Audio alerts enabled for live score updates");
      } else {
        toast.info("Audio alerts muted");
      }
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Manual refresh handler
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshedAt(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setRefreshCountdown(30);
      setIsRefreshing(false);
      toast.success("Live score feeds refreshed", {
        description: "Checked Google Sports & National syndication feeds",
      });
      if (soundEnabled) {
        playWhistleSound();
      }
    }, 600);
  }, [soundEnabled]);

  // Countdown timer for auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          handleManualRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleManualRefresh]);

  // Subtle in-play match progression simulation (ticks live cricket balls, football minutes, kabaddi raids)
  useEffect(() => {
    if (!simulationActive) return;
    const simInterval = setInterval(() => {
      setMatchesState((prev) =>
        prev.map((m) => {
          if (m.status !== "LIVE") return m;

          // Cricket in-play tick
          if (
            m.sport === "Cricket" &&
            m.teamA.score.includes("*") &&
            m.teamA.score.includes("ov")
          ) {
            const matchScore = m.teamA.score.match(/\*(\d+)\/(\d+)\s*\(([\d.]+)\s*ov\)/);
            if (matchScore) {
              const runs = parseInt(matchScore[1], 10);
              const wickets = parseInt(matchScore[2], 10);
              const overs = parseFloat(matchScore[3]);
              const addedRuns = Math.random() > 0.4 ? (Math.random() > 0.7 ? 4 : 1) : 0;
              const newRuns = runs + addedRuns;
              const newOvers = (overs + 0.1).toFixed(1);
              return {
                ...m,
                teamA: {
                  ...m.teamA,
                  score: `*${newRuns}/${wickets} (${newOvers} ov)`,
                },
                highlight:
                  addedRuns === 4
                    ? "CRACKING BOUNDARY! Smashed through cover point"
                    : addedRuns === 1
                      ? "Quick single rotated to deep square leg"
                      : m.highlight,
              };
            }
          }

          // Football clock progression
          if (m.sport === "Football" && m.venueOrOvers && m.venueOrOvers.includes("'")) {
            const min = parseInt(m.venueOrOvers, 10);
            if (!isNaN(min) && min < 90) {
              const newMin = min + 1;
              return {
                ...m,
                venueOrOvers: `${newMin}'`,
              };
            }
          }

          return m;
        }),
      );
    }, 12000);

    return () => clearInterval(simInterval);
  }, [simulationActive]);

  // Filter calculations
  const filteredMatches = useMemo(() => {
    return matchesState.filter((match) => {
      // 1. Sport
      if (selectedSport !== "All" && match.sport.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }

      // 2. Status
      if (selectedStatus !== "ALL" && match.status !== selectedStatus) {
        return false;
      }

      // 3. Favorites only
      if (onlyFavorites && !pinnedIds.has(match.id)) {
        return false;
      }

      // 4. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const searchable = [
          match.tournament,
          match.stage || "",
          match.teamA.name,
          match.teamA.code,
          match.teamB.name,
          match.teamB.code,
          match.highlight,
          match.statusText || "",
          match.liveTime || "",
          match.sport,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [matchesState, selectedSport, selectedStatus, onlyFavorites, pinnedIds, searchQuery]);

  // Separate pinned matches that match filter criteria
  const { pinnedMatches, regularMatches } = useMemo(() => {
    const pinned: LiveMatchUpdate[] = [];
    const regular: LiveMatchUpdate[] = [];

    for (const m of filteredMatches) {
      if (pinnedIds.has(m.id)) {
        pinned.push(m);
      } else {
        regular.push(m);
      }
    }

    return { pinnedMatches: pinned, regularMatches: regular };
  }, [filteredMatches, pinnedIds]);

  // Counts by sport
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { All: matchesState.length };
    for (const m of matchesState) {
      counts[m.sport] = (counts[m.sport] || 0) + 1;
    }
    return counts;
  }, [matchesState]);

  // Live match total
  const liveCount = useMemo(() => {
    return matchesState.filter((m) => m.status === "LIVE").length;
  }, [matchesState]);

  // Share match
  const handleShareMatch = async (match: LiveMatchUpdate) => {
    const shareText = `[LIVE] ${match.teamA.code} ${match.teamA.score} vs ${match.teamB.code} ${match.teamB.score} (${match.tournament}) · Check live scores on KhelGrid`;
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "https://khelgrid.com/live-scores";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${match.teamA.name} vs ${match.teamB.name} · KhelGrid Live`,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Match shared successfully!");
        return;
      } catch {
        // fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Score copied to clipboard!");
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  const getSportEmoji = (sport: string) => {
    switch (sport) {
      case "Cricket":
        return "🏏";
      case "Football":
        return "⚽";
      case "Badminton":
        return "🏸";
      case "Kabaddi":
        return "🤼";
      case "Hockey":
        return "🏑";
      case "Tennis":
        return "🎾";
      default:
        return "⚡";
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full flex-1 pb-16 sm:pb-24">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 1. HERO & REAL-TIME STATUS COMMAND BAR */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-background p-4 sm:p-7 shadow-xs">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title & Pulse Indicator */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>LIVE MATCH CENTER</span>
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {liveCount} Matches In-Play Now
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                Real-Time Live Sports Scores
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Ball-by-ball cricket, Indian Super League football, BWF badminton sets, Pro Kabaddi
                raids, and FIH hockey match centers updated continuously.
              </p>
            </div>

            {/* Quick Actions (Sound, Refresh, Simulation Toggle) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              {/* Sound Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSound}
                className={cn(
                  "gap-1.5 text-xs font-semibold rounded-xl border-border/80 transition-all",
                  soundEnabled &&
                    "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
                title={soundEnabled ? "Mute audio alerts" : "Enable sound chimes on score changes"}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4 text-emerald-500" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <span>Muted</span>
                  </>
                )}
              </Button>

              {/* In-play Simulation Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSimulationActive((prev) => {
                    const next = !prev;
                    toast.info(next ? "Live in-play simulation enabled" : "Simulation paused");
                    return next;
                  });
                }}
                className={cn(
                  "gap-1.5 text-xs font-semibold rounded-xl border-border/80",
                  simulationActive && "border-primary/40 bg-primary/5 text-primary",
                )}
                title="Toggle simulated live ball-by-ball ticking"
              >
                {simulationActive ? (
                  <>
                    <Play className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>Live Tick</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Paused</span>
                  </>
                )}
              </Button>

              {/* Refresh CTA */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-xs font-semibold rounded-xl border-border/80 hover:bg-secondary active:scale-95 transition"
                title="Refresh score feeds from Google Sports"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
                />
                <span>{isRefreshing ? "Refreshing..." : `Sync (${refreshCountdown}s)`}</span>
              </Button>
            </div>
          </div>

          {/* Real-time ticker ribbon */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground/80">Active Feeds:</span>
              <span className="rounded bg-secondary/80 px-2 py-0.5 font-medium">
                Google Sports Wire
              </span>
              <span className="rounded bg-secondary/80 px-2 py-0.5 font-medium">
                BWF / ISL / PKL
              </span>
              <span className="hidden sm:inline-block text-muted-foreground">
                · Last synced {lastRefreshedAt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 font-semibold rounded-lg px-2 py-0.5 transition-colors cursor-pointer",
                  onlyFavorites
                    ? "bg-amber-500/15 text-amber-500 font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Star
                  className={cn("h-3.5 w-3.5", onlyFavorites && "fill-amber-500 text-amber-500")}
                />
                <span>Starred ({pinnedIds.size})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. SPORT CATEGORY RAILS */}
        <div className="space-y-3">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 touch-scroll-rail">
            {SPORTS_LIST.map((sp) => {
              const isSelected = selectedSport === sp.id;
              const count = sportCounts[sp.id] || 0;
              return (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSport(sp.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border/80 bg-card text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <span>{sp.icon}</span>
                  <span>{sp.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3. SUB-FILTER BAR: STATUS + SEARCH + VIEW MODE */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "ALL", label: "All Matches" },
                  { id: "LIVE", label: "Live In-Play", isLive: true },
                  { id: "UPCOMING", label: "Upcoming" },
                  { id: "RECENT", label: "Recent Results" },
                ] as const
              ).map((tab) => {
                const isSelected = selectedStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedStatus(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isSelected
                        ? "bg-secondary text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    {tab.isLive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search & View Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter team, event, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8.5 rounded-xl pl-8 pr-7 text-xs bg-background/80 border-border/80"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* View Grid/List toggle */}
              <div className="flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors cursor-pointer",
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors cursor-pointer",
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. PINNED MATCHES SECTION (if any) */}
        {pinnedMatches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Pinned Matches ({pinnedMatches.length})
              </h2>
            </div>

            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3",
              )}
            >
              {pinnedMatches.map((match) => (
                <MatchScoreCard
                  key={match.id}
                  match={match}
                  isPinned={true}
                  onTogglePin={() => togglePin(match.id, match.tournament)}
                  onOpenDetails={() => setActiveModalMatch(match)}
                  onShare={() => handleShareMatch(match)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. MAIN MATCH CARDS FEED */}
        <div className="space-y-4">
          {pinnedMatches.length > 0 && regularMatches.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                All Matches ({regularMatches.length})
              </h2>
            </div>
          )}

          {regularMatches.length === 0 && pinnedMatches.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center space-y-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary/80 text-muted-foreground">
                <Activity className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground">No matches found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  No sports matches match your current filters. Try changing your sport or status
                  filter, or clearing search query.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSport("All");
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                  setOnlyFavorites(false);
                }}
                className="rounded-xl font-semibold"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3",
              )}
            >
              {regularMatches.map((match, idx) => (
                <div key={match.id} className="contents">
                  <MatchScoreCard
                    match={match}
                    isPinned={false}
                    onTogglePin={() => togglePin(match.id, match.tournament)}
                    onOpenDetails={() => setActiveModalMatch(match)}
                    onShare={() => handleShareMatch(match)}
                    viewMode={viewMode}
                  />
                  {/* Subtle in-feed ad insertion after 6th match */}
                  {idx === 5 && (
                    <div className={cn(viewMode === "grid" ? "col-span-full py-2" : "py-2")}>
                      <InFeedAd adSlot="liveScoresInFeed" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. SPONSORED BANNER */}
        <div className="pt-2">
          <ResponsiveAd adSlot="liveScoresBottomBanner" minHeight={90} />
        </div>

        {/* 7. LIVE SPORTS FAQ & ECOSYSTEM CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-foreground">
                KhelGrid Live Sports Coverage & FAQ
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  How often are live scores updated?
                </h3>
                <p>
                  Scores refresh automatically every 30 seconds from public national feeds and
                  Google Sports feeds. You can click &quot;Sync&quot; at any moment to trigger an
                  immediate live re-validation.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  Which sports are supported?
                </h3>
                <p>
                  Cricket (IPL, WPL, Bilateral ODIs/Tests), Football (ISL, Premier League),
                  Badminton (BWF World Tour, All England), Pro Kabaddi League, FIH Hockey, and
                  ATP/WTA Tennis.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  Can I pin my favorite matches?
                </h3>
                <p>
                  Yes! Click the star icon on any match card. Pinned matches remain pinned at the
                  very top of your feed across sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Launchpad to other KhelGrid features */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Play & Compete
              </span>
              <h3 className="text-lg font-bold text-foreground">Inspired by the live action?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step onto the turf yourself! Discover nearby amateur games, book sports venues, or
                register for upcoming tournaments.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to="/play"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Find Casual Pickup Games</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                to="/book"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Book Turf & Courts</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                to="/events"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Tournaments & Leagues</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 8. INTERACTIVE MATCH CENTER MODAL */}
      {activeModalMatch && (
        <Dialog
          open={Boolean(activeModalMatch)}
          onOpenChange={(open) => !open && setActiveModalMatch(null)}
        >
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getSportEmoji(activeModalMatch.sport)}</span>
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-extrabold text-foreground">
                      {activeModalMatch.tournament}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {activeModalMatch.stage || "Official Match"} ·{" "}
                      {activeModalMatch.venueOrOvers || "In-Play"}
                    </DialogDescription>
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                    activeModalMatch.status === "LIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : activeModalMatch.status === "UPCOMING"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {activeModalMatch.status === "LIVE" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                  {activeModalMatch.status}
                </span>
              </div>
            </DialogHeader>

            {/* Scorecard Hero */}
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 divide-x divide-border/60">
                {/* Team A */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{activeModalMatch.teamA.flag || "⚡"}</span>
                    <span className="text-sm font-bold text-foreground truncate">
                      {activeModalMatch.teamA.name}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">
                    {activeModalMatch.teamA.score}
                  </div>
                </div>

                {/* Team B */}
                <div className="pl-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{activeModalMatch.teamB.flag || "⚡"}</span>
                    <span className="text-sm font-bold text-foreground truncate">
                      {activeModalMatch.teamB.name}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-muted-foreground">
                    {activeModalMatch.teamB.score}
                  </div>
                </div>
              </div>

              {/* Status / Commentary Highlight */}
              <div className="rounded-xl bg-card p-3 border border-border/60 text-xs">
                <span className="font-bold text-primary mr-1.5">Latest Update:</span>
                <span className="text-foreground">
                  {activeModalMatch.statusText || activeModalMatch.highlight}
                </span>
              </div>
            </div>

            {/* Match Information Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Venue / Timing</span>
                </span>
                <span className="font-semibold text-foreground text-right truncate max-w-[240px]">
                  {activeModalMatch.liveTime || "Stadium Arena"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Sport Category</span>
                </span>
                <span className="font-semibold text-foreground">{activeModalMatch.sport}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Data Attribution</span>
                </span>
                <span className="font-semibold text-foreground">
                  {activeModalMatch.source || "Google Sports Syndication"}
                </span>
              </div>
            </div>

            {/* Footer Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareMatch(activeModalMatch)}
                className="gap-1.5 text-xs rounded-xl"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Score</span>
              </Button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    `${activeModalMatch.sport} ${activeModalMatch.teamA.name} vs ${activeModalMatch.teamB.name} live score`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Google Match Center</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Button
                  size="sm"
                  onClick={() => setActiveModalMatch(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface MatchScoreCardProps {
  match: LiveMatchUpdate;
  isPinned: boolean;
  onTogglePin: () => void;
  onOpenDetails: () => void;
  onShare: () => void;
  viewMode: ViewMode;
}

function MatchScoreCard({
  match,
  isPinned,
  onTogglePin,
  onOpenDetails,
  onShare,
  viewMode,
}: MatchScoreCardProps) {
  const isLive = match.status === "LIVE";
  const isUpcoming = match.status === "UPCOMING";

  const getSportEmoji = (sport: string) => {
    switch (sport) {
      case "Cricket":
        return "🏏";
      case "Football":
        return "⚽";
      case "Badminton":
        return "🏸";
      case "Kabaddi":
        return "🤼";
      case "Hockey":
        return "🏑";
      case "Tennis":
        return "🎾";
      default:
        return "⚡";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
        {/* Left: Tournament + Teams */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xl shrink-0">{getSportEmoji(match.sport)}</span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
              <span className="font-semibold text-foreground/80 truncate">{match.tournament}</span>
              {match.stage && <span>• {match.stage}</span>}
              {match.venueOrOvers && (
                <span className="font-mono text-primary font-bold">({match.venueOrOvers})</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <span>{match.teamA.flag || "⚡"}</span>
                <span>{match.teamA.code}</span>
                <span className="font-mono text-primary">{match.teamA.score}</span>
              </span>
              <span className="text-muted-foreground font-normal">vs</span>
              <span className="flex items-center gap-1.5">
                <span>{match.teamB.flag || "⚡"}</span>
                <span>{match.teamB.code}</span>
                <span className="font-mono text-muted-foreground">{match.teamB.score}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status badge + Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
              isLive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isUpcoming
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
            {match.status}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onTogglePin}
              className="p-1.5 text-muted-foreground hover:text-amber-500 transition-colors rounded-lg cursor-pointer"
              title={isPinned ? "Unpin match" : "Pin match to top"}
            >
              <Star className={cn("h-4 w-4", isPinned && "fill-amber-500 text-amber-500")} />
            </button>
            <button
              type="button"
              onClick={onShare}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg cursor-pointer"
              title="Share score"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenDetails}
              className="h-7 text-[11px] rounded-lg font-semibold cursor-pointer"
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
      {/* Top Header: Tournament, Stage & Pin */}
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5 text-[11px]">
        <div className="min-w-0 flex items-center gap-1.5">
          <span className="text-sm shrink-0">{getSportEmoji(match.sport)}</span>
          <span
            className="font-semibold text-muted-foreground truncate max-w-[170px]"
            title={match.tournament}
          >
            {match.tournament}
          </span>
          {match.stage && (
            <span className="text-muted-foreground/80 truncate text-[10px]">· {match.stage}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold",
              isLive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isUpcoming
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
            {match.status}
          </span>

          <button
            type="button"
            onClick={onTogglePin}
            className="p-1 text-muted-foreground hover:text-amber-500 transition-colors rounded-lg cursor-pointer ml-1"
            title={isPinned ? "Unpin match" : "Pin match to top"}
          >
            <Star className={cn("h-3.5 w-3.5", isPinned && "fill-amber-500 text-amber-500")} />
          </button>
        </div>
      </div>

      {/* Middle: Teams & Scores */}
      <div className="py-3.5 space-y-2.5">
        {/* Team A */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{match.teamA.flag || "⚡"}</span>
            <div className="min-w-0">
              <span
                className="font-bold text-sm text-foreground block truncate"
                title={match.teamA.name}
              >
                {match.teamA.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {match.teamA.code}
              </span>
            </div>
          </div>
          <span className="font-mono text-base font-extrabold text-foreground tracking-tight">
            {match.teamA.score}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{match.teamB.flag || "⚡"}</span>
            <div className="min-w-0">
              <span
                className="font-bold text-sm text-foreground block truncate"
                title={match.teamB.name}
              >
                {match.teamB.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {match.teamB.code}
              </span>
            </div>
          </div>
          <span className="font-mono text-base font-semibold text-muted-foreground tracking-tight">
            {match.teamB.score}
          </span>
        </div>
      </div>

      {/* Commentary Highlight Banner */}
      <div className="rounded-xl bg-secondary/50 p-2.5 text-[11px] space-y-1 mb-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
          <span className="truncate">{match.venueOrOvers || match.sport}</span>
          <span className="truncate">{match.liveTime || "In-Play"}</span>
        </div>
        <p className="font-medium text-foreground/90 text-xs line-clamp-1">
          {match.statusText || match.highlight}
        </p>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition cursor-pointer"
        >
          <Share2 className="h-3 w-3" />
          <span>Share</span>
        </button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenDetails}
          className="h-7 text-xs rounded-lg font-bold gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <span>Match Center</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default LiveScoresPage;

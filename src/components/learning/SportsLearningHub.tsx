import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Video,
  FileText,
  Headphones,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  Clock,
  Compass,
  ArrowRight,
  ExternalLink,
  Info,
  Layers,
  Award,
  ChevronRight,
  GraduationCap,
  X,
  Volume2,
  HelpCircle,
  Maximize2,
  Share2,
} from "lucide-react";
import {
  LEARNING_RESOURCES,
  SPORT_OVERVIEWS,
  type LearningResource,
  type LearningSourceType,
  type LearningLevel,
  type QuizQuestion,
} from "@/data/sportsLearningHub";
import { SPORTS_CATALOG } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SourceFilterTab {
  id: LearningSourceType | "all";
  label: string;
  shortLabel: string;
  icon: typeof BookOpen;
}

const SOURCE_TABS: SourceFilterTab[] = [
  { id: "all", label: "All Sources", shortLabel: "All", icon: Layers },
  { id: "book", label: "Books & Literature", shortLabel: "Books", icon: BookOpen },
  { id: "video", label: "Video Masterclasses", shortLabel: "Videos", icon: Video },
  { id: "text", label: "Text Guides & Rules", shortLabel: "Guides", icon: FileText },
  { id: "quiz", label: "Interactive Quizzes", shortLabel: "Quizzes", icon: HelpCircle },
  { id: "audio", label: "Audio & Talks", shortLabel: "Audio", icon: Headphones },
  { id: "diagram", label: "Court & Field Specs", shortLabel: "Specs", icon: Maximize2 },
];

const LEVELS: Array<LearningLevel | "all"> = [
  "all",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Coach & Referee",
];

export function SportsLearningHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedSourceType, setSelectedSourceType] = useState<LearningSourceType | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | "all">("all");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  // Persistence: Bookmarked resources & completed resources
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("khelgrid_learning_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("khelgrid_learning_completed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Resource in Modal / Viewer
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null);

  // Video viewer simulated state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activeVideoTime, setActiveVideoTime] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Save bookmarks
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("khelgrid_learning_bookmarks", JSON.stringify(next));
      } catch {
        // ignore
      }
      toast.success(prev.includes(id) ? "Removed from Study List" : "Added to Study List!");
      return next;
    });
  };

  // Toggle completion
  const toggleComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("khelgrid_learning_completed", JSON.stringify(next));
      } catch {
        // ignore
      }
      toast.success(prev.includes(id) ? "Marked as In-Progress" : "Marked as Mastered! 🏆");
      return next;
    });
  };

  // Reset quiz when active resource changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setVideoPlaying(false);
    setActiveVideoTime(0);
  }, [activeResource?.id]);

  // Unique sports available in learning resources
  const sportsList = useMemo(() => {
    const set = new Set<string>();
    for (const r of LEARNING_RESOURCES) {
      set.add(r.sport);
    }
    // Also add catalog sports for complete coverage
    for (const s of SPORTS_CATALOG) {
      set.add(s.name);
    }
    return Array.from(set).sort();
  }, []);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return LEARNING_RESOURCES.filter((res) => {
      // Source Type
      if (selectedSourceType !== "all" && res.sourceType !== selectedSourceType) {
        return false;
      }
      // Sport
      if (selectedSport !== "all" && res.sport.toLowerCase() !== selectedSport.toLowerCase()) {
        return false;
      }
      // Level
      if (selectedLevel !== "all" && res.level !== selectedLevel) {
        return false;
      }
      // Bookmarks only
      if (showOnlyBookmarked && !bookmarkedIds.includes(res.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesSport = res.sport.toLowerCase().includes(q);
        const matchesSummary = res.summary.toLowerCase().includes(q);
        const matchesAuthor = res.authorOrCreator.toLowerCase().includes(q);
        const matchesTags = res.tags.some((t) => t.toLowerCase().includes(q));
        const matchesTakeaways = res.keyTakeaways.some((k) => k.toLowerCase().includes(q));
        if (
          !matchesTitle &&
          !matchesSport &&
          !matchesSummary &&
          !matchesAuthor &&
          !matchesTags &&
          !matchesTakeaways
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    selectedSourceType,
    selectedSport,
    selectedLevel,
    showOnlyBookmarked,
    bookmarkedIds,
    searchQuery,
  ]);

  // Overview data for selected sport (if specific sport chosen)
  const activeSportOverview = useMemo(() => {
    if (selectedSport === "all") return null;
    return SPORT_OVERVIEWS[selectedSport] || null;
  }, [selectedSport]);

  // Counts by source type
  const countsBySource = useMemo(() => {
    const counts: Record<string, number> = { all: LEARNING_RESOURCES.length };
    for (const r of LEARNING_RESOURCES) {
      counts[r.sourceType] = (counts[r.sourceType] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary font-medium text-xs px-2.5 py-1"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Unified Sports & Learning Hub
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Books · Videos · Rulebooks · Quizzes · Drills
            </Badge>
          </div>

          <div className="mt-4 max-w-3xl">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              Master Any Sport Through Books, Videos & Guides
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base lg:text-lg leading-relaxed">
              The complete multi-format learning library for Indian athletes, students, parents, and
              coaches. Dive into foundational rules, tactical literature, masterclass video
              breakdowns, and interactive quizzes across all major sports.
            </p>
          </div>

          {/* Quick Metrics & Feature Highlights */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:max-w-4xl">
            <div className="rounded-xl border border-border/70 bg-card/60 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg sm:text-xl">
                <BookOpen className="h-5 w-5" />
                <span>Books & Text</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">NIS manuals & sports classics</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg sm:text-xl">
                <Video className="h-5 w-5" />
                <span>Video Clinics</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Drills, angles & technique films
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg sm:text-xl">
                <FileText className="h-5 w-5" />
                <span>Official Laws</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">ICC, IFAB, BWF, AKFI rulebooks</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg sm:text-xl">
                <HelpCircle className="h-5 w-5" />
                <span>Skill Quizzes</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Test your rule & tactical IQ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Controls Bar: Search & Quick Actions */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by sport, book title, drill, author, or rule..."
                className="pl-10 pr-4 h-11 bg-card rounded-xl border-border"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Filters: Level and Study List Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Level Selector */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as LearningLevel | "all")}
                  aria-label="Filter learning resources by skill level"
                  className="h-9 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner (Grassroots)</option>
                  <option value="Intermediate">Intermediate (Club)</option>
                  <option value="Advanced">Advanced (Competitive)</option>
                  <option value="Coach & Referee">Coach & Referee</option>
                </select>
              </div>

              {/* Study List Bookmark Filter */}
              <Button
                variant={showOnlyBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                className="h-9 gap-1.5 rounded-lg text-xs"
              >
                {showOnlyBookmarked ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-primary-foreground" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
                <span>My Study List ({bookmarkedIds.length})</span>
              </Button>
            </div>
          </div>

          {/* Source Type Filter Tabs (Books, Videos, Text, Quizzes, etc.) */}
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {SOURCE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = selectedSourceType === tab.id;
                const count = countsBySource[tab.id] ?? 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSourceType(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "bg-card border border-border hover:bg-accent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "ml-1 text-[11px] px-1.5 py-0.5 rounded-full",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sport Selector Rail */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Filter by Sport Discipline:</span>
              {selectedSport !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedSport("all")}
                  className="text-primary hover:underline font-medium"
                >
                  Clear sport filter ({selectedSport})
                </button>
              )}
            </div>
            <div className="overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-1.5 min-w-max">
                <button
                  onClick={() => setSelectedSport("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition",
                    selectedSport === "all"
                      ? "bg-foreground text-background font-semibold"
                      : "bg-secondary/60 hover:bg-secondary text-secondary-foreground",
                  )}
                >
                  🏅 All Sports
                </button>
                {sportsList.map((sport) => {
                  const overview = SPORT_OVERVIEWS[sport];
                  const emoji = overview?.emoji || "🏆";
                  const active = selectedSport.toLowerCase() === sport.toLowerCase();
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition",
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-secondary/60 hover:bg-secondary text-secondary-foreground",
                      )}
                    >
                      <span>{emoji}</span>
                      <span>{sport}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sport Deep Dive Blueprint (Displayed when a specific sport is active) */}
        {activeSportOverview && (
          <section className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{activeSportOverview.emoji}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {activeSportOverview.name} Blueprint & Laws
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {activeSportOverview.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <Badge variant="outline" className="bg-background/80">
                    🌍 World: {activeSportOverview.governingBody}
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    🇮🇳 India: {activeSportOverview.governingBodyIndia}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    🏅 {activeSportOverview.olympicStatus}
                  </Badge>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link to="/sport/$slug" params={{ slug: activeSportOverview.slug }}>
                    <span>Trials & Academies</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Rules & Gear Grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4 border-t border-border/60">
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Core Rules Summary
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  {activeSportOverview.quickRulesSummary.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-primary" />
                  Court & Scoring Specs
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Layout:</strong> {activeSportOverview.courtOrFieldSummary}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  <strong>Scoring:</strong> {activeSportOverview.scoringSummary}
                </p>
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  Regulation Equipment Checklist
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSportOverview.keyEquipment.map((eq, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[11px] font-normal">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Resources Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Curated Learning Materials</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredResources.length} items found)
              </span>
            </h2>
          </div>

          {filteredResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No learning resources matched your criteria
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try clearing search terms or selecting "All Sources" and "All Sports" to view the
                full curriculum.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSport("all");
                  setSelectedSourceType("all");
                  setSelectedLevel("all");
                  setShowOnlyBookmarked(false);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((res) => {
                const isBookmarked = bookmarkedIds.includes(res.id);
                const isCompleted = completedIds.includes(res.id);

                return (
                  <div
                    key={res.id}
                    onClick={() => setActiveResource(res)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Type & Sport badges + Bookmark Button */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[11px] font-medium gap-1",
                              res.sourceType === "book" &&
                                "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                              res.sourceType === "video" &&
                                "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                              res.sourceType === "text" &&
                                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              res.sourceType === "quiz" &&
                                "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                              res.sourceType === "audio" &&
                                "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                              res.sourceType === "diagram" &&
                                "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
                            )}
                          >
                            {res.sourceType === "book" && <BookOpen className="h-3 w-3" />}
                            {res.sourceType === "video" && <Video className="h-3 w-3" />}
                            {res.sourceType === "text" && <FileText className="h-3 w-3" />}
                            {res.sourceType === "quiz" && <HelpCircle className="h-3 w-3" />}
                            {res.sourceType === "audio" && <Headphones className="h-3 w-3" />}
                            {res.sourceType === "diagram" && <Maximize2 className="h-3 w-3" />}
                            <span className="capitalize">{res.sourceType}</span>
                          </Badge>

                          <Badge variant="outline" className="text-[11px]">
                            {res.sportEmoji} {res.sport}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-[10px] text-muted-foreground border-border/60"
                          >
                            {res.level}
                          </Badge>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(res.id, e)}
                          aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
                          className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary transition"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Title & Author */}
                      <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {res.title}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        by{" "}
                        <span className="font-medium text-foreground">{res.authorOrCreator}</span>
                        {res.organizationOrPublisher && ` · ${res.organizationOrPublisher}`}
                      </p>

                      {/* Summary */}
                      <p className="mt-2.5 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {res.summary}
                      </p>

                      {/* Key takeaway preview */}
                      {res.keyTakeaways.length > 0 && (
                        <div className="mt-3 rounded-xl bg-secondary/40 p-2.5 space-y-1">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Core Lesson
                          </div>
                          <p className="text-xs text-foreground/90 line-clamp-2">
                            "{res.keyTakeaways[0]}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Metadata & Action CTA */}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{res.estimatedTime}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                        <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {res.sourceType === "video" && "Watch"}
                          {res.sourceType === "book" && "Study"}
                          {res.sourceType === "text" && "Read"}
                          {res.sourceType === "quiz" && "Take Quiz"}
                          {res.sourceType === "audio" && "Listen"}
                          {res.sourceType === "diagram" && "View Specs"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Interactive Detail Modal / Resource Viewer */}
      {activeResource && (
        <Dialog open={!!activeResource} onOpenChange={(open) => !open && setActiveResource(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
            <DialogHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {activeResource.sportEmoji} {activeResource.sport}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {activeResource.sourceType}
                </Badge>
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {activeResource.level}
                </Badge>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(activeResource.id)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {bookmarkedIds.includes(activeResource.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant={completedIds.includes(activeResource.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleComplete(activeResource.id)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {completedIds.includes(activeResource.id) ? "Mastered" : "Mark Mastered"}
                    </span>
                  </Button>
                </div>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                {activeResource.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Author / Instructor: <strong>{activeResource.authorOrCreator}</strong>
                {activeResource.organizationOrPublisher &&
                  ` · ${activeResource.organizationOrPublisher}`}{" "}
                · {activeResource.estimatedTime}
              </DialogDescription>
            </DialogHeader>

            {/* Video Player Simulation (For Video Masterclasses) */}
            {activeResource.sourceType === "video" && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-border bg-black text-white p-4 space-y-3">
                <div className="relative aspect-video w-full rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex flex-col items-center justify-center p-6 text-center border border-neutral-800">
                  <div
                    className="p-4 rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition cursor-pointer"
                    onClick={() => setVideoPlaying(!videoPlaying)}
                  >
                    {videoPlaying ? (
                      <PauseIcon className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </div>
                  <div className="mt-3 text-sm font-semibold">
                    {videoPlaying
                      ? "Playing Masterclass Stream..."
                      : "Interactive Technique Breakdown"}
                  </div>
                  <div className="text-xs text-neutral-400 max-w-sm mt-1">
                    Multi-angle cameras with slow-motion mechanics and coach annotations.
                  </div>
                </div>

                {/* Video Chapters scrubber */}
                {activeResource.chapters && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Chapters & Key Timestamps
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {activeResource.chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-neutral-900/80 p-2.5 text-xs border border-neutral-800 hover:border-primary/40 transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-primary font-mono font-medium">
                            <span>{ch.timestamp}</span>
                            <span className="text-[10px] text-neutral-400">Jump to section</span>
                          </div>
                          <div className="font-semibold text-neutral-200 mt-0.5">{ch.title}</div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{ch.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Quiz Runner (For Quizzes) */}
            {activeResource.sourceType === "quiz" && activeResource.quiz && (
              <div className="mt-4 space-y-6">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-200">
                  Select your answers for each match scenario below, then tap{" "}
                  <strong>Check Answers</strong> to verify your official rule understanding.
                </div>

                <div className="space-y-5">
                  {activeResource.quiz.map((q, qIndex) => {
                    const selected = quizAnswers[qIndex];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div
                        key={qIndex}
                        className={cn(
                          "rounded-xl border p-4 space-y-3 transition-colors",
                          quizSubmitted
                            ? isCorrect
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "border-rose-500/50 bg-rose-500/5"
                            : "border-border bg-card",
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                            {qIndex + 1}
                          </span>
                          <div className="font-medium text-sm text-foreground">{q.question}</div>
                        </div>

                        <div className="space-y-2 pl-8">
                          {q.options.map((option, optIndex) => {
                            const isChosen = selected === optIndex;
                            const isOptionCorrect = optIndex === q.correctIndex;

                            return (
                              <button
                                key={optIndex}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
                                }
                                className={cn(
                                  "w-full text-left rounded-lg p-2.5 text-xs transition border flex items-center justify-between",
                                  isChosen
                                    ? "border-primary bg-primary/10 font-medium text-foreground"
                                    : "border-border bg-background hover:bg-secondary/40 text-muted-foreground",
                                  quizSubmitted &&
                                    isOptionCorrect &&
                                    "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold",
                                  quizSubmitted &&
                                    isChosen &&
                                    !isOptionCorrect &&
                                    "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300",
                                )}
                              >
                                <span>{option}</span>
                                {quizSubmitted && isOptionCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="pl-8 pt-2 text-xs leading-relaxed text-muted-foreground border-t border-border/50">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!quizSubmitted ? (
                    <Button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="w-full sm:w-auto"
                    >
                      Check Answers ({Object.keys(quizAnswers).length} /{" "}
                      {activeResource.quiz.length} answered)
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 w-full justify-between">
                      <div className="text-sm font-semibold">
                        Your Score:{" "}
                        <span className="text-primary font-bold">
                          {
                            activeResource.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex)
                              .length
                          }{" "}
                          / {activeResource.quiz.length}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Text Guides & Full Law Content */}
            {activeResource.fullTextContent && (
              <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Full Text & Official Regulation Clauses
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-foreground/90 space-y-3 leading-relaxed whitespace-pre-line">
                  {activeResource.fullTextContent}
                </div>
              </div>
            )}

            {/* Field & Court Specs Visual Layout */}
            {activeResource.fieldSpecs && (
              <div className="mt-4 rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-primary" />
                  Official Arena & Line Measurements
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground block text-[11px]">Total Length</span>
                    <span className="font-semibold text-foreground">
                      {activeResource.fieldSpecs.length}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/50">
                    <span className="text-muted-foreground block text-[11px]">Total Width</span>
                    <span className="font-semibold text-foreground">
                      {activeResource.fieldSpecs.width}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Notes:</strong> {activeResource.fieldSpecs.boundaryNote}
                </p>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground">
                    Key Regulation Lines:
                  </span>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                    {activeResource.fieldSpecs.keyLines.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Chapters / Table of Contents for Books & Guides */}
            {activeResource.chapters && activeResource.sourceType !== "video" && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Syllabus & Chapter Breakdown
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeResource.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-primary">
                        <span>{ch.title}</span>
                        {ch.page && (
                          <span className="text-[10px] text-muted-foreground">{ch.page}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{ch.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Takeaways Summary */}
            <div className="mt-4 rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Key Training Takeaways
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                {activeResource.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment Required (if any) */}
            {activeResource.equipmentRequired && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">Recommended Gear:</span>
                {activeResource.equipmentRequired.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

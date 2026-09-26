import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { SPORTS_NEWS_CATALOG, type SportsNewsArticle } from "@/data/news";
import {
  Newspaper,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  Share2,
  Bookmark,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Radio,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { MatchStatisticsCharts } from "@/components/blog/MatchStatisticsCharts";
import { IndiaJapanSocialFeed } from "@/components/blog/IndiaJapanSocialFeed";
import { AsianGamesAnalytics } from "@/components/blog/AsianGamesAnalytics";
import { MatchOutcomePredictor } from "@/components/blog/MatchOutcomePredictor";

const SPORT_TABS_CONFIG = [
  { id: "All Sports", label: "All", fullLabel: "All Sports", key: "allSports", fallback: "All" },
  { id: "Cricket", label: "Cricket", fullLabel: "Cricket", key: "cricket", fallback: "Cricket" },
  { id: "Football", label: "Football", fullLabel: "Football", key: "football", fallback: "Football" },
  { id: "Tennis", label: "Tennis", fullLabel: "Tennis", key: "tennis", fallback: "Tennis" },
  { id: "Badminton", label: "Badminton", fullLabel: "Badminton", key: "badminton", fallback: "Badminton" },
  { id: "Athletics", label: "Athletics", fullLabel: "Athletics", key: "athletics", fallback: "Athletics" },
  { id: "Asian Games", label: "Asian Games", fullLabel: "Asian Games", key: "asianGames", fallback: "Asian Games" },
  { id: "Grassroots", label: "Grassroots", fullLabel: "Grassroots", key: "grassroots", fallback: "Grassroots" },
] as const;

const SAVED_NEWS_STORAGE_KEY = "khelgrid-saved-news-v1";

export function SportsNewsSection() {
  const { t } = useLanguage();
  const [selectedSportTab, setSelectedSportTab] = useState<string>("All Sports");
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [showMatchAnalytics, setShowMatchAnalytics] = useState<boolean>(true);
  const [activeAnalyticsHub, setActiveAnalyticsHub] = useState<"asiad" | "cricket" | "predictor">(
    "asiad",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("Just now");
  const [mobileViewMode, setMobileViewMode] = useState<"carousel" | "list">("carousel");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Load saved bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_NEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedArticles(new Set(parsed.filter((id): id is string => typeof id === "string")));
        }
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Sync saved bookmarks to localStorage
  const persistSavedArticles = (nextSet: Set<string>) => {
    try {
      localStorage.setItem(SAVED_NEWS_STORAGE_KEY, JSON.stringify(Array.from(nextSet)));
    } catch {
      // ignore
    }
  };

  // Filtered news articles based on sport tab and search query
  const filteredArticles = useMemo(() => {
    let list = SPORTS_NEWS_CATALOG;

    if (selectedSportTab !== "All Sports") {
      list = list.filter((item) => {
        if (selectedSportTab === "Grassroots") {
          return item.category === "Grassroots" || item.sport === "Grassroots";
        }
        if (selectedSportTab === "Asian Games") {
          return (
            item.tags?.some((t) => t.toLowerCase().includes("asian games")) ||
            item.sport === "Multi-Sport" ||
            item.title.toLowerCase().includes("asian games")
          );
        }
        return item.sport.toLowerCase() === selectedSportTab.toLowerCase();
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.sport.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [selectedSportTab, searchQuery]);

  const featuredArticle = useMemo(() => {
    return (
      filteredArticles.find((a) => a.featured) || filteredArticles[0] || SPORTS_NEWS_CATALOG[0]
    );
  }, [filteredArticles]);

  const listArticles = useMemo(() => {
    return filteredArticles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  }, [filteredArticles, featuredArticle]);

  const remainingGridArticles = useMemo(() => {
    const shownIds = new Set([featuredArticle?.id, ...listArticles.map((a) => a.id)]);
    return filteredArticles.filter((a) => !shownIds.has(a.id));
  }, [filteredArticles, featuredArticle, listArticles]);

  // All displayed articles for mobile horizontal movable carousel
  const allCarouselArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    // Featured first, followed by remaining
    const remaining = filteredArticles.filter((a) => a.id !== featuredArticle.id);
    return [featuredArticle, ...remaining];
  }, [featuredArticle, filteredArticles]);

  // Update carousel scroll state
  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate active slide index
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(index, allCarouselArticles.length - 1));
  }, [allCarouselArticles.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, allCarouselArticles]);

  const scrollCarousel = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-carousel-card]");
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  const handleShare = async (article: SportsNewsArticle) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
    const shareUrl = article.blogSlug
      ? `${origin}/blog/${article.blogSlug}`
      : `${origin}/#news-${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.headline} - Follow live sports updates on KhelGrid`,
          url: shareUrl,
        });
        toast.success("Shared successfully");
      } catch {
        // user dismissed dialog
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Article link copied to clipboard!");
    }
  };

  const toggleSave = (id: string) => {
    setSavedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from saved reading list");
      } else {
        next.add(id);
        toast.success("Saved to your reading list!");
      }
      persistSavedArticles(next);
      return next;
    });
  };

  const handleRefreshWire = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      toast.success("Real-time sports wire refreshed", {
        description: "Fetched the latest national trials and match dispatches.",
      });
    }, 600);
  };

  // Structured Data (JSON-LD NewsArticle & ItemList) according to Google Search Central specifications
  const newsJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "@id": "https://khelgrid.com/#sports-news-wire",
          name: "KhelGrid Real-Time Sports Wire & National News",
          description:
            "Live national sports bulletins, Khelo India updates, Asian Games medal tallies, and high-performance tactical analysis.",
          numberOfItems: SPORTS_NEWS_CATALOG.length,
          itemListElement: SPORTS_NEWS_CATALOG.map((article, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: article.blogSlug
              ? `https://khelgrid.com/blog/${article.blogSlug}`
              : `https://khelgrid.com/#news-${article.slug}`,
            name: article.title,
          })),
        },
        ...SPORTS_NEWS_CATALOG.map((article) => ({
          "@type": "NewsArticle",
          "@id": article.blogSlug
            ? `https://khelgrid.com/blog/${article.blogSlug}`
            : `https://khelgrid.com/#news-${article.slug}`,
          headline: article.title,
          alternativeHeadline: article.headline,
          description: article.excerpt,
          articleBody: article.content,
          articleSection: article.sport,
          inLanguage: "en-IN",
          url: article.blogSlug
            ? `https://khelgrid.com/blog/${article.blogSlug}`
            : `https://khelgrid.com/#news-${article.slug}`,
          image: [article.imageUrl],
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": article.blogSlug
              ? `https://khelgrid.com/blog/${article.blogSlug}`
              : `https://khelgrid.com/#news-${article.slug}`,
          },
          author: {
            "@type": "Person",
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            "@type": "SportsOrganization",
            name: "KhelGrid",
            url: "https://khelgrid.com",
            logo: {
              "@type": "ImageObject",
              url: "https://khelgrid.com/favicon.svg",
              width: 512,
              height: 512,
            },
          },
          isAccessibleForFree: true,
          keywords: article.tags?.join(", "),
        })),
      ],
    };
  }, []);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section
      id="sports-news-section"
      className="mt-8 border-t border-border/60 pt-6 sm:mt-10 sm:pt-8"
      aria-labelledby="sports-news-heading"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      {/* Schema.org NewsArticle & ItemList Structured Data Injection for Search Engine Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Streamlined Header: Low-profile title, live status, and compact actions */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sr-only">Real-time Sports Wire</span>
          <h2
            id="sports-news-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <Flame className="h-4 w-4 text-primary shrink-0 animate-pulse" />
            <span>{t("sportsUpdatesTitle", "KhelWire")}</span>
          </h2>

          {/* Live pulsing badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>{t("updatedLive", "Updated Live")}</span>
          </span>

          <p className="sr-only sm:not-sr-only text-[11px] text-muted-foreground ml-1 hidden md:inline truncate max-w-sm">
            {t(
              "sportsUpdatesDesc",
              "Breaking selection trials, Khelo India updates, state championships, and athlete pathways across India.",
            )}
          </p>
        </div>

        {/* Compact Right Actions: Quick Search + Refresh + Mobile Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchNewsPlaceholder", "Search news...")}
              className="h-7 w-28 sm:w-36 focus:w-44 sm:focus:w-52 rounded-full border border-border/80 bg-background/80 pl-7 pr-6 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefreshWire}
            disabled={isRefreshing}
            className="h-7 w-7 rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Refresh Sports Wire feed"
            aria-label="Refresh Wire"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </Button>

          {/* View Toggle: Reel vs Grid (on small screens) */}
          <div className="flex items-center rounded-full border border-border bg-muted/40 p-0.5 sm:hidden">
            <button
              type="button"
              onClick={() => setMobileViewMode("carousel")}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                mobileViewMode === "carousel"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Horizontally scrollable reel"
              aria-label="Switch to horizontal reel view"
            >
              <SlidersHorizontal className="inline h-2.5 w-2.5 mr-1" />
              {t("reelView", "Reel")}
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode("list")}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                mobileViewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Responsive CSS grid view"
              aria-label="Switch to responsive grid view"
            >
              <LayoutGrid className="inline h-2.5 w-2.5 mr-1" />
              {t("gridView", "Grid")}
            </button>
          </div>
        </div>
      </header>

      {/* Streamlined Horizontal Filtering Bar directly above news grid */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/40 pb-2">
        <nav
          ref={tabsContainerRef}
          aria-label="Sports categories"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {SPORT_TABS_CONFIG.map((tab) => {
            const active = selectedSportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSportTab(tab.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={tab.fullLabel}
              >
                <span>{tab.label}</span>
                <span className="sr-only"> ({tab.fullLabel})</span>
              </button>
            );
          })}
        </nav>

        <span className="shrink-0 text-[11px] font-medium text-muted-foreground hidden sm:inline-block">
          {filteredArticles.length} {t("updates", "updates")}
        </span>
      </div>

      {/* --- SMALL SCREEN HORIZONTALLY MOVABLE CAROUSEL --- */}
      {/* Active on screens < sm when mobileViewMode === 'carousel' */}
      <div
        className={`${
          mobileViewMode === "carousel" ? "block sm:hidden" : "hidden"
        } mt-2`}
      >
        {/* Movable Controls & Swipe Affordance */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Radio className="h-3 w-3 text-primary animate-pulse" />
            <span>
              {t("swipeToBrowse", "Swipe horizontally to browse")}{" "}
              <strong>{allCarouselArticles.length}</strong> {t("updates", "updates")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              onClick={() => scrollCarousel("left")}
              className="h-7 w-7 rounded-full border-border/80 disabled:opacity-30"
              aria-label="Scroll left in sports wire"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              onClick={() => scrollCarousel("right")}
              className="h-7 w-7 rounded-full border-border/80 disabled:opacity-30"
              aria-label="Scroll right in sports wire"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Horizontally Movable Cards Reel with Edge Fade Indicators */}
        <div className="relative">
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-4 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
          )}

          <div
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Horizontally movable sports news reel"
            className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x pb-4 pt-1 px-1 no-scrollbar"
          >
            {allCarouselArticles.map((article, idx) => (
              <article
                key={article.id}
                data-carousel-card
                id={`mobile-news-${article.slug}`}
                itemScope
                itemType="https://schema.org/NewsArticle"
                className="group relative flex w-[82vw] min-w-[260px] max-w-[340px] shrink-0 snap-center sm:snap-start flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/50 shadow-xs"
              >
              <div>
                {/* Image Container with Responsive Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={article.imageUrl}
                    alt={`${article.title} - ${article.sport} Sports Wire`}
                    loading="lazy"
                    decoding="async"
                    itemProp="image"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="rounded-full bg-primary/95 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                      {article.sport}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-white/90">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  {article.featured && (
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      <Sparkles className="h-2.5 w-2.5" /> Featured Story
                    </span>
                  )}
                </div>

                {/* Article Headline & Meta */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-semibold text-primary">{article.category}</span>
                    <time dateTime={article.publishedAt} itemProp="datePublished">
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>

                  <h3
                    itemProp="headline"
                    className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
                  >
                    {article.title}
                  </h3>

                  <p
                    itemProp="description"
                    className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                      {article.author.name.charAt(0)}
                    </div>
                    <span
                      itemProp="author"
                      className="line-clamp-1 text-xs font-medium text-foreground max-w-[130px]"
                    >
                      {article.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSave(article.id)}
                      className="h-7 w-7 rounded-full"
                      aria-label={`Bookmark ${article.title}`}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${
                          savedArticles.has(article.id)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(article)}
                      className="h-7 w-7 rounded-full"
                      aria-label={`Share ${article.title}`}
                    >
                      <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {article.blogSlug && (
                  <Link
                    to="/blog/$slug"
                    params={{ slug: article.blogSlug }}
                    className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                  >
                    <span>Read Analysis & Stats</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

        {/* Carousel Pagination Dots Indicator */}
        <div
          className="mt-2 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Sports news slide indicators"
        >
          {allCarouselArticles.slice(0, 7).map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeSlideIndex === idx}
              aria-label={`Go to story ${idx + 1}`}
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlideIndex === idx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- RESPONSIVE CSS GRID NEWS FEED --- */}
      {/* Single column on mobile, 2 columns on tablets (sm/md), multi-column on desktop (lg/xl) */}
      <div
        className={`mt-2 sm:mt-3 ${
          mobileViewMode === "list" ? "grid" : "hidden sm:grid"
        } grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6`}
      >
        {/* Featured Big Story (Left on desktop, 2-col span on tablet) */}
        {featuredArticle && (
          <article
            id={`news-${featuredArticle.slug}`}
            itemScope
            itemType="https://schema.org/NewsArticle"
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/50 sm:p-6 sm:col-span-2 lg:col-span-7"
          >
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
                <img
                  src={featuredArticle.imageUrl}
                  alt={`${featuredArticle.title} - Featured National Sports Story`}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase">
                    {featuredArticle.sport} · {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/90 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {t("featuredLeadStory", "Featured Lead Story")}
                </span>
                <time dateTime={featuredArticle.publishedAt} itemProp="datePublished">
                  {formatDate(featuredArticle.publishedAt)}
                </time>
              </div>

              <h3
                itemProp="headline"
                className="mt-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl"
              >
                {featuredArticle.title}
              </h3>

              <p
                itemProp="description"
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {featuredArticle.excerpt}
              </p>

              {featuredArticle.blogSlug && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featuredArticle.blogSlug }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  >
                    {t("readFullAnalysis", "Read Tactical Analysis")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowMatchAnalytics(!showMatchAnalytics)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {showMatchAnalytics
                        ? t("hideAnalytics", "Hide Recharts & Social Feed")
                        : t("viewAnalytics", "View Recharts & Social Feed")}
                    </span>
                    {showMatchAnalytics ? (
                      <ChevronUp className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                  {featuredArticle.author.name.charAt(0)}
                </div>
                <div>
                  <div itemProp="author" className="text-xs font-semibold text-foreground">
                    {featuredArticle.author.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {featuredArticle.author.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSave(featuredArticle.id)}
                  className="h-8 w-8 rounded-full"
                  aria-label="Save to reading list"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      savedArticles.has(featuredArticle.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare(featuredArticle)}
                  className="h-8 w-8 rounded-full"
                  aria-label="Share article"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </article>
        )}

        {/* Right Side: Rapid Wire Stories (Right on desktop, 2 columns on tablet) */}
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              {t("trendingBulletins", "Trending Bulletins")}
            </span>
            <span className="text-xs text-muted-foreground">
              {filteredArticles.length} {t("activeUpdates", "updates active")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {listArticles.map((article) => (
              <article
                key={article.id}
                id={`news-${article.slug}`}
                itemScope
                itemType="https://schema.org/NewsArticle"
                className="group relative flex gap-3.5 rounded-2xl border border-border/80 bg-gradient-card p-3.5 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={article.imageUrl}
                    alt={`${article.title} thumbnail`}
                    loading="lazy"
                    decoding="async"
                    itemProp="image"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute top-1 left-1 rounded bg-black/75 px-1 py-0.5 text-[9px] font-semibold text-white">
                    {article.sport}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold text-primary">{article.category}</span>
                      <time dateTime={article.publishedAt} itemProp="datePublished">
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                    <h4
                      itemProp="headline"
                      className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm"
                    >
                      {article.title}
                    </h4>
                    {article.blogSlug && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: article.blogSlug }}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        Read match analysis & data <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span itemProp="author" className="line-clamp-1">
                      {article.author.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleSave(article.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label={`Bookmark ${article.title}`}
                      >
                        <Bookmark
                          className={`h-3 w-3 ${
                            savedArticles.has(article.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleShare(article)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label={`Share ${article.title}`}
                      >
                        <Share2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Callout banner */}
          <aside className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Newspaper className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  {t("haveTournamentUpdate", "Have a tournament or trial update?")}
                </h5>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Academy directors and federation organizers can publish verified notices on
                  KhelGrid.
                </p>
                <Link
                  to="/blog/write"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {t("submitNotice", "Submit sports notice")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Extended Multi-Column News Card Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        {remainingGridArticles.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-12 mt-4 space-y-4">
            <div className="flex items-center justify-between px-1 pt-4 border-t border-border/60">
              <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-muted-foreground">
                <Newspaper className="h-3.5 w-3.5 text-primary" />
                {t("moreNationalUpdates", "National Sports Dispatches & Selection Wire")}
              </span>
              <span className="text-xs text-muted-foreground">
                {remainingGridArticles.length} {t("articles", "articles")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {remainingGridArticles.map((article) => (
                <article
                  key={article.id}
                  id={`news-grid-${article.slug}`}
                  itemScope
                  itemType="https://schema.org/NewsArticle"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    {/* Image with sport badge & read time */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={article.imageUrl}
                        alt={`${article.title} - ${article.sport}`}
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                        <span className="rounded-full bg-primary/95 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                          {article.sport}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-white/90">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-semibold text-primary">{article.category}</span>
                        <time dateTime={article.publishedAt} itemProp="datePublished">
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>

                      <h4
                        itemProp="headline"
                        className="mt-1.5 line-clamp-2 text-sm sm:text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
                      >
                        {article.title}
                      </h4>

                      <p
                        itemProp="description"
                        className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                          {article.author.name.charAt(0)}
                        </div>
                        <span
                          itemProp="author"
                          className="line-clamp-1 text-xs font-medium text-foreground max-w-[130px]"
                        >
                          {article.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSave(article.id)}
                          className="h-7 w-7 rounded-full"
                          aria-label={`Bookmark ${article.title}`}
                        >
                          <Bookmark
                            className={`h-3.5 w-3.5 ${
                              savedArticles.has(article.id)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(article)}
                          className="h-7 w-7 rounded-full"
                          aria-label={`Share ${article.title}`}
                        >
                          <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>

                    {article.blogSlug && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: article.blogSlug }}
                        className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                      >
                        <span>{t("readFullAnalysis", "Read Tactical Analysis")}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Embedded Live Match Intelligence Hub (Recharts & Trending Social Feed) */}
      {showMatchAnalytics && (
        <div
          className="mt-10 space-y-8 border-t border-border/70 pt-8"
          id="live-match-wire-intelligence"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />{" "}
                  {t("analyticsHub", "High-Performance Analytics Hub")}
                </Badge>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  {t("liveWireData", "Live Wire Data")}
                </span>
              </div>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {activeAnalyticsHub === "asiad"
                  ? "Asian Games 2026: Live Medal Tally & Discipline Breakdown"
                  : activeAnalyticsHub === "predictor"
                    ? "Match Outcome Predictor: Dynamic Win Probability Engine"
                    : "Match Intelligence: Recharts Analytics & Community Buzz"}
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {activeAnalyticsHub === "asiad"
                  ? "Live updates on September 23, 2026: Mirabai Chanu's silver, shotgun skeet hit rates, and Asian Games leaderboard."
                  : activeAnalyticsHub === "predictor"
                    ? "Real-time win probability forecasting based on current run rates (CRR vs RRR), wickets in hand, and historical win rates."
                    : "Real-time cricket wire featuring bowling economy rates, run rate progression, and social buzz."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Horizontally scrollable switcher between Asiad, Cricket and Predictor */}
              <div className="flex items-center overflow-x-auto max-w-full rounded-full border border-border bg-background p-1 text-xs no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("asiad")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors ${
                    activeAnalyticsHub === "asiad"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Asian Games 2026
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("cricket")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors ${
                    activeAnalyticsHub === "cricket"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  India vs Japan Cricket
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("predictor")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors ${
                    activeAnalyticsHub === "predictor"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Match Outcome Predictor
                </button>
              </div>

              <Link
                to="/blog/$slug"
                params={{
                  slug:
                    activeAnalyticsHub === "asiad"
                      ? "asian-games-2026-live-updates-september-23-india-medal-tally-analysis"
                      : "india-vs-japan-cricket-match-tactical-analysis",
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                Read Full Blog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMatchAnalytics(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Hide <ChevronUp className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Render Active Analytics Dashboard */}
          {activeAnalyticsHub === "asiad" ? (
            <AsianGamesAnalytics />
          ) : activeAnalyticsHub === "predictor" ? (
            <MatchOutcomePredictor />
          ) : (
            <>
              {/* Recharts Component */}
              <MatchStatisticsCharts />

              {/* Social Media Feed Component */}
              <IndiaJapanSocialFeed />
            </>
          )}
        </div>
      )}
    </section>
  );
}

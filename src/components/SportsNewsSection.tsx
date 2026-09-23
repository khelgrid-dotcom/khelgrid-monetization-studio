import { useState, useMemo } from "react";
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
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchStatisticsCharts } from "@/components/blog/MatchStatisticsCharts";
import { IndiaJapanSocialFeed } from "@/components/blog/IndiaJapanSocialFeed";
import { AsianGamesAnalytics } from "@/components/blog/AsianGamesAnalytics";
import { MatchOutcomePredictor } from "@/components/blog/MatchOutcomePredictor";

const SPORT_TABS = [
  "All Sports",
  "Asian Games",
  "Cricket",
  "Football",
  "Badminton",
  "Athletics",
  "Grassroots",
] as const;

export function SportsNewsSection() {
  const [selectedSportTab, setSelectedSportTab] = useState<string>("All Sports");
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [showMatchAnalytics, setShowMatchAnalytics] = useState<boolean>(true);
  const [activeAnalyticsHub, setActiveAnalyticsHub] = useState<"asiad" | "cricket" | "predictor">(
    "asiad",
  );

  const filteredArticles = useMemo(() => {
    if (selectedSportTab === "All Sports") return SPORTS_NEWS_CATALOG;
    return SPORTS_NEWS_CATALOG.filter((item) => {
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
  }, [selectedSportTab]);

  const featuredArticle = useMemo(() => {
    return (
      filteredArticles.find((a) => a.featured) || filteredArticles[0] || SPORTS_NEWS_CATALOG[0]
    );
  }, [filteredArticles]);

  const listArticles = useMemo(() => {
    return filteredArticles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  }, [filteredArticles, featuredArticle]);

  const handleShare = async (article: SportsNewsArticle) => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/#news-${article.slug}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.headline,
          url,
        });
        toast.success("Shared successfully");
      } catch {
        // user dismissed or cancelled
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
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
      return next;
    });
  };

  // Structured Data (JSON-LD NewsArticle & ItemList) for Search Engine Crawlers
  const newsJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: SPORTS_NEWS_CATALOG.map((article, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt,
          url: `https://khelgrid.com/#news-${article.slug}`,
          image: article.imageUrl,
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          author: {
            "@type": "Person",
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            "@type": "SportsOrganization",
            name: "KhelGrid",
            logo: {
              "@type": "ImageObject",
              url: "https://khelgrid.com/favicon.svg",
            },
          },
        },
      })),
    };
  }, []);

  return (
    <section
      id="sports-news-section"
      className="mt-14 border-t border-border/60 pt-10 sm:mt-16 sm:pt-12"
      aria-label="Sports Updates and News Wire"
    >
      {/* Schema.org NewsArticle & ItemList Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Flame className="h-3.5 w-3.5" />
              Real-time Sports Wire
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              Updated Live
            </span>
          </div>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Sports Updates & National News
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Breaking selection trials, Khelo India updates, state championships and athlete pathways
            across India.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SPORT_TABS.map((tab) => {
            const active = selectedSportTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedSportTab(tab)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Featured Article (Left 60%) + Trending Wire (Right 40%) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Featured Big Story */}
        {featuredArticle && (
          <article
            id={`news-${featuredArticle.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/50 sm:p-6 lg:col-span-7"
          >
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  loading="lazy"
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

              <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                {featuredArticle.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {featuredArticle.excerpt}
              </p>

              {featuredArticle.blogSlug && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featuredArticle.blogSlug }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  >
                    Read Full Tactical Analysis <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowMatchAnalytics(!showMatchAnalytics)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {showMatchAnalytics
                        ? "Hide Recharts & Social Feed"
                        : "View Recharts & Social Feed"}
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
                  <div className="text-xs font-semibold text-foreground">
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
                  title="Save to reading list"
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
                  title="Share article"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </article>
        )}

        {/* Right Side: Rapid Wire Stories */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Trending Bulletins
            </span>
            <span className="text-xs text-muted-foreground">
              {filteredArticles.length} updates today
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {listArticles.map((article) => (
              <article
                key={article.id}
                id={`news-${article.slug}`}
                className="group relative flex gap-3.5 rounded-2xl border border-border/80 bg-gradient-card p-3.5 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute top-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                    {article.sport}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold text-primary">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">
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
                    <span className="line-clamp-1">{article.author.name}</span>
                    <button
                      onClick={() => handleShare(article)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Share link"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Callout banner */}
          <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Newspaper className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  Have a tournament or trial update?
                </h5>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Academy directors and federation organizers can publish verified notices on
                  KhelGrid.
                </p>
                <Link
                  to="/blog/write"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Submit sports notice <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
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
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> High-Performance Analytics Hub
                </Badge>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  Live Wire Data
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
              {/* Switcher between Asiad, Cricket and Predictor */}
              <div className="flex items-center rounded-full border border-border bg-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("asiad")}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
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
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
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
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
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

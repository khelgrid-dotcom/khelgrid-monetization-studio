import { useState, useRef } from "react";
import { type LiveMatchUpdate } from "@/data/liveSports";
import { useLiveSports } from "@/hooks/use-live-sports";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function LiveSportsBar() {
  const {
    matches,
    allMatches,
    selectedSport,
    setSelectedSport,
    sportsFilterList,
    sportCounts,
    liveCount,
    isRefreshing,
    isLiveFeedConnected,
    lastUpdated,
    sourceSummary,
    isCollapsed,
    toggleCollapse,
    refresh,
  } = useLiveSports();

  const [activeModalMatch, setActiveModalMatch] = useState<LiveMatchUpdate | null>(null);
  const tickerContainerRef = useRef<HTMLDivElement>(null);

  // Horizontal scroll controls for sports ticker
  const scrollTicker = (direction: "left" | "right") => {
    if (!tickerContainerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    tickerContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Live Sports Pulse Bar */}
      <aside
        id="khelgrid-live-sports-bar"
        aria-label="Live Sports Score Ticker"
        className="relative z-30 border-b border-border/80 bg-card/95 text-foreground backdrop-blur-md transition-all duration-200"
      >
        {/* Collapsed State Minimalist Strip */}
        {isCollapsed ? (
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-xs tracking-tight">Live Sports Ticker</span>
              {liveCount > 0 && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {liveCount} Live
                </span>
              )}
              <span className="hidden sm:inline text-[11px] text-muted-foreground">
                • {allMatches.length} matches tracked ({lastUpdated})
              </span>
            </div>
            <button
              onClick={toggleCollapse}
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Expand live sports bar"
            >
              <span>Show Scores</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded Full Ticker View */
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-2.5 py-1.5 sm:gap-3 sm:px-4">
            {/* Live Indicator Badge */}
            <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="tracking-wider">GOOGLE SPORTS</span>
              {liveCount > 0 && (
                <span className="hidden sm:inline-block rounded bg-emerald-600/20 px-1 py-0.2 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                  {liveCount} Live
                </span>
              )}
            </div>

            {/* Quick Sport Filter Chips */}
            <div className="hidden shrink-0 items-center gap-1 lg:flex">
              {sportsFilterList.map((sport) => {
                const active = selectedSport === sport;
                const count = sportCounts[sport] || 0;
                if (sport !== "All" && count === 0) return null;

                return (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {sport}
                    <span
                      className={`ml-1 text-[10px] opacity-75 ${
                        active ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ticker Left Scroll Nav */}
            <button
              onClick={() => scrollTicker("left")}
              className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Scroll scores left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Horizontal Score Cards Ticker */}
            <div
              ref={tickerContainerRef}
              className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-0.5"
            >
              {matches.length === 0 ? (
                <div className="py-1 text-xs text-muted-foreground">
                  No {selectedSport} matches currently available.
                </div>
              ) : (
                matches.map((match) => {
                  const isLive = match.status === "LIVE";
                  const isUpcoming = match.status === "UPCOMING";

                  return (
                    <button
                      key={match.id}
                      onClick={() => setActiveModalMatch(match)}
                      className={`group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1 text-left text-xs transition-all hover:border-primary/50 hover:bg-muted/70 ${
                        isLive
                          ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                          : "border-border/80 bg-background/90"
                      }`}
                      title={`View details for ${match.teamA.name} vs ${match.teamB.name}`}
                    >
                      {/* Sport Badge */}
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        {match.sport}
                      </span>

                      {/* Team A */}
                      <div className="flex items-center gap-1.5">
                        {match.teamA.logo ? (
                          <img
                            src={match.teamA.logo}
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : null}
                        <span className="font-semibold text-foreground">{match.teamA.code}</span>
                        <span
                          className={`font-bold transition-all ${
                            isLive ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                          }`}
                        >
                          {match.teamA.score}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-muted-foreground/60">vs</span>

                      {/* Team B */}
                      <div className="flex items-center gap-1.5">
                        {match.teamB.logo ? (
                          <img
                            src={match.teamB.logo}
                            alt=""
                            className="h-3.5 w-3.5 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : null}
                        <span className="font-semibold text-foreground">{match.teamB.code}</span>
                        <span
                          className={`font-bold transition-all ${
                            isLive ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                          }`}
                        >
                          {match.teamB.score}
                        </span>
                      </div>

                      {/* Detail / Overs badge */}
                      {match.venueOrOvers && (
                        <span className="hidden sm:inline-block rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {match.venueOrOvers}
                        </span>
                      )}

                      {/* Status indicator */}
                      {isLive ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live
                        </span>
                      ) : isUpcoming ? (
                        <span className="rounded bg-sky-500/10 px-1 py-0.2 text-[9px] font-semibold text-sky-600 dark:text-sky-400">
                          Upcoming
                        </span>
                      ) : (
                        <span className="rounded bg-muted px-1 py-0.2 text-[9px] font-medium text-muted-foreground">
                          Final
                        </span>
                      )}

                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Ticker Right Scroll Nav */}
            <button
              onClick={() => scrollTicker("right")}
              className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Scroll scores right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Action Buttons: Refresh & Collapse */}
            <div className="flex shrink-0 items-center gap-1 pl-1">
              {/* Refresh button */}
              <button
                onClick={() => refresh(true)}
                disabled={isRefreshing}
                className="flex items-center gap-1 rounded-md p-1.5 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60"
                title={`${sourceSummary} (${lastUpdated}). Click to re-fetch live scores now.`}
                aria-label="Refresh live scores"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
                />
                <span className="hidden xl:inline text-[10px] font-medium">{lastUpdated}</span>
              </button>

              {/* Collapse button */}
              <button
                onClick={toggleCollapse}
                className="flex items-center rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                title="Collapse live sports bar"
                aria-label="Collapse live sports bar"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Live Match Detail Dialog */}
      {activeModalMatch && (
        <Dialog
          open={Boolean(activeModalMatch)}
          onOpenChange={(open) => !open && setActiveModalMatch(null)}
        >
          <DialogContent className="max-w-md rounded-2xl border-border bg-background p-6 shadow-xl">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  {activeModalMatch.sport} · {activeModalMatch.tournament}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    activeModalMatch.status === "LIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : activeModalMatch.status === "UPCOMING"
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {activeModalMatch.status}
                </span>
              </div>
              <DialogTitle className="mt-3 text-lg font-bold">
                {activeModalMatch.teamA.name} vs {activeModalMatch.teamB.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeModalMatch.stage ? `${activeModalMatch.stage} • ` : ""}
                {activeModalMatch.venueOrOvers ? `${activeModalMatch.venueOrOvers} • ` : ""}
                {activeModalMatch.liveTime || "Scheduled"}
              </DialogDescription>
            </DialogHeader>

            {/* Scoreboard Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-muted/40 p-4">
              <div className="flex flex-col items-center text-center">
                {activeModalMatch.teamA.logo ? (
                  <img
                    src={activeModalMatch.teamA.logo}
                    alt={activeModalMatch.teamA.name}
                    className="h-10 w-10 object-contain mb-1.5"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary mb-1.5">
                    {activeModalMatch.teamA.code}
                  </div>
                )}
                <div className="text-xs font-semibold text-muted-foreground line-clamp-1">
                  {activeModalMatch.teamA.name}
                </div>
                <div className="mt-1 text-xl font-extrabold text-foreground">
                  {activeModalMatch.teamA.score}
                </div>
              </div>

              <div className="flex flex-col items-center text-center border-l border-border/70 pl-3">
                {activeModalMatch.teamB.logo ? (
                  <img
                    src={activeModalMatch.teamB.logo}
                    alt={activeModalMatch.teamB.name}
                    className="h-10 w-10 object-contain mb-1.5"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary mb-1.5">
                    {activeModalMatch.teamB.code}
                  </div>
                )}
                <div className="text-xs font-semibold text-muted-foreground line-clamp-1">
                  {activeModalMatch.teamB.name}
                </div>
                <div className="mt-1 text-xl font-extrabold text-foreground">
                  {activeModalMatch.teamB.score}
                </div>
              </div>
            </div>

            {/* Match Highlight & State */}
            <div className="mt-4 rounded-xl bg-card p-3.5 border border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Activity className="h-4 w-4" />
                <span>Match Status & Commentary</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                {activeModalMatch.highlight}
              </p>
            </div>

            {/* Feed Source & External Google Sports Link */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
              <span className="flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-emerald-500" />
                <span>Google Sports Live Data</span>
                {isLiveFeedConnected && (
                  <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </span>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${activeModalMatch.teamA.name} vs ${activeModalMatch.teamB.name} live score ${activeModalMatch.sport}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-semibold text-primary hover:bg-primary/20 transition-colors"
                title="Open live interactive score center on Google Sports"
              >
                <span>Google Sports Match Center</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

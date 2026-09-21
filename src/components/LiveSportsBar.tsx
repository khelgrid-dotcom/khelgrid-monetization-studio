import { useState, useMemo } from "react";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import { Activity, ChevronRight, RefreshCw, X, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SPORTS_FILTER: Array<"All" | LiveMatchUpdate["sport"]> = [
  "All",
  "Cricket",
  "Football",
  "Badminton",
  "Kabaddi",
  "Hockey",
  "Tennis",
];

export function LiveSportsBar() {
  const [selectedSport, setSelectedSport] = useState<"All" | LiveMatchUpdate["sport"]>("All");
  const [activeModalMatch, setActiveModalMatch] = useState<LiveMatchUpdate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const filteredMatches = useMemo(() => {
    if (selectedSport === "All") return LIVE_SPORTS_UPDATES;
    return LIVE_SPORTS_UPDATES.filter((m) => m.sport === selectedSport);
  }, [selectedSport]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated("Just now");
    }, 600);
  };

  return (
    <>
      {/* Top Live Sports Pulse Bar */}
      <aside
        aria-label="Live Sports Score Ticker"
        className="relative z-30 border-b border-border/70 bg-card/95 text-foreground backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-4">
          {/* Pulse Indicator badge */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">LIVE SPORTS</span>
          </div>

          {/* Quick Sport Filter Chips (Desktop) */}
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            {SPORTS_FILTER.map((sport) => {
              const active = selectedSport === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>

          {/* Horizontal score cards ticker */}
          <div className="flex flex-1 items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredMatches.map((match) => {
              const isLive = match.status === "LIVE";
              return (
                <button
                  key={match.id}
                  onClick={() => setActiveModalMatch(match)}
                  className="group flex shrink-0 items-center gap-2.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-left text-xs transition-all hover:border-primary/50 hover:bg-muted/60"
                  title={`View details for ${match.teamA.name} vs ${match.teamB.name}`}
                >
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {match.sport}
                  </span>

                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-foreground">{match.teamA.code}</span>
                    <span className="font-semibold text-primary">{match.teamA.score}</span>
                    <span className="text-[10px] text-muted-foreground">vs</span>
                    <span className="text-foreground">{match.teamB.code}</span>
                    <span className="font-semibold text-primary">{match.teamB.score}</span>
                  </div>

                  {match.venueOrOvers && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {match.venueOrOvers}
                    </span>
                  )}

                  {isLive && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  )}

                  <ChevronRight className="h-3 w-3 text-muted-foreground opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          {/* Refresh button */}
          <div className="flex shrink-0 items-center gap-1.5 pl-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 rounded-md p-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Refresh live scores"
              aria-label="Refresh live scores"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              <span className="hidden xl:inline text-[10px]">{lastUpdated}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Live Match Detail Slide-over / Modal */}
      {activeModalMatch && (
        <Dialog
          open={Boolean(activeModalMatch)}
          onOpenChange={(o) => !o && setActiveModalMatch(null)}
        >
          <DialogContent className="max-w-md rounded-2xl border-border bg-background p-6">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  {activeModalMatch.sport} · {activeModalMatch.tournament}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    activeModalMatch.status === "LIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {activeModalMatch.status}
                </span>
              </div>
              <DialogTitle className="mt-2 text-lg font-bold">
                {activeModalMatch.teamA.name} vs {activeModalMatch.teamB.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeModalMatch.stage ? `${activeModalMatch.stage} · ` : ""}
                {activeModalMatch.liveTime}
              </DialogDescription>
            </DialogHeader>

            {/* Scoreboard Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-muted/40 p-4">
              <div className="text-center">
                <div className="text-xs font-semibold text-muted-foreground">
                  {activeModalMatch.teamA.name} ({activeModalMatch.teamA.code})
                </div>
                <div className="mt-1 text-xl font-bold text-foreground">
                  {activeModalMatch.teamA.score}
                </div>
              </div>
              <div className="text-center border-l border-border/70">
                <div className="text-xs font-semibold text-muted-foreground">
                  {activeModalMatch.teamB.name} ({activeModalMatch.teamB.code})
                </div>
                <div className="mt-1 text-xl font-bold text-foreground">
                  {activeModalMatch.teamB.score}
                </div>
              </div>
            </div>

            {/* Match Highlight & State */}
            <div className="mt-4 rounded-xl bg-card p-3.5 border border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Activity className="h-4 w-4" />
                Live Status & Commentary
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                {activeModalMatch.highlight}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Source: {activeModalMatch.source}</span>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${activeModalMatch.teamA.name} vs ${activeModalMatch.teamB.name} live score`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                View on Google Sports <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

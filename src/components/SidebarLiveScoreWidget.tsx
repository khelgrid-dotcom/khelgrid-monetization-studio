import { useState, useEffect } from "react";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import { ChevronRight, ChevronLeft, Activity, Radio } from "lucide-react";

export function SidebarLiveScoreWidget() {
  const liveMatches = LIVE_SPORTS_UPDATES.filter((m) => m.status === "LIVE");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate through matches every 8 seconds if not interacted
  useEffect(() => {
    if (liveMatches.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveMatches.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [liveMatches.length]);

  const currentMatch = liveMatches[currentIndex] || LIVE_SPORTS_UPDATES[0];
  if (!currentMatch) return null;

  const scrollToLiveSection = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const el = document.getElementById("live-scores");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#live-scores";
      }
    }
  };

  return (
    <div className="my-2 rounded-xl border border-[#232938] bg-[#141822] p-3 text-white shadow-sm transition-all hover:border-amber-500/40">
      {/* Mini Header: Match title & LIVE badge */}
      <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px]">🏏</span>
          <span className="truncate font-medium text-[11px] text-slate-300">
            {currentMatch.matchInfo ||
              `${currentMatch.stage || "Match"} • ${currentMatch.tournament}`}
          </span>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0a2618] border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LIVE</span>
        </span>
      </div>

      {/* Mini Teams & Scores */}
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">{currentMatch.teamA.flag || "🇨🇦"}</span>
            <span className="font-bold text-slate-100 truncate">{currentMatch.teamA.code}</span>
          </div>
          <span className="font-mono text-xs font-bold text-white">{currentMatch.teamA.score}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">{currentMatch.teamB.flag || "⚡"}</span>
            <span className="font-bold text-slate-100 truncate">{currentMatch.teamB.code}</span>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-300">
            {currentMatch.teamB.score}
          </span>
        </div>
      </div>

      {/* Mini Status */}
      <p className="mt-2 text-[10px] text-slate-400 truncate font-medium">
        {currentMatch.statusText || currentMatch.highlight}
      </p>

      {/* Mini Footer: Switcher & Link to Live Scores Section */}
      <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
        <a
          href="/#live-scores"
          onClick={scrollToLiveSection}
          className="inline-flex items-center gap-0.5 font-semibold text-amber-400 hover:underline"
        >
          <span>Live Scores</span>
          <ChevronRight className="h-3 w-3" />
        </a>

        {liveMatches.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + liveMatches.length) % liveMatches.length)
              }
              className="p-0.5 text-slate-400 hover:text-white rounded"
              aria-label="Previous live match"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-[9px] text-slate-400 font-mono">
              {currentIndex + 1}/{liveMatches.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % liveMatches.length)}
              className="p-0.5 text-slate-400 hover:text-white rounded"
              aria-label="Next live match"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

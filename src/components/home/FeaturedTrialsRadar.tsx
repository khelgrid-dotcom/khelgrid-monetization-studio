import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { TRIALS, type Trial } from "@/data/trials";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import {
  Trophy,
  Calendar,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface FeaturedTrialsRadarProps {
  selectedSport?: string;
  selectedCity?: string;
}

export function FeaturedTrialsRadar({
  selectedSport = "All",
  selectedCity = "All Cities",
}: FeaturedTrialsRadarProps) {
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTrials = TRIALS.filter((trial) => {
    const matchSport =
      selectedSport === "All" ||
      selectedSport === "All Sports" ||
      trial.sport.toLowerCase() === selectedSport.toLowerCase();

    const matchCity =
      selectedCity === "All Cities" ||
      selectedCity === "All Locations" ||
      trial.city.toLowerCase() === selectedCity.toLowerCase();

    return matchSport && matchCity;
  }).slice(0, 8);

  const displayTrials = filteredTrials.length > 0 ? filteredTrials : TRIALS.slice(0, 8);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  const handleShare = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
    const shareUrl = `${origin}/trial/${trial.id}`;
    const text = `🏆 *${trial.sport.toUpperCase()} TRIAL: ${trial.title}*\n📍 *Location:* ${trial.academy}, ${trial.city}\n🗓️ *Date:* ${trial.date}\n🎟️ *Fee:* ${trial.fee === 0 ? "Free Entry" : "₹" + trial.fee}\n🎯 *Eligibility:* ${trial.ageCategory || "Open"}\n\n👉 *Details & Registration:* ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Opening WhatsApp share!");
  };

  const handleBookmark = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(id);
    if (!isSaved(id)) {
      toast.success(`Saved "${title}"`);
    } else {
      toast.info(`Removed from saved`);
    }
  };

  return (
    <section
      aria-label="Featured Selection Trials"
      className="w-full min-w-0 max-w-full overflow-hidden py-2"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2.5 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">Selection Trials & Combines</span>
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            Verified SAI, federation & academy scouting trials · Swipe to explore
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Left/Right Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll trials left"
              className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll trials right"
              className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/trials"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>All ({TRIALS.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontally Scrollable Rail of Trial Cards across all screen devices */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-2.5 pt-1 px-0.5 overscroll-x-contain touch-pan-x snap-x snap-mandatory"
      >
        {displayTrials.map((trial) => {
          const saved = isSaved(trial.id);

          return (
            <Link
              key={trial.id}
              to="/trial/$id"
              params={{ id: trial.id }}
              className="snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-[320px] lg:w-[340px] group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-primary text-[11px] uppercase tracking-wide truncate">
                      {trial.sport}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-[11px] text-muted-foreground truncate">{trial.city}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, trial)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition"
                      title="Share trial"
                      aria-label="Share trial on WhatsApp"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleBookmark(e, trial.id, trial.title)}
                      className={`grid h-7 w-7 place-items-center rounded-lg transition cursor-pointer ${
                        saved
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                      title={saved ? "Remove bookmark" : "Bookmark trial"}
                      aria-label="Bookmark trial"
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-primary" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Trial Title */}
                <h3 className="mt-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                  {trial.title}
                </h3>

                {/* Academy / Organizer */}
                <p className="mt-1 text-xs text-muted-foreground truncate flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{trial.academy}</span>
                </p>
              </div>

              {/* Card Footer: Date, Eligibility, Fee */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[11px] font-medium">{trial.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {trial.ageCategory || "Open Age"}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      trial.fee === 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {trial.fee === 0 ? "Free" : `₹${trial.fee}`}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

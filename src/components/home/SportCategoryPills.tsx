import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SPORTS_LIST = [
  { id: "All", name: "All Sports", emoji: "🏅" },
  { id: "Cricket", name: "Cricket", emoji: "🏏" },
  { id: "Football", name: "Football", emoji: "⚽" },
  { id: "Badminton", name: "Badminton", emoji: "🏸" },
  { id: "Wrestling", name: "Wrestling", emoji: "🤼" },
  { id: "Athletics", name: "Athletics", emoji: "🏃" },
  { id: "Tennis", name: "Tennis", emoji: "🎾" },
  { id: "Hockey", name: "Hockey", emoji: "🏑" },
  { id: "Basketball", name: "Basketball", emoji: "🏀" },
  { id: "Pickleball", name: "Pickleball", emoji: "🏓" },
] as const;

interface SportCategoryPillsProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

export function SportCategoryPills({ selectedSport, onSelectSport }: SportCategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -180 : 180,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative py-1 min-h-[46px]">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 overscroll-x-contain touch-pan-x snap-x snap-mandatory"
      >
        {SPORTS_LIST.map((sport) => {
          const isSelected =
            selectedSport === sport.id || (selectedSport === "All Sports" && sport.id === "All");

          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className={`snap-start flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[40px] select-none ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/30"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-sm leading-none">{sport.emoji}</span>
              <span>{sport.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SaveForLaterButtonProps {
  eventId: string;
  eventTitle?: string;
  isSaved: boolean;
  onToggle: (e: React.MouseEvent) => void;
  variant?: "icon-badge" | "button" | "compact" | "icon";
  className?: string;
}

export function SaveForLaterButton({
  eventId,
  eventTitle = "Tournament",
  isSaved,
  onToggle,
  variant = "icon-badge",
  className,
}: SaveForLaterButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle(e);
  };

  const titleText = isSaved
    ? `Saved to shortlist (click to remove)`
    : `Save "${eventTitle}" for later`;

  // 1. VARIANT: ICON-BADGE (Floating circular button on card image corner)
  if (variant === "icon-badge") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={titleText}
        aria-label={titleText}
        data-testid={`save-badge-${eventId}`}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer shadow-md select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isSaved
            ? "bg-amber-500 text-white shadow-amber-500/30 border border-amber-400 scale-105"
            : "bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md hover:scale-105",
          isAnimating && "scale-125 duration-100",
          className,
        )}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-all duration-200",
            isSaved ? "fill-white text-white stroke-[2.5]" : "stroke-[2]",
          )}
        />
        {isSaved && (
          <span className="sr-only">Saved for later</span>
        )}
      </button>
    );
  }

  // 2. VARIANT: COMPACT (Small action button for card footer)
  if (variant === "compact") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        title={titleText}
        aria-label={titleText}
        data-testid={`save-btn-${eventId}`}
        className={cn(
          "h-8.5 px-2 text-xs transition-all cursor-pointer font-medium select-none",
          isSaved
            ? "text-amber-500 hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20"
            : "text-muted-foreground hover:text-foreground",
          isAnimating && "scale-95 duration-100",
          className,
        )}
      >
        <Bookmark
          className={cn(
            "h-3.5 w-3.5 mr-1 transition-all",
            isSaved ? "fill-amber-500 text-amber-500" : "text-muted-foreground",
          )}
        />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </Button>
    );
  }

  // 3. VARIANT: ICON (Minimal inline icon button)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={titleText}
        aria-label={titleText}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-all cursor-pointer",
          isSaved
            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          className,
        )}
      >
        <Bookmark
          className={cn(
            "h-3.5 w-3.5",
            isSaved && "fill-amber-500 text-amber-500",
          )}
        />
      </button>
    );
  }

  // 4. VARIANT: BUTTON (Full width / prominent button with label)
  return (
    <Button
      type="button"
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      title={titleText}
      aria-label={titleText}
      data-testid={`save-full-btn-${eventId}`}
      className={cn(
        "gap-1.5 text-xs font-semibold cursor-pointer transition-all",
        isSaved
          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
          : "hover:border-primary/50 text-foreground",
        isAnimating && "scale-95 duration-100",
        className,
      )}
    >
      <Bookmark
        className={cn(
          "h-3.5 w-3.5 transition-transform",
          isSaved && "fill-amber-500 text-amber-500 scale-110",
        )}
      />
      <span>{isSaved ? "Saved for Later" : "Save for Later"}</span>
    </Button>
  );
}

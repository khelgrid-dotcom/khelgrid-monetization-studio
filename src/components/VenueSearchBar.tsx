import React from "react";
import { Search, X, MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VenueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  totalResults?: number;
  isLoading?: boolean;
}

export function VenueSearchBar({
  value,
  onChange,
  placeholder = "Search sports venues by name, area, city, or address...",
  className = "",
  totalResults,
  isLoading = false,
}: VenueSearchBarProps) {
  return (
    <div id="venue-search-bar-wrapper" className={`relative w-full space-y-2 ${className}`}>
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-muted-foreground">
          <Search className="h-4 w-4 text-primary" />
        </div>

        {/* Input Field */}
        <Input
          id="venue-search-input-field"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full pl-10 pr-24 rounded-xl border-border/80 bg-background/90 text-sm md:text-base placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary shadow-xs transition-all"
        />

        {/* Right side buttons & indicators */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value.trim().length > 0 && (
            <Button
              id="venue-search-clear-btn"
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60 text-[11px] font-medium text-muted-foreground border border-border/50 select-none pointer-events-none">
            <Building2 className="h-3 w-3" />
            <span>Name</span>
            <span className="opacity-40">/</span>
            <MapPin className="h-3 w-3 text-primary/80" />
            <span>Location</span>
          </div>
        </div>
      </div>

      {/* Active Search Context Hint */}
      {value.trim().length > 0 && (
        <div
          id="venue-search-status-bar"
          className="flex items-center justify-between text-xs text-muted-foreground px-1"
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>
              Filtering by{" "}
              <strong className="text-foreground font-semibold">&ldquo;{value}&rdquo;</strong>{" "}
              across name and location
            </span>
          </div>

          {typeof totalResults === "number" && !isLoading && (
            <span className="font-medium text-foreground">
              {`${totalResults} ${totalResults === 1 ? "venue" : "venues"} found`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default VenueSearchBar;

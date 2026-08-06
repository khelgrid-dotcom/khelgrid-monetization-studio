import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { SPORTS_CATALOG } from "@/data/catalog";

interface SportsLauncherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SportsLauncher({ open, onOpenChange }: SportsLauncherProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredSports = SPORTS_CATALOG.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSportClick = (slug: string) => {
    navigate({ to: `/sport/${slug}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Explore Sports & Trials</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredSports.map((sport) => (
              <button
                key={sport.slug}
                onClick={() => handleSportClick(sport.slug)}
                className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card/60 hover:bg-secondary/60 transition-all hover:shadow-lg"
              >
                {/* Emoji Icon */}
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {sport.emoji}
                </div>

                {/* Sport Name */}
                <h3 className="font-semibold text-sm text-center text-foreground mb-1">
                  {sport.name}
                </h3>

                {/* Tagline */}
                <p className="text-xs text-muted-foreground text-center line-clamp-2">
                  {sport.tagline}
                </p>

                {/* Badge */}
                <span className="mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {sport.level}
                </span>
              </button>
            ))}
          </div>

          {filteredSports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sports found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, Search, Check, Sparkles } from "lucide-react";

export const POPULAR_METROS = [
  { name: "Delhi NCR", value: "Delhi" },
  { name: "Mumbai", value: "Mumbai" },
  { name: "Bengaluru", value: "Bengaluru" },
  { name: "Hyderabad", value: "Hyderabad" },
  { name: "Chandigarh", value: "Chandigarh" },
  { name: "Pune", value: "Pune" },
  { name: "Kolkata", value: "Kolkata" },
  { name: "All Locations", value: "All Locations" },
] as const;

interface MetroCityPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export function MetroCityPickerModal({
  open,
  onOpenChange,
  selectedCity,
  onSelectCity,
}: MetroCityPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = POPULAR_METROS.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleSelect = (val: string) => {
    onSelectCity(val);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[92vw] sm:w-full rounded-2xl p-5 border-border/80 bg-card shadow-xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>Select Your City</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground mt-1">
            Explore trials & venues near you
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Filter sports opportunities, turf venues and academy tryouts in your region.
          </DialogDescription>
        </DialogHeader>

        {/* Search input inside modal */}
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type city name (e.g. Delhi, Mumbai)…"
            className="h-10 w-full rounded-xl bg-secondary/50 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
          />
        </div>

        {/* Quick popular metro chips */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Popular Sports Metros</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredCities.map((metro) => {
              const isSelected = selectedCity.toLowerCase() === metro.value.toLowerCase();
              return (
                <button
                  key={metro.name}
                  type="button"
                  onClick={() => handleSelect(metro.value)}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer active:scale-95 text-left ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                      : "border-border/80 bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <span className="truncate">{metro.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

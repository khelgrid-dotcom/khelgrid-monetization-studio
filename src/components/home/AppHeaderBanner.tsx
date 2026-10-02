import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Sparkles, ChevronDown, ShieldCheck, Trophy, Flame } from "lucide-react";
import { PLAYO_CITIES } from "@/data/playo";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";

interface AppHeaderBannerProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export function AppHeaderBanner({ selectedCity, onSelectCity }: AppHeaderBannerProps) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome, Athlete");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning, Athlete");
    else if (hour < 17) setGreeting("Good afternoon, Athlete");
    else setGreeting("Good evening, Athlete");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: searchQuery.trim(),
        city: selectedCity === "All Cities" ? undefined : selectedCity,
        sort: "Soonest",
        free: false,
      },
    });
  };

  return (
    <header className="relative space-y-3 pt-2">
      {/* PWA / App Install Bar */}
      <PWAInstallBanner />

      {/* App Top Greetings & City Switcher Bar */}
      <div className="flex items-start sm:items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium h-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">{greeting}</span>
          </div>
          <h1 className="mt-0.5 text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground truncate min-h-[1.75rem] sm:min-h-[2.25rem]">
            {selectedCity === "All Cities" ? (
              <>
                Sports Across <span className="text-primary">India</span>
              </>
            ) : (
              <>
                Sports in <span className="text-primary">{selectedCity}</span>
              </>
            )}
          </h1>
        </div>

        {/* City Switcher Pill */}
        <div className="relative shrink-0 pt-0.5 sm:pt-0">
          <button
            type="button"
            onClick={() => setCityDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition hover:bg-secondary hover:border-primary/40 cursor-pointer min-h-[36px]"
            aria-expanded={cityDropdownOpen}
            aria-label="Select City"
          >
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="max-w-[80px] sm:max-w-none truncate">
              {selectedCity === "All Cities" ? "All India" : selectedCity}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>

          {cityDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setCityDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-40 w-44 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Select Metro City
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCity("All Cities");
                    setCityDropdownOpen(false);
                  }}
                  className={`w-full rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition cursor-pointer ${
                    selectedCity === "All Cities"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  All India
                </button>
                {PLAYO_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition cursor-pointer ${
                      selectedCity === city
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* App Quick Search Input Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-xs backdrop-blur-md transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20"
      >
        <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cricket trials, football turf, badminton..."
          aria-label="Search trials, venues, or sports events"
          className="h-10 w-full bg-transparent px-3 text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-primary px-3 sm:px-4 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 cursor-pointer min-h-[36px]"
        >
          <span>Find</span>
        </button>
      </form>
    </header>
  );
}

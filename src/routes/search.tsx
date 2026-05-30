import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { TRIALS, SPORTS, CITIES, type Trial } from "@/data/trials";
import { TrialCard } from "@/components/TrialCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BoostModal } from "@/components/BoostModal";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search as SearchIcon,
  MapPin,
  Trophy,
  X,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  IndianRupee,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const ALL_SPORT = "All Sports";
const ALL_CITY = "All Locations";
const SORTS = ["Soonest", "Most spots", "Lowest fee"] as const;
type SortKey = (typeof SORTS)[number];

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sport: fallback(z.string(), ALL_SPORT).default(ALL_SPORT),
  city: fallback(z.string(), ALL_CITY).default(ALL_CITY),
  sort: fallback(z.enum(SORTS), "Soonest").default("Soonest"),
  free: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search · KhelGrid" },
      { name: "description", content: "Search trials, tournaments, academies and events across India by sport and city." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const auth = useAuth();
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [checkout, setCheckout] = useState<Trial | null>(null);
  const [boost, setBoost] = useState<Trial | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const update = (patch: Partial<typeof params>) =>
    navigate({ search: (prev: typeof params) => ({ ...prev, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    let list = TRIALS.filter(t => {
      if (params.sport !== ALL_SPORT && t.sport !== params.sport) return false;
      if (params.city !== ALL_CITY && t.city !== params.city) return false;
      if (params.free && t.fee > 0) return false;
      if (q && !`${t.title} ${t.academy} ${t.sport} ${t.city} ${t.tag}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const dateKey = (t: Trial) => new Date(t.date).getTime();
    if (params.sort === "Soonest") list = [...list].sort((a, b) => dateKey(a) - dateKey(b));
    else if (params.sort === "Most spots") list = [...list].sort((a, b) => b.spots - a.spots);
    else if (params.sort === "Lowest fee") list = [...list].sort((a, b) => a.fee - b.fee);

    const boosted = list.filter(t => auth.boostedTrials.includes(t.id));
    const regular = list.filter(t => !auth.boostedTrials.includes(t.id));
    return { boosted, regular, total: list.length };
  }, [params, auth.boostedTrials]);

  const handleApply = (trial: Trial) => {
    if (auth.applications.includes(trial.id)) return;
    if (auth.canApply(trial.id)) {
      auth.applyToTrial(trial.id);
      toast.success(`Applied to ${trial.title}`);
      return;
    }
    setCheckout(trial);
  };

  const showBoostAction = auth.role === "organizer";

  const activePills: { key: string; label: string; icon: React.ReactNode; onClear: () => void }[] = [];
  if (params.q)
    activePills.push({
      key: "q",
      label: `"${params.q}"`,
      icon: <SearchIcon className="h-3 w-3" />,
      onClear: () => update({ q: "" }),
    });
  if (params.sport !== ALL_SPORT)
    activePills.push({
      key: "sport",
      label: params.sport,
      icon: <Trophy className="h-3 w-3" />,
      onClear: () => update({ sport: ALL_SPORT }),
    });
  if (params.city !== ALL_CITY)
    activePills.push({
      key: "city",
      label: params.city,
      icon: <MapPin className="h-3 w-3" />,
      onClear: () => update({ city: ALL_CITY }),
    });
  if (params.free)
    activePills.push({
      key: "free",
      label: "Free entry",
      icon: <IndianRupee className="h-3 w-3" />,
      onClear: () => update({ free: false }),
    });
  if (params.sort !== "Soonest")
    activePills.push({
      key: "sort",
      label: params.sort,
      icon: <ArrowUpDown className="h-3 w-3" />,
      onClear: () => update({ sort: "Soonest" }),
    });

  const clearAll = () =>
    navigate({ search: { q: "", sport: ALL_SPORT, city: ALL_CITY, sort: "Soonest", free: false }, replace: true });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Search the Grid</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Trials, academies & events across India.
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 border-border">
          {results.total}
        </Badge>
      </div>

      {/* Search input + filters trigger (mobile-first) */}
      <div className="mt-5 flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={params.q}
            onChange={e => update({ q: e.target.value })}
            placeholder="Search sport, organizer, venue…"
            className="h-11 w-full rounded-xl border border-border bg-card/60 pl-9 pr-9 text-sm outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
          />
          {params.q && (
            <button
              onClick={() => update({ q: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-11 w-11 shrink-0 rounded-xl border-border"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activePills.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {activePills.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
            <SheetHeader className="text-left">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-5 space-y-6">
              <FilterGroup label="Sport" icon={<Trophy className="h-3.5 w-3.5" />}>
                <ChipRow
                  options={[ALL_SPORT, ...SPORTS]}
                  active={params.sport}
                  onSelect={v => update({ sport: v })}
                />
              </FilterGroup>

              <FilterGroup label="Location" icon={<MapPin className="h-3.5 w-3.5" />}>
                <ChipRow
                  options={[ALL_CITY, ...CITIES]}
                  active={params.city}
                  onSelect={v => update({ city: v })}
                />
              </FilterGroup>

              <FilterGroup label="Sort by" icon={<ArrowUpDown className="h-3.5 w-3.5" />}>
                <ChipRow
                  options={[...SORTS]}
                  active={params.sort}
                  onSelect={v => update({ sort: v as SortKey })}
                />
              </FilterGroup>

              <FilterGroup label="Price" icon={<IndianRupee className="h-3.5 w-3.5" />}>
                <ChipRow
                  options={["Any", "Free entry only"]}
                  active={params.free ? "Free entry only" : "Any"}
                  onSelect={v => update({ free: v === "Free entry only" })}
                />
              </FilterGroup>
            </div>

            <SheetFooter className="mt-6 flex-row gap-2 sm:justify-between">
              <Button variant="ghost" onClick={clearAll} className="flex-1">
                Reset
              </Button>
              <Button onClick={() => setSheetOpen(false)} className="flex-1">
                Show {results.total} result{results.total === 1 ? "" : "s"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {activePills.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            No filters applied · tap{" "}
            <SlidersHorizontal className="inline h-3 w-3 align-text-bottom" /> to refine
          </span>
        ) : (
          <>
            {activePills.map(p => (
              <button
                key={p.key}
                onClick={p.onClear}
                className="group inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
              >
                {p.icon}
                <span>{p.label}</span>
                <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
              </button>
            ))}
            <button
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      {/* Boosted */}
      {results.boosted.length > 0 && (
        <section className="mt-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Flame className="h-3.5 w-3.5" /> Featured · sponsored
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.boosted.map(t => (
              <TrialCard
                key={t.id}
                trial={t}
                boosted
                onApply={() => handleApply(t)}
                onBoost={() => setBoost(t)}
                showBoostAction={showBoostAction}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular */}
      <section className="mt-7">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {results.boosted.length > 0 ? "More results" : "Results"}
        </div>
        {results.regular.length === 0 && results.boosted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <SearchIcon className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
            <div className="text-sm">No trials match your filters.</div>
            <Button onClick={clearAll} variant="link" size="sm" className="mt-1 text-primary">
              Reset search
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.regular.map(t => (
              <TrialCard
                key={t.id}
                trial={t}
                onApply={() => handleApply(t)}
                onBoost={() => setBoost(t)}
                showBoostAction={showBoostAction}
              />
            ))}
          </div>
        )}
      </section>

      {checkout && (
        <CheckoutModal
          open={!!checkout}
          onOpenChange={o => !o && setCheckout(null)}
          trialId={checkout.id}
          trialTitle={checkout.title}
          onPaid={() => auth.applyToTrial(checkout.id)}
        />
      )}
      {boost && (
        <BoostModal
          open={!!boost}
          onOpenChange={o => !o && setBoost(null)}
          trialId={boost.id}
          trialTitle={boost.title}
        />
      )}
    </main>
  );
}

function FilterGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function ChipRow({
  options,
  active,
  onSelect,
}: {
  options: string[];
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const isActive = active === o;
        return (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-secondary/40 text-foreground hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            {isActive && <Check className="h-3 w-3" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, MapPin, Trophy, X, SlidersHorizontal, Flame } from "lucide-react";
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
  const activeFilters =
    (params.q ? 1 : 0) +
    (params.sport !== ALL_SPORT ? 1 : 0) +
    (params.city !== ALL_CITY ? 1 : 0) +
    (params.free ? 1 : 0);

  const clearAll = () =>
    navigate({ search: { q: "", sport: ALL_SPORT, city: ALL_CITY, sort: "Soonest", free: false }, replace: true });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search the Grid</h1>
          <p className="text-sm text-muted-foreground">
            Find trials, academies, and events across India.
          </p>
        </div>
        <Badge variant="outline" className="border-border">
          <SlidersHorizontal className="mr-1 h-3 w-3" />
          {results.total} result{results.total === 1 ? "" : "s"}
        </Badge>
      </div>

      {/* Search bar */}
      <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={params.q}
            onChange={e => update({ q: e.target.value })}
            placeholder="Sport, event, organizer, venue…"
            className="h-11 w-full rounded-xl bg-transparent pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground"
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

        <Select value={params.sport} onValueChange={v => update({ sport: v })}>
          <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/40 sm:w-44">
            <Trophy className="mr-1 h-4 w-4 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_SPORT}>{ALL_SPORT}</SelectItem>
            {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={params.city} onValueChange={v => update({ city: v })}>
          <SelectTrigger className="h-11 w-full rounded-xl border-border bg-secondary/40 sm:w-44">
            <MapPin className="mr-1 h-4 w-4 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CITY}>{ALL_CITY}</SelectItem>
            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Sub filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Sort</span>
        <div className="flex flex-wrap gap-1">
          {SORTS.map(s => {
            const active = params.sort === s;
            return (
              <button
                key={s}
                onClick={() => update({ sort: s as SortKey })}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => update({ free: !params.free })}
          className={`ml-2 rounded-full border px-3 py-1 text-xs transition-colors ${
            params.free
              ? "border-primary/60 bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Free entry only
        </button>

        {activeFilters > 0 && (
          <Button onClick={clearAll} variant="ghost" size="sm" className="ml-auto h-8 text-xs">
            <X className="mr-1 h-3 w-3" /> Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
          </Button>
        )}
      </div>

      {/* Boosted */}
      {results.boosted.length > 0 && (
        <section className="mt-8">
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
      <section className="mt-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {results.boosted.length > 0 ? "More results" : "Results"}
        </div>
        {results.regular.length === 0 && results.boosted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <SearchIcon className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
            <div className="text-sm">No trials match your filters.</div>
            <Button onClick={clearAll} variant="link" size="sm" className="mt-1 text-primary">Reset search</Button>
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

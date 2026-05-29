import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TRIALS, type Trial } from "@/data/trials";
import { TrialCard } from "@/components/TrialCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { BoostModal } from "@/components/BoostModal";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Flame, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/trials")({
  head: () => ({
    meta: [
      { title: "Live Trials · KhelGrid" },
      { name: "description", content: "Browse and apply to live sports trials across India. Free users get 2 applications, unlock more via wallet or Pro." },
    ],
  }),
  component: LiveTrials,
});

function LiveTrials() {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [checkout, setCheckout] = useState<Trial | null>(null);
  const [boost, setBoost] = useState<Trial | null>(null);

  const { boosted, regular } = useMemo(() => {
    const filtered = TRIALS.filter(t =>
      [t.title, t.academy, t.sport, t.city].join(" ").toLowerCase().includes(query.toLowerCase()),
    );
    return {
      boosted: filtered.filter(t => auth.boostedTrials.includes(t.id)),
      regular: filtered.filter(t => !auth.boostedTrials.includes(t.id)),
    };
  }, [query, auth.boostedTrials]);

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Trials</h1>
          <p className="text-sm text-muted-foreground">
            Discover scouted trials across India, refreshed every hour.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {auth.plan === "pro" ? (
            <Badge className="bg-gradient-gold text-primary-foreground border-0">
              <Crown className="mr-1 h-3 w-3" /> Pro · Unlimited applications
            </Badge>
          ) : (
            <Badge variant="outline" className="border-border">
              <Sparkles className="mr-1 h-3 w-3 text-primary" />
              {auth.remainingFree} / {auth.freeLimit} free applications left
            </Badge>
          )}
        </div>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by sport, academy or city…"
          className="pl-9 h-11 bg-card border-border"
        />
      </div>

      {boosted.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Flame className="h-3.5 w-3.5" /> Featured · sponsored by academies
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boosted.map(t => (
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

      <section className="mt-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          All trials
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regular.map(t => (
            <TrialCard
              key={t.id}
              trial={t}
              onApply={() => handleApply(t)}
              onBoost={() => setBoost(t)}
              showBoostAction={showBoostAction}
            />
          ))}
        </div>
        {regular.length === 0 && boosted.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No trials match "{query}".
          </div>
        )}
      </section>

      {checkout && (
        <CheckoutModal
          open={!!checkout}
          onOpenChange={o => !o && setCheckout(null)}
          trialId={checkout.id}
          trialTitle={checkout.title}
          onPaid={() => {
            auth.applyToTrial(checkout.id);
          }}
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

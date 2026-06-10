import { createFileRoute, Link } from "@tanstack/react-router";
import { SPORTS_CATALOG } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "All sports · KhelGrid" },
      { name: "description", content: "Explore trials, academies and scholarships across 16 sports in India." },
    ],
  }),
  component: SportsIndex,
});

function SportsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">{SPORTS_CATALOG.length} sports</Badge>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Pick your sport</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Every sport on KhelGrid has its own trial feed, academy network, scholarship list and learning hub.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SPORTS_CATALOG.map(s => (
          <Link key={s.slug} to="/sport/$slug" params={{ slug: s.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl">{s.emoji}</div>
              <div>
                <div className="text-base font-semibold group-hover:text-primary">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.level} · {s.ageBand}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.tagline}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

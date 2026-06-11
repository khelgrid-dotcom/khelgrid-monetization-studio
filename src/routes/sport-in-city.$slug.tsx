import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SPORTS_CATALOG, CITIES_CATALOG, type Sport, type City } from "@/data/catalog";
import { TRIALS } from "@/data/trials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

const PAGE_SIZE = 8;

const searchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/sport-in-city/$slug")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ params }) => {
    // slug shape: "<sport>-in-<city>"
    const match = params.slug.match(/^(.+)-in-(.+)$/);
    if (!match) throw notFound();
    const [, sportSlug, citySlug] = match;
    const sport = SPORTS_CATALOG.find(s => s.slug === sportSlug);
    const city = CITIES_CATALOG.find(c => c.slug === citySlug);
    if (!sport || !city) throw notFound();
    return { sport, city };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.sport.name} trials in ${loaderData.city.name} · KhelGrid` },
      { name: "description", content: `Live ${loaderData.sport.name} trials, academies & scouts in ${loaderData.city.name}, ${loaderData.city.state}. ${loaderData.sport.tagline}.` },
      { property: "og:title", content: `${loaderData.sport.name} in ${loaderData.city.name}` },
      { property: "og:description", content: `${loaderData.sport.tagline} — open trials across ${loaderData.city.name}.` },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Combination not found</h1>
      <Button asChild className="mt-6"><Link to="/sports">Browse sports</Link></Button>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  ),
  component: SportInCityPage,
});

function SportInCityPage() {
  const { sport, city } = Route.useLoaderData() as { sport: Sport; city: City };
  const { page } = Route.useSearch();

  const all = TRIALS.filter(
    t =>
      t.sport.toLowerCase() === sport.name.toLowerCase() &&
      t.city.toLowerCase() === city.name.toLowerCase(),
  );
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <nav className="text-xs text-muted-foreground">
        <Link to="/sports" className="hover:text-foreground">Sports</Link>
        {" / "}
        <Link to="/sport/$slug" params={{ slug: sport.slug }} className="hover:text-foreground">{sport.name}</Link>
        {" / "}
        <Link to="/city/$slug" params={{ slug: city.slug }} className="hover:text-foreground">{city.name}</Link>
      </nav>

      <header className="mt-4 flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-2xl">{sport.emoji}</div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {sport.name} trials in {city.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            <MapPin className="inline h-4 w-4" /> {city.state} · {city.venues}+ venues · {all.length} live opportunities
          </p>
        </div>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {slice.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground sm:col-span-2">
            No live {sport.name} trials in {city.name} right now.{" "}
            <Link to="/search" className="text-primary underline">Open the full search</Link> or set an alert.
          </div>
        )}
        {slice.map(t => (
          <div key={t.id} className="rounded-2xl border border-border bg-gradient-card p-5">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{t.tag}</Badge>
              <span className="text-xs text-muted-foreground">{t.date}</span>
            </div>
            <h3 className="mt-2 font-semibold">{t.title}</h3>
            <p className="text-xs text-muted-foreground">{t.academy} · {t.city}</p>
            <Button asChild size="sm" className="mt-3"><Link to="/search">View & apply <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </div>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              from={Route.fullPath}
              search={{ page: p }}
              className={`rounded-md border px-3 py-1 text-sm ${p === safePage ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}

      <section className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
        <h2 className="text-lg font-semibold">Nearby {sport.name} hubs in {city.name}</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
          {city.hubs.map((h: string) => <li key={h}>📍 {h}</li>)}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Other sports in {city.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPORTS_CATALOG.filter(s => s.slug !== sport.slug).slice(0, 8).map(s => (
            <Link
              key={s.slug}
              to="/sport-in-city/$slug"
              params={{ slug: `${s.slug}-in-${city.slug}` }}
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary hover:text-primary"
            >
              {s.emoji} {s.name} in {city.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

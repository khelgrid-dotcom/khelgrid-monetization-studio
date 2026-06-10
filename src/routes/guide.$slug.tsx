import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GUIDES_CATALOG } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    const guide = GUIDES_CATALOG.find(g => g.slug === params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.guide.title} · KhelGrid` },
      { name: "description", content: loaderData.guide.excerpt },
      { property: "og:title", content: loaderData.guide.title },
      { property: "og:description", content: loaderData.guide.excerpt },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Guide not found</h1>
      <Button asChild className="mt-6"><Link to="/guides">All guides</Link></Button>
    </div>
  ),
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const related = GUIDES_CATALOG.filter(g => g.category === guide.category && g.slug !== guide.slug).slice(0, 4);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link to="/guides" className="text-xs text-muted-foreground hover:text-foreground">← All guides</Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">{guide.category}</Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{guide.readMins} min read</span>
        <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />KhelGrid Learning</span>
      </div>
      <p className="mt-6 text-base text-muted-foreground">{guide.excerpt}</p>

      <ol className="mt-8 space-y-3">
        {guide.steps.map((s: string, i: number) => (
          <li key={s} className="flex items-start gap-3 rounded-2xl border border-border bg-gradient-card p-4">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</div>
            <span className="text-sm">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" /> Ready to act on this?
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Find a live trial that fits this plan and apply in two taps.</p>
        <Button asChild className="mt-4 bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link to="/search" search={{ q: "", sport: "All Sports", city: "All Locations", sort: "Soonest", free: false }}>
            Browse live trials
          </Link>
        </Button>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">More on {guide.category}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map(r => (
              <Link key={r.slug} to="/guide/$slug" params={{ slug: r.slug }}
                className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40">
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

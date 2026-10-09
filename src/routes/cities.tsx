import { createFileRoute, Link } from "@tanstack/react-router";
import { CITIES_CATALOG } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/cities")({
  head: () =>
    buildSeoHead({
      title: "Sports Trials, Venues & Academies by City in India · KhelGrid",
      description:
        "Locate upcoming sports trials, turf bookings, certified coaches, and elite academies in 16+ Indian cities including Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, and Pune.",
      canonicalPath: "/cities",
      keywords:
        "sports in Bengaluru, sports in Mumbai, Delhi sports trials, Hyderabad badminton courts, Pune football turfs, sports academies Chennai",
      type: "website",
    }),
  component: CitiesIndex,
});

function CitiesIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
        {CITIES_CATALOG.length} cities
      </Badge>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Pick your city</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every Indian city on KhelGrid lists open trials, venues and academy pathways near you.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES_CATALOG.map((c) => (
          <Link
            key={c.slug}
            to="/city/$slug"
            params={{ slug: c.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {c.state}
            </div>
            <div className="mt-2 text-lg font-semibold group-hover:text-primary">{c.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            <div className="mt-3 text-xs text-muted-foreground">{c.venueNote}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}

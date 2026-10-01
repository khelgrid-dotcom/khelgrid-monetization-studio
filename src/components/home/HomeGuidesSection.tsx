import { Link } from "@tanstack/react-router";
import { GUIDES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";

export const FEATURED_GUIDES = GUIDES_CATALOG.slice(0, 8);
export const FEATURED_SPORTS = SPORTS_CATALOG.filter((sport) =>
  [
    "cricket",
    "football",
    "athletics",
    "badminton",
    "wrestling",
    "boxing",
    "swimming",
    "basketball",
  ].includes(sport.slug),
);

export function HomeGuidesSection() {
  return (
    <div className="space-y-12">
      {/* 1. Sports Guides Grid */}
      <section aria-label="Featured Sports Guides" className="pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Sports guides</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Practical reading for athletes, parents and coaches.
            </p>
          </div>
          <Link
            to="/guides"
            className="text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Open Learning Hub →
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to="/guide/$slug"
              params={{ slug: guide.slug }}
              className="group rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {guide.category} · {guide.readMins} min
              </div>
              <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {guide.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Sports Pathways Grid */}
      <section aria-label="Sports Development Pathways">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Sports pathways</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Start with the sport page for an overview, current listings, city links and preparation
            resources.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              to="/sport/$slug"
              params={{ slug: sport.slug }}
              className="group rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {sport.emoji}
                </span>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {sport.name}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{sport.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Verification & Trust Callout Card */}
      <section
        aria-label="Verification standard notice"
        className="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          How KhelGrid verifies opportunity information
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          We record the source used for a listing, separate organizer information from KhelGrid
          guidance, and ask users to confirm dates, venues, eligibility and fees with the latest
          official notice. Verification is context for safer research, not a guarantee of selection
          or event completion.
        </p>
        <Link
          to="/trust-center"
          className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          Read the Trust Center →
        </Link>
      </section>
    </div>
  );
}

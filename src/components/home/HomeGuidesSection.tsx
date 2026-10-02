import { Link } from "@tanstack/react-router";
import { GUIDES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";

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
    <div
      id="pathways-and-guides"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12"
    >
      {/* 1. Sports Guides Section */}
      <section aria-label="Featured Sports Guides" className="pt-6 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Athlete Playbooks</span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              Sports guides
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Practical reading for athletes, parents and coaches.
            </p>
          </div>
          <Link
            to="/guides"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0"
          >
            <span>Learning Hub</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Guides Cards: Horizontal App Swipe on Mobile, 4-col Grid on Desktop */}
        <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:p-0">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to="/guide/$slug"
              params={{ slug: guide.slug }}
              className="group flex w-[75vw] max-w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98] sm:w-auto sm:shrink"
            >
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {guide.category} · {guide.readMins} min read
                </div>
                <h3 className="mt-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {guide.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {guide.excerpt}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-primary">
                <span>Read Guide</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Sports Pathways Section */}
      <section aria-label="Sports Development Pathways">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Disciplines</span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl text-foreground">
              Sports pathways
            </h2>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              Overview, listings, city links and preparation resources for each sport.
            </p>
          </div>
          <Link
            to="/sports"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline shrink-0"
          >
            <span>All Sports</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Sports Cards: Horizontal App Swipe on Mobile, 4-col Grid on Desktop */}
        <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:p-0">
          {FEATURED_SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              to="/sport/$slug"
              params={{ slug: sport.slug }}
              className="group flex w-[55vw] max-w-[210px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98] sm:w-auto sm:shrink"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {sport.emoji}
                  </span>
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {sport.name}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {sport.tagline}
                </p>
              </div>

              <div className="mt-3 pt-1 text-[11px] font-semibold text-primary inline-flex items-center gap-1">
                <span>Explore pathway</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Verification & Trust Callout Card */}
      <section
        aria-label="Verification standard notice"
        className="rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-6"
      >
        <h2 className="text-base sm:text-xl font-bold text-foreground">
          How KhelGrid verifies opportunity information
        </h2>
        <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
          We record the source used for a listing, separate organizer information from KhelGrid
          guidance, and ask users to confirm dates, venues, eligibility and fees with the latest
          official notice. Verification is context for safer research, not a guarantee of selection
          or event completion.
        </p>
        <Link
          to="/trust-center"
          className="mt-3 inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:underline"
        >
          Read the Trust Center →
        </Link>
      </section>
    </div>
  );
}

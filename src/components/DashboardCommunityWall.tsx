import { CalendarDays, CheckCircle2, MessageSquareQuote, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ATHLETE_MILESTONES, ATHLETE_TESTIMONIALS } from "@/data/community-wall";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function DashboardCommunityWall() {
  return (
    <section
      className="mt-8 rounded-2xl border border-border bg-card/50 p-4 sm:p-6"
      aria-labelledby="community-wall-heading"
    >
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            Community wall
          </Badge>
          <h2
            id="community-wall-heading"
            className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
          >
            Progress worth sharing
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Practical reflections and documented milestones from the athlete community, shown
            recent-first.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/community">Open community</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section aria-labelledby="testimonials-heading">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-primary" />
            <h3 id="testimonials-heading" className="font-semibold">
              Athlete reflections
            </h3>
          </div>
          <div className="mt-3 space-y-3">
            {ATHLETE_TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-xl border border-border bg-gradient-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary"
                    aria-hidden="true"
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="font-semibold">{testimonial.athlete}</h4>
                      <Badge variant="outline" className="border-border text-[10px]">
                        {testimonial.sport}
                      </Badge>
                    </div>
                    <blockquote className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      “{testimonial.quote}”
                    </blockquote>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span>{testimonial.context}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(testimonial.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="milestones-heading">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 id="milestones-heading" className="font-semibold">
              Recent milestones
            </h3>
          </div>
          <div className="mt-3 space-y-3">
            {ATHLETE_MILESTONES.map((milestone) => (
              <article
                key={milestone.id}
                className="rounded-xl border border-border bg-gradient-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="font-semibold">{milestone.athlete}</h4>
                      <span className="text-xs text-muted-foreground">{milestone.sport}</span>
                    </div>
                    <p className="mt-2 text-sm">{milestone.achievement}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{milestone.metric}</p>
                    <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(milestone.date)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 flex gap-2 rounded-xl border border-dashed border-border p-3 text-xs leading-relaxed text-muted-foreground">
        <MessageSquareQuote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p>
          <strong className="text-foreground">Community wall preview:</strong> these entries
          demonstrate the format with illustrative content. Public testimonials should be replaced
          with consented athlete submissions, attribution and supporting context before being
          presented as endorsements.
        </p>
      </div>
    </section>
  );
}

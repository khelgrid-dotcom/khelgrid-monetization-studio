import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router";
import { BookOpenCheck, CheckCircle2, Link2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy · KhelGrid" },
      {
        name: "description",
        content: "How KhelGrid creates, sources, reviews, updates and labels sports information and opportunity guidance.",
      },
      { property: "og:title", content: "KhelGrid Editorial Policy" },
      { property: "og:description", content: "Our standards for original sports information, sourcing, updates and sponsored content." },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/editorial-policy" }],
  }),
  component: EditorialPolicyPage,
});

const PRINCIPLES = [
  {
    icon: BookOpenCheck,
    title: "Original, useful explanations",
    body: "We add practical context around opportunities, including who may be a fit, what to confirm, how to prepare, and where the organizer's information comes from. We do not treat a copied notice or a list of keywords as a finished article.",
  },
  {
    icon: Link2,
    title: "Sources and uncertainty",
    body: "When a source is available, we identify it and link to the organizer, federation, academy, or official notice. If a detail cannot be independently confirmed, we say so instead of filling the gap with a guess.",
  },
  {
    icon: CheckCircle2,
    title: "Updates and corrections",
    body: "Dates, fees, eligibility, venues and registration instructions can change. We review reports, update or annotate affected pages, and remove information that can no longer be responsibly presented.",
  },
  {
    icon: ShieldCheck,
    title: "Clear commercial labels",
    body: "Advertising, paid placements and organizer promotions must be distinguishable from editorial guidance. Payment does not buy a verification label, a guaranteed result, or a favorable editorial conclusion.",
  },
];

function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transparency</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">KhelGrid editorial policy</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        KhelGrid publishes sports opportunity information and practical guidance for athletes, parents, coaches and
        organizers. This policy explains how we aim to make those pages useful, source-aware and honest about their limits.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <section key={title} className="rounded-2xl border border-border bg-gradient-card p-6">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="font-semibold">How we use automation and AI</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Software may help us organize catalogs, detect duplicate information, or draft internal summaries. Automated
          output is not treated as a source by itself. A page must be checked for accuracy, usefulness, attribution and
          safety before it is presented as KhelGrid guidance. We do not claim that a tool, score, or prediction can select
          an athlete or replace a qualified coach, medical professional, federation rule, or official organizer notice.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <h2 className="font-semibold">Report an error or conflict</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Send the page URL, the specific statement, the correct information, and a reliable source when available. For
          opportunity corrections, include the event date and organizer so we can investigate the right listing.
        </p>
        <Link to="/contact" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">Contact the KhelGrid team →</Link>
      </section>
    </main>
  );
}

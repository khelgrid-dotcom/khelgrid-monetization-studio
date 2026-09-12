import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verification-policy")({
  head: () => ({
    meta: [
      { title: "Opportunity Verification Policy · KhelGrid" },
      {
        name: "description",
        content:
          "What KhelGrid checks before showing source and verification context for a sports opportunity.",
      },
      { property: "og:title", content: "KhelGrid Opportunity Verification Policy" },
      {
        property: "og:description",
        content:
          "Our process for source checks, organizer context, listing review and corrections.",
      },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/verification-policy" }],
  }),
  component: VerificationPolicyPage,
});

const CHECKS = [
  [
    FileCheck2,
    "Source check",
    "We look for an official organizer page, federation notice, academy channel, or registration source and record what was used.",
  ],
  [
    ShieldCheck,
    "Organizer context",
    "We distinguish information supplied by an organizer from KhelGrid's own explanation. A source check is not an endorsement.",
  ],
  [
    CheckCircle2,
    "Detail review",
    "When available, we compare the sport, date, city, venue, eligibility, fee, spots and registration instructions.",
  ],
  [
    AlertTriangle,
    "Change monitoring",
    "We respond to reports about expired dates, changed venues, suspicious payment requests, or information that no longer matches the source.",
  ],
] as const;

function VerificationPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Opportunity trust
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Opportunity verification policy
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Verification context helps athletes understand how a KhelGrid listing was assembled. It does
        not turn KhelGrid into the event organizer and never guarantees selection, attendance,
        safety, or a refund.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {CHECKS.map(([Icon, title, body]) => (
          <section key={title} className="rounded-2xl border border-border bg-gradient-card p-6">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <h2 className="font-semibold">What users must still confirm</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-85">
          Before travelling, submitting documents, or paying, confirm the organizer's latest notice,
          exact venue, reporting time, eligibility, fee, deadline, refund terms and contact details.
          Never pay a selector or organizer for guaranteed selection.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
        <Link to="/trust-center" className="text-primary hover:underline">
          Read the Trust Center →
        </Link>
        <Link to="/correction-policy" className="text-primary hover:underline">
          Report a correction →
        </Link>
      </div>
    </main>
  );
}

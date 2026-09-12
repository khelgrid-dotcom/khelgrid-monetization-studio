import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, FileCheck2, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/trust-center")({
  head: () => ({
    meta: [
      { title: "KhelGrid Verification · How trust checks work" },
      {
        name: "description",
        content:
          "Understand how KhelGrid reviews organizer and opportunity information, reports corrections, and marks listings.",
      },
      { property: "og:title", content: "How KhelGrid verification works" },
      {
        property: "og:description",
        content:
          "Our source-checking, organizer-review, correction, and expiry process for sports opportunities.",
      },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/trust-center" }],
  }),
  component: TrustCenterPage,
});

const STEPS = [
  {
    icon: FileCheck2,
    title: "Source check",
    body: "We look for an official organizer website, federation notice, academy channel, or registration page and record the source used for the listing.",
  },
  {
    icon: ShieldCheck,
    title: "Organizer context",
    body: "We distinguish organizer-provided information from KhelGrid editorial notes. A verified label describes the information checked, not a guarantee of selection.",
  },
  {
    icon: CheckCircle2,
    title: "Listing review",
    body: "We check the visible basics such as sport, city, date, venue, eligibility, fee, and registration instructions when those details are available.",
  },
  {
    icon: AlertTriangle,
    title: "Updates and corrections",
    body: "If a date changes, an event expires, or an athlete reports an issue, we review the claim and update, annotate, or remove the listing.",
  },
];

function TrustCenterPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Trust and transparency
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        How KhelGrid verification works
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        KhelGrid is a discovery and information service. We make the checking process visible so
        athletes can decide what to confirm with an organizer before they travel, submit documents,
        or pay a fee.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, body }, index) => (
          <section key={title} className="rounded-2xl border border-border bg-gradient-card p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </div>
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">{title}</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <h2 className="font-semibold">What a verification label does not mean</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-85">
          It is not a promise that an organizer will select an athlete, that an event will happen as
          planned, or that a payment is risk-free. Confirm the latest official notice, keep
          receipts, and never pay for guaranteed selection.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Report an issue or request a correction</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Email the listing title, the problem, and an official source or screenshot when possible.
          We review reports and mark information that can no longer be confirmed.
        </p>
        <a
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          href="mailto:support@khelgrid.com"
        >
          support@khelgrid.com
        </a>
        <div className="mt-4">
          <Link to="/about" className="text-sm font-semibold text-primary hover:underline">
            About KhelGrid →
          </Link>
        </div>
      </section>
    </main>
  );
}

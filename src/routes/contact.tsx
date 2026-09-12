import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KhelGrid · Corrections and support" },
      {
        name: "description",
        content:
          "Contact KhelGrid for support, listing corrections, verification questions, and privacy requests.",
      },
      { property: "og:title", content: "Contact KhelGrid" },
      {
        property: "og:description",
        content: "Reach KhelGrid about support, corrections, verification, and privacy.",
      },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
      </div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">We are here to help</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Use the right channel below so your request reaches the right review queue.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:support@khelgrid.com"
          className="rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
        >
          <h2 className="font-semibold">Support and corrections</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Report an expired opportunity, incorrect detail, suspicious listing, or account issue.
          </p>
          <p className="mt-4 text-sm font-semibold text-primary">support@khelgrid.com</p>
        </a>
        <a
          href="mailto:privacy@khelgrid.com"
          className="rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
        >
          <h2 className="font-semibold">Privacy requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Request access, correction, deletion, or advertising preference support.
          </p>
          <p className="mt-4 text-sm font-semibold text-primary">privacy@khelgrid.com</p>
        </a>
      </div>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">What to include</h2>
        </div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>The listing title or page URL</li>
          <li>What appears incorrect and when you noticed it</li>
          <li>An official source, screenshot, or receipt when available</li>
          <li>Your preferred reply address</li>
        </ul>
      </section>
    </main>
  );
}

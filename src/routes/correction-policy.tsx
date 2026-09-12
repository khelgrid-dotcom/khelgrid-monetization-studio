import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Mail, SearchCheck } from "lucide-react";

export const Route = createFileRoute("/correction-policy")({
  head: () => ({
    meta: [
      { title: "Correction Policy · KhelGrid" },
      {
        name: "description",
        content:
          "How to report inaccurate, expired or misleading sports opportunity information on KhelGrid.",
      },
      { property: "og:title", content: "KhelGrid Correction Policy" },
      {
        property: "og:description",
        content: "How KhelGrid reviews reports and updates sports opportunity information.",
      },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/correction-policy" }],
  }),
  component: CorrectionPolicyPage,
});

const STEPS = [
  {
    icon: Mail,
    title: "Send enough detail to find the listing",
    body: "Email the page URL or opportunity title, the issue you found, when you noticed it, and the source or screenshot that supports the correction.",
  },
  {
    icon: SearchCheck,
    title: "We assess the report",
    body: "We compare the report with the source on record and, where practical, contact the organizer or check a current official notice. A report is not automatically treated as fact until reviewed.",
  },
  {
    icon: CheckCircle2,
    title: "We update, annotate or remove",
    body: "We correct clear errors, add context when information is disputed or incomplete, and remove or mark listings that can no longer be responsibly confirmed.",
  },
  {
    icon: AlertTriangle,
    title: "Safety reports are prioritized",
    body: "Reports about fraud, guaranteed-selection claims, unsafe travel instructions, impersonation, or requests for unofficial payments are escalated for faster review.",
  },
];

function CorrectionPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Trust and safety
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Correction policy</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Sports opportunities change quickly. KhelGrid welcomes reports from athletes, parents,
        organizers and coaches so that pages remain useful without hiding uncertainty.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <section key={title} className="rounded-2xl border border-border bg-gradient-card p-6">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="font-semibold">What happens after a correction?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We may update the visible detail, add a correction note, change the source status, pause
          the listing, or remove it. We do not publish private reporter information without
          permission. If a correction affects a safety or payment decision, users should still
          confirm the latest position directly with the organizer.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <h2 className="font-semibold">Submit a correction</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the support channel for listing corrections and suspicious opportunity reports.
        </p>
        <a
          href="mailto:support@khelgrid.com"
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          support@khelgrid.com
        </a>
      </section>
    </main>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, FileText, MapPin, ShieldCheck, Users } from "lucide-react";
import { TRIALS } from "@/data/trials";

export const Route = createFileRoute("/trial/$id")({
  loader: ({ params }) => {
    const trial = TRIALS.find((item) => item.id === params.id);
    if (!trial) throw notFound();
    return { trial };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.trial.title} · KhelGrid` },
          {
            name: "description",
            content: `${loaderData.trial.title} in ${loaderData.trial.city}: eligibility, date, fee, organizer, and verification context.`,
          },
          { property: "og:title", content: `${loaderData.trial.title} · KhelGrid` },
          {
            property: "og:description",
            content: `Review the available details for this ${loaderData.trial.sport} opportunity before applying.`,
          },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `https://khelgrid.com/trial/${loaderData.trial.id}` }] : [],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Opportunity not found</h1>
      <p className="mt-3 text-muted-foreground">This listing may have expired or been removed.</p>
      <Button asChild className="mt-6"><Link to="/search">Browse opportunities</Link></Button>
    </main>
  ),
  component: TrialDetailPage,
});

function TrialDetailPage() {
  const { trial } = Route.useLoaderData();
  const sourceLabel = trial.sourceLabel ?? "Organizer source not recorded";
  const verificationLabel = trial.lastVerified
    ? `Last verified ${trial.lastVerified}`
    : "Verification date not recorded";
  const related = TRIALS.filter(
    (item) => item.id !== trial.id && item.sport === trial.sport,
  ).slice(0, 3);
  const documents = trial.requiredDocuments ?? [
    "Government-issued identity or age proof",
    "Recent sports record, if the organizer requests one",
    "Personal sports equipment and water",
    "Registration confirmation and payment receipt, if applicable",
  ];
  const applicationSteps = [
    "Read the eligibility and selection requirements published by the organizer.",
    "Confirm the date, venue, fee, and registration deadline through an official channel.",
    "Prepare the requested documents and submit the application using the organizer's process.",
    "Save your confirmation and check for schedule or venue updates before travelling.",
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground">← Back to search</Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">{trial.sport}</Badge>
        <Badge variant="secondary">{trial.tag}</Badge>
      </div>
      <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">{trial.title}</h1>
      <p className="mt-2 text-lg text-muted-foreground">Organized by {trial.academy}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Detail icon={MapPin} label="City" value={trial.city} />
        <Detail icon={Calendar} label="Date" value={trial.date} />
        <Detail icon={Users} label="Places" value={`${trial.spots} listed spots`} />
        <Detail icon={FileText} label="Entry fee" value={trial.fee === 0 ? "Free entry" : `₹${trial.fee}`} />
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="text-xl font-semibold">What this opportunity is</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This listing describes a {trial.sport.toLowerCase()} opportunity from {trial.academy} in {trial.city}.
          It is a starting point for your research, not a promise of selection, attendance, or a particular outcome.
          Use the details below to decide what to confirm and how to prepare.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">KhelGrid verification context</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Source status: {sourceLabel}. {verificationLabel}. Confirm the latest date, venue, eligibility, fee, and
          registration instructions with the organizer before travelling or paying. A KhelGrid listing does not mean
          that KhelGrid is the organizer or that a place is reserved for you.
        </p>
        {trial.sourceUrl && (
          <a href={trial.sourceUrl} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
            Open official source →
          </a>
        )}
        <Link to="/trust-center" className="mt-3 block text-sm font-semibold text-primary hover:underline">
          How our verification process works →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Opportunity details</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <InfoSection title="Eligibility" value={trial.eligibility ?? "Ask the organizer for age, gender, skill-level, and category requirements."} />
          <InfoSection title="What to bring" value={documents.join(", ")} />
          <InfoSection title="Selection process" value={trial.selectionProcess ?? "The organizer has not published a selection process in this listing. Confirm the assessment stages before applying."} />
          <InfoSection title="Registration deadline" value={trial.registrationDeadline ?? "Not listed. Confirm the deadline directly with the organizer."} />
          <InfoSection title="Venue" value={trial.venue ?? "Not listed. Confirm the exact ground, court, gate, and reporting point with the organizer."} />
          <InfoSection title="Travel planning" value={`Plan for arrival in ${trial.city} only after the organizer confirms the venue and reporting time.`} />
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-semibold">Application checklist</h2>
          <ol className="mt-4 space-y-4">
            {applicationSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-semibold">Prepare safely</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Keep copies of forms, receipts, and messages.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Do not pay anyone who guarantees selection or asks for an unofficial fee.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />For minors, involve a parent or guardian in travel, payment, and organizer communication.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-semibold">Questions to confirm before travelling</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoSection title="Is registration still open?" value="Ask for the current deadline and whether places remain." />
          <InfoSection title="Where should I report?" value="Confirm the exact venue address, reporting time, and contact person." />
          <InfoSection title="What happens after applying?" value="Ask when shortlists, assessments, and next-step messages will be shared." />
          <InfoSection title="What does the fee cover?" value={trial.fee === 0 ? "This listing shows no entry fee; confirm that no separate charge applies." : `This listing shows an entry fee of ₹${trial.fee}; ask what it covers and request a receipt.`} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">More {trial.sport} opportunities</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} to="/trial/$id" params={{ id: item.id }} className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-2 text-xs text-muted-foreground">{item.city} · {item.date} · {item.fee === 0 ? "Free" : `₹${item.fee}`}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-semibold">Ready to compare?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Review other listings by sport and city, then save the opportunities you want to follow up on.</p>
        <Button asChild className="mt-5"><Link to="/search">Compare more opportunities</Link></Button>
      </div>
    </main>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function InfoSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card/50 p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
    </section>
  );
}

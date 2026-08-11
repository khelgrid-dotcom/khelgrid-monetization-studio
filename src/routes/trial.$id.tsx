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

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground">← Back to search</Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">{trial.sport}</Badge>
        <Badge variant="secondary">{trial.tag}</Badge>
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{trial.title}</h1>
      <p className="mt-2 text-lg text-muted-foreground">Organized by {trial.academy}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Detail icon={MapPin} label="City" value={trial.city} />
        <Detail icon={Calendar} label="Date" value={trial.date} />
        <Detail icon={Users} label="Places" value={`${trial.spots} listed spots`} />
        <Detail icon={FileText} label="Entry fee" value={trial.fee === 0 ? "Free entry" : `₹${trial.fee}`} />
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">KhelGrid verification context</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Source status: {sourceLabel}. {verificationLabel}. Confirm the latest date, venue, eligibility, fee, and
          registration instructions with the organizer before travelling or paying.
        </p>
        {trial.sourceUrl && (
          <a href={trial.sourceUrl} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
            Open official source →
          </a>
        )}
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <InfoSection title="Eligibility" value={trial.eligibility ?? "Ask the organizer for age, gender, skill-level, and category requirements."} />
        <InfoSection title="What to bring" value={trial.requiredDocuments?.join(", ") ?? "Carry identification, relevant certificates, sports equipment, and payment proof if applicable."} />
        <InfoSection title="Selection process" value={trial.selectionProcess ?? "The organizer has not published a selection process in this listing. Confirm the assessment stages before applying."} />
        <InfoSection title="Registration deadline" value={trial.registrationDeadline ?? "Not listed. Confirm the deadline directly with the organizer."} />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-semibold">Before you apply</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Use the organizer&apos;s official registration channel whenever one is available.</li>
          <li>Never pay a selector or organizer for guaranteed selection.</li>
          <li>Save the confirmation, receipt, and the latest official announcement.</li>
        </ul>
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
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
    </section>
  );
}

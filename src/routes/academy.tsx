import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/academy")({
  head: () => ({ meta: [{ title: "For Academies · KhelGrid" }, { name: "description", content: "List trials, boost listings and recruit India's next-gen athletes on KhelGrid." }] }),
  component: AcademyPage,
});

function AcademyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">For organizers</Badge>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Recruit India's next champion.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        List trials in 60 seconds, boost them to the top with neon-featured rows, and receive ranked applicant lists with Verified Sports CVs attached.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: Zap, t: "List for free", d: "Post trials, camps and selections at zero cost. Pay only when you boost." },
          { icon: Flame, t: "Boost for ₹1,500", d: "Pin to top for 7 days. Featured rows get 8.4× more views and 3.2× more applies." },
          { icon: TrendingUp, t: "Ranked applicants", d: "Applicants are auto-ranked by Talent Scanner score, verified status and proximity." },
          { icon: Users, t: "240+ academies", d: "Trusted by NIS coaches, IPL franchise feeders and SAI-affiliated centres." },
          { icon: Zap, t: "Analytics included", d: "Live dashboards on views, applies, conversion and applicant quality." },
          { icon: Flame, t: "Bulk export", d: "Export applicant data + CVs as CSV or PDF for selection committees." },
        ].map(x => (
          <div key={x.t} className="rounded-2xl border border-border bg-gradient-card p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <x.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-3 font-semibold">{x.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link to="/trials">Try boosting a trial <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild size="lg" variant="outline"><Link to="/pricing">See pricing</Link></Button>
      </div>
    </main>
  );
}

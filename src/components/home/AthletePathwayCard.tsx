import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AthletePathwayCard() {
  return (
    <section aria-label="Athlete Sports CV Passport and Pathways" className="py-2">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card p-5 sm:p-7 shadow-sm">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Digital Athlete Passport</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
              Build your verified Sports CV & get scouted
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Coaches, talent recruiters, and federation scouts evaluate verified tournament
              histories and fitness benchmarks. Generate your official digital athletic profile and
              QR passport on KhelGrid for free.
            </p>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pt-1 pb-1 text-xs text-foreground/80 overscroll-x-contain touch-pan-x snap-x snap-mandatory sm:grid sm:grid-cols-3">
              <div className="snap-start shrink-0 flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">Verified Match Stats</span>
              </div>
              <div className="snap-start shrink-0 flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">Export PDF Resume</span>
              </div>
              <div className="snap-start shrink-0 flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">Scout Share Link</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Button
              asChild
              className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs"
            >
              <Link to="/my-stats">
                <FileText className="h-4 w-4 mr-1.5" />
                <span>Create Sports CV</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-border hover:bg-secondary font-semibold"
            >
              <Link to="/guides">
                <span>Browse Pathways</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

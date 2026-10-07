import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AthletePathwayCard() {
  return (
    <section
      aria-label="Athlete Sports CV Passport and Pathways"
      className="w-full min-w-0 max-w-full py-2"
    >
      <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-center w-full min-w-0">
          <div className="lg:col-span-8 min-w-0 w-full space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Digital Athlete Passport</span>
            </div>

            <h2 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-snug">
              Build your verified Sports CV & get scouted
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Coaches, talent recruiters, and federation scouts evaluate verified tournament
              histories and fitness benchmarks. Generate your official digital athletic profile and
              QR passport on KhelGrid for free.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 text-xs text-foreground/80 sm:grid sm:grid-cols-3 w-full min-w-0 max-w-full">
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Verified Match Stats</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Export PDF Resume</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 border border-border/60 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Scout Share Link</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 min-w-0 flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-2.5 w-full">
            <Button
              asChild
              className="h-10 sm:h-11 flex-1 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs"
            >
              <Link to="/my-stats">
                <FileText className="h-4 w-4 mr-1.5" />
                <span>Create Sports CV</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 sm:h-11 flex-1 rounded-xl border-border hover:bg-secondary font-semibold"
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

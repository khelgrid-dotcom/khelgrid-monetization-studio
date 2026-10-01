import { Link } from "@tanstack/react-router";
import { ArrowRight, Trophy, Sparkles, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCtaBannerSection() {
  return (
    <section
      id="join-network"
      aria-label="Join KhelGrid Sports Network"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 sm:p-12 text-primary-foreground shadow-xl">
        {/* Decorative background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-black/15 blur-3xl"
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              <span>Take Your Next Step Today</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Your sports career deserves a trusted platform
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-primary-foreground/90 max-w-xl">
              Whether you are an aspiring athlete aiming for state selections, a parent seeking authentic academy trials, or a facility owner with empty court slots, KhelGrid connects you directly.
            </p>

            <div className="mt-6 flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-primary-foreground/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span>Zero hidden agent fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span>Verified organizer badges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span>Instant turf bookings</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link to="/onboarding" className="w-full">
              <Button
                size="lg"
                className="w-full h-13 rounded-xl bg-white text-foreground hover:bg-white/90 font-bold shadow-md cursor-pointer justify-between px-5 text-sm sm:text-base"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Create Free Sports CV</span>
                </div>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <Link to="/partner" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-13 rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20 font-semibold backdrop-blur-md cursor-pointer justify-between px-5 text-sm sm:text-base"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-white" aria-hidden="true" />
                  <span>List Academy or Turf</span>
                </div>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

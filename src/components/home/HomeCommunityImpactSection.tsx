import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  Users2,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const VERIFIED_ACADEMIES = [
  {
    name: "Inspire Institute of Sport (IIS)",
    location: "Vijayanagar, Karnataka",
    sports: "Athletics, Boxing, Wrestling, Judo",
    badge: "Olympic Training Center",
    verified: true,
  },
  {
    name: "Tata Football Academy (TFA)",
    location: "Jamshedpur, Jharkhand",
    sports: "Football",
    badge: "Elite Youth Academy",
    verified: true,
  },
  {
    name: "Pullela Gopichand Badminton Academy",
    location: "Hyderabad, Telangana",
    sports: "Badminton",
    badge: "National Center of Excellence",
    verified: true,
  },
  {
    name: "Bhaichung Bhutia Football Schools",
    location: "Pan-India (20+ Centers)",
    sports: "Grassroots Football",
    badge: "AIFF 4-Star Certified",
    verified: true,
  },
] as const;

export const VERIFICATION_PILLARS = [
  {
    title: "Direct Source Audit",
    desc: "Every trial listing cites the official gazette, federation circular, or academy notice before publishing.",
  },
  {
    title: "Zero Exploitation Policy",
    desc: "We flag and reject dubious trial agents, unauthorized commercial entry fees, and age-manipulation rackets.",
  },
  {
    title: "Direct Organizer Connect",
    desc: "Official phone numbers, registration links, and venue reporting times verified directly with event coordinators.",
  },
] as const;

export function HomeCommunityImpactSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="community-impact"
      aria-label="Verified Sports Academy Network"
      className="w-full py-1"
    >
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-card shadow-sm">
        <div className="grid lg:grid-cols-12 gap-0 items-stretch">
          {/* Left Column: Visual Showcase & Verification Statement */}
          <div className="relative lg:col-span-5 flex flex-col justify-between overflow-hidden bg-muted p-6 sm:p-8">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/khelgrid_academy_showcase_1790836301666.jpg"
                alt="Modern Indian badminton and multi-sport training facility"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"
              />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Zero Fake Trials Standard</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                India&apos;s most rigorous sports opportunity audit
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80">
                Thousands of young athletes lose time and money to unofficial trial scams. KhelGrid
                enforces a multi-point verification protocol across government, federation, and
                verified private selections.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>300+ Verified Academies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>50k+ Athletes Protected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Academies & Audit Guarantee */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground sm:text-lg">
                    Featured Training Institutions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Accredited sports centers actively scouted on KhelGrid · Swipe to view
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scroll("left")}
                      aria-label="Scroll academies left"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scroll("right")}
                      aria-label="Scroll academies right"
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <Link
                    to="/academy"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>All Academies</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Academy Cards List - Horizontally scrollable across all screen devices */}
              <div
                ref={scrollRef}
                className="mt-4 flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 overscroll-x-contain touch-pan-x snap-x snap-mandatory"
              >
                {VERIFIED_ACADEMIES.map((academy) => (
                  <div
                    key={academy.name}
                    className="snap-start shrink-0 w-[80vw] max-w-[280px] sm:w-[260px] flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-primary/40 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-foreground sm:text-sm line-clamp-1">
                          {academy.name}
                        </div>
                        <CheckCircle2
                          className="h-4 w-4 text-emerald-500 shrink-0"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{academy.location}</span>
                      </div>
                      <div className="mt-2 text-[11px] font-medium text-primary">
                        {academy.sports}
                      </div>
                    </div>
                    <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground pt-2 border-t border-border/50">
                      {academy.badge}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verification Checklist */}
              <div className="mt-6 pt-5 border-t border-border/60">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  The KhelGrid Promise
                </div>
                <div className="mt-3 flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 overscroll-x-contain touch-pan-x snap-x snap-mandatory sm:grid sm:grid-cols-3">
                  {VERIFICATION_PILLARS.map((p) => (
                    <div key={p.title} className="snap-start shrink-0 w-[240px] sm:w-auto text-xs">
                      <div className="font-semibold text-foreground">{p.title}</div>
                      <div className="mt-1 text-muted-foreground leading-relaxed">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">
                Are you a recognized sports academy or organizer?
              </span>
              <Link
                to="/partner"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <span>Partner with KhelGrid</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

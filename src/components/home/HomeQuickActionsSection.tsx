import { Link } from "@tanstack/react-router";
import {
  Swords,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export const ACTION_PILLARS = [
  {
    to: "/trials",
    title: "Trial & Selections",
    desc: "Discover SAI, Khelo India, and verified club youth selections.",
    badge: "350+ Active",
    icon: Award,
    accent: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    actionLabel: "Browse Trials",
  },
  {
    to: "/book",
    title: "Book Sports Venues",
    desc: "Reserve hourly slots for cricket turfs, football pitches & badminton courts.",
    badge: "Instant Confirm",
    icon: CalendarCheck,
    accent: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    actionLabel: "Find Turfs",
  },
  {
    to: "/play",
    title: "Join Pickup Games",
    desc: "Find friendly local games or host matches with players near your location.",
    badge: "Community",
    icon: Swords,
    accent: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    actionLabel: "Join a Match",
  },
  {
    to: "/train",
    title: "Coaching & Academies",
    desc: "Train under certified coaches, high-performance academies & skill camps.",
    badge: "Verified Staff",
    icon: GraduationCap,
    accent: "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    actionLabel: "Find Coaches",
  },
  {
    to: "/my-stats",
    title: "Verified Sports CV",
    desc: "Showcase competition history, verified metrics, and get scouted by recruiters.",
    badge: "Athlete Passport",
    icon: Sparkles,
    accent: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    actionLabel: "Build CV",
  },
  {
    to: "/events",
    title: "Tournaments & Leagues",
    desc: "Register for district, inter-college, corporate, and national championships.",
    badge: "Registration Open",
    icon: CalendarDays,
    accent: "from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    actionLabel: "Explore Events",
  },
] as const;

export function HomeQuickActionsSection() {
  return (
    <section
      id="quick-actions"
      aria-label="Core Sports Hub Categories"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Ecosystem Portals
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Choose what you want to achieve today
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
          Single-click entry into verified selection trials, venue bookings, pickup sports, and certified athlete development.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTION_PILLARS.map((pillar) => (
          <Link
            key={pillar.to}
            to={pillar.to}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md active:scale-[0.99]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl border bg-gradient-to-br ${pillar.accent}`}
                >
                  <pillar.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {pillar.badge}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors sm:text-lg">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {pillar.desc}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border/50">
              <span>{pillar.actionLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

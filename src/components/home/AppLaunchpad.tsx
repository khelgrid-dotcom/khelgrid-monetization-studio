import { Link } from "@tanstack/react-router";
import {
  Trophy,
  CalendarCheck,
  Swords,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";

export const LAUNCHPAD_ITEMS = [
  {
    to: "/trials",
    title: "Trials",
    subtitle: "350+ SAI & Club",
    icon: Trophy,
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-500/5 text-amber-500",
    border: "hover:border-amber-500/50",
  },
  {
    to: "/book",
    title: "Book Turf",
    subtitle: "Hourly Slots",
    icon: CalendarCheck,
    gradient: "from-emerald-500/20 via-teal-500/10 to-emerald-500/5 text-emerald-500",
    border: "hover:border-emerald-500/50",
  },
  {
    to: "/play",
    title: "Pickup Games",
    subtitle: "Join Match",
    icon: Swords,
    gradient: "from-blue-500/20 via-indigo-500/10 to-blue-500/5 text-blue-500",
    border: "hover:border-blue-500/50",
  },
  {
    to: "/train",
    title: "Coaching",
    subtitle: "Top Academies",
    icon: GraduationCap,
    gradient: "from-purple-500/20 via-violet-500/10 to-purple-500/5 text-purple-500",
    border: "hover:border-purple-500/50",
  },
  {
    to: "/my-stats",
    title: "Sports CV",
    subtitle: "Scout Passport",
    icon: Sparkles,
    gradient: "from-rose-500/20 via-pink-500/10 to-rose-500/5 text-rose-500",
    border: "hover:border-rose-500/50",
  },
  {
    to: "/events",
    title: "Tournaments",
    subtitle: "State & City",
    icon: Award,
    gradient: "from-cyan-500/20 via-sky-500/10 to-cyan-500/5 text-cyan-500",
    border: "hover:border-cyan-500/50",
  },
] as const;

export function AppLaunchpad() {
  return (
    <section aria-label="Core sports app actions" className="py-2">
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
        {LAUNCHPAD_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 ${item.border}`}
          >
            {/* App Icon Container */}
            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br shadow-inner transition-transform group-hover:scale-105 ${item.gradient}`}
            >
              <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            </div>

            {/* Title & Subtitle */}
            <span className="mt-2 text-xs font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {item.title}
            </span>
            <span className="text-[10px] text-muted-foreground truncate w-full">
              {item.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

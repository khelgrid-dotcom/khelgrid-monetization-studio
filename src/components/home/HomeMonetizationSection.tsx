import { Link } from "@tanstack/react-router";
import { Zap, Crown, Flame, ChevronDown } from "lucide-react";

export const MONETIZATION_PLANS = [
  {
    icon: Zap,
    title: "Micropayments",
    price: "₹49 per application",
    desc: "Free users get 2 applications. Unlock more via wallet or UPI.",
    to: "/trials",
    highlight: false,
  },
  {
    icon: Crown,
    title: "KhelGrid Pro",
    price: "₹499 / month",
    desc: "Unlimited applications, Verified Sports CV, priority scouting.",
    highlight: true,
    to: "/pricing",
  },
  {
    icon: Flame,
    title: "Academy Boost",
    price: "₹1,500 / 7 days",
    desc: "Pin your trial to the top with a glowing Featured row.",
    highlight: false,
    to: "/trials",
  },
] as const;

export function HomeMonetizationSection() {
  return (
    <section
      id="plans-pricing"
      aria-label="Membership and Pricing Options"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Plans & Memberships
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Built for athletes. Powered by academies.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          Transparent pricing for grassroots athletes, verified sports passports, and academy trial visibility.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MONETIZATION_PLANS.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className={`group rounded-2xl border bg-gradient-card p-5 transition-all hover:-translate-y-1 sm:p-6 cursor-pointer ${
              card.highlight
                ? "border-primary/40 shadow-sm"
                : "border-border hover:border-border/80"
            }`}
          >
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl shadow-xs ${
                card.highlight ? "bg-gradient-hero" : "bg-secondary"
              }`}
            >
              <card.icon
                className={`h-5 w-5 ${card.highlight ? "text-primary-foreground" : "text-primary"}`}
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">{card.title}</h3>
            <div className="text-sm font-semibold text-primary">{card.price}</div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>

            <div className="mt-4 inline-flex items-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              <span>Learn more</span>
              <ChevronDown className="ml-1 h-3 w-3 -rotate-90" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

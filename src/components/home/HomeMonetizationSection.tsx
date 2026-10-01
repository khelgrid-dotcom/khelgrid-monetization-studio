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
      aria-label="Membership and Pricing Options"
      className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20"
    >
      <h2 className="mb-5 text-center text-xl font-bold tracking-tight sm:mb-6 sm:text-2xl text-foreground">
        Built for athletes. Powered by academies.
      </h2>

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

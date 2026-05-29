import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Flame, ShieldCheck, Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KhelGrid · India's premium grid for sports trials" },
      { name: "description", content: "Apply to elite trials, unlock a Verified Sports CV, and let academies feature their listings — built for India's next generation of athletes." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
            <Flame className="mr-1 h-3 w-3" /> Monetization simulator · live demo
          </Badge>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            India's sports trials,{" "}
            <span className="text-gradient">on a single grid.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Apply to scouted trials, generate a verified sports CV, and let academies boost their listings to reach the next Virat, Sindhu or Neeraj.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-95">
              <Link to="/trials">Explore live trials <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">My dashboard</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> 1,200+ trials</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 86k verified athletes</div>
            <div className="flex items-center gap-2"><Crown className="h-4 w-4 text-primary" /> 240 academies</div>
          </div>
        </div>
      </section>

      {/* How monetization works */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Micropayments",
              price: "₹49 per application",
              desc: "Free users get 2 applications. After that, unlock individual trials via wallet or UPI — or upgrade for unlimited access.",
            },
            {
              icon: Crown,
              title: "KhelGrid Pro",
              price: "₹499 / month",
              desc: "Unlimited applications, priority placement to scouts, Verified Sports CV included, and early access to elite camps.",
              highlight: true,
            },
            {
              icon: Flame,
              title: "Academy Boost",
              price: "₹1,500 / 7 days",
              desc: "Academies pin their trial to the top of search with a glowing neon Featured row — driving 8.4× views and 3.2× applies.",
            },
          ].map(card => (
            <div
              key={card.title}
              className={`rounded-2xl border bg-gradient-card p-6 ${card.highlight ? "border-primary/40 animate-pulse-glow" : "border-border"}`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${card.highlight ? "bg-gradient-hero" : "bg-secondary"}`}>
                <card.icon className={`h-5 w-5 ${card.highlight ? "text-primary-foreground" : "text-primary"}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <div className="text-sm text-primary">{card.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

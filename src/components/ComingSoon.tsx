import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  cta?: { to: string; label: string };
}

export function ComingSoon({ icon: Icon, eyebrow, title, description, bullets, cta }: Props) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
        <Sparkles className="mr-1 h-3 w-3" /> {eyebrow}
      </Badge>
      <div className="mt-6 flex items-start gap-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elevated">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {bullets.map(b => (
            <div key={b} className="rounded-2xl border border-border bg-gradient-card p-5 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--neon-glow)]" />
                <span>{b}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link to={cta?.to ?? "/trials"}>
            {cta?.label ?? "Explore live trials"} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}

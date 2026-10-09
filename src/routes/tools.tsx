import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { TOOLS_CATALOG } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/tools")({
  head: () =>
    buildSeoHead({
      title: "Athlete Tools, Calculators & Trial Planners · KhelGrid",
      description:
        "Free sports calculators, age eligibility checkers, sprint pace estimators, hydration planners, and trial preparation checklists for Indian athletes and parents.",
      canonicalPath: "/tools",
      keywords:
        "sports tools, athlete calculators, age cutoff checker, trial budget planner, sports cv builder",
      type: "website",
    }),
  component: ToolsLayout,
});

function ToolsLayout() {
  const matches = useMatches();
  const onChild = matches.some((m) => m.routeId === "/tools/$slug");
  if (onChild) return <Outlet />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
        {TOOLS_CATALOG.length} tools
      </Badge>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Tools & calculators</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Quick painkillers — readiness scores, eligibility checks, packing lists.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS_CATALOG.map((t) => (
          <Link
            key={t.slug}
            to="/tools/$slug"
            params={{ slug: t.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Wrench className="h-3 w-3" />
              {t.category}
            </div>
            <div className="mt-2 text-base font-semibold group-hover:text-primary">{t.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

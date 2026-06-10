import { createFileRoute, Link } from "@tanstack/react-router";
import { GUIDES_CATALOG } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";

const CATEGORIES = ["All", "Trial prep", "Sports CV", "Scholarships", "Nutrition", "Mindset", "Parents", "Recovery", "Tech"] as const;

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides & playbooks · KhelGrid" },
      { name: "description", content: "India-specific guides on trial prep, Sports CVs, scholarships, nutrition and parenting young athletes." },
    ],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return GUIDES_CATALOG.filter(g =>
      (cat === "All" || g.category === cat) &&
      (!query || `${g.title} ${g.excerpt}`.toLowerCase().includes(query))
    );
  }, [cat, q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">{GUIDES_CATALOG.length} guides</Badge>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Guides & playbooks</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Practical, India-specific guides written for athletes, parents and coaches.</p>

      <div className="mt-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search guides…"
          className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm focus:border-primary/40 focus:outline-none" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${cat === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(g => (
          <Link key={g.slug} to="/guide/$slug" params={{ slug: g.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{g.category}</div>
            <div className="mt-2 text-base font-semibold group-hover:text-primary">{g.title}</div>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{g.excerpt}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{g.readMins} min</div>
          </Link>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No guides match that search.</p>}
      </div>
    </main>
  );
}

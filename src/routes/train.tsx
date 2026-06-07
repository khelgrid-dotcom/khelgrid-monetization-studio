import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { COACHING, PLAYO_SPORTS, PLAYO_CITIES } from "@/data/playo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, GraduationCap, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/train")({
  head: () => ({
    meta: [
      { title: "Coaching & Academies · KhelGrid Train" },
      { name: "description", content: "Find coaches, academies and training programs across India. Beginner to elite, every sport." },
    ],
  }),
  component: TrainPage,
});

function TrainPage() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("All");
  const [city, setCity] = useState("Bengaluru");
  const [level, setLevel] = useState("All");

  const list = useMemo(() => COACHING.filter(c =>
    (city === "All" || c.city === city) &&
    (sport === "All" || c.sport === sport) &&
    (level === "All" || c.level === level) &&
    (q === "" || [c.title, c.coach, c.area].join(" ").toLowerCase().includes(q.toLowerCase())),
  ), [q, sport, city, level]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Train with the best coaches</h1>
        <p className="mt-1 text-sm text-muted-foreground">Structured coaching programs from certified academies near you.</p>
      </div>

      <div className="sticky top-14 z-30 mt-4 -mx-4 border-y border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:top-16 sm:rounded-2xl sm:mx-0 sm:border sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr,160px,160px,160px]">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search coach or program…" className="h-11 pl-9 bg-secondary/40 border-border" />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-11 bg-secondary/40 border-border"><MapPin className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cities</SelectItem>
              {PLAYO_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="h-11 bg-secondary/40 border-border"><Trophy className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sports</SelectItem>
              {PLAYO_SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-11 bg-secondary/40 border-border"><GraduationCap className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {["All", "Beginner", "Intermediate", "Advanced", "All Levels"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(c => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-border/80">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
              <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-md bg-primary/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{c.level}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-tight">{c.title}</h3>
                <div className="flex shrink-0 items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{c.rating}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.coach}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                <Badge variant="outline" className="border-border text-[10px]">{c.sport}</Badge>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.area}, {c.city}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-semibold">₹{c.pricePerMonth.toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground"> / mo</span>
                </div>
                <Button size="sm" className="rounded-full" onClick={() => toast.success(`Enquiry sent to ${c.coach}`)}>
                  Enquire
                </Button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No programs match your filters.
          </div>
        )}
      </div>
    </main>
  );
}

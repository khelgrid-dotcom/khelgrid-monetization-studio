import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GAMES, PLAYO_SPORTS, PLAYO_CITIES } from "@/data/playo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Trophy, Users, Zap, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Find Players & Join Games · KhelGrid Play" },
      { name: "description", content: "Join casual games near you, match by skill level, host your own game." },
    ],
  }),
  component: PlayPage,
});

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

function PlayPage() {
  const [sport, setSport] = useState("All");
  const [city, setCity] = useState("All");
  const [level, setLevel] = useState("All");

  const list = useMemo(() => GAMES.filter(g =>
    (city === "All" || g.city === city) &&
    (sport === "All" || g.sport === sport) &&
    (level === "All" || g.skillLevel === level),
  ), [sport, city, level]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find players. Join games.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Casual pickup games near you, matched by skill.</p>
        </div>
        <Button className="rounded-full bg-gradient-hero text-primary-foreground hover:opacity-95" onClick={() => toast.success("Host a game flow coming soon")}>
          <Plus className="mr-1 h-4 w-4" /> Host a game
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-10 w-[150px] bg-secondary/40 border-border"><MapPin className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            {PLAYO_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="h-10 w-[150px] bg-secondary/40 border-border"><Trophy className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sports</SelectItem>
            {PLAYO_SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="h-10 w-[150px] bg-secondary/40 border-border"><Zap className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(g => {
          const full = g.joined >= g.capacity;
          const pct = Math.min(100, Math.round((g.joined / g.capacity) * 100));
          return (
            <div key={g.id} className="rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/15 border-primary/40 text-primary">{g.sport}</Badge>
                    <Badge variant="outline" className="border-border text-[10px]">{g.skillLevel}</Badge>
                  </div>
                  <h3 className="mt-2 text-base font-semibold">{g.venue}</h3>
                  <p className="text-xs text-muted-foreground">Hosted by {g.host}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">₹{g.costPerPlayer}</div>
                  <div className="text-muted-foreground">per player</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{g.date}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{g.time}</div>
                <div className="col-span-2 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{g.city}</div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" />{g.joined}/{g.capacity} joined</span>
                  <span className="text-muted-foreground">{g.capacity - g.joined} spots</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <Button
                className="mt-4 w-full rounded-full"
                disabled={full}
                onClick={() => toast.success(`Joined ${g.sport} game at ${g.venue}`)}
              >
                {full ? "Full" : "Join game"}
              </Button>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No open games match your filters.
          </div>
        )}
      </div>
    </main>
  );
}

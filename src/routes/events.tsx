import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EVENTS, PLAYO_SPORTS, PLAYO_CITIES } from "@/data/playo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Trophy, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Sports Events & Tournaments · KhelGrid" },
      { name: "description", content: "Join local tournaments, leagues and open sports events near you." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [sport, setSport] = useState("All");
  const [city, setCity] = useState("All");

  const list = useMemo(() => EVENTS.filter(e =>
    (city === "All" || e.city === city) &&
    (sport === "All" || e.sport === sport),
  ), [sport, city]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Local events & tournaments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Open formats, leagues and weekend showdowns across India.</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-10 w-[160px] bg-secondary/40 border-border"><MapPin className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Cities</SelectItem>
            {PLAYO_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="h-10 w-[160px] bg-secondary/40 border-border"><Trophy className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sports</SelectItem>
            {PLAYO_SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(e => (
          <div key={e.id} className="overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
              <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <Badge className="bg-primary text-primary-foreground border-0">{e.sport}</Badge>
                <h3 className="mt-2 text-lg font-bold leading-snug">{e.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{e.date}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{e.time}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.venue}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{e.spotsLeft} spots left</div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{e.format}</div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">₹{e.entryFee} <span className="font-normal text-muted-foreground">entry</span></div>
                <Button size="sm" className="rounded-full" onClick={() => toast.success(`Registered for ${e.title}`)}>
                  Register
                </Button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No events match your filters.
          </div>
        )}
      </div>
    </main>
  );
}

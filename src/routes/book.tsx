import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VENUES, PLAYO_SPORTS, PLAYO_CITIES, type Venue } from "@/data/playo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Trophy, Calendar, Clock, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Sports Venues · KhelGrid" },
      { name: "description", content: "Find and book sports venues, turfs, courts and arenas near you across India." },
    ],
  }),
  component: BookVenues,
});

const TIMES = ["6:00 AM", "7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

function BookVenues() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState<string>("All");
  const [city, setCity] = useState<string>("Bengaluru");
  const [booking, setBooking] = useState<Venue | null>(null);

  const list = useMemo(() => {
    return VENUES.filter(v =>
      (city === "All" || v.city === city) &&
      (sport === "All" || v.sports.includes(sport)) &&
      (q === "" || [v.name, v.area].join(" ").toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, sport, city]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sports Venues in {city}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover and book turfs, courts, arenas and pools near you.
        </p>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 mt-4 -mx-4 border-y border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:top-16 sm:rounded-2xl sm:mx-0 sm:border sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr,180px,180px]">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by venue name…" className="h-11 pl-9 bg-secondary/40 border-border" />
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
        </div>
      </div>

      {/* Counts row tabs (visual only) */}
      <div className="mt-4 flex gap-4 border-b border-border/60 text-sm">
        <span className="border-b-2 border-primary pb-2 font-semibold text-primary">
          Venues ({list.length})
        </span>
        <span className="pb-2 text-muted-foreground">Coaching</span>
        <span className="pb-2 text-muted-foreground">Events</span>
        <span className="pb-2 text-muted-foreground">Memberships</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(v => (
          <VenueCard key={v.id} v={v} onBook={() => setBooking(v)} />
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No venues match your filters.
          </div>
        )}
      </div>

      {booking && (
        <BookingDialog open={!!booking} onOpenChange={o => !o && setBooking(null)} venue={booking} />
      )}
    </main>
  );
}

function VenueCard({ v, onBook }: { v: Venue; onBook: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-border/80">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover" />
        {v.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-yellow-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
            Featured
          </span>
        )}
        {v.bookable && (
          <span className="absolute right-3 top-3 rounded-md bg-primary/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Bookable
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{v.name}</h3>
          <div className="flex shrink-0 items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{v.rating}</span>
            <span className="text-muted-foreground">({v.reviews})</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{v.area} · ~{v.distanceKm} km</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {v.sports.map(s => (
            <Badge key={s} variant="outline" className="border-border text-[10px]">{s}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">from </span>
            <span className="font-semibold">₹{v.pricePerHour}</span>
            <span className="text-muted-foreground"> / hr</span>
          </div>
          <Button size="sm" onClick={onBook} className="rounded-full">Book slot</Button>
        </div>
      </div>
    </div>
  );
}

function BookingDialog({ open, onOpenChange, venue }: { open: boolean; onOpenChange: (o: boolean) => void; venue: Venue }) {
  const [sport, setSport] = useState(venue.sports[0]);
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const confirm = () => {
    if (!time) return;
    toast.success(`Booked ${venue.name} · ${date} · ${time}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-xl">{venue.name}</DialogTitle>
          <DialogDescription>{venue.area} · {venue.city}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Sport</label>
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger className="h-11 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {venue.sports.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground"><Calendar className="mr-1 inline h-3 w-3" /> Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-11 mt-1" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground"><Clock className="mr-1 inline h-3 w-3" /> Slot</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {TIMES.map(t => {
                const active = time === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-lg border px-1 py-2 text-xs transition ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-border/80"
                    }`}
                  >
                    {active && <Check className="mr-0.5 inline h-3 w-3" />}{t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="text-lg font-bold">₹{venue.pricePerHour}</span>
            </div>
          </div>

          <Button onClick={confirm} disabled={!time} className="w-full" size="lg">
            {time ? `Confirm booking · ${time}` : "Select a slot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

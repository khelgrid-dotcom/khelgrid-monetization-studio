import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from "react";
import { VENUES, PLAYO_SPORTS, PLAYO_CITIES, type Venue } from "@/data/playo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Trophy, Calendar, Clock, Check, Bot, Sparkles, CircleCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Sports Venues · KhelGrid" },
      { name: "description", content: "Find and book sports venues, turfs, courts and arenas near you across India." },
    ],
    links: [{ rel: "canonical", href: "https://khelgrid.com/book" }],
  }),
  component: BookVenues,
});

const TIMES = ["6:00 AM", "7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
type BookingSelection = { venue: Venue; date: string; time: string | null };

function BookVenues() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState<string>("All");
  const [city, setCity] = useState<string>("Bengaluru");
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const list = useMemo(() => {
    return VENUES.filter(v =>
      (city === "All" || v.city === city) &&
      (sport === "All" || v.sports.includes(sport)) &&
      (q === "" || [v.name, v.area].join(" ").toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, sport, city]);

  const startBooking = (venue: Venue, date = today, time: string | null = null) => {
    setBooking({ venue, date, time });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sports Venues in {city}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Discover and book turfs, courts, arenas and pools near you.</p>
      </div>

      <VenueBookingAssistant defaultCity={city === "All" ? "Bengaluru" : city} defaultDate={today} onBook={startBooking} />

      <div className="sticky top-14 z-30 mt-6 -mx-4 border-y border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:top-16 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr,180px,180px]">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by venue name…" className="h-11 border-border bg-secondary/40 pl-9" />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-11 border-border bg-secondary/40"><MapPin className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cities</SelectItem>
              {PLAYO_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="h-11 border-border bg-secondary/40"><Trophy className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sports</SelectItem>
              {PLAYO_SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex gap-4 border-b border-border/60 text-sm">
        <span className="border-b-2 border-primary pb-2 font-semibold text-primary">Venues ({list.length})</span>
        <span className="pb-2 text-muted-foreground">Coaching</span>
        <span className="pb-2 text-muted-foreground">Events</span>
        <span className="pb-2 text-muted-foreground">Memberships</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(v => <VenueCard key={v.id} v={v} onBook={() => startBooking(v)} />)}
        {list.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No venues match your filters.</div>}
      </div>

      {booking && <BookingDialog key={`${booking.venue.id}-${booking.date}-${booking.time}`} open={Boolean(booking)} onOpenChange={open => !open && setBooking(null)} venue={booking.venue} initialDate={booking.date} initialTime={booking.time} />}
    </main>
  );
}

function VenueBookingAssistant({ defaultCity, defaultDate, onBook }: { defaultCity: string; defaultDate: string; onBook: (venue: Venue, date: string, time: string) => void }) {
  const [city, setCity] = useState(defaultCity);
  const [sport, setSport] = useState("Football");
  const [date, setDate] = useState(defaultDate);
  const [venueId, setVenueId] = useState("");

  useEffect(() => setCity(defaultCity), [defaultCity]);

  const matches = useMemo(() => VENUES.filter((venue) => venue.bookable && venue.city === city && venue.sports.includes(sport)), [city, sport]);

  useEffect(() => {
    if (!matches.some((venue) => venue.id === venueId)) setVenueId(matches[0]?.id ?? "");
  }, [matches, venueId]);

  const venue = matches.find((item) => item.id === venueId);
  const slots = venue ? getAvailableSlots(venue, date) : [];

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-card">
      <div className="flex flex-col gap-3 border-b border-primary/20 bg-primary/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div>
          <div>
            <div className="flex items-center gap-2"><h2 className="font-semibold">VenueBooking Assistant</h2><Badge className="border-0 bg-primary/15 text-primary">Beta</Badge></div>
            <p className="text-xs text-muted-foreground">Tell me where and when you want to play. I&apos;ll find matching slots.</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Demo availability</span>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-4">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-11"><MapPin className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>{PLAYO_CITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="h-11"><Trophy className="mr-1 h-4 w-4 text-primary" /><SelectValue /></SelectTrigger>
          <SelectContent>{PLAYO_SPORTS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="date" min={defaultDate} value={date} onChange={(event) => setDate(event.target.value)} className="h-11" aria-label="Booking date" />
        <Select value={venueId} onValueChange={setVenueId} disabled={matches.length === 0}>
          <SelectTrigger className="h-11"><SelectValue placeholder="Choose venue" /></SelectTrigger>
          <SelectContent>{matches.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        {!venue ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" />No bookable {sport.toLowerCase()} venue is available in {city} yet. Try another city or sport.</div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">{slots.length} slots available at {venue.name}</span></div>
              <p className="mt-1 text-xs text-muted-foreground">{venue.area} · ₹{venue.pricePerHour}/hour · availability is refreshed in the booking step.</p>
              <div className="mt-3 flex flex-wrap gap-2">{slots.map((slot) => <button key={slot} onClick={() => onBook(venue, date, slot)} className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground">{slot}</button>)}</div>
            </div>
            <Button onClick={() => onBook(venue, date, slots[0])} disabled={slots.length === 0} className="shrink-0 gap-2"><Calendar className="h-4 w-4" />Book earliest slot</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function VenueCard({ v, onBook }: { v: Venue; onBook: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-border/80">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover" />
        {v.featured && <span className="absolute left-3 top-3 rounded-md bg-yellow-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">Featured</span>}
        {v.bookable && <span className="absolute right-3 top-3 rounded-md bg-primary/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Bookable</span>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2"><h3 className="text-base font-semibold leading-tight">{v.name}</h3><div className="flex shrink-0 items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /><span className="font-semibold">{v.rating}</span><span className="text-muted-foreground">({v.reviews})</span></div></div>
        <p className="mt-1 text-sm text-muted-foreground">{v.area} · ~{v.distanceKm} km</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{v.sports.map(s => <Badge key={s} variant="outline" className="border-border text-[10px]">{s}</Badge>)}</div>
        <div className="mt-4 flex items-center justify-between gap-2"><div className="text-sm"><span className="text-muted-foreground">from </span><span className="font-semibold">₹{v.pricePerHour}</span><span className="text-muted-foreground"> / hr</span></div><Button size="sm" onClick={onBook} className="rounded-full">Book slot</Button></div>
      </div>
    </div>
  );
}

function BookingDialog({ open, onOpenChange, venue, initialDate, initialTime }: { open: boolean; onOpenChange: (open: boolean) => void; venue: Venue; initialDate: string; initialTime: string | null }) {
  const [sport, setSport] = useState(venue.sports[0]);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState<string | null>(initialTime);
  const availableSlots = getAvailableSlots(venue, date);

  const selectDate = (nextDate: string) => {
    setDate(nextDate);
    if (time && !getAvailableSlots(venue, nextDate).includes(time)) setTime(null);
  };

  const confirm = () => {
    if (!time) return;
    toast.success(`Booking request sent for ${venue.name} · ${date} · ${time}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-gradient-card">
        <DialogHeader><DialogTitle className="text-xl">{venue.name}</DialogTitle><DialogDescription>{venue.area} · {venue.city}</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-muted-foreground">Sport</label><Select value={sport} onValueChange={setSport}><SelectTrigger className="mt-1 h-11"><SelectValue /></SelectTrigger><SelectContent>{venue.sports.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="text-xs font-medium text-muted-foreground"><Calendar className="mr-1 inline h-3 w-3" /> Date</label><Input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={event => selectDate(event.target.value)} className="mt-1 h-11" /></div>
          <div>
            <div className="flex items-center justify-between"><label className="text-xs font-medium text-muted-foreground"><Clock className="mr-1 inline h-3 w-3" /> Slot</label><span className="text-[10px] text-muted-foreground">Demo availability</span></div>
            <div className="mt-2 grid grid-cols-4 gap-2">{TIMES.map((slot) => { const available = availableSlots.includes(slot); const active = time === slot; return <button key={slot} disabled={!available} onClick={() => setTime(slot)} className={`rounded-lg border px-1 py-2 text-xs transition ${active ? "border-primary bg-primary text-primary-foreground" : available ? "border-border hover:border-primary/50" : "cursor-not-allowed border-border/50 bg-secondary/40 text-muted-foreground line-through"}`}>{active && <Check className="mr-0.5 inline h-3 w-3" />}{slot}</button>; })}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-3 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Estimated total</span><span className="text-lg font-bold">₹{venue.pricePerHour}</span></div></div>
          <Button onClick={confirm} disabled={!time} className="w-full" size="lg">{time ? `Send booking request · ${time}` : "Select an available slot"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getAvailableSlots(venue: Venue, date: string) {
  const seed = `${venue.id}-${date}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TIMES.filter((_, index) => (seed + index * 7) % 5 !== 0);
}

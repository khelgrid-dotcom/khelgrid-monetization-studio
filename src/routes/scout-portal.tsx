import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  LockKeyhole,
  MapPin,
  Save,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SCOUT_ATHLETES } from "@/data/scout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NOTES_STORAGE_KEY = "khelgrid-scout-private-notes-v1";

export const Route = createFileRoute("/scout-portal")({
  head: () => ({
    meta: [
      { title: "Scout Portal · KhelGrid" },
      {
        name: "description",
        content:
          "Private recruiter workspace for reviewing athlete profiles and saving internal assessments.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: ScoutPortal,
});

function readNotes(): Record<string, string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

function ScoutPortal() {
  const { role, setRole } = useAuth();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All sports");
  const [selectedId, setSelectedId] = useState(SCOUT_ATHLETES[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(readNotes());
  }, []);

  const sports = useMemo(
    () => ["All sports", ...new Set(SCOUT_ATHLETES.map((athlete) => athlete.sport))],
    [],
  );
  const filteredAthletes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return SCOUT_ATHLETES.filter((athlete) => {
      const matchesSport = sport === "All sports" || athlete.sport === sport;
      const matchesQuery =
        !normalizedQuery ||
        [athlete.name, athlete.sport, athlete.city, athlete.position]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesSport && matchesQuery;
    });
  }, [query, sport]);
  const activeAthlete =
    filteredAthletes.find((athlete) => athlete.id === selectedId) ?? filteredAthletes[0] ?? null;
  const activeAthleteId = activeAthlete?.id ?? "";

  useEffect(() => {
    setDraft(activeAthleteId ? (notes[activeAthleteId] ?? "") : "");
    setSaved(false);
  }, [activeAthleteId, notes]);

  const saveNote = () => {
    if (!activeAthlete) return;
    const nextNotes = { ...notes };
    const value = draft.trim();
    if (value) nextNotes[activeAthlete.id] = value;
    else delete nextNotes[activeAthlete.id];
    setNotes(nextNotes);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));
    setSaved(true);
    toast.success(`Private note saved for ${activeAthlete.name}`);
  };

  if (role !== "recruiter") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-10">
          <LockKeyhole className="mx-auto h-10 w-10 text-primary" />
          <Badge variant="outline" className="mt-4 border-primary/40 bg-primary/10 text-primary">
            Recruiter access
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Scout Portal</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Private athlete assessments belong in the recruiter workspace and never appear on an
            athlete&apos;s shareable Sports CV.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            This prototype uses a demo role switch. Production access must be enforced by
            server-side authentication and recruiter permissions before real athlete data is
            connected.
          </p>
          <Button type="button" className="mt-6 rounded-full" onClick={() => setRole("recruiter")}>
            Enter demo recruiter workspace
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Private recruiter workspace
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Scout Portal</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review athlete evidence and keep internal assessment notes beside each profile. Notes
            are not included in athlete-facing profile views.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          <LockKeyhole className="h-3.5 w-3.5 text-primary" /> Recruiter-only notes
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-card/60 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search athletes…"
              aria-label="Search athlete profiles"
              className="h-10 border-border bg-secondary/40 pl-9"
            />
          </div>
          <select
            value={sport}
            onChange={(event) => setSport(event.target.value)}
            aria-label="Filter athletes by sport"
            className="mt-2 h-10 w-full rounded-md border border-border bg-secondary/40 px-3 text-sm text-foreground outline-none focus:border-primary/50"
          >
            {sports.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="mt-4 flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>{filteredAthletes.length} profiles</span>
            <span>Updated evidence</span>
          </div>
          <div className="mt-2 space-y-1">
            {filteredAthletes.map((athlete) => (
              <button
                key={athlete.id}
                type="button"
                onClick={() => setSelectedId(athlete.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${activeAthlete?.id === athlete.id ? "border-primary/50 bg-primary/10" : "border-transparent hover:border-border hover:bg-secondary/60"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{athlete.name}</span>
                  {notes[athlete.id]?.trim() && (
                    <LockKeyhole
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      aria-label="Private note saved"
                    />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {athlete.sport} · {athlete.city}
                </p>
                <Badge variant="outline" className="mt-2 border-border text-[10px]">
                  {athlete.status}
                </Badge>
              </button>
            ))}
            {filteredAthletes.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No profiles match those filters.
              </p>
            )}
          </div>
        </aside>

        {activeAthlete ? (
          <section
            className="min-w-0 rounded-2xl border border-border bg-gradient-card p-4 sm:p-6"
            aria-labelledby="athlete-profile-heading"
          >
            <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="athlete-profile-heading" className="text-2xl font-bold tracking-tight">
                      {activeAthlete.name}
                    </h2>
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                      {activeAthlete.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeAthlete.ageGroup} {activeAthlete.sport} · {activeAthlete.position}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {activeAthlete.city}
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" /> Evidence updated{" "}
                {activeAthlete.lastUpdated}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Latest evidence
                </p>
                <p className="mt-2 text-sm leading-relaxed">{activeAthlete.latestEvidence}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Observed strengths
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeAthlete.strengths.map((strength) => (
                    <Badge key={strength} variant="outline" className="border-border">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <LockKeyhole className="h-4 w-4 text-primary" /> Private assessment notes
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    For internal scouting context only. These notes are excluded from the athlete
                    profile and shareable Sports CV.
                  </p>
                </div>
                {saved && <span className="text-xs font-medium text-primary">Saved just now</span>}
              </div>
              <Textarea
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setSaved(false);
                }}
                placeholder="Record strengths to verify, development areas, fit for a pathway, follow-up questions or next steps…"
                aria-label={`Private assessment notes for ${activeAthlete.name}`}
                className="mt-4 min-h-36 border-primary/20 bg-background/70 leading-relaxed"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Stored locally in this recruiter workspace on this device.
                </p>
                <Button type="button" onClick={saveNote} className="rounded-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save private note
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Select an athlete profile to review.
          </div>
        )}
      </div>
    </main>
  );
}

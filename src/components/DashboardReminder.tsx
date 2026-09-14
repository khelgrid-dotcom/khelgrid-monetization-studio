import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Clock3, GraduationCap, MapPin, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ScheduledSession } from "@/context/AuthContext";

interface Props {
  sessions: ScheduledSession[];
}

function getCountdown(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function DashboardReminder({ sessions }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const nextSession = useMemo(
    () =>
      sessions
        .filter((session) => Date.parse(session.scheduledAt) > now)
        .sort((first, second) => Date.parse(first.scheduledAt) - Date.parse(second.scheduledAt))[0],
    [now, sessions],
  );

  if (!nextSession) {
    return (
      <section
        className="mt-8 rounded-2xl border border-border bg-gradient-card p-5 sm:p-6"
        aria-labelledby="session-reminder-heading"
      >
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          <CalendarClock className="mr-1.5 h-3.5 w-3.5" /> Schedule reminder
        </Badge>
        <h2 id="session-reminder-heading" className="mt-3 text-xl font-bold tracking-tight">
          No upcoming sessions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your countdown will appear here when you schedule a trial or coaching session.
        </p>
      </section>
    );
  }

  const countdown = getCountdown(Date.parse(nextSession.scheduledAt) - now);
  const SessionIcon = nextSession.type === "trial" ? Trophy : GraduationCap;
  const sessionType = nextSession.type === "trial" ? "Upcoming trial" : "Coaching session";
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(nextSession.scheduledAt));
  const units = [
    ["Days", countdown.days],
    ["Hours", countdown.hours],
    ["Minutes", countdown.minutes],
    ["Seconds", countdown.seconds],
  ];

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-card shadow-[var(--shadow-neon)]"
      aria-labelledby="session-reminder-heading"
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <SessionIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" /> {sessionType}
            </Badge>
            <h2
              id="session-reminder-heading"
              className="mt-2 truncate text-xl font-bold tracking-tight sm:text-2xl"
            >
              {nextSession.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{nextSession.provider}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-primary" />
                {dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {nextSession.location}
              </span>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-4 gap-2 sm:gap-3"
          role="timer"
          aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds until ${nextSession.title}`}
        >
          {units.map(([label, value]) => (
            <div
              key={label}
              className="min-w-14 rounded-xl border border-border bg-background/50 px-2 py-2.5 text-center sm:min-w-16"
            >
              <div className="font-display text-xl font-bold tabular-nums text-primary sm:text-2xl">
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-primary/20 bg-primary/5 px-5 py-3 text-xs font-medium text-primary sm:px-6">
        <Clock3 className="h-3.5 w-3.5" /> Your next session starts in the time shown above.
      </div>
    </section>
  );
}

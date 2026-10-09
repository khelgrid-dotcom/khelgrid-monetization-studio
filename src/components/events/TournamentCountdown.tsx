import { useState, useEffect, useMemo } from "react";
import { Clock, AlertTriangle, CheckCircle, Timer, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownResult {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isClosed: boolean;
  isUrgent: boolean; // Less than 24h or low spots
  isWarning: boolean; // Less than 3 days
  formattedShort: string;
  formattedDetailed: string;
}

// Known deterministic offsets (in seconds) for mock seed events to ensure
// vivid, realistic live countdowns across any environment time.
const MOCK_DEADLINE_OFFSETS: Record<string, number> = {
  e3: 14 * 3600 + 35 * 60 + 20, // 14h 35m (High urgency)
  e4: 28 * 3600 + 40 * 60, // 1d 4h (Closing tomorrow)
  e1: 2 * 86400 + 11 * 3600 + 15 * 60, // 2d 11h
  e2: 3 * 86400 + 8 * 3600, // 3d 8h
  e5: 4 * 86400 + 16 * 3600, // 4d 16h
  e6: 6 * 86400 + 4 * 3600, // 6d 4h
  e7: 7 * 86400 + 19 * 3600, // 7d 19h
  e8: 9 * 86400 + 12 * 3600, // 9d 12h
  e9: 11 * 86400 + 6 * 3600, // 11d 6h
  e10: 13 * 86400 + 18 * 3600, // 13d 18h
  e11: 16 * 86400 + 9 * 3600, // 16d 9h
  e12: 18 * 86400 + 14 * 3600, // 18d 14h
  e13: 21 * 86400 + 7 * 3600, // 21d 7h
  e14: 24 * 86400 + 12 * 3600, // 24d 12h
  e15: 0, // Sold out
};

const MONTH_NAMES: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/**
 * Calculates remaining seconds until registration closes
 */
export function calculateDeadlineRemaining(
  eventId?: string,
  deadlineStr?: string,
  spotsLeft: number = 10,
  status?: string,
): CountdownResult {
  // 1. Sold out or closed state
  if (spotsLeft <= 0 || status === "Sold Out") {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isClosed: true,
      isUrgent: false,
      isWarning: false,
      formattedShort: "Closed",
      formattedDetailed: "Registration Closed",
    };
  }

  let totalSeconds = 0;

  // 2. Check if we have a seed offset for authentic interactive demo countdown
  if (eventId && MOCK_DEADLINE_OFFSETS[eventId] !== undefined) {
    totalSeconds = MOCK_DEADLINE_OFFSETS[eventId];
  } else if (deadlineStr) {
    // 3. Try to parse real deadline string (e.g. "Jun 12, 11:59 PM" or ISO)
    const match = deadlineStr.match(
      /([A-Za-z]{3,})\s+(\d{1,2})(?:,?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i,
    );
    if (match) {
      const monthStr = match[1].toLowerCase().slice(0, 3);
      const day = parseInt(match[2], 10);
      let hours = match[3] ? parseInt(match[3], 10) : 23;
      const minutes = match[4] ? parseInt(match[4], 10) : 59;
      const meridiem = match[5]?.toUpperCase();

      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const monthIndex = MONTH_NAMES[monthStr] ?? 5;
      const now = new Date();
      let target = new Date(now.getFullYear(), monthIndex, day, hours, minutes, 0);

      if (target.getTime() <= now.getTime()) {
        target = new Date(now.getFullYear() + 1, monthIndex, day, hours, minutes, 0);
      }

      totalSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    } else {
      // Default fallback: 3 days remaining
      totalSeconds = 3 * 86400;
    }
  } else {
    // Default fallback
    totalSeconds = 2 * 86400 + 12 * 3600;
  }

  if (totalSeconds <= 0) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isClosed: true,
      isUrgent: false,
      isWarning: false,
      formattedShort: "Closed",
      formattedDetailed: "Deadline Passed",
    };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds < 24 * 3600 || spotsLeft <= 2;
  const isWarning = totalSeconds < 3 * 86400 || spotsLeft <= 4;

  let formattedShort = "";
  let formattedDetailed = "";

  if (days > 0) {
    formattedShort = `${days}d ${hours}h`;
    formattedDetailed = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formattedShort = `${hours}h ${minutes}m`;
    formattedDetailed = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    formattedShort = `${minutes}m ${seconds}s`;
    formattedDetailed = `${minutes}m ${seconds}s`;
  }

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isClosed: false,
    isUrgent,
    isWarning,
    formattedShort,
    formattedDetailed,
  };
}

export interface TournamentCountdownProps {
  eventId?: string;
  deadline?: string;
  eventDate?: string;
  spotsLeft?: number;
  status?: string;
  variant?: "badge" | "strip" | "compact" | "banner";
  className?: string;
  showSeconds?: boolean;
}

export function TournamentCountdown({
  eventId,
  deadline,
  eventDate,
  spotsLeft = 10,
  status,
  variant = "strip",
  className,
  showSeconds = true,
}: TournamentCountdownProps) {
  // Initial calculate
  const initial = useMemo(
    () => calculateDeadlineRemaining(eventId, deadline, spotsLeft, status),
    [eventId, deadline, spotsLeft, status],
  );

  const [remainingSec, setRemainingSec] = useState<number>(initial.totalSeconds);

  // Live ticking countdown
  useEffect(() => {
    if (initial.isClosed || initial.totalSeconds <= 0) return;

    setRemainingSec(initial.totalSeconds);

    const interval = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initial.isClosed, initial.totalSeconds]);

  // Derive active status from ticking seconds
  const current = useMemo(() => {
    if (spotsLeft <= 0 || status === "Sold Out" || remainingSec <= 0) {
      return {
        totalSeconds: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isClosed: true,
        isUrgent: false,
        isWarning: false,
        formattedShort: "Closed",
        formattedDetailed: spotsLeft <= 0 ? "Sold Out" : "Registration Closed",
      };
    }

    const days = Math.floor(remainingSec / 86400);
    const hours = Math.floor((remainingSec % 86400) / 3600);
    const minutes = Math.floor((remainingSec % 3600) / 60);
    const seconds = remainingSec % 60;

    const isUrgent = remainingSec < 24 * 3600 || spotsLeft <= 2;
    const isWarning = remainingSec < 3 * 86400 || spotsLeft <= 4;

    let formattedShort = "";
    let formattedDetailed = "";

    if (days > 0) {
      formattedShort = `${days}d ${hours}h`;
      formattedDetailed = showSeconds
        ? `${days}d ${hours}h ${minutes}m ${seconds}s`
        : `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      formattedShort = `${hours}h ${minutes}m`;
      formattedDetailed = `${hours}h ${minutes}m ${seconds}s`;
    } else {
      formattedShort = `${minutes}m ${seconds}s`;
      formattedDetailed = `${minutes}m ${seconds}s`;
    }

    return {
      totalSeconds: remainingSec,
      days,
      hours,
      minutes,
      seconds,
      isClosed: false,
      isUrgent,
      isWarning,
      formattedShort,
      formattedDetailed,
    };
  }, [remainingSec, spotsLeft, status, showSeconds]);

  const deadlineLabel = deadline
    ? `Registration closes: ${deadline}`
    : eventDate
      ? `Registration closes 24h prior to ${eventDate}`
      : "Registration deadline";

  // 1. VARIANT: BADGE (Used overlay on card images or tight metadata badges)
  if (variant === "badge") {
    if (current.isClosed) {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight shadow-xs",
            "bg-rose-950/80 text-rose-200 border border-rose-500/30 backdrop-blur-md",
            className,
          )}
          title={deadlineLabel}
        >
          <Clock className="h-3 w-3 shrink-0" />
          <span>Reg. Closed</span>
        </span>
      );
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight shadow-xs transition-colors",
          current.isUrgent
            ? "bg-amber-500 text-black border border-amber-400 font-extrabold animate-pulse"
            : current.isWarning
              ? "bg-indigo-600/90 text-white border border-indigo-400/30 backdrop-blur-md"
              : "bg-black/75 text-white/90 border border-white/20 backdrop-blur-md",
          className,
        )}
        title={deadlineLabel}
      >
        {current.isUrgent ? (
          <Flame className="h-3 w-3 shrink-0 text-red-900 fill-red-900" />
        ) : (
          <Timer className="h-3 w-3 shrink-0" />
        )}
        <span>Closes in {current.formattedShort}</span>
      </span>
    );
  }

  // 2. VARIANT: COMPACT (Used inside list rows or calendar cards)
  if (variant === "compact") {
    if (current.isClosed) {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500",
            className,
          )}
          title={deadlineLabel}
        >
          <Clock className="h-3 w-3" />
          <span>Reg. Closed</span>
        </span>
      );
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] font-semibold font-mono",
          current.isUrgent
            ? "text-amber-500 font-bold"
            : "text-muted-foreground hover:text-foreground transition-colors",
          className,
        )}
        title={deadlineLabel}
      >
        {current.isUrgent ? (
          <Flame className="h-3 w-3 text-amber-500" />
        ) : (
          <Timer className="h-3 w-3 text-primary" />
        )}
        <span>Closes in {current.formattedShort}</span>
      </span>
    );
  }

  // 3. VARIANT: BANNER (Used inside rules & details modal)
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-xs",
          current.isClosed
            ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
            : current.isUrgent
              ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-medium"
              : "bg-secondary/60 border-border/80 text-foreground",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "grid h-7 w-7 place-items-center rounded-lg shrink-0",
              current.isClosed
                ? "bg-rose-500/20 text-rose-500"
                : current.isUrgent
                  ? "bg-amber-500/20 text-amber-500 animate-pulse"
                  : "bg-primary/10 text-primary",
            )}
          >
            {current.isUrgent ? <Flame className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-bold text-xs">
              {current.isClosed ? "Registration Window Closed" : "Registration Deadline Countdown"}
            </div>
            <div className="text-[11px] text-muted-foreground">{deadlineLabel}</div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={cn(
              "text-xs font-mono font-bold tracking-tight",
              current.isUrgent ? "text-amber-500" : "text-foreground",
            )}
          >
            {current.isClosed ? "CLOSED" : current.formattedDetailed}
          </div>
          {!current.isClosed && (
            <div className="text-[10px] text-muted-foreground">Live countdown</div>
          )}
        </div>
      </div>
    );
  }

  // 4. VARIANT: STRIP (Default card horizontal indicator)
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-[11px] transition-all",
        current.isClosed
          ? "bg-secondary/40 border-border/50 text-muted-foreground"
          : current.isUrgent
            ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            : "bg-secondary/60 border-border/60 text-muted-foreground",
        className,
      )}
      title={deadlineLabel}
    >
      <div className="flex items-center gap-1.5 truncate font-medium">
        {current.isUrgent ? (
          <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0 animate-bounce" />
        ) : (
          <Timer className="h-3.5 w-3.5 text-primary shrink-0" />
        )}
        <span className="truncate">
          {current.isClosed ? "Registration Closed" : "Registration Closes"}
        </span>
      </div>

      <div className="flex items-center gap-1 font-mono font-semibold shrink-0">
        {current.isClosed ? (
          <span className="text-[10px] text-rose-500 font-bold uppercase">Sold Out</span>
        ) : (
          <>
            <span
              className={cn(
                "font-bold",
                current.isUrgent ? "text-amber-600 dark:text-amber-400" : "text-foreground",
              )}
            >
              {current.formattedDetailed}
            </span>
            {current.isUrgent && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

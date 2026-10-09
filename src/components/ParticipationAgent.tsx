import { useMemo, useState } from "react";
import { Bot, CalendarCheck, CheckCircle2, Clock3, FileCheck2, MapPin, Send, ShieldAlert } from "lucide-react";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { useNotifications } from "@/context/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import type { Trial } from "@/data/trials";

const REMINDER_STORAGE_KEY = "khelgrid-participation-reminders-v1";

type ReminderMap = Record<string, string>;

function daysUntil(date: string) {
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return null;
  return Math.ceil((timestamp - Date.now()) / 86400000);
}

function nextAction(trial: Trial) {
  const days = daysUntil(trial.date);
  if (days !== null && days < 0) return { label: "Check if this opportunity was rescheduled", icon: ShieldAlert, tone: "text-amber-600" };
  if (days !== null && days <= 7) return { label: "Confirm details and prepare your kit", icon: CalendarCheck, tone: "text-primary" };
  if (trial.spots <= 30) return { label: "Review eligibility and apply early", icon: Clock3, tone: "text-primary" };
  return { label: "Complete your preparation checklist", icon: FileCheck2, tone: "text-primary" };
}

function readReminders(): ReminderMap {
  try {
    const value = JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function ParticipationAgent() {
  const { savedOpportunities } = useSavedOpportunities();
  const { addNotification } = useNotifications();
  const [reminders, setReminders] = useState<ReminderMap>(() => {
    if (typeof window === "undefined") return {};
    return readReminders();
  });

  const pendingActions = useMemo(() => savedOpportunities.filter((trial) => !reminders[trial.id]).length, [savedOpportunities, reminders]);

  const scheduleCheckIn = (trial: Trial) => {
    const next = { ...reminders, [trial.id]: new Date().toISOString() };
    setReminders(next);
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
    addNotification({
      type: "participation_agent",
      title: `Your next step for ${trial.title}`,
      description: `${nextAction(trial).label}. Check the official organizer notice before you travel or pay.`,
      read: false,
      createdAt: new Date(),
      trialId: trial.id,
    });
    toast.success("Participation check-in added to your alerts.");
  };

  return (
    <Card className="border-primary/30 bg-gradient-card">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 border-b border-border/60">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Participation Agent</h2><Badge className="border-0 bg-primary/15 text-primary">Beta</Badge></div>
            <p className="mt-1 text-sm text-muted-foreground">I check your saved opportunities and turn them into practical next steps.</p>
          </div>
        </div>
        <div className="hidden text-right sm:block"><div className="text-2xl font-bold text-primary">{pendingActions}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">next actions</div></div>
      </CardHeader>
      <CardContent className="pt-5">
        {savedOpportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <MapPin className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Save an opportunity to activate check-ins.</p>
            <p className="mt-1 text-xs text-muted-foreground">The agent can remind you to verify details, prepare documents, and apply before the opportunity becomes easy to miss.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedOpportunities.map((trial) => {
              const action = nextAction(trial);
              const ActionIcon = action.icon;
              const checkedIn = Boolean(reminders[trial.id]);
              return (
                <div key={trial.id} className="rounded-xl border border-border bg-background/45 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-primary/30 text-primary">{trial.sport}</Badge><span className="text-xs text-muted-foreground">{trial.city} · {trial.date}</span></div>
                      <h3 className="mt-2 truncate text-sm font-semibold">{trial.title}</h3>
                      <p className={`mt-1 flex items-center gap-1.5 text-xs ${action.tone}`}><ActionIcon className="h-3.5 w-3.5" />{action.label}</p>
                    </div>
                    <Button onClick={() => scheduleCheckIn(trial)} disabled={checkedIn} size="sm" variant={checkedIn ? "secondary" : "default"} className="shrink-0 gap-2">{checkedIn ? <><CheckCircle2 className="h-4 w-4" /> Check-in added</> : <><Send className="h-4 w-4" /> Check in with me</>}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Check-ins are saved in this browser during the beta. The agent never guarantees selection and always points you back to the organizer&apos;s official details.</p>
      </CardContent>
    </Card>
  );
}

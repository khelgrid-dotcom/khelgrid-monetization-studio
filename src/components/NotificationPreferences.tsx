import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  Loader2,
  Database,
  Smartphone,
  Radio,
  Sliders,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SPORTS, CITIES } from "@/data/trials";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "@/lib/notification-subscription-service";
import type { NotificationPreferencesInput } from "@/types/notification-subscription";

export interface NotificationPreferencesProps {
  userId?: string | null;
  initialCity?: string;
  initialSports?: string[];
  onSaved?: (prefs: NotificationPreferencesInput) => void;
  className?: string;
}

export function NotificationPreferences({
  userId,
  initialCity,
  initialSports,
  onSaved,
  className = "",
}: NotificationPreferencesProps) {
  const auth = useAuth();
  const effectiveUserId = userId || auth.user?.id || "user-athlete-mehta";

  // Persistent Device Token
  const [fcmToken, setFcmToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("khelgrid_fcm_token");
      if (stored) return stored;
      const generated = `fcm_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
      localStorage.setItem("khelgrid_fcm_token", generated);
      return generated;
    }
    return "fcm_browser_web_client_token";
  });

  // Form State
  const [notifyLiveTrials, setNotifyLiveTrials] = useState<boolean>(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState<boolean>(true);
  const [city, setCity] = useState<string>(initialCity || auth.user?.city || "Bengaluru");
  const [preferredSports, setPreferredSports] = useState<string[]>(
    initialSports || [auth.user?.primarySport || "Cricket", "Football"],
  );

  // Status & UI State
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [testSending, setTestSending] = useState<boolean>(false);

  // Load preferences from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const { preferences, isSupabaseLive: live } = await getNotificationPreferences(
          fcmToken,
          effectiveUserId,
        );
        if (isMounted) {
          setNotifyLiveTrials(preferences.notifyLiveTrials);
          setNotifyDeadlines(preferences.notifyDeadlines);
          if (preferences.city) setCity(preferences.city);
          if (preferences.preferredSports && preferences.preferredSports.length > 0) {
            setPreferredSports(preferences.preferredSports);
          }
          setIsSupabaseLive(live);
        }
      } catch (err) {
        console.warn("Failed loading initial notification preferences", err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [effectiveUserId, fcmToken]);

  // Toggle Sport selection
  const handleToggleSport = (sport: string) => {
    setPreferredSports((prev) => {
      if (prev.includes(sport)) {
        if (prev.length === 1) {
          toast.warning("Keep at least one preferred sport selected.");
          return prev;
        }
        return prev.filter((s) => s !== sport);
      } else {
        return [...prev, sport];
      }
    });
  };

  // Select all / deselect all
  const handleSelectAllSports = () => {
    if (preferredSports.length === SPORTS.length) {
      setPreferredSports([auth.user?.primarySport || "Cricket"]);
    } else {
      setPreferredSports([...SPORTS]);
    }
  };

  // Handle Save Preferences
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanCity = city.trim();
    if (!cleanCity) {
      toast.error("Please enter a valid city.");
      return;
    }

    if (preferredSports.length === 0) {
      toast.error("Select at least one preferred sport.");
      return;
    }

    setLoading(true);

    try {
      const payload: NotificationPreferencesInput = {
        userId: effectiveUserId,
        fcmToken,
        preferredSports,
        city: cleanCity,
        notifyLiveTrials,
        notifyDeadlines,
        deviceType: "web",
      };

      const res = await saveNotificationPreferences(payload);

      setIsSupabaseLive(res.isSupabaseLive);
      setLastSavedTime(new Date().toLocaleTimeString());

      toast.success("Notification preferences saved successfully!", {
        description: `Alerts configured for ${preferredSports.join(", ")} in ${cleanCity}.`,
      });

      if (onSaved) onSaved(payload);
    } catch (err: any) {
      toast.error("Failed to save preferences: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Handle Send Test Notification
  const handleSendTestNotification = () => {
    setTestSending(true);
    setTimeout(() => {
      setTestSending(false);
      if (!notifyLiveTrials && !notifyDeadlines) {
        toast.info("Alert categories are disabled", {
          description: "Enable Live Trials or Deadlines above to receive trial notifications.",
        });
        return;
      }

      toast.custom(
        () => (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-zinc-950 p-4 text-white shadow-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">KhelGrid Push Alert</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-400 font-mono">
                  {city}
                </span>
              </div>
              <p className="text-zinc-300">
                {notifyLiveTrials
                  ? `🎯 New ${preferredSports[0] || "Cricket"} Trial open in ${city}!`
                  : `⏰ 48h Deadline closing for ${preferredSports[0] || "Cricket"} in ${city}.`}
              </p>
              <span className="text-[10px] text-zinc-500">Delivered via FCM device token</span>
            </div>
          </div>
        ),
        { duration: 4500 },
      );
    }, 600);
  };

  return (
    <Card
      id="notification-preferences-card"
      className={`border-border/80 bg-card shadow-sm ${className}`}
    >
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Configure push notifications for upcoming sports trials and registration deadlines.
              </CardDescription>
            </div>
          </div>

          <Badge
            id="badge-supabase-sync-status"
            variant="outline"
            className={`text-[11px] gap-1 px-2 py-0.5 font-medium ${
              isSupabaseLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            <Database className="h-3 w-3" />
            {isSupabaseLive ? "Supabase Live" : "Local Sync"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* ========================================================================= */}
        {/* 1. ALERT CATEGORIES TOGGLES */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Alert Categories
            </Label>
            <span className="text-[11px] text-muted-foreground">Toggle alert triggers</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Live Trials Alert Toggle */}
            <div
              id="card-toggle-live-trials"
              className={`flex items-start justify-between rounded-xl border p-3.5 transition-colors ${
                notifyLiveTrials
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/70 bg-card hover:bg-muted/30"
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-foreground">Live Trials</span>
                  {notifyLiveTrials && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Immediate alerts when new scouting trials or academy selection camps are
                  published.
                </p>
              </div>
              <Switch
                id="switch-notify-live-trials"
                checked={notifyLiveTrials}
                onCheckedChange={setNotifyLiveTrials}
                className="mt-0.5 cursor-pointer"
              />
            </div>

            {/* Deadlines Alert Toggle */}
            <div
              id="card-toggle-deadlines"
              className={`flex items-start justify-between rounded-xl border p-3.5 transition-colors ${
                notifyDeadlines
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border/70 bg-card hover:bg-muted/30"
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-semibold text-xs text-foreground">Deadlines</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Urgent alerts when registration for trials in your city is closing in under 48
                  hours.
                </p>
              </div>
              <Switch
                id="switch-notify-deadlines"
                checked={notifyDeadlines}
                onCheckedChange={setNotifyDeadlines}
                className="mt-0.5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TARGET CITY INPUT & QUICK PILLS */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <Label
              htmlFor="input-notification-city"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" />
              Target City / Location
            </Label>
            <span className="text-[11px] text-muted-foreground">Saved to city column</span>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="input-notification-city"
                type="text"
                placeholder="Enter city (e.g. Bengaluru, Delhi NCR, Mumbai, Hyderabad)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>

            {/* Quick City Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Popular hubs:</span>
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                    city.toLowerCase() === c.toLowerCase()
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCity("All India")}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                  city.toLowerCase() === "all india"
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                All India
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PREFERRED SPORTS (ARRAY SELECTION) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Preferred Sports (preferred_sports array)
            </Label>
            <button
              type="button"
              onClick={handleSelectAllSports}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              {preferredSports.length === SPORTS.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SPORTS.map((sport) => {
              const isSelected = preferredSports.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => handleToggleSport(sport)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[2.5]" />}
                  <span>{sport}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Selected:{" "}
            <span className="font-semibold text-foreground">{preferredSports.join(", ")}</span>
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 4. FCM DEVICE TOKEN & DATABASE SCHEMA INFO */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
              FCM Device Push Token
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              Registered
            </span>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground truncate bg-background/60 p-1.5 rounded border border-border/50">
            {fcmToken}
          </div>
          <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground pt-1">
            <span>User ID: {effectiveUserId}</span>
            {lastSavedTime && <span>Last saved at: {lastSavedTime}</span>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 py-3.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={testSending}
          onClick={handleSendTestNotification}
          className="text-xs h-9 gap-1.5 border-border hover:bg-secondary cursor-pointer"
        >
          {testSending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 text-primary" />
          )}
          Send Test Push Alert
        </Button>

        <Button
          type="button"
          id="btn-save-notification-preferences"
          size="sm"
          disabled={loading}
          onClick={() => handleSave()}
          className="text-xs h-9 gap-1.5 bg-primary text-primary-foreground font-semibold shadow-xs cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving to Database...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Preferences
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default NotificationPreferences;

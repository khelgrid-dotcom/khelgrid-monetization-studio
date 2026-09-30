import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Clock,
  Radio,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Send,
  Sliders,
  MapPin,
  ExternalLink,
  Sparkles,
  Database,
  Filter,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  getAlertHistory,
  saveAlertHistory,
  markAllAlertsAsRead,
  markAlertAsRead,
  clearAlertHistory,
  addAlertToHistory,
  DEFAULT_ALERT_HISTORY,
  type AlertHistoryItem,
} from "@/lib/alert-history-service";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/notification-subscription-service";
import { CITIES, SPORTS } from "@/data/trials";

export interface NotificationsDashboardTabProps {
  className?: string;
}

export function NotificationsDashboardTab({ className = "" }: NotificationsDashboardTabProps) {
  const auth = useAuth();
  const effectiveUserId = auth.user?.id || "user-athlete-mehta";

  // Persistent Device Token
  const [fcmToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("khelgrid_fcm_token");
      if (stored) return stored;
      const generated = `fcm_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
      localStorage.setItem("khelgrid_fcm_token", generated);
      return generated;
    }
    return "fcm_browser_web_client_token";
  });

  // Alert categories real-time state
  const [notifyLiveTrials, setNotifyLiveTrials] = useState<boolean>(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState<boolean>(true);
  const [targetCity, setTargetCity] = useState<string>(auth.user?.city || "Bengaluru");
  const [preferredSports, setPreferredSports] = useState<string[]>([
    auth.user?.primarySport || "Cricket",
    "Football",
  ]);

  // Alert history state
  const [alerts, setAlerts] = useState<AlertHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("khelgrid_alert_history_v1");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return DEFAULT_ALERT_HISTORY;
  });
  const [filterCategory, setFilterCategory] = useState<
    "all" | "live_trials" | "deadlines" | "unread"
  >("all");
  const [isRealtimeSyncing, setIsRealtimeSyncing] = useState<boolean>(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<string>("Synced in real-time");

  // Load preferences and alert history on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [prefRes, histRes] = await Promise.all([
          getNotificationPreferences(fcmToken, effectiveUserId),
          getAlertHistory(effectiveUserId),
        ]);

        if (isMounted) {
          setNotifyLiveTrials(prefRes.preferences.notifyLiveTrials);
          setNotifyDeadlines(prefRes.preferences.notifyDeadlines);
          if (prefRes.preferences.city) setTargetCity(prefRes.preferences.city);
          if (prefRes.preferences.preferredSports?.length) {
            setPreferredSports(prefRes.preferences.preferredSports);
          }
          setAlerts(histRes.alerts);
          setIsSupabaseLive(prefRes.isSupabaseLive || histRes.isSupabaseLive);
        }
      } catch (err) {
        console.warn("Failed loading notification dashboard data", err);
      }
    }

    loadData();

    // Listen for real-time history updates across tabs
    const handleHistoryChanged = (e: Event) => {
      const custom = e as CustomEvent<AlertHistoryItem[]>;
      if (custom.detail) {
        setAlerts(custom.detail);
      }
    };
    window.addEventListener("khelgrid_alert_history_changed", handleHistoryChanged);
    return () => {
      isMounted = false;
      window.removeEventListener("khelgrid_alert_history_changed", handleHistoryChanged);
    };
  }, [effectiveUserId, fcmToken]);

  // Real-time Category Toggle: Live Trials
  const handleToggleLiveTrials = async (checked: boolean) => {
    setNotifyLiveTrials(checked);
    setIsRealtimeSyncing(true);
    setLastSyncStatus("Saving changes...");

    try {
      const res = await saveNotificationPreferences({
        userId: effectiveUserId,
        fcmToken,
        preferredSports,
        city: targetCity,
        notifyLiveTrials: checked,
        notifyDeadlines,
        deviceType: "web",
      });

      setIsSupabaseLive(res.isSupabaseLive);
      setLastSyncStatus(
        `Live Trials alerts ${checked ? "enabled" : "disabled"} (real-time synced)`,
      );
      toast.success(
        checked
          ? "Live Trials alerts turned ON in real-time."
          : "Live Trials alerts paused in real-time.",
        {
          description: "Database preferences updated instantly.",
        },
      );
    } catch {
      toast.error("Failed to sync preference to database.");
      setLastSyncStatus("Sync failed");
    } finally {
      setIsRealtimeSyncing(false);
    }
  };

  // Real-time Category Toggle: Deadlines
  const handleToggleDeadlines = async (checked: boolean) => {
    setNotifyDeadlines(checked);
    setIsRealtimeSyncing(true);
    setLastSyncStatus("Saving changes...");

    try {
      const res = await saveNotificationPreferences({
        userId: effectiveUserId,
        fcmToken,
        preferredSports,
        city: targetCity,
        notifyLiveTrials,
        notifyDeadlines: checked,
        deviceType: "web",
      });

      setIsSupabaseLive(res.isSupabaseLive);
      setLastSyncStatus(`Deadlines alerts ${checked ? "enabled" : "disabled"} (real-time synced)`);
      toast.success(
        checked
          ? "Deadlines warnings turned ON in real-time."
          : "Deadlines warnings paused in real-time.",
        {
          description: "Database preferences updated instantly.",
        },
      );
    } catch {
      toast.error("Failed to sync preference to database.");
      setLastSyncStatus("Sync failed");
    } finally {
      setIsRealtimeSyncing(false);
    }
  };

  // Real-time City change
  const handleCityChange = async (newCity: string) => {
    setTargetCity(newCity);
    setIsRealtimeSyncing(true);
    try {
      const res = await saveNotificationPreferences({
        userId: effectiveUserId,
        fcmToken,
        preferredSports,
        city: newCity,
        notifyLiveTrials,
        notifyDeadlines,
        deviceType: "web",
      });
      setIsSupabaseLive(res.isSupabaseLive);
      setLastSyncStatus(`Target city updated to ${newCity}`);
      toast.success(`Target city set to ${newCity} in real-time.`);
    } catch {
      toast.error("Failed to update target city");
    } finally {
      setIsRealtimeSyncing(false);
    }
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    const updated = markAllAlertsAsRead();
    setAlerts(updated);
    toast.info("All notifications marked as read.");
  };

  // Mark single alert as read
  const handleMarkSingleRead = (id: string) => {
    const updated = markAlertAsRead(id);
    setAlerts(updated);
  };

  // Clear all history
  const handleClearHistory = () => {
    const updated = clearAlertHistory();
    setAlerts(updated);
    toast.info("Notification history cleared.");
  };

  // Simulate receiving a live alert in real-time
  const handleSimulateIncomingAlert = (type: "live_trials" | "deadlines") => {
    const isTrial = type === "live_trials";
    const sampleSport = preferredSports[0] || "Cricket";
    const newAlert = addAlertToHistory({
      category: type,
      title: isTrial
        ? `🎯 New ${sampleSport} Trial: State Selection Screening in ${targetCity}`
        : `⏰ 24 Hours Left: Registration closing for ${sampleSport} trials in ${targetCity}`,
      message: isTrial
        ? `A new official scout screening camp was just published for ${targetCity}. 45 open spots available.`
        : `Final notice: Online portal for ${sampleSport} trials closes tonight at 11:59 PM.`,
      sport: sampleSport,
      city: targetCity,
      isRead: false,
      actionUrl: "/trials",
    });

    setAlerts((prev) => [newAlert, ...prev]);

    toast.custom(
      () => (
        <div className="flex items-start gap-3 rounded-xl border border-primary/40 bg-zinc-950 p-4 text-white shadow-2xl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
            {isTrial ? (
              <Radio className="h-5 w-5 animate-pulse" />
            ) : (
              <Clock className="h-5 w-5 animate-spin" />
            )}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Real-Time Alert Received</span>
              <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[10px] text-primary font-mono">
                {targetCity}
              </span>
            </div>
            <p className="text-zinc-300 font-medium">{newAlert.title}</p>
            <span className="text-[10px] text-zinc-500">Recorded in alerts history</span>
          </div>
        </div>
      ),
      { duration: 4000 },
    );
  };

  // Format relative timestamp
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recent";
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterCategory === "live_trials") return alert.category === "live_trials";
    if (filterCategory === "deadlines") return alert.category === "deadlines";
    if (filterCategory === "unread") return !alert.isRead;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div id="notifications-dashboard-tab" className={`space-y-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. HEADER & REAL-TIME STATUS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Alerts &amp; Notifications Center
              </h2>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground font-semibold text-xs px-2">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Review received alerts and manage Live Trials and Deadline preferences in real-time.
            </p>
          </div>
        </div>

        {/* Real-time Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span>Real-Time Sync Active</span>
          </div>

          <Badge variant="outline" className="text-[11px] border-border text-muted-foreground">
            <Database className="h-3 w-3 mr-1" />
            {isSupabaseLive ? "Supabase Live" : "Local Sync"}
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME ALERT CATEGORIES MANAGER CARD */}
      {/* ========================================================================= */}
      <Card id="card-alert-categories-manager" className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Manage Alert Categories (Real-Time)
              </CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              {isRealtimeSyncing ? "Saving..." : lastSyncStatus}
            </span>
          </div>
          <CardDescription className="text-xs">
            Toggles instantly update the{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-primary font-mono text-[11px]">
              notification_subscriptions
            </code>{" "}
            table in Supabase.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Switches Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Live Trials Toggle */}
            <div
              id="category-toggle-live-trials"
              className={`flex items-start justify-between rounded-xl border p-4 transition-all ${
                notifyLiveTrials
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                  : "border-border/70 bg-card/60 opacity-80"
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-semibold text-xs text-foreground">Live Trials Alerts</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      notifyLiveTrials
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notifyLiveTrials ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Real-time push alerts the moment new sports trials, academy screenings, or scout
                  dates are announced.
                </p>
              </div>

              <Switch
                id="switch-dashboard-live-trials"
                checked={notifyLiveTrials}
                onCheckedChange={handleToggleLiveTrials}
                className="mt-1 cursor-pointer"
              />
            </div>

            {/* Deadlines Toggle */}
            <div
              id="category-toggle-deadlines"
              className={`flex items-start justify-between rounded-xl border p-4 transition-all ${
                notifyDeadlines
                  ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                  : "border-border/70 bg-card/60 opacity-80"
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-semibold text-xs text-foreground">
                    Deadlines Urgency Alerts
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      notifyDeadlines
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notifyDeadlines ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Urgent alerts when registration for trials in {targetCity} closes within 48 hours
                  to prevent missed opportunities.
                </p>
              </div>

              <Switch
                id="switch-dashboard-deadlines"
                checked={notifyDeadlines}
                onCheckedChange={handleToggleDeadlines}
                className="mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Location & Sports Preference Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3.5 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Target City:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CITIES.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCityChange(c)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                      targetCity.toLowerCase() === c.toLowerCase()
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Test alert simulators */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[11px]">Test trigger:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSimulateIncomingAlert("live_trials")}
                className="h-7 text-[11px] px-2 gap-1 border-border"
              >
                <Radio className="h-3 w-3 text-emerald-500" />
                Live Trial
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSimulateIncomingAlert("deadlines")}
                className="h-7 text-[11px] px-2 gap-1 border-border"
              >
                <Clock className="h-3 w-3 text-amber-500" />
                Deadline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 3. ALERT HISTORY RECEIVED FEED */}
      {/* ========================================================================= */}
      <div id="section-alert-history-feed" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              History of Alerts Received ({alerts.length})
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="flex items-center rounded-lg border border-border/80 bg-secondary/30 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterCategory("all")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterCategory === "all"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory("live_trials")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterCategory === "live_trials"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Trials
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory("deadlines")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterCategory === "deadlines"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Deadlines
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory("unread")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterCategory === "unread"
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Actions: Mark read / Clear */}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5 text-primary" />
                Mark all read
              </Button>
            )}

            {alerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Alert Cards List */}
        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-border/80">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
              <Bell className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-sm text-foreground">No alerts matching filter</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You haven&apos;t received alerts for this category yet. When new trials or deadlines
              arrive in {targetCity}, they will appear here.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSimulateIncomingAlert("live_trials")}
                className="text-xs h-8"
              >
                Simulate Live Trial Alert
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`relative rounded-xl border p-4 transition-all ${
                  alert.isRead
                    ? "border-border/70 bg-card/60"
                    : "border-primary/40 bg-primary/5 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        alert.category === "live_trials"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {alert.category === "live_trials" ? (
                        <Radio className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{alert.title}</span>
                        {!alert.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            alert.category === "live_trials"
                              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                              : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                          }`}
                        >
                          {alert.category === "live_trials" ? "Live Trial" : "Deadline 48h"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-primary" /> {alert.sport}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {alert.city}
                        </span>
                        <span>· {formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Card Action */}
                  <div className="flex shrink-0 items-center gap-2">
                    {!alert.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkSingleRead(alert.id)}
                        title="Mark as read"
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1 text-primary hover:text-primary"
                    >
                      <Link to={alert.actionUrl || "/trials"}>
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsDashboardTab;

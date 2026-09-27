import React, { useState } from "react";
import { Mail, Bell, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SPORTS, CITIES } from "@/data/trials";

export interface TrialNewsletterSignupProps {
  defaultSport?: string;
  defaultCity?: string;
  variant?: "card" | "compact" | "banner";
  className?: string;
  title?: string;
  subtitle?: string;
}

export interface NewsletterSubscription {
  email: string;
  sport: string;
  city: string;
  subscribedAt: string;
}

const STORAGE_KEY = "khelgrid_newsletter_subscriptions";

export function getStoredSubscriptions(): NewsletterSubscription[] {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch {
    return [];
  }
}

export function saveSubscription(sub: NewsletterSubscription): void {
  try {
    if (typeof localStorage !== "undefined") {
      const current = getStoredSubscriptions();
      const updated = [
        sub,
        ...current.filter((s) => s.email.toLowerCase() !== sub.email.toLowerCase()),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore local storage limits
  }
}

export function TrialNewsletterSignup({
  defaultSport = "All Sports",
  defaultCity = "All Locations",
  variant = "card",
  className = "",
  title,
  subtitle,
}: TrialNewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [selectedSport, setSelectedSport] = useState(defaultSport);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    // Standard email validation
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address", {
        description: "We will send trial notification alerts to this inbox.",
      });
      return;
    }

    setLoading(true);

    // Simulate instant secure registration & store locally
    setTimeout(() => {
      const newSub: NewsletterSubscription = {
        email: trimmed,
        sport: selectedSport,
        city: selectedCity,
        subscribedAt: new Date().toISOString(),
      };
      saveSubscription(newSub);
      setLoading(false);
      setIsSubscribed(true);
      toast.success("Subscribed to Trial Alerts!", {
        description: `You'll get email updates when new ${
          selectedSport === "All Sports" ? "sports" : selectedSport
        } trials are posted${selectedCity !== "All Locations" ? ` in ${selectedCity}` : ""}.`,
      });
    }, 600);
  };

  if (isSubscribed) {
    return (
      <div
        className={`rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center ${className}`}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground">
          You&apos;re on the priority notification list!
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
          We&apos;ve registered <span className="font-semibold text-foreground">{email}</span> for
          automatic alerts whenever new{" "}
          {selectedSport === "All Sports" ? "sports trials" : `${selectedSport} trials`} are
          verified and published.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubscribed(false);
            setEmail("");
          }}
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          Subscribe another email or change preferences →
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for trial alerts..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="h-10 text-xs font-semibold shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
          ) : (
            <Bell className="h-3.5 w-3.5 mr-1" />
          )}
          Notify Me
        </Button>
      </form>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 shadow-sm ${className}`}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Bell className="h-3.5 w-3.5" />
              Automatic Trial Notifications
            </div>
            <h3 className="mt-2.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title || "Never Miss a Sports Trial or Selection Camp"}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {subtitle ||
                "Get instant email alerts as soon as official national federations, SAI centers, and accredited academies announce new trials, recruitment combines, and sports scholarships."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Verified announcements only
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Zero spam · 1-click unsubscribe
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Filter by your sport & city
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:max-w-md rounded-2xl border border-border/80 bg-background/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm space-y-3"
          >
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Set Your Alert Preferences</span>
              <span className="text-[10px] text-muted-foreground">Free Service</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="All Sports">All Sports</option>
                  {SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="All Locations">All of India</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 text-xs font-bold gap-2 bg-primary text-primary-foreground shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Activating Alerts...
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  Get Automatic Trial Alerts
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground pt-1">
              By subscribing, you agree to receive trial alert notifications. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TrialNewsletterSignup;

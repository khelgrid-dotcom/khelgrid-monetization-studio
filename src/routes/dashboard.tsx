import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, ProtectedRoute } from "@/hooks/use-auth";
import { TRIALS } from "@/data/trials";
import { SportsCV } from "@/components/SportsCV";
import { DashboardCommunityWall } from "@/components/DashboardCommunityWall";
import { DashboardProgressShare } from "@/components/DashboardProgressShare";
import { OpportunityInterviewAgent } from "@/components/OpportunityInterviewAgent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Plus,
  Crown,
  Trophy,
  RotateCcw,
  Calendar,
  CheckCircle2,
  User,
  Wand2,
  Bell,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { getVenueBookings, type BookingRecord } from "@/lib/booking-service";
import { UserProfile } from "@/components/UserProfile";
import { NotificationsDashboardTab } from "@/components/NotificationsDashboardTab";
import { TrialsDiscoveryDashboard } from "@/components/TrialsDiscoveryDashboard";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    buildSeoHead({
      title: "Athlete Dashboard & Application Tracker · KhelGrid",
      description:
        "Manage your sports trial applications, venue bookings, verified sports CV, and athletic profile on KhelGrid.",
      canonicalPath: "/dashboard",
      noindex: true,
      type: "website",
    }),
  component: Dashboard,
});

function Dashboard() {
  const {
    name,
    wallet,
    plan,
    applications,
    paidApplications,
    topUpWallet,
    freeLimit,
    remainingFree,
    reset,
    upgradeToPro,
  } = useAuth();
  const applied = TRIALS.filter((t) => applications.includes(t.id));
  const [venueBookings, setVenueBookings] = useState<BookingRecord[]>([]);
  const [activeDashboardTab, setActiveDashboardTab] = useState<
    "overview" | "trials" | "notifications" | "applications" | "bookings" | "profile"
  >("overview");

  useEffect(() => {
    getVenueBookings()
      .then(setVenueBookings)
      .catch(() => {});
    const handler = () => {
      getVenueBookings()
        .then(setVenueBookings)
        .catch(() => {});
    };
    window.addEventListener("khelgrid_booking_created", handler);
    return () => window.removeEventListener("khelgrid_booking_created", handler);
  }, []);

  return (
    <ProtectedRoute message="Sign in to access your athlete control room and manage applications.">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground">Your athlete control room.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary text-primary-foreground font-semibold">
              <Link to="/onboarding">
                <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Sports CV Wizard
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">
                <User className="mr-1 h-3.5 w-3.5" /> Full Profile
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                toast.success("Simulator reset");
              }}
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset simulator
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs Bar */}
        <div
          id="dashboard-navigation-tabs"
          className="mt-6 flex items-center gap-2 overflow-x-auto border-b border-border/80 pb-3"
        >
          <button
            id="tab-btn-overview"
            type="button"
            onClick={() => setActiveDashboardTab("overview")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "overview"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </button>

          <button
            id="tab-btn-trials-discovery"
            type="button"
            onClick={() => setActiveDashboardTab("trials")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "trials"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Trials Discovery</span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${
                activeDashboardTab === "trials"
                  ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              }`}
            >
              Supabase
            </Badge>
          </button>

          <button
            id="tab-btn-notifications"
            type="button"
            onClick={() => setActiveDashboardTab("notifications")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "notifications"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                activeDashboardTab === "notifications"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              Real-Time
            </span>
          </button>

          <button
            id="tab-btn-applications"
            type="button"
            onClick={() => setActiveDashboardTab("applications")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "applications"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            id="tab-btn-bookings"
            type="button"
            onClick={() => setActiveDashboardTab("bookings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "bookings"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Bookings ({venueBookings.length})</span>
          </button>

          <button
            id="tab-btn-profile"
            type="button"
            onClick={() => setActiveDashboardTab("profile")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              activeDashboardTab === "profile"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Athlete Profile</span>
          </button>
        </div>

        {/* ======================================================================= */}
        {/* TAB: TRIALS DISCOVERY (SUPABASE CLIENT GRID VIEW) */}
        {/* ======================================================================= */}
        {activeDashboardTab === "trials" && (
          <div id="dashboard-tab-content-trials-discovery" className="mt-6">
            <TrialsDiscoveryDashboard />
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 1: NOTIFICATIONS DASHBOARD TAB */}
        {/* ======================================================================= */}
        {activeDashboardTab === "notifications" && (
          <div id="dashboard-tab-content-notifications" className="mt-6">
            <NotificationsDashboardTab />
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: OVERVIEW */}
        {/* ======================================================================= */}
        {activeDashboardTab === "overview" && (
          <>
            {/* Onboarding Wizard Callout */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/25 bg-primary/5 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">
                    Set Up Your Sports CV & Connect Social Media Handles
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Launch the guided 6-step wizard to calibrate athletic benchmarks, tournament
                    medals, and connect your Instagram & YouTube highlight reels for recruiters.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="shrink-0 gap-1.5 bg-primary text-primary-foreground font-semibold"
              >
                <Link to="/onboarding">
                  <Wand2 className="h-3.5 w-3.5" /> Launch Wizard →
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-gradient-card p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Wallet balance</span>
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">₹{wallet.toLocaleString("en-IN")}</div>
                <Button
                  onClick={() => {
                    topUpWallet(500);
                    toast.success("₹500 added to wallet");
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Top up ₹500
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-card p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Applications</span>
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">{applications.length}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {plan === "pro"
                    ? "Unlimited on Pro"
                    : `${remainingFree} / ${freeLimit} free remaining · ${paidApplications.length} paid`}
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 ${plan === "pro" ? "border-primary/40 bg-gradient-hero text-primary-foreground" : "border-border bg-gradient-card"}`}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-wider opacity-80">
                  <span>Plan</span>
                  <Crown className="h-4 w-4" />
                </div>
                <div className="mt-2 text-3xl font-bold capitalize">
                  {plan === "pro" ? "Pro" : "Free"}
                </div>
                {plan === "free" ? (
                  <Button
                    onClick={() => {
                      upgradeToPro();
                      toast.success("Welcome to Pro 🎉");
                    }}
                    size="sm"
                    className="mt-3 bg-gradient-gold text-primary-foreground hover:opacity-90"
                  >
                    Upgrade · ₹499/mo
                  </Button>
                ) : (
                  <Badge className="mt-3 bg-black/30 border-0 text-white">Renews monthly</Badge>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="mb-3 text-lg font-semibold">My applications</h2>
                {applied.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No applications yet.{" "}
                    <Link to="/trials" className="text-primary underline-offset-4 hover:underline">
                      Browse live trials →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applied.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-gradient-card p-4"
                      >
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.academy} · {t.city} · {t.date}
                          </div>
                        </div>
                        {paidApplications.includes(t.id) ? (
                          <Badge className="bg-gradient-gold text-primary-foreground border-0">
                            Paid · ₹49
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <OpportunityInterviewAgent opportunities={TRIALS} />
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold">Verified Sports CV</h2>
                <SportsCV />
              </div>
            </div>

            {/* My Venue Bookings Section */}
            <div className="mt-8 rounded-2xl border border-border bg-gradient-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> My Venue Bookings
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Turfs, courts and grounds booked by you
                  </p>
                </div>
                <Link to="/book" className="text-xs font-semibold text-primary hover:underline">
                  Book another venue →
                </Link>
              </div>

              {venueBookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                  No venue bookings recorded yet.{" "}
                  <Link to="/book" className="text-primary underline font-medium">
                    Explore available turfs and courts
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {venueBookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-border/70 bg-background/60 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            Ref: {b.id.slice(-8)}
                          </span>
                          <div className="font-bold text-sm text-foreground">{b.venue_name}</div>
                          <div className="text-muted-foreground">
                            {b.venue_area}, {b.venue_city}
                          </div>
                        </div>
                        <Badge
                          variant={b.status === "cancelled" ? "outline" : "default"}
                          className={
                            b.status === "confirmed"
                              ? "bg-emerald-500/90 text-white"
                              : b.status === "cancelled"
                                ? "border-destructive text-destructive"
                                : ""
                          }
                        >
                          {b.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <span>
                          {b.booking_date} · {b.start_time}
                        </span>
                        <span className="font-bold text-primary">₹{b.total_price}</span>
                      </div>
                      {b.synced_to_db && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified Booking
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Athlete Profile & Sports Achievements Section */}
            <div className="mt-10">
              <UserProfile />
            </div>

            <DashboardProgressShare name={name} />
            <DashboardCommunityWall />
          </>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: APPLICATIONS */}
        {/* ======================================================================= */}
        {activeDashboardTab === "applications" && (
          <div id="dashboard-tab-content-applications" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  My Trial Applications ({applied.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Official screening registration and trial statuses
                </p>
              </div>
              <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
                <Link to="/trials">Browse Live Trials →</Link>
              </Button>
            </div>

            {applied.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No applications yet.{" "}
                <Link
                  to="/trials"
                  className="text-primary underline-offset-4 hover:underline font-semibold"
                >
                  Browse live trials →
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {applied.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-foreground">{t.title}</span>
                        {paidApplications.includes(t.id) ? (
                          <Badge className="bg-gradient-gold text-primary-foreground border-0 text-[10px]">
                            Paid · ₹49
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Free
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t.academy} · {t.city} · {t.date}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <span className="text-emerald-600 font-medium">Status: Registered</span>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary"
                      >
                        <Link to="/trials">View Details →</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <OpportunityInterviewAgent opportunities={TRIALS} />
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: VENUE BOOKINGS */}
        {/* ======================================================================= */}
        {activeDashboardTab === "bookings" && (
          <div id="dashboard-tab-content-bookings" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> My Venue Bookings (
                  {venueBookings.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Turfs, indoor arenas, courts, and swimming complexes reserved
                </p>
              </div>
              <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
                <Link to="/book">Book New Venue →</Link>
              </Button>
            </div>

            {venueBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No venue bookings recorded yet.{" "}
                <Link to="/book" className="text-primary underline font-semibold">
                  Explore available turfs and courts
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {venueBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Ref: {b.id.slice(-8)}
                        </span>
                        <div className="font-bold text-sm text-foreground">{b.venue_name}</div>
                        <div className="text-muted-foreground">
                          {b.venue_area}, {b.venue_city}
                        </div>
                      </div>
                      <Badge
                        variant={b.status === "cancelled" ? "outline" : "default"}
                        className={
                          b.status === "confirmed"
                            ? "bg-emerald-500 text-white"
                            : b.status === "cancelled"
                              ? "border-destructive text-destructive"
                              : ""
                        }
                      >
                        {b.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span>
                        {b.booking_date} · {b.start_time}
                      </span>
                      <span className="font-bold text-primary">₹{b.total_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: PROFILE & ACHIEVEMENTS */}
        {/* ======================================================================= */}
        {activeDashboardTab === "profile" && (
          <div id="dashboard-tab-content-profile" className="mt-6">
            <UserProfile />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

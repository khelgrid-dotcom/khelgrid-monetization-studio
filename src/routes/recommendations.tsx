import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Bell, Save, Bot, CheckCheck, Trash2, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrialCard } from "@/components/TrialCard";
import { mockSavedSearches } from "@/data/recommendations";
import { useNotifications } from "@/context/NotificationContext";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { useAuth } from "@/context/AuthContext";
import { ParticipationAgent } from "@/components/ParticipationAgent";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Your Opportunities · KhelGrid" },
      {
        name: "description",
        content: "Review saved opportunities, alerts and participation check-ins.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const { savedOpportunities, savedIds } = useSavedOpportunities();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<"agent" | "for-you" | "saved" | "alerts">("agent");

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Opportunities</h1>
          <p className="text-slate-600">
            Personalized trials and events tailored to your interests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto border-b border-slate-200">
          <button
            onClick={() => setActiveTab("agent")}
            className={`whitespace-nowrap px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "agent"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bot className="inline mr-2 h-4 w-4" />
            Participation Agent
          </button>
          <button
            onClick={() => setActiveTab("for-you")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "for-you"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Heart className="inline mr-2 h-4 w-4" />
            For You
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`whitespace-nowrap px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "saved"
                ? "border-rose-600 text-rose-600 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Heart
              className={`inline mr-2 h-4 w-4 ${savedIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}`}
            />
            Saved Favorites ({savedOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-3 font-medium border-b-2 transition relative ${
              activeTab === "alerts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="inline mr-2 h-4 w-4" />
            Alerts
            {unreadNotifications.length > 0 && (
              <span className="absolute top-2 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Participation Agent Tab */}
        {activeTab === "agent" && <ParticipationAgent />}

        {/* For You Tab */}
        {activeTab === "for-you" && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-l-4 border-l-blue-600 hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {i === 1
                            ? "Elite Cricket Academy Trial"
                            : i === 2
                              ? "Pro Football Bootcamp"
                              : i === 3
                                ? "Badminton Championship Trials"
                                : "Tennis Coaching Program"}
                        </CardTitle>
                        <CardDescription>
                          {i === 1
                            ? "Matches your cricket interest • 95% match"
                            : i === 2
                              ? "Popular in your city • 92% match"
                              : i === 3
                                ? "Great selection rate • 88% match"
                                : "Affordable coaching • 85% match"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          ₹{i === 1 ? "1,500" : i === 2 ? "2,000" : i === 3 ? "800" : "1,200"}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span>
                        📍{" "}
                        {i === 1 ? "Mumbai" : i === 2 ? "Delhi" : i === 3 ? "Bangalore" : "Chennai"}
                      </span>
                      <span>
                        📅{" "}
                        {i === 1 ? "Feb 10-12" : i === 2 ? "Feb 15" : i === 3 ? "Feb 18" : "Feb 20"}
                      </span>
                      <span>
                        👥{" "}
                        {i === 1
                          ? "12 spots"
                          : i === 2
                            ? "20 spots"
                            : i === 3
                              ? "15 spots"
                              : "8 spots"}
                      </span>
                    </div>
                    <Button className="mt-4 w-full">View Trial</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Favorites & Searches Tab */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            {/* 1. Favorite Selection Trials */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                    <span>Your Favorite Selection Trials</span>
                  </h2>
                  <p className="text-sm text-slate-600">
                    Trials and combines you bookmarked with the ❤️ Save icon.
                  </p>
                </div>
                <Link
                  to="/search"
                  search={{ savedOnly: false }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Explore All Trials →
                </Link>
              </div>

              {savedOpportunities.length === 0 ? (
                <Card className="border-dashed p-8 text-center space-y-3 bg-white/70">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">No favorite trials saved yet</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                      Click the Save or Heart icon on any selection trial card to view your favorite
                      trials in this separate list.
                    </p>
                  </div>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/search">Browse Selection Trials</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0 max-w-full">
                  {savedOpportunities.map((trial) => (
                    <TrialCard
                      key={trial.id}
                      trial={trial}
                      onApply={() => auth.applyToTrial(trial.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 2. Saved Searches */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Save className="h-4 w-4 text-slate-600" />
                  <span>Saved Search Alerts</span>
                </h3>
                <Button variant="outline" size="sm">
                  + Create New Alert
                </Button>
              </div>
              <div className="space-y-3">
                {mockSavedSearches.map((search) => (
                  <Card key={search.id} className="hover:shadow-md transition">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{search.name}</CardTitle>
                          <CardDescription>
                            {search.sport} • {search.city}
                            {search.skillLevel && ` • ${search.skillLevel}`}
                            {search.priceRange &&
                              ` • ₹${search.priceRange[0]}-${search.priceRange[1]}`}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            {search.savedCount} results
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Notification center</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Saved trial reminders and followed academy schedule updates.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadNotifications.length === 0}
              >
                <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
              </Button>
            </div>
            {notifications.length === 0 ? (
              <Card className="py-12 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-600">No notifications yet</p>
              </Card>
            ) : (
              notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`transition ${!notif.read ? "border-l-4 border-l-blue-600 bg-blue-50" : ""}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                          {notif.type === "saved_trial_approaching"
                            ? "Saved trial"
                            : notif.type === "followed_academy_schedule"
                              ? "Followed academy"
                              : "KhelGrid alert"}
                        </p>
                        <h4 className="mt-1 font-semibold text-slate-900">{notif.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {notif.description}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Intl.DateTimeFormat("en-IN", {
                            dateStyle: "medium",
                            timeZone: "UTC",
                          }).format(new Date(notif.createdAt))}
                        </p>
                        {notif.trialId && (
                          <Link
                            to="/trial/$id"
                            params={{ id: notif.trialId }}
                            onClick={(event) => event.stopPropagation()}
                            className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Review saved trial →
                          </Link>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {!notif.read && (
                          <div
                            className="h-2 w-2 rounded-full bg-blue-600"
                            aria-label="Unread notification"
                          />
                        )}
                        <button
                          type="button"
                          aria-label={`Remove ${notif.title}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

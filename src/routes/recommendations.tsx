import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrialCard } from "@/components/TrialCard";
import { mockSavedSearches, mockNotifications } from "@/data/recommendations";
import { useNotifications } from "@/context/NotificationContext";

export const Route = createFileRoute("/recommendations")({
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const { notifications, markAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<"for-you" | "saved" | "alerts">(
    "for-you"
  );

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Your Opportunities
          </h1>
          <p className="text-slate-600">
            Personalized trials and events tailored to your interests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
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
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "saved"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Save className="inline mr-2 h-4 w-4" />
            Saved Searches
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

        {/* For You Tab */}
        {activeTab === "for-you" && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-blue-600 hover:shadow-lg transition"
                >
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
                        <div className="font-bold text-lg">₹
                          {i === 1 ? "1,500" : i === 2 ? "2,000" : i === 3 ? "800" : "1,200"}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span>📍 {i === 1 ? "Mumbai" : i === 2 ? "Delhi" : i === 3 ? "Bangalore" : "Chennai"}</span>
                      <span>📅 {i === 1 ? "Feb 10-12" : i === 2 ? "Feb 15" : i === 3 ? "Feb 18" : "Feb 20"}</span>
                      <span>👥 {i === 1 ? "12 spots" : i === 2 ? "20 spots" : i === 3 ? "15 spots" : "8 spots"}</span>
                    </div>
                    <Button className="mt-4 w-full">View Trial</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Searches Tab */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              + Create New Search
            </Button>
            {mockSavedSearches.map((search) => (
              <Card key={search.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{search.name}</CardTitle>
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
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">No notifications yet</p>
              </Card>
            ) : (
              notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`cursor-pointer transition ${
                    !notif.read ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {notif.title}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {notif.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-1" />
                      )}
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

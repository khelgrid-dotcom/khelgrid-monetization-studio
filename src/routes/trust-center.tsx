import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle, AlertCircle, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrganizers, mockReviews, mockDisputes } from "@/data/verification";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/trust-center")({
  component: TrustCenterPage,
});

function TrustCenterPage() {
  const [activeTab, setActiveTab] = useState<"organizers" | "disputes">(
    "organizers"
  );

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "elite":
        return "bg-yellow-100 text-yellow-900";
      case "trusted":
        return "bg-green-100 text-green-900";
      case "verified":
        return "bg-blue-100 text-blue-900";
      default:
        return "bg-slate-100 text-slate-900";
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "elite":
        return "🏆";
      case "trusted":
        return "✓";
      case "verified":
        return "✓✓";
      default:
        return "⭕";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Trust Center</h1>
          <p className="text-slate-600">
            Verified organizers, secure transactions, and community reviews
          </p>
        </div>

        {/* Trust Score Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h3 className="font-bold text-slate-900">KhelGrid Trust Score</h3>
                <p className="text-sm text-slate-600">
                  We verify organizers, manage disputes, and protect your payments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("organizers")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "organizers"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Verified Organizers
          </button>
          <button
            onClick={() => setActiveTab("disputes")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "disputes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Dispute Resolution
          </button>
        </div>

        {/* Organizers Tab */}
        {activeTab === "organizers" && (
          <div className="space-y-4">
            {mockOrganizers.map((org) => (
              <Card
                key={org.id}
                className="hover:shadow-lg transition border-l-4"
                style={{
                  borderLeftColor:
                    org.badgeType === "elite"
                      ? "#f59e0b"
                      : org.badgeType === "trusted"
                        ? "#10b981"
                        : org.badgeType === "verified"
                          ? "#3b82f6"
                          : "#e5e7eb",
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{org.name}</h3>
                        {org.verified && (
                          <Badge className={getBadgeColor(org.badgeType)}>
                            {getBadgeIcon(org.badgeType)} {org.badgeType.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {org.rating} ({org.reviewCount} reviews)
                        </span>
                        <span>{org.totalTrials} trials organized</span>
                        <span>{org.totalParticipants.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 rounded p-3">
                      <div className="text-xs text-slate-600">Response Rate</div>
                      <div className="text-lg font-bold text-slate-900">
                        {org.responseRate}%
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded p-3">
                      <div className="text-xs text-slate-600">Refund Rate</div>
                      <div className="text-lg font-bold text-slate-900">
                        {org.refundRate}%
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded p-3">
                      <div className="text-xs text-slate-600">Trust Score</div>
                      <div className="text-lg font-bold text-green-600">
                        {((org.rating / 5) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Recent Reviews</h4>
                    {mockReviews
                      .filter((r) => r.organizerId === org.id)
                      .slice(0, 2)
                      .map((review) => (
                        <div key={review.id} className="bg-slate-50 rounded p-3 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-slate-900">
                              {review.userName}
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">{review.title}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Helpful: {review.helpful}
                          </p>
                        </div>
                      ))}
                  </div>
                  <Button className="w-full mt-4">View All Trials</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === "disputes" && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-bold text-slate-900 mb-2">How Disputes Work</h3>
                <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                  <li>Report issue within 7 days of trial</li>
                  <li>Organizer has 48 hours to respond</li>
                  <li>KhelGrid mediates if needed</li>
                  <li>Automatic refund if unresolved in 5 days</li>
                </ol>
              </CardContent>
            </Card>

            {mockDisputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{dispute.reason}</CardTitle>
                      <CardDescription>
                        Transaction: {dispute.transactionId}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        dispute.status === "resolved"
                          ? "bg-green-100 text-green-900"
                          : dispute.status === "refunded"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-slate-100 text-slate-900"
                      }
                    >
                      {dispute.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <span className="text-sm font-medium text-slate-600">
                        Amount
                      </span>
                      <p className="font-bold text-slate-900">₹{dispute.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">
                        Resolution
                      </span>
                      <p className="text-slate-600">{dispute.resolution}</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      Filed on{" "}
                      {new Date(dispute.createdAt).toLocaleDateString()}
                      {dispute.resolvedAt &&
                        ` • Resolved on ${new Date(dispute.resolvedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              <AlertCircle className="mr-2 h-4 w-4" />
              File a Dispute
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

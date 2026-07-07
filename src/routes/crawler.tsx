import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Play, Pause, Settings, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/crawler")({
  component: CrawlerPage,
});

interface CrawlerStats {
  totalNotifications: number;
  lastRun: Date;
  nextRun: Date;
  status: "running" | "paused" | "idle";
  successRate: number;
  sourceStats: Record<string, number>;
}

function CrawlerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [crawlerConfig, setCrawlerConfig] = useState({
    rss: true,
    twitter: true,
    instagram: true,
    email: false,
    officialApis: true,
  });

  const [interval, setInterval] = useState(5);
  const [stats, setStats] = useState<CrawlerStats>({
    totalNotifications: 342,
    lastRun: new Date(Date.now() - 5 * 60000),
    nextRun: new Date(Date.now() + 5 * 60000),
    status: "idle",
    successRate: 98.5,
    sourceStats: {
      rss: 125,
      twitter: 89,
      instagram: 67,
      officialApis: 61,
      email: 0,
    },
  });

  const handleRunCrawler = async () => {
    setIsRunning(true);
    setStats((prev) => ({ ...prev, status: "running" }));
    
    // Simulate crawler run
    setTimeout(() => {
      setIsRunning(false);
      setStats((prev) => ({
        ...prev,
        status: "idle",
        lastRun: new Date(),
        nextRun: new Date(Date.now() + interval * 60000),
        totalNotifications: prev.totalNotifications + Math.floor(Math.random() * 20),
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">Sports Crawler</h1>
          </div>
          <p className="text-slate-600">Automatically collect notifications from sports organizations</p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      stats.status === "running"
                        ? "bg-green-500 animate-pulse"
                        : stats.status === "paused"
                          ? "bg-yellow-500"
                          : "bg-slate-400"
                    }`}
                  />
                  <span className="font-semibold text-slate-900 capitalize">{stats.status}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Last Run</p>
                <p className="font-semibold text-slate-900">
                  {stats.lastRun.toLocaleTimeString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Next Run</p>
                <p className="font-semibold text-slate-900">
                  {stats.nextRun.toLocaleTimeString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Success Rate</p>
                <p className="font-semibold text-green-600">{stats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Control Panel</CardTitle>
            <CardDescription>Manage crawler settings and execution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Run Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleRunCrawler}
                disabled={isRunning}
                className="gap-2"
                size="lg"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Crawler Now"}
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Pause className="h-4 w-4" />
                Pause All
              </Button>
            </div>

            {/* Interval Settings */}
            <div className="border-t pt-6">
              <label className="block font-semibold text-slate-900 mb-4">Update Interval</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[5, 15, 30, 60, 240].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setInterval(minutes)}
                    className={`p-3 rounded-lg border-2 transition font-medium ${
                      interval === minutes
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card/60 text-slate-900 hover:border-border"
                    }`}
                  >
                    {minutes === 240 ? "4h" : `${minutes}m`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Current: Every {interval} minutes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Select which sources to crawl</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">RSS Feeds</p>
                <p className="text-sm text-slate-600">BCCI, IPL, ISL, and other official RSS feeds</p>
              </div>
              <Switch
                checked={crawlerConfig.rss}
                onCheckedChange={(checked) =>
                  setCrawlerConfig({ ...crawlerConfig, rss: checked })
                }
              />
            </div>

            <div className="border-t pt-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Twitter/X</p>
                <p className="text-sm text-slate-600">Official announcements and updates</p>
              </div>
              <Switch
                checked={crawlerConfig.twitter}
                onCheckedChange={(checked) =>
                  setCrawlerConfig({ ...crawlerConfig, twitter: checked })
                }
              />
            </div>

            <div className="border-t pt-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Instagram</p>
                <p className="text-sm text-slate-600">Visual announcements and posts</p>
              </div>
              <Switch
                checked={crawlerConfig.instagram}
                onCheckedChange={(checked) =>
                  setCrawlerConfig({ ...crawlerConfig, instagram: checked })
                }
              />
            </div>

            <div className="border-t pt-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Official APIs</p>
                <p className="text-sm text-slate-600">Direct integration with sports body APIs</p>
              </div>
              <Switch
                checked={crawlerConfig.officialApis}
                onCheckedChange={(checked) =>
                  setCrawlerConfig({ ...crawlerConfig, officialApis: checked })
                }
              />
            </div>

            <div className="border-t pt-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Coming soon</p>
              </div>
              <Switch checked={crawlerConfig.email} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Collected</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.totalNotifications}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-500 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-slate-600 mb-3">Notifications by Source</p>
                <div className="space-y-2">
                  {Object.entries(stats.sourceStats).map(([source, count]) => (
                    count > 0 && (
                      <div key={source} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 capitalize">{source}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-slate-600 mb-3">Coverage</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-600">Active Sources</span>
                      <span className="text-sm font-bold text-slate-900">4/5</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-600">Organizations</span>
                      <span className="text-sm font-bold text-slate-900">16</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Crawled Notifications</CardTitle>
            <CardDescription>Latest data collected from sports organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { org: "IPL", title: "IPL 2026 Mega Auction Dates Announced", source: "Official API", time: "5 min ago" },
                { org: "BCCI", title: "U-19 Cricket Selection Trials - Mumbai", source: "RSS Feed", time: "32 min ago" },
                { org: "ISL", title: "ISL Cup Final Match Update", source: "Twitter", time: "1 hour ago" },
                { org: "Hockey India", title: "National Camp Trials Open", source: "Instagram", time: "2 hours ago" },
                { org: "AIFF", title: "Football I-League Schedule Released", source: "RSS Feed", time: "3 hours ago" },
              ].map((notification, i) => (
                <div key={i} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{notification.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {notification.org} • {notification.source}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 ml-4">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

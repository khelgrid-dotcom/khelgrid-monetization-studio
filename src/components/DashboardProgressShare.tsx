import { Award, Check, LineChart as LineChartIcon, Share2, Trophy } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { mockAthleteStats } from "@/data/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GROWTH_DATA = [
  { month: "Jan", score: 58, sessions: 6 },
  { month: "Feb", score: 66, sessions: 8 },
  { month: "Mar", score: 72, sessions: 10 },
  { month: "Apr", score: 81, sessions: 12 },
];

export function DashboardProgressShare({ name }: { name: string }) {
  const shareProgress = async () => {
    const achievementNames = mockAthleteStats.achievements
      .map((achievement) => achievement.name)
      .join(", ");
    const shareText = `${name}'s KhelGrid progress: ${mockAthleteStats.successRate}% trial success rate, ${mockAthleteStats.totalEvents} events, and achievements including ${achievementNames}.`;
    const shareUrl = `${window.location.origin}/dashboard`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s KhelGrid progress`,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success("Progress snapshot copied. You can paste it into any social app.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Sharing is unavailable in this browser. Try copying your dashboard link.");
    }
  };

  return (
    <section
      className="mt-8 rounded-2xl border border-border bg-gradient-card p-4 sm:p-6"
      aria-labelledby="progress-share-heading"
    >
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <LineChartIcon className="mr-1.5 h-3.5 w-3.5" /> Shareable progress
          </Badge>
          <h2
            id="progress-share-heading"
            className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
          >
            Your growth snapshot
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Show your training progress and earned achievements in one simple update.
          </p>
        </div>
        <Button type="button" onClick={shareProgress} className="shrink-0 rounded-full">
          <Share2 className="mr-2 h-4 w-4" /> Share snapshot
        </Button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Performance growth</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Progress score across recent training reviews
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">81%</span>
          </div>
          <div className="mt-4 h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  width={32}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Progress"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{mockAthleteStats.totalTrialsApplied} trials applied</span>
            <span>{mockAthleteStats.totalEvents} events logged</span>
            <span>{mockAthleteStats.streakDays}-day activity streak</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Earned achievements</h3>
          </div>
          <div className="mt-3 space-y-3">
            {mockAthleteStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-gradient-card p-3"
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl"
                  aria-hidden="true"
                >
                  {achievement.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{achievement.name}</h4>
                    <Badge variant="outline" className="border-border text-[10px]">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                <Check className="h-4 w-4 shrink-0 text-primary" aria-label="Achievement earned" />
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3.5 w-3.5 text-primary" /> Share only the achievements and results
            you can verify.
          </p>
        </div>
      </div>
    </section>
  );
}

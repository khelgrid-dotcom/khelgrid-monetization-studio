import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Trophy,
  Medal,
  Activity,
  Flame,
  Clock,
  CheckCircle2,
  Target,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Medal Distribution across Disciplines for India at Asian Games 2026
const INDIA_DISCIPLINE_MEDALS = [
  {
    sport: "Weightlifting",
    gold: 0,
    silver: 1,
    bronze: 0,
    total: 1,
    athlete: "Mirabai Chanu (49kg)",
    color: "#94a3b8",
  },
  {
    sport: "Shooting",
    gold: 0,
    silver: 0,
    bronze: 2,
    total: 2,
    athlete: "Men's & Women's Skeet Teams",
    color: "#f59e0b",
  },
  {
    sport: "Cricket",
    gold: 1,
    silver: 0,
    bronze: 0,
    total: 1,
    athlete: "Indian Women's Team",
    color: "#eab308",
  },
  {
    sport: "Mixed Martial Arts",
    gold: 0,
    silver: 0,
    bronze: 1,
    total: 1,
    athlete: "Suchika Tariyal (-60kg)",
    color: "#f59e0b",
  },
  {
    sport: "Soft Tennis",
    gold: 0,
    silver: 0,
    bronze: 1,
    total: 1,
    athlete: "Jay Meena (Singles)",
    color: "#f59e0b",
  },
  {
    sport: "Wushu",
    gold: 0,
    silver: 1,
    bronze: 0,
    total: 1,
    athlete: "Roshibina Devi (Assured)",
    color: "#94a3b8",
  },
];

// Top Nations Leaderboard as of September 23, 2026
const TOP_NATIONS_MEDAL_TALLY = [
  { nation: "China", gold: 48, silver: 21, bronze: 9, total: 78, flag: "🇨🇳" },
  { nation: "Japan", gold: 19, silver: 22, bronze: 18, total: 59, flag: "🇯🇵" },
  { nation: "South Korea", gold: 14, silver: 16, bronze: 19, total: 49, flag: "🇰🇷" },
  { nation: "Uzbekistan", gold: 6, silver: 7, bronze: 8, total: 21, flag: "🇺🇿" },
  { nation: "Chinese Taipei", gold: 3, silver: 4, bronze: 6, total: 13, flag: "🇹🇼" },
  { nation: "India", gold: 1, silver: 5, bronze: 6, total: 12, flag: "🇮🇳" },
];

// Shooting Skeet Team Hit Rate Comparison (Targets out of 375 / 125)
const SKEET_ACCURACY_DATA = [
  { shooter: "Anantjeet Naruka (M)", score: 121, max: 125, hitRate: 96.8, event: "Men's Skeet" },
  { shooter: "Mairaj Ahmad Khan (M)", score: 118, max: 125, hitRate: 94.4, event: "Men's Skeet" },
  { shooter: "Bhavtegh Gill (M)", score: 116, max: 125, hitRate: 92.8, event: "Men's Skeet" },
  { shooter: "Raiza Dhillon (W)", score: 117, max: 125, hitRate: 93.6, event: "Women's Skeet" },
  {
    shooter: "Maheshwari Chauhan (W)",
    score: 115,
    max: 125,
    hitRate: 92.0,
    event: "Women's Skeet",
  },
  { shooter: "Parinaaz Dhaliwal (W)", score: 114, max: 125, hitRate: 91.2, event: "Women's Skeet" },
];

// Tactical analysis and post-competition timeline updates on Sept 23, 2026
const LIVE_UPDATES_CHRONOLOGY = [
  {
    time: "17:30 IST",
    sport: "Wushu",
    badge: "Medal Assured",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    headline: "Roshibina Devi Storms into Women's Sanda Semifinals",
    detail:
      "Naorem Roshibina Devi displayed superior takedown defense and rapid counter-striking to outclass her opponent 2-0, assuring India of at least another Asian Games medal.",
  },
  {
    time: "16:15 IST",
    sport: "Soft Tennis",
    badge: "Bronze Medal",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    headline: "Jay Meena Secures Hard-Fought Bronze in Men's Singles",
    detail:
      "A grueling 5-set baseline marathon ends with Jay Meena clinching India's medal in Soft Tennis, executing 38 baseline winners in extreme humidity at Nagoya Tennis Complex.",
  },
  {
    time: "15:00 IST",
    sport: "Mixed Martial Arts",
    badge: "Historic Bronze",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    headline: "Suchika Tariyal Bags India's First-Ever Asiad MMA Medal",
    detail:
      "Competing in the women's traditional -60kg division, Suchika delivered phenomenal grappling control and submission defense to capture India's first continental MMA honor.",
  },
  {
    time: "13:20 IST",
    sport: "Shooting",
    badge: "Double Bronze",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    headline: "India Grabs Double Bronze in Men's and Women's Skeet Team Events",
    detail:
      "The women's trio (Raiza Dhillon, Maheshwari Chauhan, Parinaaz Dhaliwal) shot 346/375 to secure 3rd place, while the men's team (Anantjeet Naruka, Mairaj Khan, Bhavtegh Gill) followed suit with 355/375.",
  },
  {
    time: "11:40 IST",
    sport: "Weightlifting",
    badge: "Historic Silver",
    badgeColor: "bg-slate-400/20 text-slate-700 dark:text-slate-300 border-slate-400/40",
    headline: "Mirabai Chanu Ends 28-Year Drought with 49kg Silver",
    detail:
      "With an 86kg Snatch and 108kg Clean & Jerk (Total 194kg), Mirabai clinched silver behind China's world-record holder, securing India's first Asiad weightlifting medal since Karnam Malleswari in 1998.",
  },
  {
    time: "09:15 IST",
    sport: "Cricket",
    badge: "Gold Medal",
    badgeColor: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    headline: "Indian Women's Cricket Team Defends Asiad Gold Title",
    detail:
      "A clinical spin stranglehold conceded only 68 runs in 20 overs, before the top order knocked off the target with 5.2 overs to spare, cementing consecutive Asian Games gold medals.",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      sport?: string;
      athlete?: string;
      total?: number;
      gold?: number;
      silver?: number;
      bronze?: number;
      nation?: string;
      flag?: string;
      shooter?: string;
      score?: number;
      max?: number;
      hitRate?: number;
      event?: string;
    };
  }>;
  label?: string;
}

function DisciplineTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/80 bg-background/95 p-3 text-xs shadow-lg backdrop-blur-sm">
        <p className="font-bold text-foreground">{data.sport}</p>
        <p className="text-muted-foreground">{data.athlete}</p>
        <div className="mt-2 space-y-1 border-t border-border/60 pt-2 font-mono">
          <div className="flex justify-between gap-4">
            <span className="text-amber-500 font-semibold">Gold:</span>
            <span>{data.gold}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400 font-semibold">Silver:</span>
            <span>{data.silver}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Bronze:</span>
            <span>{data.bronze}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-border/40 pt-1 font-bold">
            <span className="text-primary">Total:</span>
            <span>{data.total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function NationTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/80 bg-background/95 p-3 text-xs shadow-lg backdrop-blur-sm">
        <p className="font-bold text-foreground flex items-center gap-1.5">
          <span>{data.flag}</span>
          <span>{data.nation}</span>
        </p>
        <div className="mt-2 space-y-1 border-t border-border/60 pt-2 font-mono text-xs">
          <div className="flex justify-between gap-4 text-amber-500">
            <span>Gold:</span>
            <span className="font-bold">{data.gold}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400">
            <span>Silver:</span>
            <span className="font-bold">{data.silver}</span>
          </div>
          <div className="flex justify-between gap-4 text-amber-700 dark:text-amber-400">
            <span>Bronze:</span>
            <span className="font-bold">{data.bronze}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-border/40 pt-1 font-extrabold text-foreground">
            <span>Total Medals:</span>
            <span className="text-primary">{data.total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function AsianGamesAnalytics() {
  const [activeTab, setActiveTab] = useState<"medals" | "leaderboard" | "skeet" | "timeline">(
    "medals",
  );

  return (
    <section
      id="asian-games-2026-analytics-hub"
      aria-labelledby="asiad-heading"
      className="my-10 rounded-3xl border border-border bg-gradient-card p-5 sm:p-7 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Trophy className="mr-1.5 h-3.5 w-3.5" /> Asian Games 2026 Post-Match Intelligence
            </Badge>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
              Aichi-Nagoya · Sept 23, 2026
            </span>
          </div>
          <h3 id="asiad-heading" className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
            India Medal Tally, Discipline Analytics & Tactical Breakdown
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Tactical analysis of post-competition performance: Mirabai Chanu's silver, double skeet
            bronze, and medal tally standings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 rounded-full border border-border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("medals")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "medals"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Disciplines
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "leaderboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Nations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("skeet")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "skeet"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Skeet Accuracy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "timeline"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Timeline
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <Trophy className="h-3.5 w-3.5" /> Total Medals
          </div>
          <div className="mt-1 text-2xl font-black text-foreground">12</div>
          <p className="text-[11px] text-muted-foreground">Rank 13th Overall</p>
        </div>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            <Medal className="h-3.5 w-3.5" /> Gold
          </div>
          <div className="mt-1 text-2xl font-black text-yellow-600 dark:text-yellow-400">1</div>
          <p className="text-[11px] text-muted-foreground">Women's Cricket</p>
        </div>

        <div className="rounded-2xl border border-slate-400/30 bg-slate-400/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-semibold">
            <Medal className="h-3.5 w-3.5" /> Silver
          </div>
          <div className="mt-1 text-2xl font-black text-slate-700 dark:text-slate-300">5</div>
          <p className="text-[11px] text-muted-foreground">Mirabai Chanu + Teams</p>
        </div>

        <div className="rounded-2xl border border-amber-700/30 bg-amber-700/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold">
            <Medal className="h-3.5 w-3.5" /> Bronze
          </div>
          <div className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-400">6</div>
          <p className="text-[11px] text-muted-foreground">Skeet, MMA, Soft Tennis</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-primary/30 bg-primary/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-primary font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Day 5 Additions
          </div>
          <div className="mt-1 text-2xl font-black text-primary">+4</div>
          <p className="text-[11px] text-muted-foreground">1 Silver, 3 Bronze (Sept 23)</p>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-6">
        {activeTab === "medals" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                India's Medals by Sports Discipline (Asian Games 2026)
              </span>
              <span className="text-muted-foreground">Hover bar to view athlete highlights</span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INDIA_DISCIPLINE_MEDALS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis
                    dataKey="sport"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} allowDecimals={false} />
                  <Tooltip content={<DisciplineTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="gold" name="Gold" fill="#eab308" stackId="a" />
                  <Bar dataKey="silver" name="Silver" fill="#94a3b8" stackId="a" />
                  <Bar
                    dataKey="bronze"
                    name="Bronze"
                    fill="#b45309"
                    stackId="a"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                Top Nations Asian Games 2026 Medal Tally (as of Sept 23, 2026)
              </span>
              <span className="text-muted-foreground">China leads with 78 medals (48 gold)</span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TOP_NATIONS_MEDAL_TALLY}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "currentColor" }} />
                  <YAxis
                    type="category"
                    dataKey="nation"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />
                  <Tooltip content={<NationTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="gold" name="Gold" fill="#eab308" stackId="tally" />
                  <Bar dataKey="silver" name="Silver" fill="#94a3b8" stackId="tally" />
                  <Bar
                    dataKey="bronze"
                    name="Bronze"
                    fill="#b45309"
                    stackId="tally"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "skeet" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                Indian Skeet Shooters: Hit Rate Accuracy (%) at Aichi Range
              </span>
              <span className="text-muted-foreground">
                Men's & Women's Team Bronze Medalist stats
              </span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SKEET_ACCURACY_DATA}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis
                    dataKey="shooter"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[85, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val}% Hit Accuracy`, "Accuracy"]}
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      borderRadius: "0.75rem",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="hitRate"
                    name="Target Accuracy %"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  >
                    {SKEET_ACCURACY_DATA.map((entry) => (
                      <Cell
                        key={entry.shooter}
                        fill={entry.hitRate >= 95 ? "#10b981" : "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-3.5">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                Chronological Post-Competition Breakdown (KhelGrid Event Intelligence - Sept 23,
                2026)
              </span>
              <span>All times in Indian Standard Time (IST)</span>
            </div>

            <div className="relative border-l-2 border-border/80 ml-3 pl-4 space-y-4">
              {LIVE_UPDATES_CHRONOLOGY.map((item, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                  <div className="rounded-xl border border-border/70 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.time}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          · {item.sport}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <h5 className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                      {item.headline}
                    </h5>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tactical Analysis footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span>
            Tactical analysis and performance metrics: Independent post-competition biomechanical
            and statistical evaluation conducted by KhelGrid High-Performance Intelligence Desk.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-primary">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-foreground">KhelGrid Verified Intelligence Desk</span>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Bowling performance dataset
const BOWLING_DATA = [
  {
    bowler: "R. Bishnoi (IND)",
    team: "India",
    overs: 8.0,
    maidens: 2,
    runs: 5,
    wickets: 4,
    economy: 0.62,
    dots: 44,
  },
  {
    bowler: "K. Tyagi (IND)",
    team: "India",
    overs: 6.0,
    maidens: 1,
    runs: 10,
    wickets: 3,
    economy: 1.67,
    dots: 30,
  },
  {
    bowler: "Akash Singh (IND)",
    team: "India",
    overs: 5.0,
    maidens: 0,
    runs: 12,
    wickets: 2,
    economy: 2.4,
    dots: 23,
  },
  {
    bowler: "V. Patil (IND)",
    team: "India",
    overs: 3.5,
    maidens: 0,
    runs: 9,
    wickets: 1,
    economy: 2.6,
    dots: 17,
  },
  {
    bowler: "K. Ota-Dobell (JPN)",
    team: "Japan",
    overs: 2.0,
    maidens: 0,
    runs: 15,
    wickets: 0,
    economy: 7.5,
    dots: 5,
  },
  {
    bowler: "Y. Retharekar (JPN)",
    team: "Japan",
    overs: 1.5,
    maidens: 0,
    runs: 14,
    wickets: 0,
    economy: 8.84,
    dots: 3,
  },
  {
    bowler: "S. Ichiki (JPN)",
    team: "Japan",
    overs: 1.0,
    maidens: 0,
    runs: 13,
    wickets: 0,
    economy: 13.0,
    dots: 2,
  },
];

// Over-by-over progression comparison data
const OVER_PROGRESSION_DATA = [
  { over: "Ov 1", japanRuns: 2, japanWickets: 0, indiaRuns: 9, indiaWickets: 0 },
  { over: "Ov 2", japanRuns: 4, japanWickets: 1, indiaRuns: 19, indiaWickets: 0 },
  { over: "Ov 3", japanRuns: 7, japanWickets: 1, indiaRuns: 29, indiaWickets: 0 },
  { over: "Ov 4", japanRuns: 11, japanWickets: 2, indiaRuns: 38, indiaWickets: 0 },
  { over: "Ov 5", japanRuns: 13, japanWickets: 2, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 7", japanRuns: 15, japanWickets: 2, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 9", japanRuns: 18, japanWickets: 3, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 11", japanRuns: 21, japanWickets: 4, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 13", japanRuns: 25, japanWickets: 5, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 15", japanRuns: 29, japanWickets: 6, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 17", japanRuns: 33, japanWickets: 7, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 19", japanRuns: 37, japanWickets: 8, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 21", japanRuns: 39, japanWickets: 9, indiaRuns: 42, indiaWickets: 0 },
  { over: "Ov 23", japanRuns: 41, japanWickets: 10, indiaRuns: 42, indiaWickets: 0 },
];

// Phase breakdown metrics
const PHASE_DATA = [
  {
    phase: "Powerplay (Overs 1-10)",
    japanScore: 19,
    japanWickets: 3,
    japanRunRate: 1.9,
    indiaScore: 42,
    indiaWickets: 0,
    indiaRunRate: 8.69,
  },
  {
    phase: "Middle Overs (Overs 11-20)",
    japanScore: 18,
    japanWickets: 5,
    japanRunRate: 1.8,
    indiaScore: 0,
    indiaWickets: 0,
    indiaRunRate: 0,
  },
  {
    phase: "Tailend (Overs 21-23)",
    japanScore: 4,
    japanWickets: 2,
    japanRunRate: 1.41,
    indiaScore: 0,
    indiaWickets: 0,
    indiaRunRate: 0,
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      bowler?: string;
      team?: string;
      overs?: number;
      maidens?: number;
      runs?: number;
      wickets?: number;
      economy?: number;
      dots?: number;
      over?: string;
      japanRuns?: number;
      japanWickets?: number;
      indiaRuns?: number;
      indiaWickets?: number;
    };
  }>;
  label?: string;
}

function BowlingTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/80 bg-background/95 p-3 text-xs shadow-lg backdrop-blur-sm">
        <p className="font-bold text-foreground">{data.bowler}</p>
        <p className="text-muted-foreground">{data.team} Bowling Attack</p>
        <div className="mt-2 space-y-1 border-t border-border/60 pt-2 font-mono">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Overs & Maidens:</span>
            <span className="font-semibold text-foreground">
              {data.overs} ov ({data.maidens} M)
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Runs Conceded:</span>
            <span className="font-semibold text-foreground">{data.runs}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Wickets Taken:</span>
            <span className="font-bold text-amber-500">{data.wickets} wkts</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Economy Rate:</span>
            <span className="font-extrabold text-primary">{data.economy} RPO</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Dot Balls:</span>
            <span className="font-semibold text-emerald-500">{data.dots} balls</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function ProgressionTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/80 bg-background/95 p-3 text-xs shadow-lg backdrop-blur-sm">
        <p className="font-bold text-foreground">{label}</p>
        <div className="mt-2 space-y-1 font-mono">
          <div className="flex items-center justify-between gap-4 text-primary">
            <span>🇮🇳 India Progress:</span>
            <span className="font-bold">
              {data.indiaRuns}/{data.indiaWickets} (4.5 ov chase)
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-red-500">
            <span>🇯🇵 Japan Progress:</span>
            <span className="font-bold">
              {data.japanRuns}/{data.japanWickets}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function MatchStatisticsCharts() {
  const [activeTab, setActiveTab] = useState<"economy" | "progression" | "phases">("economy");

  return (
    <section
      id="match-statistics-recharts-section"
      aria-labelledby="charts-heading"
      className="my-10 rounded-3xl border border-border bg-gradient-card p-5 sm:p-7 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> Recharts Tactical Analytics
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Official ICC U19 Match Data
            </span>
          </div>
          <h3 id="charts-heading" className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
            Match Statistical Models & Economy Rates
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Interactive visualization comparing bowling economy figures, over progression, and
            powerplay run rate splits.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-full border border-border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("economy")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "economy"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bowling Economy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("progression")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "progression"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Run Rate Worm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("phases")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              activeTab === "phases"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Phases Split
          </button>
        </div>
      </div>

      {/* Highlight KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>Best Economy</span>
          </div>
          <div className="mt-1 text-xl font-extrabold text-foreground">0.62 RPO</div>
          <p className="text-[11px] text-muted-foreground">Ravi Bishnoi (8-2-5-4)</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-emerald-500" />
            <span>Dot Ball %</span>
          </div>
          <div className="mt-1 text-xl font-extrabold text-foreground">78.8%</div>
          <p className="text-[11px] text-muted-foreground">108 dots of 137 balls faced</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span>India Chase Rate</span>
          </div>
          <div className="mt-1 text-xl font-extrabold text-primary">8.69 RPO</div>
          <p className="text-[11px] text-muted-foreground">42 runs in 4.5 overs</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-blue-500" />
            <span>Japan Run Rate</span>
          </div>
          <div className="mt-1 text-xl font-extrabold text-foreground">1.79 RPO</div>
          <p className="text-[11px] text-muted-foreground">41 all out in 22.5 overs</p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-6">
        {activeTab === "economy" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                Bowling Economy Rate (Runs Per Over) & Wicket Returns
              </span>
              <span className="text-muted-foreground">Hover bar to inspect full figures</span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={BOWLING_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis
                    dataKey="bowler"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    unit=" RPO"
                    domain={[0, 14]}
                  />
                  <Tooltip content={<BowlingTooltip />} />
                  <Bar dataKey="economy" name="Economy Rate (RPO)" radius={[6, 6, 0, 0]}>
                    {BOWLING_DATA.map((entry) => (
                      <Cell
                        key={entry.bowler}
                        fill={
                          entry.team === "India"
                            ? entry.economy < 1.0
                              ? "#10b981"
                              : "#3b82f6"
                            : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>Elite Economy (&lt; 1.0 RPO)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span>India Pace Attack</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span>Japan Bowling</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progression" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                Cumulative Match Runs Progression (Worm Graph)
              </span>
              <span className="text-muted-foreground">India chase finished in 4.5 overs</span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={OVER_PROGRESSION_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="over" tick={{ fontSize: 11, fill: "currentColor" }} />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} domain={[0, 48]} />
                  <Tooltip content={<ProgressionTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="indiaRuns"
                    name="India Score (Target: 42)"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="japanRuns"
                    name="Japan Score (41 all out)"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "phases" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-foreground">
                Phase-wise Run Rate Comparison (Powerplay vs Middle vs Tail)
              </span>
              <span className="text-muted-foreground">Runs per over across match phases</span>
            </div>
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PHASE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="phase" tick={{ fontSize: 11, fill: "currentColor" }} />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} unit=" RPO" />
                  <Tooltip
                    formatter={(value: number) => [`${value} RPO`, "Run Rate"]}
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      borderRadius: "0.75rem",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar
                    dataKey="indiaRunRate"
                    name="India Run Rate (RPO)"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="japanRunRate"
                    name="Japan Run Rate (RPO)"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

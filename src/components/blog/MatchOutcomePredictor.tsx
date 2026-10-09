import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Sparkles, Sliders, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PresetMatch {
  id: string;
  name: string;
  tournament: string;
  format: "T20" | "ODI";
  team1: string; // Chasing or Team Batting
  team2: string; // Defending
  target: number;
  currentScore: number;
  oversBowled: number;
  wicketsLost: number;
  historicalWinRateTeam1: number; // 0 to 100
  pitchCondition: "Balanced" | "Spin-friendly" | "Batting Paradise";
  description: string;
}

const PRESET_MATCHES: PresetMatch[] = [
  {
    id: "thriller-t20",
    name: "T20 Continental Death-Overs Chase",
    tournament: "Asian Championship / T20 Final",
    format: "T20",
    team1: "Chasing Side",
    team2: "Defending Side",
    target: 172,
    currentScore: 124,
    oversBowled: 15.0,
    wicketsLost: 4,
    historicalWinRateTeam1: 54,
    pitchCondition: "Balanced",
    description: "48 runs needed off 30 balls with 6 wickets in hand. Classic balance point.",
  },
  {
    id: "asiad-cricket-gold",
    name: "Asian Games Women's Final Spin-Choke",
    tournament: "Asian Games 2026",
    format: "T20",
    team1: "Chasing Opposition",
    team2: "India Women (Defending)",
    target: 117,
    currentScore: 56,
    oversBowled: 14.0,
    wicketsLost: 6,
    historicalWinRateTeam1: 18,
    pitchCondition: "Spin-friendly",
    description: "61 runs needed off 36 balls against tight spin stranglehold.",
  },
  {
    id: "india-vs-japan-u19",
    name: "India U19 vs Japan U19",
    tournament: "ICC U19 World Cup",
    format: "ODI",
    team1: "India U19",
    team2: "Japan U19",
    target: 42,
    currentScore: 42,
    oversBowled: 4.5,
    wicketsLost: 0,
    historicalWinRateTeam1: 99,
    pitchCondition: "Balanced",
    description: "Completed chase of 42 in 4.5 overs with 10 wickets remaining.",
  },
  {
    id: "middle-overs-spin",
    name: "Middle-Overs Collapse Scenario",
    tournament: "Multi-Nation Trophy",
    format: "T20",
    team1: "Batting Team",
    team2: "Bowling Unit",
    target: 165,
    currentScore: 78,
    oversBowled: 11.2,
    wicketsLost: 5,
    historicalWinRateTeam1: 42,
    pitchCondition: "Spin-friendly",
    description: "High dot-ball ratio with 5 top-order wickets down. Severe run-rate pressure.",
  },
];

export function MatchOutcomePredictor() {
  const [activePresetId, setActivePresetId] = useState<string>("thriller-t20");
  const [format, setFormat] = useState<"T20" | "ODI">("T20");
  const [team1Name, setTeam1Name] = useState("Chasing Team");
  const [team2Name, setTeam2Name] = useState("Defending Team");
  const [target, setTarget] = useState(172);
  const [currentScore, setCurrentScore] = useState(124);
  const [oversBowled, setOversBowled] = useState(15.0);
  const [wicketsLost, setWicketsLost] = useState(4);
  const [historicalWinRateTeam1, setHistoricalWinRateTeam1] = useState(54);
  const [pitchCondition, setPitchCondition] = useState<
    "Balanced" | "Spin-friendly" | "Batting Paradise"
  >("Balanced");

  const totalOvers = format === "T20" ? 20 : 50;

  // Load a preset
  const applyPreset = (preset: PresetMatch) => {
    setActivePresetId(preset.id);
    setFormat(preset.format);
    setTeam1Name(preset.team1);
    setTeam2Name(preset.team2);
    setTarget(preset.target);
    setCurrentScore(preset.currentScore);
    setOversBowled(preset.oversBowled);
    setWicketsLost(preset.wicketsLost);
    setHistoricalWinRateTeam1(preset.historicalWinRateTeam1);
    setPitchCondition(preset.pitchCondition);
  };

  // Run Rate & Probability Calculations
  const stats = useMemo(() => {
    const oversLeft = Math.max(0, totalOvers - oversBowled);
    const ballsRemaining = Math.round(oversLeft * 6);
    const runsNeeded = Math.max(0, target - currentScore);
    const crr = oversBowled > 0 ? Number((currentScore / oversBowled).toFixed(2)) : 0;
    const rrr =
      oversLeft > 0 ? Number((runsNeeded / oversLeft).toFixed(2)) : runsNeeded > 0 ? 99 : 0;

    // Check if match is already decided
    if (currentScore >= target) {
      return {
        crr,
        rrr: 0,
        runsNeeded: 0,
        ballsRemaining,
        oversLeft,
        wicketsInHand: 10 - wicketsLost,
        team1Prob: 100,
        team2Prob: 0,
        tieProb: 0,
        projectedScore: currentScore,
        parScore: target,
        momentum: "Completed Chase",
        marginText: `${team1Name} has won by ${10 - wicketsLost} wickets!`,
      };
    }

    if (wicketsLost >= 10 || (ballsRemaining <= 0 && currentScore < target - 1)) {
      return {
        crr,
        rrr: 99,
        runsNeeded,
        ballsRemaining: 0,
        oversLeft: 0,
        wicketsInHand: 0,
        team1Prob: 0,
        team2Prob: 100,
        tieProb: 0,
        projectedScore: currentScore,
        parScore: target,
        momentum: "Innings Terminated",
        marginText: `${team2Name} wins by ${target - 1 - currentScore} runs!`,
      };
    }

    // Mathematical Win Probability Model
    // 1. Resource remaining factor (DLS-style based on wickets in hand and balls left)
    const wicketsInHand = Math.max(0, 10 - wicketsLost);
    const wicketFactor = Math.pow(wicketsInHand / 10, 0.75);
    const overFractionRemaining = oversLeft / totalOvers;

    // 2. Run Rate Differential Index
    // Par RRR baseline: 8.0 in T20, 5.5 in ODI
    const parRRR = format === "T20" ? 8.5 : 5.5;
    const rrrDiff = parRRR - rrr; // Positive if RRR is low/manageable, negative if high

    // Pitch modifier
    let pitchMod = 0;
    if (pitchCondition === "Spin-friendly") {
      pitchMod = -0.4; // Chasing in spin choke is harder
    } else if (pitchCondition === "Batting Paradise") {
      pitchMod = 0.3; // Chasing is easier
    }

    // 3. Dynamic prior weight (Historical win rate has high weight early, minimal weight near the end)
    const matchProgressRatio = oversBowled / totalOvers; // 0 to 1
    const priorWeight = Math.max(0.04, 0.45 * Math.pow(1 - matchProgressRatio, 1.6));
    const priorProb = historicalWinRateTeam1 / 100;

    // 4. In-game live trend score (Logit link)
    // Z-score based on RRR pressure and wickets in hand
    const rateAdvantage = (crr - rrr) * 0.35 + rrrDiff * 0.45;
    const resourceStrength = (wicketFactor - 0.5) * 4.0;
    const logitZ = rateAdvantage + resourceStrength + pitchMod;

    // Convert Z to probability via Sigmoid function: 1 / (1 + e^-z)
    const rawLiveProb = 1 / (1 + Math.exp(-logitZ));

    // Blend with historical prior:
    let blendedTeam1Prob = (1 - priorWeight) * rawLiveProb + priorWeight * priorProb;

    // Clamp and format
    blendedTeam1Prob = Math.min(0.995, Math.max(0.005, blendedTeam1Prob));

    // Calculate tie/Super Over likelihood (spikes if RRR close to par with last over)
    let tieProb = 0;
    if (oversLeft <= 1.0 && Math.abs(runsNeeded - 8) <= 3 && wicketsInHand >= 2) {
      tieProb = 8.5;
    } else if (oversLeft <= 2.0 && Math.abs(runsNeeded - 16) <= 4) {
      tieProb = 4.2;
    } else {
      tieProb = 1.2;
    }

    const team1Prob = Number((blendedTeam1Prob * (100 - tieProb)).toFixed(1));
    const team2Prob = Number((100 - team1Prob - tieProb).toFixed(1));

    // Projected Final Score if batting 1st or current CRR
    const projectedAtCRR = Math.round(currentScore + crr * oversLeft);
    const parScore = Math.round(target);

    // Momentum description
    let momentum = "Evenly Poised";
    if (team1Prob >= 75) {
      momentum = "High Chasing Momentum";
    } else if (team1Prob >= 58) {
      momentum = "Chasing Team In Control";
    } else if (team1Prob <= 25) {
      momentum = "Dominant Bowling Stranglehold";
    } else if (team1Prob <= 42) {
      momentum = "Defending Team Pressure Mounts";
    }

    // Win Margin prediction text
    let marginText = "";
    if (team1Prob > 50) {
      const estimatedBallsLeft = Math.max(1, Math.round(ballsRemaining * 0.25));
      marginText = `${team1Name} projected to win by ${wicketsInHand} wickets (~${estimatedBallsLeft} balls spare)`;
    } else {
      const estimatedDefendMargin = Math.max(2, Math.round((target - currentScore) * 0.35));
      marginText = `${team2Name} projected to defend total by ~${estimatedDefendMargin} runs`;
    }

    return {
      crr,
      rrr,
      runsNeeded,
      ballsRemaining,
      oversLeft,
      wicketsInHand,
      team1Prob,
      team2Prob,
      tieProb,
      projectedScore: projectedAtCRR,
      parScore,
      momentum,
      marginText,
    };
  }, [
    totalOvers,
    oversBowled,
    target,
    currentScore,
    wicketsLost,
    format,
    pitchCondition,
    historicalWinRateTeam1,
    team1Name,
    team2Name,
  ]);

  // Generate Recharts projection over next overs (Win Probability Timeline)
  const trajectoryData = useMemo(() => {
    const points = [];
    const currentOverInt = Math.floor(oversBowled);
    const startOver = Math.max(0, currentOverInt - 4);
    const endOver = totalOvers;

    for (let o = startOver; o <= endOver; o += 2) {
      let prob = stats.team1Prob;
      if (o < currentOverInt) {
        // Earlier in the game: closer to historical prior
        const weight = (currentOverInt - o) / currentOverInt;
        prob = Math.round(
          stats.team1Prob * (1 - weight * 0.4) + historicalWinRateTeam1 * (weight * 0.4),
        );
      } else if (o > currentOverInt) {
        // Projected: diverge depending on whether team1 is ahead or behind
        const futureDiff = o - currentOverInt;
        if (stats.team1Prob > 50) {
          prob = Math.min(99, Math.round(stats.team1Prob + futureDiff * 4.5));
        } else {
          prob = Math.max(1, Math.round(stats.team1Prob - futureDiff * 5.0));
        }
      }
      points.push({
        over: `Ov ${o}`,
        team1: prob,
        team2: Math.max(0, 100 - prob),
      });
    }
    return points;
  }, [oversBowled, totalOvers, stats.team1Prob, historicalWinRateTeam1]);

  return (
    <section
      id="match-outcome-predictor-section"
      aria-labelledby="predictor-heading"
      className="my-10 rounded-3xl border border-border bg-gradient-card p-5 sm:p-7 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI & Quantitative Analytics
            </Badge>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
              Live Probability Engine
            </span>
          </div>
          <h3
            id="predictor-heading"
            className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl"
          >
            Match Outcome Predictor & Win Probability Engine
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Simulates dynamic win probabilities from current run rates (CRR vs RRR), wickets in
            hand, and historical win-rate baselines.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Sliders className="h-3 w-3" /> Presets:
          </span>
          {PRESET_MATCHES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                activePresetId === preset.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Probability Meter Display */}
      <div className="mt-6 rounded-2xl border border-border bg-card/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-bold text-primary text-xs">
              {team1Name.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">{team1Name}</span>
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                {currentScore}/{wicketsLost} ({oversBowled}/{totalOvers} ov)
              </span>
            </div>
          </div>

          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
            Target: {target} (Need {stats.runsNeeded} off {stats.ballsRemaining}b)
          </Badge>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">{team2Name}</span>
              <span className="ml-2 text-xs text-muted-foreground">Defending Total</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold text-foreground text-xs">
              {team2Name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Win Probability Bar */}
        <div className="mt-4">
          <div className="mb-2 flex items-baseline justify-between text-xs">
            <span className="font-extrabold text-primary text-base sm:text-lg">
              {stats.team1Prob}%{" "}
              <span className="text-xs font-normal text-muted-foreground">Win Prob</span>
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Tie/Super Over: {stats.tieProb}%
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base sm:text-lg">
              <span className="text-xs font-normal text-muted-foreground">Win Prob </span>{" "}
              {stats.team2Prob}%
            </span>
          </div>

          <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${stats.team1Prob}%` }}
            />
            {stats.tieProb > 0 && (
              <div
                className="absolute top-0 bottom-0 bg-yellow-400/80 transition-all duration-500"
                style={{
                  left: `${stats.team1Prob}%`,
                  width: `${stats.tieProb}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Tactical Key Indicators */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Current Run Rate (CRR)
            </span>
            <div className="mt-0.5 text-base font-black text-foreground font-mono">
              {stats.crr} <span className="text-xs font-normal text-muted-foreground">rpo</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Required Rate (RRR)
            </span>
            <div className="mt-0.5 text-base font-black font-mono text-foreground">
              {stats.rrr > 36 ? "N/A" : `${stats.rrr}`}{" "}
              <span className="text-xs font-normal text-muted-foreground">rpo</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Wickets in Hand
            </span>
            <div className="mt-0.5 text-base font-black font-mono text-primary">
              {stats.wicketsInHand}{" "}
              <span className="text-xs font-normal text-muted-foreground">/ 10</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Tactical State
            </span>
            <div className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
              {stats.momentum}
            </div>
          </div>
        </div>

        {/* AI Projection Headline */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary font-medium">
          <TrendingUp className="h-4 w-4 shrink-0" />
          <span>{stats.marginText}</span>
        </div>
      </div>

      {/* Interactive Controls & Scenario Adjuster */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Interactive Controls */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-primary" /> Live Match Parameter Simulator
            </h4>
            <span className="text-xs text-muted-foreground">
              Adjust sliders to see probability shift
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Target Score */}
            <div>
              <div className="flex justify-between font-medium text-foreground mb-1">
                <span>Target Runs:</span>
                <span className="font-mono font-bold text-primary">{target}</span>
              </div>
              <input
                type="range"
                min="40"
                max="350"
                step="1"
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  setActivePresetId("custom");
                }}
                className="w-full accent-primary"
              />
            </div>

            {/* Current Score */}
            <div>
              <div className="flex justify-between font-medium text-foreground mb-1">
                <span>Current Runs Scored:</span>
                <span className="font-mono font-bold text-primary">{currentScore}</span>
              </div>
              <input
                type="range"
                min="0"
                max={target + 10}
                step="1"
                value={currentScore}
                onChange={(e) => {
                  setCurrentScore(Number(e.target.value));
                  setActivePresetId("custom");
                }}
                className="w-full accent-primary"
              />
            </div>

            {/* Overs Bowled */}
            <div>
              <div className="flex justify-between font-medium text-foreground mb-1">
                <span>Overs Bowled:</span>
                <span className="font-mono font-bold text-primary">
                  {oversBowled} / {totalOvers} ov
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max={totalOvers}
                step="0.1"
                value={oversBowled}
                onChange={(e) => {
                  setOversBowled(Number(e.target.value));
                  setActivePresetId("custom");
                }}
                className="w-full accent-primary"
              />
            </div>

            {/* Wickets Lost */}
            <div>
              <div className="flex justify-between font-medium text-foreground mb-1">
                <span>Wickets Lost:</span>
                <span className="font-mono font-bold text-rose-500">{wicketsLost} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={wicketsLost}
                onChange={(e) => {
                  setWicketsLost(Number(e.target.value));
                  setActivePresetId("custom");
                }}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Historical Win Rate Prior */}
            <div>
              <div className="flex justify-between font-medium text-foreground mb-1">
                <span>Historical Head-to-Head Win Rate ({team1Name}):</span>
                <span className="font-mono font-bold text-blue-500">{historicalWinRateTeam1}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={historicalWinRateTeam1}
                onChange={(e) => {
                  setHistoricalWinRateTeam1(Number(e.target.value));
                  setActivePresetId("custom");
                }}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Pitch & Format toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Format
                </label>
                <div className="flex rounded-lg border border-border p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormat("T20");
                      setActivePresetId("custom");
                    }}
                    className={`flex-1 rounded-md py-1 text-xs font-semibold ${
                      format === "T20"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    T20 (20 ov)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormat("ODI");
                      setActivePresetId("custom");
                    }}
                    className={`flex-1 rounded-md py-1 text-xs font-semibold ${
                      format === "ODI"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    ODI (50 ov)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Pitch Condition
                </label>
                <select
                  value={pitchCondition}
                  onChange={(e) => {
                    setPitchCondition(
                      e.target.value as "Balanced" | "Spin-friendly" | "Batting Paradise",
                    );
                    setActivePresetId("custom");
                  }}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium"
                >
                  <option value="Balanced">Balanced Surface</option>
                  <option value="Spin-friendly">Spin-friendly / Deteriorating</option>
                  <option value="Batting Paradise">Batting Paradise</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Projected Probability Curve over Remaining Overs */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">
                Win Probability Trajectory Curve
              </h4>
              <span className="text-xs text-muted-foreground">Historical vs In-Game Trend</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Visualizes probability progression. Early overs are stabilized by historical priors;
              death overs become hyper-sensitive to dot balls and boundaries.
            </p>

            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trajectoryData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="team1Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="team2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="over" tick={{ fontSize: 10, fill: "currentColor" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "currentColor" }} unit="%" />
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, "Win Prob"]}
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      borderRadius: "0.75rem",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine y={50} stroke="#64748b" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="team1"
                    name={team1Name}
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#team1Grad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="team2"
                    name={team2Name}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#team2Grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Note */}
          <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
            <HelpCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              <strong>Algorithmic Note:</strong> Blends Bayesian historical win-rate priors with
              live run-rate delta ($CRR - RRR$), non-linear resource degradation ($Wickets^{0.75}$),
              and pitch decay indices.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

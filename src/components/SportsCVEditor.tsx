import { useState } from "react";
import type {
  SportsCVData,
  AthleticAchievement,
  PerformanceMetric,
  SportType,
  AchievementLevel,
  AwardType,
  MetricCategory,
} from "@/types/sports-cv";
import { SPORT_POSITION_PRESETS, COMMON_METRIC_PRESETS } from "@/types/sports-cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Zap,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  User,
  Medal,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface SportsCVEditorProps {
  data: SportsCVData;
  onChange: (updated: SportsCVData) => void;
}

const SPORTS_LIST: SportType[] = [
  "Cricket",
  "Football",
  "Basketball",
  "Badminton",
  "Athletics",
  "Tennis",
  "Kabaddi",
  "Swimming",
  "Hockey",
  "Other",
];

const ACHIEVEMENT_LEVELS: AchievementLevel[] = [
  "School",
  "Club",
  "District",
  "State",
  "National",
  "International",
];

const AWARD_TYPES: AwardType[] = [
  "Gold / 1st Place",
  "Silver / 2nd Place",
  "Bronze / 3rd Place",
  "MVP / Best Player",
  "Best Bowler",
  "Best Batsman",
  "Top Scorer",
  "State Selection",
  "Finalist",
  "Certificate of Merit",
];

const METRIC_CATEGORIES: MetricCategory[] = [
  "Speed",
  "Endurance",
  "Power",
  "Athleticism",
  "Sport-Specific",
];

export function SportsCVEditor({ data, onChange }: SportsCVEditorProps) {
  // New Achievement form state
  const [newAchTitle, setNewAchTitle] = useState("");
  const [newAchCompetition, setNewAchCompetition] = useState("");
  const [newAchYear, setNewAchYear] = useState<number>(new Date().getFullYear());
  const [newAchLevel, setNewAchLevel] = useState<AchievementLevel>("State");
  const [newAchAward, setNewAchAward] = useState<AwardType>("Gold / 1st Place");
  const [newAchDesc, setNewAchDesc] = useState("");

  // New Metric form state
  const [newMetName, setNewMetName] = useState("");
  const [newMetValue, setNewMetValue] = useState("");
  const [newMetUnit, setNewMetUnit] = useState("");
  const [newMetCategory, setNewMetCategory] = useState<MetricCategory>("Speed");
  const [newMetScore, setNewMetScore] = useState<number>(85);
  const [newMetBenchmark, setNewMetBenchmark] = useState("");

  // Helper updater
  const updateField = <K extends keyof SportsCVData>(field: K, value: SportsCVData[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Add Achievement
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim() || !newAchCompetition.trim()) {
      toast.error("Please enter achievement title and competition name.");
      return;
    }

    const newAch: AthleticAchievement = {
      id: `ach-${Date.now()}`,
      title: newAchTitle.trim(),
      competition: newAchCompetition.trim(),
      year: Number(newAchYear) || new Date().getFullYear(),
      level: newAchLevel,
      award: newAchAward,
      description: newAchDesc.trim() || undefined,
      verified: true,
    };

    onChange({
      ...data,
      achievements: [newAch, ...data.achievements],
    });

    setNewAchTitle("");
    setNewAchCompetition("");
    setNewAchDesc("");
    toast.success("Athletic achievement added to your profile card!");
  };

  const handleRemoveAchievement = (id: string) => {
    onChange({
      ...data,
      achievements: data.achievements.filter((a) => a.id !== id),
    });
    toast.info("Achievement removed.");
  };

  // Add Metric
  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetName.trim() || !newMetValue.trim()) {
      toast.error("Please enter metric test name and score value.");
      return;
    }

    const newMet: PerformanceMetric = {
      id: `met-${Date.now()}`,
      name: newMetName.trim(),
      value: newMetValue.trim(),
      unit: newMetUnit.trim(),
      category: newMetCategory,
      score: Math.max(1, Math.min(100, Number(newMetScore) || 85)),
      benchmark: newMetBenchmark.trim() || undefined,
    };

    onChange({
      ...data,
      performanceMetrics: [...data.performanceMetrics, newMet],
    });

    setNewMetName("");
    setNewMetValue("");
    setNewMetUnit("");
    setNewMetBenchmark("");
    toast.success("Performance metric added to your profile card!");
  };

  const handleRemoveMetric = (id: string) => {
    onChange({
      ...data,
      performanceMetrics: data.performanceMetrics.filter((m) => m.id !== id),
    });
    toast.info("Metric removed.");
  };

  // Apply Sport Preset Metrics
  const handleApplySportMetrics = () => {
    const presets = COMMON_METRIC_PRESETS[data.sport] || COMMON_METRIC_PRESETS.Cricket;
    const generated: PerformanceMetric[] = presets.map((p, idx) => ({
      ...p,
      id: `met-preset-${Date.now()}-${idx}`,
    }));

    onChange({
      ...data,
      performanceMetrics: generated,
    });
    toast.success(`Applied recommended ${data.sport} performance benchmarks!`);
  };

  const currentSportPositions = SPORT_POSITION_PRESETS[data.sport] || [];
  const currentSportMetricSuggestions = COMMON_METRIC_PRESETS[data.sport] || [];

  return (
    <div className="space-y-8 text-foreground">
      {/* 1. Athlete Bio & Position Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">Position & Athlete Credentials</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Core Identity
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Athlete Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-athlete-name">Full Athlete Name</Label>
            <Input
              id="cv-athlete-name"
              value={data.athleteName}
              onChange={(e) => updateField("athleteName", e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          {/* Sport */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-sport-select">Primary Sport</Label>
            <Select
              value={data.sport}
              onValueChange={(val: SportType) => updateField("sport", val)}
            >
              <SelectTrigger id="cv-sport-select">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS_LIST.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Playing Position */}
          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cv-position">Primary Playing Position / Role</Label>
              <span className="text-[11px] text-muted-foreground">
                Click a role suggestion below
              </span>
            </div>
            <Input
              id="cv-position"
              value={data.position}
              onChange={(e) => updateField("position", e.target.value)}
              placeholder="e.g. Opening Batsman & Wicketkeeper"
            />

            {/* Position Suggestions */}
            {currentSportPositions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentSportPositions.slice(0, 7).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateField("position", pos)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                      data.position === pos
                        ? "border-primary bg-primary/15 text-primary font-semibold"
                        : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Position */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-secondary-pos">Secondary Role / Speciality (Optional)</Label>
            <Input
              id="cv-secondary-pos"
              value={data.secondaryPosition || ""}
              onChange={(e) => updateField("secondaryPosition", e.target.value)}
              placeholder="e.g. Middle-Order Finisher / Slip Catcher"
            />
          </div>

          {/* Jersey Number */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-jersey">Jersey / Squad Number</Label>
            <Input
              id="cv-jersey"
              value={data.jerseyNumber || ""}
              onChange={(e) => updateField("jerseyNumber", e.target.value)}
              placeholder="e.g. #7 or #18"
            />
          </div>

          {/* Age Category */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-age-category">Age Band / Category</Label>
            <Select
              value={data.ageCategory}
              onValueChange={(val) => updateField("ageCategory", val)}
            >
              <SelectTrigger id="cv-age-category">
                <SelectValue placeholder="Select age band" />
              </SelectTrigger>
              <SelectContent>
                {["U-14", "U-16", "U-19", "U-23", "Senior Open", "Veterans (35+)"].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Academy / Club */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-academy">Current Academy, Club or School</Label>
            <Input
              id="cv-academy"
              value={data.currentAcademy}
              onChange={(e) => updateField("currentAcademy", e.target.value)}
              placeholder="e.g. Delhi Sports Club Academy"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-city">City</Label>
            <Input
              id="cv-city"
              value={data.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="e.g. New Delhi"
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-state">State / Region</Label>
            <Input
              id="cv-state"
              value={data.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="e.g. Delhi NCR"
            />
          </div>

          {/* Physical Attributes: Height, Weight, Dominant Side */}
          <div className="space-y-1.5">
            <Label htmlFor="cv-height">Height</Label>
            <Input
              id="cv-height"
              value={data.height}
              onChange={(e) => updateField("height", e.target.value)}
              placeholder="e.g. 182 cm (6'0'')"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-weight">Weight</Label>
            <Input
              id="cv-weight"
              value={data.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="e.g. 74 kg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-dominant">Dominant Side</Label>
            <Select
              value={data.dominantSide}
              onValueChange={(val: "Right" | "Left" | "Ambidextrous") =>
                updateField("dominantSide", val)
              }
            >
              <SelectTrigger id="cv-dominant">
                <SelectValue placeholder="Dominant Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Right">Right-Handed / Right-Footed</SelectItem>
                <SelectItem value="Left">Left-Handed / Left-Footed</SelectItem>
                <SelectItem value="Ambidextrous">Ambidextrous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-availability">Scout Availability</Label>
            <Select
              value={data.availability}
              onValueChange={(
                val: "Open for Trials" | "Club Contracted" | "Free Agent" | "Academy Trainee",
              ) => updateField("availability", val)}
            >
              <SelectTrigger id="cv-availability">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open for Trials">Open for Trials</SelectItem>
                <SelectItem value="Free Agent">Free Agent</SelectItem>
                <SelectItem value="Club Contracted">Club Contracted</SelectItem>
                <SelectItem value="Academy Trainee">Academy Trainee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-bio">Scout Bio & Playing Style Summary</Label>
            <Textarea
              id="cv-bio"
              rows={2}
              value={data.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Describe your athletic strengths, match temperament, and key playing style..."
            />
          </div>
        </div>
      </section>

      {/* 2. Performance Metrics Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">Athletic Performance Metrics</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Input physical test benchmarks, sprints, stamina scores, or sport-specific stats.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplySportMetrics}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Apply {data.sport} Presets
          </Button>
        </div>

        {/* Existing Metrics list */}
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Active Metrics ({data.performanceMetrics.length})
          </div>

          {data.performanceMetrics.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No performance metrics added yet. Use the form below or click "Apply {data.sport}{" "}
              Presets".
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {data.performanceMetrics.map((met) => (
                <div
                  key={met.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {met.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {met.benchmark || met.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-primary">{met.value}</span>
                      <span className="text-[11px] text-muted-foreground ml-1">{met.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(met.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      title="Delete metric"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to add a new Metric */}
        <form
          onSubmit={handleAddMetric}
          className="mt-6 rounded-xl border border-border/80 bg-muted/10 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-primary" /> Add New Performance Metric
            </h4>

            {currentSportMetricSuggestions.length > 0 && (
              <span className="text-[11px] text-muted-foreground">Suggested for {data.sport}:</span>
            )}
          </div>

          {/* Quick suggestions */}
          {currentSportMetricSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {currentSportMetricSuggestions.map((sug) => (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() => {
                    setNewMetName(sug.name);
                    setNewMetValue(String(sug.value));
                    setNewMetUnit(sug.unit);
                    setNewMetCategory(sug.category);
                    setNewMetScore(sug.score || 85);
                    setNewMetBenchmark(sug.benchmark || "");
                  }}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  + {sug.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="met-name" className="text-xs">
                Metric Name *
              </Label>
              <Input
                id="met-name"
                value={newMetName}
                onChange={(e) => setNewMetName(e.target.value)}
                placeholder="e.g. 40m Sprint or Yo-Yo Test"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-value" className="text-xs">
                Value *
              </Label>
              <Input
                id="met-value"
                value={newMetValue}
                onChange={(e) => setNewMetValue(e.target.value)}
                placeholder="e.g. 4.92"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-unit" className="text-xs">
                Unit
              </Label>
              <Input
                id="met-unit"
                value={newMetUnit}
                onChange={(e) => setNewMetUnit(e.target.value)}
                placeholder="e.g. s, km/h, cm, %"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-category" className="text-xs">
                Category
              </Label>
              <Select
                value={newMetCategory}
                onValueChange={(val: MetricCategory) => setNewMetCategory(val)}
              >
                <SelectTrigger id="met-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-score" className="text-xs">
                Percentile / Rating (1-100)
              </Label>
              <Input
                id="met-score"
                type="number"
                min={1}
                max={100}
                value={newMetScore}
                onChange={(e) => setNewMetScore(Number(e.target.value))}
                placeholder="e.g. 90"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="met-benchmark" className="text-xs">
                Benchmark Note (Optional)
              </Label>
              <Input
                id="met-benchmark"
                value={newMetBenchmark}
                onChange={(e) => setNewMetBenchmark(e.target.value)}
                placeholder="e.g. State Standard: <5.10s"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Metric
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Athletic Achievements Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold">Athletic Achievements & Honours</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              List tournament medals, state selections, trophies, and trial achievements.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.achievements.length} Recorded
          </Badge>
        </div>

        {/* Existing Achievements list */}
        <div className="mt-4 space-y-2.5">
          {data.achievements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No athletic achievements recorded yet. Add your first tournament medal below!
            </div>
          ) : (
            data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="font-bold text-xs sm:text-sm text-foreground">{ach.title}</h5>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {ach.level}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">{ach.year}</span>
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">{ach.award}</span> ·{" "}
                    {ach.competition}
                  </div>

                  {ach.description && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{ach.description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(ach.id)}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded transition-colors shrink-0"
                  title="Remove achievement"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Form to add an Achievement */}
        <form
          onSubmit={handleAddAchievement}
          className="mt-6 rounded-xl border border-border/80 bg-muted/10 p-4"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-3">
            <Plus className="h-3.5 w-3.5 text-primary" /> Add New Athletic Achievement
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="ach-title" className="text-xs">
                Achievement Title *
              </Label>
              <Input
                id="ach-title"
                value={newAchTitle}
                onChange={(e) => setNewAchTitle(e.target.value)}
                placeholder="e.g. State Youth Tournament Gold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-comp" className="text-xs">
                Tournament / Competition Name *
              </Label>
              <Input
                id="ach-comp"
                value={newAchCompetition}
                onChange={(e) => setNewAchCompetition(e.target.value)}
                placeholder="e.g. Delhi State Championship 2025"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-year" className="text-xs">
                Year *
              </Label>
              <Input
                id="ach-year"
                type="number"
                min={2000}
                max={2030}
                value={newAchYear}
                onChange={(e) => setNewAchYear(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ach-level" className="text-xs">
                Competition Level
              </Label>
              <Select
                value={newAchLevel}
                onValueChange={(val: AchievementLevel) => setNewAchLevel(val)}
              >
                <SelectTrigger id="ach-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="ach-award" className="text-xs">
                Award / Standing
              </Label>
              <Select value={newAchAward} onValueChange={(val: AwardType) => setNewAchAward(val)}>
                <SelectTrigger id="ach-award">
                  <SelectValue placeholder="Select award" />
                </SelectTrigger>
                <SelectContent>
                  {AWARD_TYPES.map((aw) => (
                    <SelectItem key={aw} value={aw}>
                      {aw}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="ach-desc" className="text-xs">
                Description / Notable Stats (Optional)
              </Label>
              <Textarea
                id="ach-desc"
                rows={2}
                value={newAchDesc}
                onChange={(e) => setNewAchDesc(e.target.value)}
                placeholder="e.g. Scored 320 runs in 4 games; awarded Best Batsman of the Tournament..."
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Achievement
            </Button>
          </div>
        </form>
      </section>

      {/* 4. Coach Reference & Verification */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="text-base font-bold">Coach Reference & Media</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Scout Verification
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cv-coach-name">Coach Reference Name</Label>
            <Input
              id="cv-coach-name"
              value={data.coachReference?.name || ""}
              onChange={(e) =>
                updateField("coachReference", {
                  name: e.target.value,
                  designation: data.coachReference?.designation || "Head Coach",
                  phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                })
              }
              placeholder="e.g. Coach R. S. Negi"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-coach-desig">Coach Title / Academy</Label>
            <Input
              id="cv-coach-desig"
              value={data.coachReference?.designation || ""}
              onChange={(e) =>
                updateField("coachReference", {
                  name: data.coachReference?.name || "Head Coach",
                  designation: e.target.value,
                  phoneOrEmail: data.coachReference?.phoneOrEmail || "",
                })
              }
              placeholder="e.g. Head Coach, National Sports Academy"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-video">Skills Highlight Reel Link</Label>
            <Input
              id="cv-video"
              value={data.highlightVideoUrl || ""}
              onChange={(e) => updateField("highlightVideoUrl", e.target.value)}
              placeholder="e.g. https://youtu.be/your-athletic-reel or Google Drive link"
            />
          </div>
        </div>
      </section>

      {/* 5. Connected Athletic Socials & Profiles */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">Connected Socials & Athletic Profiles</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Scout Recruitment
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Connect your sports handles so scouts and trial coaches can verify training clips and
          match stats.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cv-instagram">Instagram Handle or Link</Label>
            <Input
              id="cv-instagram"
              value={data.socialProfiles?.instagram || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  instagram: e.target.value,
                })
              }
              placeholder="e.g. @aarav.cricket or full URL"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-twitter">Twitter / 𝕏 Handle or Link</Label>
            <Input
              id="cv-twitter"
              value={data.socialProfiles?.twitter || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  twitter: e.target.value,
                })
              }
              placeholder="e.g. @aarav_pace"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-cricheroes">CricHeroes Profile (for Cricket)</Label>
            <Input
              id="cv-cricheroes"
              value={data.socialProfiles?.cricheroes || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  cricheroes: e.target.value,
                })
              }
              placeholder="e.g. https://cricheroes.com/player-profile/..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cv-strava">Strava Profile (for Athletics/Running)</Label>
            <Input
              id="cv-strava"
              value={data.socialProfiles?.strava || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  strava: e.target.value,
                })
              }
              placeholder="e.g. https://www.strava.com/athletes/..."
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="cv-playo">Playo Profile / Community ID</Label>
            <Input
              id="cv-playo"
              value={data.socialProfiles?.playo || ""}
              onChange={(e) =>
                updateField("socialProfiles", {
                  ...data.socialProfiles,
                  playo: e.target.value,
                })
              }
              placeholder="e.g. playo.co/username or karma profile link"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

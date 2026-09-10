import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  analyzeAthleteProfile,
  type AthleteProfile,
  type ImprovementPriority,
  type ProfileImprovement,
} from "@/lib/athlete-profile-agent";

const PRIORITY_STYLES: Record<ImprovementPriority, string> = {
  high: "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-300",
  medium: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-300",
  low: "border-border bg-background/40 text-muted-foreground",
};

export function AthleteProfileAgent({ profile }: { profile: AthleteProfile }) {
  const [expanded, setExpanded] = useState(false);
  const analysis = analyzeAthleteProfile(profile);
  const visibleImprovements = expanded ? analysis.improvements : analysis.improvements.slice(0, 2);

  return (
    <section
      className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5"
      aria-labelledby="profile-agent-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Profile improvement agent
          </Badge>
          <h4 id="profile-agent-heading" className="mt-2 font-semibold">
            Make your profile easier to review
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A transparent completeness review based on the evidence currently listed in your Sports
            CV.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-3 py-1.5 text-sm font-semibold text-primary">
          <Target className="h-3.5 w-3.5" /> {analysis.score}% ready
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Evidence completeness</span>
          <span>{analysis.score} / 100</span>
        </div>
        <Progress
          value={analysis.score}
          aria-label={`Profile evidence completeness: ${analysis.score}%`}
          className="h-2 bg-primary/15"
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>

      {analysis.improvements.length > 0 ? (
        <div className="mt-4 space-y-2">
          {visibleImprovements.map((improvement) => (
            <ImprovementCard key={improvement.id} improvement={improvement} />
          ))}
          {analysis.improvements.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="w-full justify-between text-xs text-primary hover:text-primary"
            >
              {expanded
                ? "Show fewer suggestions"
                : `View ${analysis.improvements.length - 2} more suggestion${analysis.improvements.length - 2 === 1 ? "" : "s"}`}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/25 bg-background/50 p-3 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Keep your evidence current and confirm that every shared result and link is accurate.
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        This is a preparation aid, not a scout decision, ranking or promise of selection. Only add
        accurate evidence that you have permission to share.
      </p>
    </section>
  );
}

function ImprovementCard({ improvement }: { improvement: ProfileImprovement }) {
  return (
    <article className={`rounded-xl border p-3 ${PRIORITY_STYLES[improvement.priority]}`}>
      <div className="flex items-start gap-3">
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="font-semibold text-foreground">{improvement.title}</h5>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {improvement.priority} priority
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{improvement.reason}</p>
          <p className="mt-2 text-xs font-medium text-foreground">
            Next step: {improvement.action}
          </p>
        </div>
      </div>
    </article>
  );
}

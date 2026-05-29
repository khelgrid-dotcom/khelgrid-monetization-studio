import { Calendar, MapPin, Users, Flame, Check, Zap } from "lucide-react";
import type { Trial } from "@/data/trials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface Props {
  trial: Trial;
  boosted?: boolean;
  onApply: () => void;
  onBoost?: () => void;
  showBoostAction?: boolean;
}

export function TrialCard({ trial, boosted, onApply, onBoost, showBoostAction }: Props) {
  const { applications } = useAuth();
  const applied = applications.includes(trial.id);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-card p-5 transition-all ${
        boosted
          ? "border-primary/60 animate-pulse-glow"
          : "border-border hover:border-border/80 hover:translate-y-[-2px]"
      }`}
    >
      {boosted && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gradient-hero px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
          <Flame className="h-3 w-3" /> Featured
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="border-border text-[10px]">{trial.sport}</Badge>
        <span className="text-foreground/60">·</span>
        <span>{trial.tag}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{trial.title}</h3>
      <p className="text-sm text-muted-foreground">{trial.academy}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{trial.city}</div>
        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{trial.date}</div>
        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{trial.spots} spots</div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button
          onClick={onApply}
          disabled={applied}
          className="flex-1"
          variant={applied ? "secondary" : "default"}
        >
          {applied ? (<><Check className="mr-1 h-4 w-4" /> Applied</>) : "Apply now"}
        </Button>
        {showBoostAction && !boosted && (
          <Button onClick={onBoost} variant="outline" size="icon" title="Boost listing">
            <Zap className="h-4 w-4 text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
}

import { CalendarDays, MapPin, Trophy, Award, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MatchStatsProps {
  stats: {
    matchTitle: string;
    date: string;
    venue: string;
    tournament: string;
    teams: {
      team1: { name: string; score: string; overs?: string; highlights: string };
      team2: { name: string; score: string; overs?: string; highlights: string };
    };
    result: string;
    playerOfTheMatch?: string;
  };
}

export function MatchStatsCard({ stats }: MatchStatsProps) {
  return (
    <div
      id="match-scorecard-summary"
      className="my-8 overflow-hidden rounded-2xl border border-primary/30 bg-card/80 shadow-sm"
    >
      <div className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Official Match Tactical Record
          </span>
        </div>
        <Badge variant="outline" className="border-primary/40 bg-background text-xs">
          {stats.tournament}
        </Badge>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span>{stats.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{stats.venue}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Team 1 */}
          <div className="rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground flex items-center gap-2">
                <span>🇯🇵</span> {stats.teams.team1.name}
              </span>
              <span className="text-base font-extrabold text-foreground">
                {stats.teams.team1.score}
              </span>
            </div>
            {stats.teams.team1.overs && (
              <p className="mt-0.5 text-xs text-muted-foreground">{stats.teams.team1.overs}</p>
            )}
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground border-t border-border/50 pt-2">
              {stats.teams.team1.highlights}
            </p>
          </div>

          {/* Team 2 */}
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground flex items-center gap-2">
                <span>🇮🇳</span> {stats.teams.team2.name}
              </span>
              <span className="text-base font-extrabold text-primary">
                {stats.teams.team2.score}
              </span>
            </div>
            {stats.teams.team2.overs && (
              <p className="mt-0.5 text-xs text-muted-foreground">{stats.teams.team2.overs}</p>
            )}
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground border-t border-primary/20 pt-2">
              {stats.teams.team2.highlights}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold text-foreground">{stats.result}</span>
          </div>
          {stats.playerOfTheMatch && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Player of the Match:</span>
              <strong className="text-foreground">{stats.playerOfTheMatch}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

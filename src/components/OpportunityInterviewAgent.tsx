import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, RotateCcw, Sparkles } from "lucide-react";
import { SPORTS, CITIES, type Trial } from "@/data/trials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  OPPORTUNITY_GOALS,
  recommendOpportunities,
  type OpportunityGoal,
  type OpportunityRecommendation,
} from "@/lib/opportunity-interview-agent";

interface Props {
  opportunities: Trial[];
}

export function OpportunityInterviewAgent({ opportunities }: Props) {
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState("");
  const [goal, setGoal] = useState<OpportunityGoal | "">("");
  const [city, setCity] = useState("Any location");
  const [recommendations, setRecommendations] = useState<OpportunityRecommendation[] | null>(null);

  const reset = () => {
    setStep(1);
    setSport("");
    setGoal("");
    setCity("Any location");
    setRecommendations(null);
  };

  const findMatches = () => {
    if (!sport || !goal) return;
    setRecommendations(recommendOpportunities({ sport, goal, city }, opportunities));
    setStep(4);
  };

  return (
    <section className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5" aria-labelledby="opportunity-agent-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Opportunity interview agent
          </Badge>
          <h3 id="opportunity-agent-heading" className="mt-2 text-lg font-semibold">
            Find a listing that fits your next goal
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Answer three quick questions and we will rank the current opportunity listings for you.
          </p>
        </div>
        {step === 4 && (
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Start over
          </Button>
        )}
      </div>

      {step < 4 ? (
        <div className="mt-5">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {[1, 2, 3].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border ${
                    step >= item
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/50"
                  }`}
                >
                  {step > item ? <CheckCircle2 className="h-3.5 w-3.5" /> : item}
                </span>
                {item < 3 && <span className="h-px w-6 bg-border" />}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div>
              <h4 className="font-medium">What sport are you pursuing?</h4>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SPORTS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSport(option)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      sport === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background/40 hover:border-primary/50"
                    }`}
                    aria-pressed={sport === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <Button type="button" className="mt-4" onClick={() => setStep(2)} disabled={!sport}>
                Continue <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="font-medium">What would help you most right now?</h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {OPPORTUNITY_GOALS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setGoal(option.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      goal === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background/40 hover:border-primary/50"
                    }`}
                    aria-pressed={goal === option.id}
                  >
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)} disabled={!goal}>
                  Continue <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="font-medium">Where can you realistically attend?</h4>
              <label className="mt-3 block text-sm text-muted-foreground" htmlFor="opportunity-city">
                Preferred location
              </label>
              <select
                id="opportunity-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary sm:max-w-sm"
              >
                <option>Any location</option>
                {CITIES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="button" onClick={findMatches}>
                  Show my matches <Sparkles className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="rounded-xl border border-primary/25 bg-background/50 p-3 text-sm">
            <p className="font-medium">Your best matches for {sport}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ranked using your goal, preferred location, and the listing details currently available.
            </p>
          </div>
          <div className="mt-3 grid gap-3">
            {recommendations?.map(({ trial, reasons }) => (
              <article key={trial.id} className="rounded-xl border border-border bg-background/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Badge variant="secondary" className="text-[10px]">
                      {trial.sport} · {trial.tag}
                    </Badge>
                    <h4 className="mt-2 font-semibold">{trial.title}</h4>
                    <p className="text-sm text-muted-foreground">{trial.academy}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {trial.city}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Good fit because it is {reasons.join(", ") || "a current listing in your sport"}.
                </p>
                <Link
                  to="/trial/$id"
                  params={{ id: trial.id }}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  Review opportunity <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          <Link to="/trials" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
            Browse all live opportunities →
          </Link>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Recommendations are based on the information you provide and the current listing metadata. Check the organizer details before applying.
      </p>
    </section>
  );
}

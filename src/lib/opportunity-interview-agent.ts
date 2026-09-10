import type { Trial } from "@/data/trials";

export const OPPORTUNITY_GOALS = [
  {
    id: "first_step",
    label: "Get my first opportunity",
    description: "Find an accessible open day or entry-level assessment.",
  },
  {
    id: "scouting",
    label: "Get noticed by scouts",
    description: "Prioritize combines and listings built around scouting.",
  },
  {
    id: "official_pathway",
    label: "Follow an official pathway",
    description: "Look for federation or authority-backed opportunities.",
  },
  {
    id: "elite_competition",
    label: "Compete at a higher level",
    description: "Find elite, premium, or advanced selection events.",
  },
] as const;

export type OpportunityGoal = (typeof OPPORTUNITY_GOALS)[number]["id"];

export interface OpportunityInterviewAnswers {
  sport: string;
  city: string;
  goal: OpportunityGoal;
}

export interface OpportunityRecommendation {
  trial: Trial;
  score: number;
  reasons: string[];
}

const GOAL_TAGS: Record<OpportunityGoal, string[]> = {
  first_step: ["Open"],
  scouting: ["Scouted"],
  official_pathway: ["Official"],
  elite_competition: ["Elite", "Premium"],
};

export function recommendOpportunities(
  answers: OpportunityInterviewAnswers,
  opportunities: Trial[],
): OpportunityRecommendation[] {
  return opportunities
    .map((trial) => {
      let score = 0;
      const reasons: string[] = [];

      if (trial.sport === answers.sport) {
        score += 50;
        reasons.push(`${trial.sport} opportunity`);
      }

      if (answers.city !== "Any location" && trial.city === answers.city) {
        score += 25;
        reasons.push(`in ${trial.city}`);
      }

      if (GOAL_TAGS[answers.goal].includes(trial.tag)) {
        score += 20;
        reasons.push(`${trial.tag.toLowerCase()} pathway`);
      }

      if (answers.goal === "first_step" && trial.fee === 0) {
        score += 5;
        reasons.push("no registration fee");
      }

      return { trial, score, reasons };
    })
    .sort((first, second) => {
      if (second.score !== first.score) return second.score - first.score;
      return new Date(first.trial.date).getTime() - new Date(second.trial.date).getTime();
    })
    .slice(0, 3);
}

export interface AthleteProfile {
  name: string;
  sport: string;
  ageBand: string;
  city: string;
  fitnessSummary: string | null;
  results: string[];
  trials: string[];
  videoUrl: string | null;
  coachReference: string | null;
  availability: string | null;
}

export type ImprovementPriority = "high" | "medium" | "low";

export interface ProfileImprovement {
  id: string;
  priority: ImprovementPriority;
  title: string;
  reason: string;
  action: string;
}

export interface AthleteProfileAnalysis {
  score: number;
  profile: AthleteProfile;
  summary: string;
  improvements: ProfileImprovement[];
}

export function analyzeAthleteProfile(profile: AthleteProfile): AthleteProfileAnalysis {
  const improvements: ProfileImprovement[] = [];
  let score = 20;

  if (profile.results.length > 0) score += 20;
  else {
    improvements.push({
      id: "results",
      priority: "high",
      title: "Add dated performance evidence",
      reason:
        "Reviewers need context to compare progress across events, age groups and conditions.",
      action: "Add two or three recent results with the event, date, format and outcome.",
    });
  }

  if (profile.videoUrl) score += 20;
  else {
    improvements.push({
      id: "video",
      priority: "high",
      title: "Attach a focused skills clip",
      reason:
        "A short, clearly labelled clip gives a coach more useful context than a broad claim about ability.",
      action: "Add a 60–90 second clip showing your role, sport and the date recorded.",
    });
  }

  if (profile.fitnessSummary) score += 15;
  else {
    improvements.push({
      id: "fitness",
      priority: "medium",
      title: "Record current fitness markers",
      reason:
        "Simple, consistently recorded measures help a reviewer understand your current training baseline.",
      action: "Add recent coach-reviewed or repeatable measures relevant to your sport.",
    });
  }

  if (profile.coachReference) score += 15;
  else {
    improvements.push({
      id: "reference",
      priority: "medium",
      title: "Add a permission-based coach reference",
      reason:
        "A named reference can clarify your role, training habits and the context behind your results.",
      action:
        "Ask a coach or academy contact for permission before adding their name and contact details.",
    });
  }

  if (profile.trials.length > 0) score += 5;
  else {
    improvements.push({
      id: "experience",
      priority: "low",
      title: "Document relevant trial experience",
      reason:
        "A short history helps opportunities understand the level and format you have already encountered.",
      action: "List recent assessments or competitions and note what you learned from each one.",
    });
  }

  if (profile.availability) score += 5;
  else {
    improvements.push({
      id: "availability",
      priority: "low",
      title: "Make your availability clear",
      reason:
        "Clear location and schedule details reduce friction when a coach wants to follow up.",
      action: "Add your city, travel range and the days or times you can attend assessments.",
    });
  }

  const normalizedScore = Math.min(100, score);
  const summary =
    improvements.length === 0
      ? "Your profile has the core evidence a reviewer needs. Keep dates, links and results current."
      : `${improvements.length} improvement${improvements.length === 1 ? "" : "s"} could make your profile easier for a professional reviewer to assess.`;

  return { score: normalizedScore, profile, summary, improvements };
}

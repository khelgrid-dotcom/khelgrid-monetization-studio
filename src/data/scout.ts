export interface ScoutAthlete {
  id: string;
  name: string;
  sport: string;
  city: string;
  ageGroup: string;
  position: string;
  strengths: string[];
  latestEvidence: string;
  status: "New profile" | "Shortlisted" | "Follow up";
  lastUpdated: string;
}

export const SCOUT_ATHLETES: ScoutAthlete[] = [
  {
    id: "athlete-1",
    name: "Arjun Mehta",
    sport: "Cricket",
    city: "Delhi",
    ageGroup: "U-19",
    position: "Top-order batter",
    strengths: ["Footwork", "Shot selection", "Match awareness"],
    latestEvidence: "Sports CV updated with recent match footage",
    status: "Shortlisted",
    lastUpdated: "2026-03-08",
  },
  {
    id: "athlete-2",
    name: "Priya Kumar",
    sport: "Badminton",
    city: "Mumbai",
    ageGroup: "U-17",
    position: "Singles",
    strengths: ["Movement", "Recovery", "Competitive focus"],
    latestEvidence: "Tournament result and coach reference added",
    status: "Follow up",
    lastUpdated: "2026-03-05",
  },
  {
    id: "athlete-3",
    name: "Kabir Singh",
    sport: "Football",
    city: "Bengaluru",
    ageGroup: "U-16",
    position: "Central midfielder",
    strengths: ["Scanning", "Passing range", "Work rate"],
    latestEvidence: "Assessment clip uploaded for review",
    status: "New profile",
    lastUpdated: "2026-03-02",
  },
  {
    id: "athlete-4",
    name: "Sneha Patel",
    sport: "Athletics",
    city: "Pune",
    ageGroup: "Senior",
    position: "400m",
    strengths: ["Race discipline", "Acceleration", "Training consistency"],
    latestEvidence: "Personal-best log and event history updated",
    status: "Shortlisted",
    lastUpdated: "2026-02-27",
  },
];

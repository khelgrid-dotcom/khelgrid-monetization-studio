import { Trial } from "./trials";

export interface Recommendation extends Trial {
  matchScore: number;
  reason: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  sport: string;
  city: string;
  priceRange?: [number, number];
  skillLevel?: string;
  createdAt: Date;
  savedCount: number;
}

export const mockSavedSearches: SavedSearch[] = [
  {
    id: "search-1",
    name: "Beginner Cricket Trials",
    sport: "Cricket",
    city: "Mumbai",
    skillLevel: "Beginner",
    createdAt: new Date("2024-01-15"),
    savedCount: 1,
  },
  {
    id: "search-2",
    name: "Affordable Football",
    sport: "Football",
    city: "Delhi",
    priceRange: [0, 500],
    createdAt: new Date("2024-01-10"),
    savedCount: 3,
  },
];

export const mockNotifications = [
  {
    id: "notif-1",
    type: "new_trial",
    title: "New Cricket trial in your area!",
    description: "Elite Cricket Academy is hosting a new trial this weekend",
    read: false,
    createdAt: new Date(),
    trialId: "trial-1",
  },
  {
    id: "notif-2",
    type: "saved_search",
    title: "3 new trials match your search",
    description: "Check out these beginner-friendly football trials",
    read: false,
    createdAt: new Date(Date.now() - 3600000),
    searchId: "search-1",
  },
  {
    id: "notif-3",
    type: "opportunity_closing",
    title: "Only 2 spots left!",
    description: "Cricket Elite Trial - Last day to apply",
    read: true,
    createdAt: new Date(Date.now() - 86400000),
    trialId: "trial-2",
  },
];

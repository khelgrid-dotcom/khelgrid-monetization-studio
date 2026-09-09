export interface AthleteStats {
  userId: string;
  totalTrialsApplied: number;
  successfulSelections: number;
  successRate: number;
  averageRating: number;
  totalEvents: number;
  streakDays: number;
  lastActive: Date;
  achievements: Achievement[];
  performanceMetrics: {
    sport: string;
    wins: number;
    losses: number;
    draws?: number;
  }[];
}

export interface VenueStats {
  venueId: string;
  totalBookings: number;
  occupancyRate: number;
  avgRating: number;
  revenue: number;
  peakHours: string[];
  popularSports: string[];
  retention: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Leaderboard {
  rank: number;
  userId: string;
  userName: string;
  sport: string;
  city: string;
  score: number;
  trials: number;
  rating: number;
  image?: string;
}

export const mockAthleteStats: AthleteStats = {
  userId: "user-current",
  totalTrialsApplied: 8,
  successfulSelections: 5,
  successRate: 62.5,
  averageRating: 4.5,
  totalEvents: 12,
  streakDays: 15,
  lastActive: new Date(),
  achievements: [
    {
      id: "ach-1",
      name: "First Trial",
      description: "Applied to your first trial",
      icon: "🎯",
      unlockedAt: new Date("2023-12-01"),
      rarity: "common",
    },
    {
      id: "ach-2",
      name: "Selected!",
      description: "Got selected in 5 trials",
      icon: "⭐",
      unlockedAt: new Date("2024-01-15"),
      rarity: "rare",
    },
    {
      id: "ach-3",
      name: "Perfect Record",
      description: "5-star rating on all trials",
      icon: "🏆",
      unlockedAt: new Date("2024-01-20"),
      rarity: "epic",
    },
  ],
  performanceMetrics: [
    { sport: "Cricket", wins: 3, losses: 1 },
    { sport: "Football", wins: 2, losses: 2 },
  ],
};

export const mockLeaderboard: Leaderboard[] = [
  {
    rank: 1,
    userId: "user-2",
    userName: "Virat Sharma",
    sport: "Cricket",
    city: "Mumbai",
    score: 9800,
    trials: 25,
    rating: 4.9,
  },
  {
    rank: 2,
    userId: "user-3",
    userName: "Priya Kumar",
    sport: "Cricket",
    city: "Delhi",
    score: 9200,
    trials: 23,
    rating: 4.8,
  },
  {
    rank: 3,
    userId: "user-current",
    userName: "You",
    sport: "Cricket",
    city: "Bangalore",
    score: 8900,
    trials: 8,
    rating: 4.5,
  },
  {
    rank: 4,
    userId: "user-4",
    userName: "Arjun Singh",
    sport: "Cricket",
    city: "Chennai",
    score: 8600,
    trials: 20,
    rating: 4.7,
  },
  {
    rank: 5,
    userId: "user-5",
    userName: "Sneha Patel",
    sport: "Cricket",
    city: "Mumbai",
    score: 8200,
    trials: 18,
    rating: 4.6,
  },
];

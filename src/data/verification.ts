export interface Organizer {
  id: string;
  name: string;
  verified: boolean;
  verifiedDate?: Date;
  badgeType: "none" | "verified" | "trusted" | "elite";
  totalTrials: number;
  totalParticipants: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  refundRate: number;
}

export interface Review {
  id: string;
  organizerId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  trialTitle: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  initiatedBy: "user" | "organizer";
  reason: string;
  status: "open" | "resolved" | "refunded" | "dismissed";
  amount: number;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export const mockOrganizers: Organizer[] = [
  {
    id: "org-1",
    name: "Elite Cricket Academy",
    verified: true,
    verifiedDate: new Date("2023-06-15"),
    badgeType: "elite",
    totalTrials: 24,
    totalParticipants: 1250,
    rating: 4.8,
    reviewCount: 156,
    responseRate: 98,
    refundRate: 2,
  },
  {
    id: "org-2",
    name: "Pro Football Academy",
    verified: true,
    verifiedDate: new Date("2023-08-20"),
    badgeType: "trusted",
    totalTrials: 18,
    totalParticipants: 890,
    rating: 4.6,
    reviewCount: 98,
    responseRate: 95,
    refundRate: 3,
  },
  {
    id: "org-3",
    name: "Casual Sports Arena",
    verified: false,
    badgeType: "none",
    totalTrials: 5,
    totalParticipants: 120,
    rating: 4.2,
    reviewCount: 12,
    responseRate: 70,
    refundRate: 5,
  },
];

export const mockReviews: Review[] = [
  {
    id: "review-1",
    organizerId: "org-1",
    userId: "user-1",
    userName: "Raj Kumar",
    rating: 5,
    title: "Excellent coaching and professional setup",
    content:
      "The trial was very well organized. Coaches were experienced and gave constructive feedback. Highly recommend!",
    verified: true,
    helpful: 24,
    createdAt: new Date("2024-01-10"),
    trialTitle: "Cricket Elite Trial",
  },
  {
    id: "review-2",
    organizerId: "org-1",
    userId: "user-2",
    userName: "Priya Singh",
    rating: 4,
    title: "Good experience overall",
    content: "Great opportunity to learn. Only issue was the crowd management.",
    verified: true,
    helpful: 8,
    createdAt: new Date("2024-01-05"),
    trialTitle: "Cricket Elite Trial",
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: "dispute-1",
    transactionId: "txn-001",
    initiatedBy: "user",
    reason: "Trial was cancelled without notice",
    status: "resolved",
    amount: 500,
    createdAt: new Date("2024-01-08"),
    resolvedAt: new Date("2024-01-12"),
    resolution: "Full refund processed",
  },
];

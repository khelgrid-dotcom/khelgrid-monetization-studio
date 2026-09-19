export type UserRole = "user" | "coach" | "academy" | "athlete" | "organizer" | "recruiter";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "coach" | "academy";
  avatarUrl?: string;
  city?: string;
  primarySport?: string;
  secondarySports?: string[];
  organization?: string;
  credentials?: string;
  licenseNumber?: string;
  verified?: boolean;
  lastLoginAt?: string;
  targetRoute?: string;
}

export const ROLE_DEFINITIONS = {
  user: {
    key: "user" as const,
    label: "Athlete / Player",
    shortLabel: "Athlete",
    subtitle: "For athletes, players & aspiring talent",
    description: "Track trials, manage your Sports CV, book turfs, and scout national selections.",
    accentColor: "emerald",
    defaultRoute: "/dashboard",
    badge: "Athlete Portal",
  },
  coach: {
    key: "coach" as const,
    label: "Coach / Trainer",
    shortLabel: "Coach",
    subtitle: "For certified coaches & sports trainers",
    description:
      "Manage coaching programs, track trainee progression, and review talent scout reports.",
    accentColor: "blue",
    defaultRoute: "/scout-portal",
    badge: "Coach Portal",
  },
  academy: {
    key: "academy" as const,
    label: "Academy / Club",
    shortLabel: "Academy",
    subtitle: "For sports academies, venues & turf organizers",
    description: "Host selection trials, manage venue bookings, and oversee student enrollments.",
    accentColor: "amber",
    defaultRoute: "/academy",
    badge: "Academy Portal",
  },
} as const;

export const DEMO_ACCOUNTS: Record<"user" | "coach" | "academy", UserAccount> = {
  user: {
    id: "user-arjun-mehta",
    name: "Arjun Mehta",
    email: "arjun.mehta@khelgrid.com",
    phone: "+91 98765 43210",
    role: "user",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    city: "Bengaluru",
    primarySport: "Cricket",
    secondarySports: ["Badminton", "Football"],
    organization: "Karnataka State Youth Cricket",
    credentials: "State Finalist U-19",
    verified: true,
    targetRoute: "/dashboard",
  },
  coach: {
    id: "coach-rajesh-sharma",
    name: "Coach Rajesh Sharma",
    email: "coach.rajesh@khelgrid.com",
    phone: "+91 98123 45678",
    role: "coach",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    city: "Delhi NCR",
    primarySport: "Cricket & Athletics",
    secondarySports: ["Fitness & Conditioning"],
    organization: "Delhi North Sports High-Performance Center",
    credentials: "BCCI Level-2 & NIS Certified High-Performance Coach",
    licenseNumber: "BCCI-COACH-2018-4421",
    verified: true,
    targetRoute: "/scout-portal",
  },
  academy: {
    id: "academy-apex-mumbai",
    name: "Apex Sports Arena & Academy",
    email: "contact@apexacademy.org",
    phone: "+91 98450 11223",
    role: "academy",
    avatarUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80",
    city: "Mumbai",
    primarySport: "Multi-Sport (Cricket, Football, Tennis)",
    secondarySports: ["Badminton", "Swimming"],
    organization: "Apex Sports Infrastructure Ltd.",
    credentials: "Affiliated with Maharashtra State Sports Council (Reg #MS-2021-884)",
    licenseNumber: "MSSC-ACAD-884",
    verified: true,
    targetRoute: "/academy",
  },
};

export function normalizeRole(rawRole?: string): "user" | "coach" | "academy" {
  if (!rawRole) return "user";
  const lower = rawRole.toLowerCase();
  if (lower === "coach" || lower === "recruiter") return "coach";
  if (lower === "academy" || lower === "organizer") return "academy";
  return "user";
}

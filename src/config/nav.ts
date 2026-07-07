import type { ComponentType } from "react";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  ScanLine,
  Users,
  BookOpen,
  Crown,
  GraduationCap,
  Smartphone,
  Info,
  CalendarCheck,
  CalendarDays,
  Star,
  Search,
  Trophy,
  MapPin,
  Wrench,
  Swords,
  Home,
  Compass,
  User,
  Zap,
  LogIn,
  Radio,
  Briefcase,
  Library,
  Heart,
  Shield,
  TrendingUp,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Which nav surfaces should render this item. */
  surfaces: Array<"primary" | "features">;
};

/**
 * Single source of truth for in-app navigation. Both the desktop
 * FeaturesSidebar and mobile NavDrawer render from this list, and the
 * Breadcrumbs component derives its route→label map from it so labels
 * can never drift between surfaces.
 *
 * Add a route here and it automatically appears wherever it's needed
 * (per its `surfaces`) with a matching breadcrumb label.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home, surfaces: ["primary"] },
  { to: "/search", label: "Search trials", icon: Search, surfaces: ["primary", "features"] },
  { to: "/trials", label: "Live Trials", icon: Radio, surfaces: [] },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase, surfaces: [] },
  { to: "/resources", label: "Resources", icon: Library, surfaces: [] },
  { to: "/sports", label: "Sports", icon: Trophy, surfaces: ["primary", "features"] },
  { to: "/cities", label: "Cities", icon: Compass, surfaces: ["primary"] },
  { to: "/guides", label: "Guides", icon: BookOpen, surfaces: ["primary", "features"] },
  { to: "/tools", label: "Tools & calculators", icon: Wrench, surfaces: ["primary", "features"] },
  { to: "/play", label: "Play · Find games", icon: Swords, surfaces: ["primary", "features"] },
  { to: "/book", label: "Book venues", icon: CalendarCheck, surfaces: ["primary", "features"] },
  { to: "/train", label: "Train · Coaching", icon: GraduationCap, surfaces: ["primary", "features"] },
  { to: "/events", label: "Events & tournaments", icon: CalendarDays, surfaces: ["primary", "features"] },
  { to: "/memberships", label: "Memberships", icon: Star, surfaces: ["primary", "features"] },
  { to: "/recommendations", label: "For You", icon: Heart, surfaces: ["primary", "features"] },
  { to: "/trust-center", label: "Trust Center", icon: Shield, surfaces: ["primary", "features"] },
  { to: "/my-stats", label: "My Stats", icon: TrendingUp, surfaces: ["primary", "features"] },
  { to: "/crawler", label: "Sports Crawler", icon: Bot, surfaces: ["features"] },
  { to: "/dashboard", label: "My Dashboard", icon: User, surfaces: ["primary"] },
  { to: "/start-from-zero", label: "Start From Zero", icon: Sparkles, surfaces: ["features"] },
  { to: "/ai-guide", label: "AI Guide", icon: Bot, surfaces: ["features"] },
  { to: "/verify", label: "Verify", icon: ShieldCheck, surfaces: ["features"] },
  { to: "/talent-scanner", label: "Talent Scanner", icon: ScanLine, surfaces: ["features"] },
  { to: "/community", label: "Community", icon: Users, surfaces: ["features"] },
  { to: "/learning-hub", label: "Learning Hub", icon: BookOpen, surfaces: ["features"] },
  { to: "/pricing", label: "Pricing", icon: Crown, surfaces: ["features"] },
  { to: "/coaches", label: "Coaches", icon: GraduationCap, surfaces: ["features"] },
  { to: "/academy", label: "For Academies", icon: Trophy, surfaces: ["features"] },
  { to: "/mobile-app", label: "Mobile App", icon: Smartphone, surfaces: ["features"] },
  { to: "/about", label: "About", icon: Info, surfaces: ["primary", "features"] },
  { to: "/login", label: "Log in", icon: LogIn, surfaces: [] },
];

/**
 * Labels for dynamic route IDs (contain `$param`) — these never appear in
 * NAV_ITEMS because they aren't linkable without params.
 */
export const DYNAMIC_ROUTE_LABELS: Record<string, string> = {
  "/sports/$slug": "Sport",
  "/sport/$slug": "Sport",
  "/city/$slug": "City",
  "/guide/$slug": "Guide",
  "/tool/$slug": "Tool",
  "/tools/$slug": "Tool",
  "/sport-in-city/$slug": "Sport in city",
  "/top-guides/$category": "Top guides",
  "/best-tools/$category": "Best tools",
  "/recommendations": "For You",
  "/trust-center": "Trust Center",
  "/my-stats": "My Stats",
};

/**
 * Route path → label map derived from NAV_ITEMS + dynamic overrides.
 * Consumers (Breadcrumbs) read from this so labels can't drift from nav.
 */
export const ROUTE_LABELS: Record<string, string> = {
  ...Object.fromEntries(NAV_ITEMS.map((i) => [i.to, i.label])),
  ...DYNAMIC_ROUTE_LABELS,
};

// Convenience filtered lists for existing consumers.
export const PRIMARY_ITEMS = NAV_ITEMS.filter((i) => i.surfaces.includes("primary"));
export const FEATURE_ITEMS = NAV_ITEMS.filter((i) => i.surfaces.includes("features"));

// Zap is re-exported so NavDrawer's "Go Pro" CTA can keep using it without
// importing lucide directly if it prefers a single import site.
export { Zap };

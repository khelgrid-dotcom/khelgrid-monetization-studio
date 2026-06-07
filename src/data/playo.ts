// Mock seed data for Playo-style features: venues, coaching, events, games, memberships.

export const PLAYO_SPORTS = [
  "Cricket", "Football", "Badminton", "Tennis", "Pickleball", "Basketball",
  "Box Cricket", "Table Tennis", "Swimming", "Volleyball",
] as const;

export const PLAYO_CITIES = [
  "Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai", "Pune", "Chandigarh",
] as const;

export interface Venue {
  id: string;
  name: string;
  area: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  sports: string[];
  pricePerHour: number;
  featured?: boolean;
  bookable?: boolean;
  image: string;
}

export interface CoachingProgram {
  id: string;
  title: string;
  coach: string;
  sport: string;
  city: string;
  area: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  pricePerMonth: number;
  rating: number;
  image: string;
}

export interface SportEvent {
  id: string;
  title: string;
  sport: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  entryFee: number;
  spotsLeft: number;
  format: string;
  image: string;
}

export interface Game {
  id: string;
  sport: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  host: string;
  joined: number;
  capacity: number;
  costPerPlayer: number;
}

export interface Membership {
  id: string;
  name: string;
  venue: string;
  city: string;
  sport: string;
  durationMonths: number;
  price: number;
  perks: string[];
  popular?: boolean;
}

const IMG = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const VENUES: Venue[] = [
  { id: "v1", name: "FerroHub Sports | Millers", area: "Vasanth Nagar", city: "Bengaluru", distanceKm: 2.4, rating: 4.25, reviews: 4, sports: ["Pickleball", "Box Cricket"], pricePerHour: 800, featured: true, bookable: true, image: IMG("photo-1518091043644-c1d4457512c6") },
  { id: "v2", name: "Depot18 - Sports", area: "Jayamahal Palace Road", city: "Bengaluru", distanceKm: 2.8, rating: 4.63, reviews: 16, sports: ["Football", "Cricket"], pricePerHour: 1200, featured: true, bookable: true, image: IMG("photo-1459865264687-595d652de67e") },
  { id: "v3", name: "Wellness Sports Inc", area: "Sampangi Rama Nagar", city: "Bengaluru", distanceKm: 0.6, rating: 4.5, reviews: 28, sports: ["Swimming"], pricePerHour: 600, bookable: true, image: IMG("photo-1530549387789-4c1017266635") },
  { id: "v4", name: "Smashers Arena", area: "Indiranagar", city: "Bengaluru", distanceKm: 5.1, rating: 4.7, reviews: 122, sports: ["Badminton", "Table Tennis"], pricePerHour: 450, bookable: true, image: IMG("photo-1626224583764-f87db24ac4ea") },
  { id: "v5", name: "Turf Town Andheri", area: "Andheri West", city: "Mumbai", distanceKm: 3.2, rating: 4.6, reviews: 210, sports: ["Football", "Cricket"], pricePerHour: 1500, featured: true, bookable: true, image: IMG("photo-1551958219-acbc608c6377") },
  { id: "v6", name: "Hauz Khas Sports Complex", area: "Hauz Khas", city: "Delhi", distanceKm: 4.0, rating: 4.4, reviews: 89, sports: ["Tennis", "Basketball"], pricePerHour: 700, bookable: true, image: IMG("photo-1542144612-1b3641ec3459") },
  { id: "v7", name: "Padmavati Indoor Arena", area: "Madhapur", city: "Hyderabad", distanceKm: 2.1, rating: 4.55, reviews: 64, sports: ["Badminton", "Pickleball"], pricePerHour: 550, bookable: true, image: IMG("photo-1599058917212-d750089bc07e") },
  { id: "v8", name: "Pune Box Cricket Hub", area: "Baner", city: "Pune", distanceKm: 6.4, rating: 4.3, reviews: 41, sports: ["Box Cricket"], pricePerHour: 900, bookable: true, image: IMG("photo-1531415074968-036ba1b575da") },
  { id: "v9", name: "Marina Aquatic Centre", area: "Adyar", city: "Chennai", distanceKm: 3.0, rating: 4.65, reviews: 73, sports: ["Swimming", "Volleyball"], pricePerHour: 500, bookable: true, image: IMG("photo-1576013551627-0cc20b96c2a7") },
  { id: "v10", name: "Sector 17 Arena", area: "Sector 17", city: "Chandigarh", distanceKm: 1.5, rating: 4.5, reviews: 35, sports: ["Football", "Tennis"], pricePerHour: 850, featured: true, bookable: true, image: IMG("photo-1508098682722-e99c43a406b2") },
];

export const COACHING: CoachingProgram[] = [
  { id: "c1", title: "Junior Cricket Coaching", coach: "Coach Arjun Mehta", sport: "Cricket", city: "Bengaluru", area: "Koramangala", level: "Beginner", pricePerMonth: 3500, rating: 4.7, image: IMG("photo-1531415074968-036ba1b575da") },
  { id: "c2", title: "Pro Badminton Academy", coach: "Coach Priya Nair", sport: "Badminton", city: "Hyderabad", area: "Madhapur", level: "Advanced", pricePerMonth: 6500, rating: 4.9, image: IMG("photo-1626224583764-f87db24ac4ea") },
  { id: "c3", title: "Beginner Tennis Bootcamp", coach: "Coach Rohan Iyer", sport: "Tennis", city: "Mumbai", area: "Bandra", level: "Beginner", pricePerMonth: 4200, rating: 4.6, image: IMG("photo-1542144612-1b3641ec3459") },
  { id: "c4", title: "Football Skills Lab", coach: "Coach Vikram Singh", sport: "Football", city: "Delhi", area: "Dwarka", level: "Intermediate", pricePerMonth: 3800, rating: 4.5, image: IMG("photo-1551958219-acbc608c6377") },
  { id: "c5", title: "All Levels Swim School", coach: "Coach Anjali Rao", sport: "Swimming", city: "Chennai", area: "Adyar", level: "All Levels", pricePerMonth: 5000, rating: 4.8, image: IMG("photo-1530549387789-4c1017266635") },
  { id: "c6", title: "Pickleball Starter Pack", coach: "Coach Daniel Thomas", sport: "Pickleball", city: "Bengaluru", area: "Indiranagar", level: "Beginner", pricePerMonth: 2800, rating: 4.4, image: IMG("photo-1599058917212-d750089bc07e") },
  { id: "c7", title: "Basketball Elite Squad", coach: "Coach Kunal Verma", sport: "Basketball", city: "Pune", area: "Aundh", level: "Advanced", pricePerMonth: 5500, rating: 4.7, image: IMG("photo-1546519638-68e109498ffc") },
  { id: "c8", title: "Table Tennis Pro Path", coach: "Coach Meera Joshi", sport: "Table Tennis", city: "Chandigarh", area: "Sector 22", level: "Intermediate", pricePerMonth: 3200, rating: 4.5, image: IMG("photo-1611251135345-18c56206b863") },
];

export const EVENTS: SportEvent[] = [
  { id: "e1", title: "Sunday Pickleball Open", sport: "Pickleball", city: "Bengaluru", venue: "FerroHub Sports", date: "Sun, Jun 14", time: "8:00 AM", entryFee: 499, spotsLeft: 12, format: "Doubles · Round Robin", image: IMG("photo-1599058917212-d750089bc07e") },
  { id: "e2", title: "Corporate Cricket Cup", sport: "Box Cricket", city: "Mumbai", venue: "Turf Town Andheri", date: "Sat, Jun 20", time: "5:00 PM", entryFee: 1500, spotsLeft: 4, format: "Teams of 6", image: IMG("photo-1531415074968-036ba1b575da") },
  { id: "e3", title: "City Badminton League · Wk 3", sport: "Badminton", city: "Hyderabad", venue: "Padmavati Indoor", date: "Fri, Jun 12", time: "7:30 PM", entryFee: 350, spotsLeft: 8, format: "Mixed Doubles", image: IMG("photo-1626224583764-f87db24ac4ea") },
  { id: "e4", title: "5-a-Side Football Showdown", sport: "Football", city: "Delhi", venue: "Hauz Khas Sports", date: "Sun, Jun 21", time: "6:00 AM", entryFee: 800, spotsLeft: 2, format: "Single Elim", image: IMG("photo-1551958219-acbc608c6377") },
  { id: "e5", title: "Pune Tennis Knockout", sport: "Tennis", city: "Pune", venue: "Aundh Sports Club", date: "Sat, Jun 27", time: "9:00 AM", entryFee: 600, spotsLeft: 6, format: "Singles · Best of 3", image: IMG("photo-1542144612-1b3641ec3459") },
  { id: "e6", title: "Aqua Sprint Meet", sport: "Swimming", city: "Chennai", venue: "Marina Aquatic", date: "Sun, Jul 05", time: "7:00 AM", entryFee: 450, spotsLeft: 22, format: "50m / 100m heats", image: IMG("photo-1530549387789-4c1017266635") },
];

export const GAMES: Game[] = [
  { id: "g1", sport: "Pickleball", city: "Bengaluru", venue: "FerroHub Sports", date: "Tue, Jun 10", time: "7:00 PM", skillLevel: "Intermediate", host: "Rahul S.", joined: 3, capacity: 4, costPerPlayer: 200 },
  { id: "g2", sport: "Football", city: "Mumbai", venue: "Turf Town Andheri", date: "Wed, Jun 11", time: "8:30 PM", skillLevel: "Beginner", host: "Aakash M.", joined: 8, capacity: 12, costPerPlayer: 250 },
  { id: "g3", sport: "Badminton", city: "Hyderabad", venue: "Padmavati Indoor", date: "Tue, Jun 10", time: "6:30 PM", skillLevel: "Advanced", host: "Sneha K.", joined: 3, capacity: 4, costPerPlayer: 150 },
  { id: "g4", sport: "Cricket", city: "Delhi", venue: "Hauz Khas Sports", date: "Sat, Jun 14", time: "5:00 AM", skillLevel: "Intermediate", host: "Vikram P.", joined: 14, capacity: 22, costPerPlayer: 180 },
  { id: "g5", sport: "Tennis", city: "Pune", venue: "Aundh Sports Club", date: "Thu, Jun 12", time: "6:00 PM", skillLevel: "Intermediate", host: "Neha R.", joined: 1, capacity: 4, costPerPlayer: 220 },
  { id: "g6", sport: "Box Cricket", city: "Bengaluru", venue: "Smashers Arena", date: "Fri, Jun 13", time: "9:00 PM", skillLevel: "Beginner", host: "Karan D.", joined: 6, capacity: 10, costPerPlayer: 300 },
  { id: "g7", sport: "Basketball", city: "Chennai", venue: "Marina Aquatic", date: "Sun, Jun 15", time: "7:00 AM", skillLevel: "Advanced", host: "Manish T.", joined: 5, capacity: 10, costPerPlayer: 200 },
  { id: "g8", sport: "Table Tennis", city: "Chandigarh", venue: "Sector 17 Arena", date: "Wed, Jun 11", time: "7:30 PM", skillLevel: "Beginner", host: "Pooja M.", joined: 2, capacity: 4, costPerPlayer: 120 },
];

export const MEMBERSHIPS: Membership[] = [
  { id: "m1", name: "Starter Pass", venue: "FerroHub Sports", city: "Bengaluru", sport: "Pickleball", durationMonths: 1, price: 1999, perks: ["4 court hours / mo", "Free racket rental", "Member-only games"] },
  { id: "m2", name: "Quarterly Player", venue: "Smashers Arena", city: "Bengaluru", sport: "Badminton", durationMonths: 3, price: 5499, perks: ["12 court hours", "1 free coaching session", "Priority booking"], popular: true },
  { id: "m3", name: "Annual All-Sports", venue: "Turf Town Andheri", city: "Mumbai", sport: "All Sports", durationMonths: 12, price: 18999, perks: ["Unlimited weekday slots", "20% off events", "Bring-a-friend pass"], popular: true },
  { id: "m4", name: "Aqua Monthly", venue: "Marina Aquatic Centre", city: "Chennai", sport: "Swimming", durationMonths: 1, price: 2499, perks: ["Daily lane access", "Locker included"] },
  { id: "m5", name: "Tennis Quarterly", venue: "Hauz Khas Sports", city: "Delhi", sport: "Tennis", durationMonths: 3, price: 6999, perks: ["10 court hours", "2 ball boxes / mo", "Match ladder access"] },
  { id: "m6", name: "Pro League Annual", venue: "Padmavati Indoor", city: "Hyderabad", sport: "Badminton", durationMonths: 12, price: 21999, perks: ["Unlimited prime-time hours", "Coach access", "Event entry waived"] },
];

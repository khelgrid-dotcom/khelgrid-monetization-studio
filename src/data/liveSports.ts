export interface LiveMatchUpdate {
  id: string;
  sport: "Cricket" | "Football" | "Badminton" | "Hockey" | "Kabaddi" | "Tennis";
  status: "LIVE" | "UPCOMING" | "RECENT";
  tournament: string;
  stage?: string;
  matchInfo?: string;
  teamA: {
    name: string;
    code: string;
    score: string;
    logo?: string;
    flag?: string;
  };
  teamB: {
    name: string;
    code: string;
    score: string;
    logo?: string;
    flag?: string;
  };
  highlight: string;
  statusText?: string;
  venueOrOvers?: string;
  liveTime?: string;
  source: string;
  isRealTime?: boolean;
  hasSchedule?: boolean;
  hasPointsTable?: boolean;
}

export const LIVE_SPORTS_UPDATES: LiveMatchUpdate[] = [
  {
    id: "cricket-cans60-tts-bbz",
    sport: "Cricket",
    status: "LIVE",
    tournament: "CANS60",
    stage: "4th Match",
    matchInfo: "4th Match • CANS60",
    teamA: {
      name: "Toronto Titans",
      code: "TTS",
      score: "*120/2 (8 ov)",
      logo: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=80&q=80",
      flag: "🍁",
    },
    teamB: {
      name: "Brampton Blitz",
      code: "BBZ",
      score: "Yet to bat",
      logo: "https://images.unsplash.com/photo-1531415074868-036b1c57e359?auto=format&fit=crop&w=80&q=80",
      flag: "⚡",
    },
    highlight: "TTS cruising at 15.0 RRR · Powerplay surge",
    statusText: "BBZ elected to bowl",
    venueOrOvers: "8.0/10 ov",
    liveTime: "In-Play · Brampton Oval",
    source: "Live Cricket Feed",
    isRealTime: true,
    hasSchedule: true,
    hasPointsTable: true,
  },
  {
    id: "cricket-oit2026-oma-ker",
    sport: "Cricket",
    status: "LIVE",
    tournament: "OIT2026",
    stage: "7th Match",
    matchInfo: "7th Match • OIT2026",
    teamA: {
      name: "Oman National XI",
      code: "OMA",
      score: "-",
      logo: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=80&q=80",
      flag: "🇴🇲",
    },
    teamB: {
      name: "Kerala Cricket Team",
      code: "KER",
      score: "-",
      logo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=80&q=80",
      flag: "🏏",
    },
    highlight: "Persistent drizzle halted proceedings before coin toss",
    statusText: "Match Abandoned",
    venueOrOvers: "Abandoned without toss",
    liveTime: "Al Amerat Cricket Ground",
    source: "Live Cricket Feed",
    isRealTime: true,
    hasSchedule: true,
    hasPointsTable: true,
  },
  {
    id: "cricket-ind-a-aus-a-test",
    sport: "Cricket",
    status: "LIVE",
    tournament: "IND-A vs AUS-A",
    stage: "2nd unofficial Test",
    matchInfo: "2nd unofficial ... • IND-A vs AUS-A",
    teamA: {
      name: "India A",
      code: "IND-A",
      score: "*122/5 (51 ov)",
      logo: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=80&q=80",
      flag: "🇮🇳",
    },
    teamB: {
      name: "Australia A",
      code: "AUS-A",
      score: "358/10 (116.3 ov)",
      logo: "https://images.unsplash.com/photo-1531415074868-036b1c57e359?auto=format&fit=crop&w=80&q=80",
      flag: "🇦🇺",
    },
    highlight: "Easwaran 48*, Jurel 32 · Day 2 Stumps called",
    statusText: "Stumps : Day 2 - IND-A trail by 236 runs.",
    venueOrOvers: "Day 2 · 51 ov",
    liveTime: "Great Barrier Reef Arena, Mackay",
    source: "Live Cricket Feed",
    isRealTime: true,
    hasSchedule: true,
    hasPointsTable: false,
  },
  {
    id: "cricket-ind-eng-1",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Champions Trophy / Bilateral Series",
    stage: "2nd ODI",
    teamA: { name: "India", code: "IND", score: "248/4 (38.2 ov)" },
    teamB: { name: "England", code: "ENG", score: "Yet to bat" },
    highlight: "Gill 88* (76), Rahul 42* · Run Rate 6.47",
    venueOrOvers: "38.2/50 ov",
    liveTime: "Live from Ahmedabad",
    source: "Google Sports",
  },
  {
    id: "football-isl-mcfc-mbsg",
    sport: "Football",
    status: "LIVE",
    tournament: "Indian Super League",
    stage: "League Phase",
    teamA: { name: "Mumbai City FC", code: "MCFC", score: "2" },
    teamB: { name: "Mohun Bagan SG", code: "MBSG", score: "1" },
    highlight: "Chhangte 61' goal · Intense midfield battle",
    venueOrOvers: "74'",
    liveTime: "2nd Half · Mumbai Football Arena",
    source: "Google Sports",
  },
  {
    id: "badminton-all-england",
    sport: "Badminton",
    status: "LIVE",
    tournament: "All England Open Championships",
    stage: "Quarter-Final",
    teamA: { name: "Lakshya Sen", code: "IND", score: "21, 18, 16" },
    teamB: { name: "Viktor Axelsen", code: "DEN", score: "19, 21, 14" },
    highlight: "Deciding Game 3 · 16-14 in Lakshya's favor",
    venueOrOvers: "Game 3",
    liveTime: "Court 1 · Live",
    source: "Google Sports",
  },
  {
    id: "kabaddi-pkl-del-pun",
    sport: "Kabaddi",
    status: "LIVE",
    tournament: "Pro Kabaddi League",
    stage: "Zone Eliminator",
    teamA: { name: "Dabang Delhi KC", code: "DEL", score: "34" },
    teamB: { name: "Puneri Paltan", code: "PUN", score: "32" },
    highlight: "Naveen Express super raid under 2 mins left",
    venueOrOvers: "38'",
    liveTime: "2nd Half · Delhi",
    source: "Google Sports",
  },
  {
    id: "hockey-ind-ger",
    sport: "Hockey",
    status: "RECENT",
    tournament: "FIH Pro League 2026",
    stage: "Round Robin",
    teamA: { name: "India", code: "IND", score: "4" },
    teamB: { name: "Germany", code: "GER", score: "3" },
    highlight: "Harmanpreet Singh hat-trick on drag flicks",
    venueOrOvers: "Full Time",
    liveTime: "Rourkela Stadium",
    source: "Google Sports",
  },
  {
    id: "tennis-atp-bopanna",
    sport: "Tennis",
    status: "UPCOMING",
    tournament: "ATP Masters 1000 Indian Wells",
    stage: "Men's Doubles Semi-Final",
    teamA: { name: "Bopanna / Ebden", code: "IND/AUS", score: "-" },
    teamB: { name: "Granollers / Zeballos", code: "ESP/ARG", score: "-" },
    highlight: "Match scheduled at 18:30 IST today",
    venueOrOvers: "Starts 18:30 IST",
    liveTime: "Center Court",
    source: "Google Sports",
  },
];

export interface LiveMatchUpdate {
  id: string;
  sport: "Cricket" | "Football" | "Badminton" | "Hockey" | "Kabaddi" | "Tennis";
  status: "LIVE" | "UPCOMING" | "RECENT";
  tournament: string;
  stage?: string;
  teamA: {
    name: string;
    code: string;
    score: string;
    flag?: string;
  };
  teamB: {
    name: string;
    code: string;
    score: string;
    flag?: string;
  };
  highlight: string;
  venueOrOvers?: string;
  liveTime?: string;
  source: string;
}

export const LIVE_SPORTS_UPDATES: LiveMatchUpdate[] = [
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
    source: "Google Sports / Cricinfo",
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
    source: "Google Sports / ISL Media",
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
    source: "BWF / Google Sports",
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
    source: "PKL / Google Sports",
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
    source: "FIH / Google Sports",
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
    source: "ATP / Google Sports",
  },
];

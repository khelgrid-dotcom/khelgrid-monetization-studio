export const GOOGLE_CRICKET_SEARCH_URL =
  "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&sxsrf=APpeQnv7S_hYa8j3xghYQ4nz5MsSmeFQOQ:1791525759353&q=Live+Cricket+match+today&sa=X&sqi=2&ved=2ahUKEwivt_fDoayXAxX6zDgGHQu0G64Q1QJ6BAgxEAE&biw=1280&bih=631&dpr=1.5#sie=lg;/g/11ybbzm0qn;5;/m/021q23;mt;fp;1;;;;-1";

export const GOOGLE_IND_WI_2ND_T20I_URL =
  "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&sxsrf=APpeQnv7S_hYa8j3xghYQ4nz5MsSmeFQOQ:1791525759353&q=Live+Cricket+match+today&sa=X&sqi=2&ved=2ahUKEwivt_fDoayXAxX6zDgGHQu0G64Q1QJ6BAgxEAE&biw=1280&bih=631&dpr=1.5#sie=m;/g/11z3y_p23j;5;/m/021q23;dt;fp;1;;;;-1";

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
  googleUrl?: string;
}

export const LIVE_SPORTS_UPDATES: LiveMatchUpdate[] = [
  // 1. India vs West Indies 2nd T20I (Google Live Cricket schedule)
  {
    id: "cricket-ind-wi-2nd-t20i",
    sport: "Cricket",
    status: "LIVE",
    tournament: "West Indies Tour of India 2026",
    stage: "2nd T20I · Starts 7:00 PM IST",
    matchInfo: "2nd T20I • Bilateral Series",
    teamA: {
      name: "India",
      code: "IND",
      score: "Live on Google",
      flag: "🇮🇳",
    },
    teamB: {
      name: "West Indies",
      code: "WI",
      score: "Live on Google",
      flag: "🌴",
    },
    highlight: "2nd T20I of 5-match bilateral series under lights at Ranchi",
    statusText: "In-Play · For live ball-by-ball score visit Google",
    venueOrOvers: "Starts 7:00 PM IST",
    liveTime: "JSCA International Stadium Complex, Ranchi",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl: GOOGLE_IND_WI_2ND_T20I_URL,
  },
  // 2. South Africa vs Australia 1st Test (Google Live Cricket schedule)
  {
    id: "cricket-sa-aus-1st-test",
    sport: "Cricket",
    status: "LIVE",
    tournament: "Australia Tour of South Africa 2026",
    stage: "1st Test · Day 1",
    matchInfo: "1st Test • 3-Match Test Series",
    teamA: {
      name: "South Africa",
      code: "SA",
      score: "Live on Google",
      flag: "🇿🇦",
    },
    teamB: {
      name: "Australia",
      code: "AUS",
      score: "Live on Google",
      flag: "🇦🇺",
    },
    highlight: "Australia's first Test series visit to Kingsmead since 2018",
    statusText: "Day 1 In-Play · For live scorecard visit Google",
    venueOrOvers: "Day 1 · Kingsmead",
    liveTime: "Kingsmead, Durban (8:30 AM GMT / 1:00 PM IST)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+Australia+Tour+of+South+Africa+2026+1st+Test&sa=X#sie=m;/g/11y62wkmk8;5;/m/021q23;dt;fp;1;;;;-1",
  },
  // 3. Bangladesh vs Afghanistan Only Test (Google Live Cricket schedule)
  {
    id: "cricket-ban-afg-only-test",
    sport: "Cricket",
    status: "LIVE",
    tournament: "Afghanistan vs Bangladesh in UAE 2026",
    stage: "Only Test · Day 1",
    matchInfo: "Only Test • UAE Tour",
    teamA: {
      name: "Bangladesh",
      code: "BAN",
      score: "Live on Google",
      flag: "🇧🇩",
    },
    teamB: {
      name: "Afghanistan",
      code: "AFG",
      score: "Live on Google",
      flag: "🇦🇫",
    },
    highlight: "One-off Test match battle at Zayed Cricket Stadium",
    statusText: "Day 1 In-Play · For live scorecard visit Google",
    venueOrOvers: "Day 1 · Abu Dhabi",
    liveTime: "Sheikh Zayed Stadium, Abu Dhabi (7:00 AM GMT / 11:30 AM IST)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+Afghanistan+vs+Bangladesh+in+UAE+2026+Only+Test&sa=X",
  },
  // 4. Pakistan vs Sri Lanka 1st T20I (Google Live Cricket schedule)
  {
    id: "cricket-pak-sl-1st-t20i",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "Sri Lanka Tour of Pakistan 2026",
    stage: "1st T20I · Starts 9:00 PM IST",
    matchInfo: "1st T20I • Rawalpindi Series",
    teamA: {
      name: "Pakistan",
      code: "PAK",
      score: "Upcoming",
      flag: "🇵🇰",
    },
    teamB: {
      name: "Sri Lanka",
      code: "SL",
      score: "Upcoming",
      flag: "🇱🇰",
    },
    highlight: "Opening T20 international encounter under floodlights",
    statusText: "Scheduled today · For live score visit Google",
    venueOrOvers: "Starts 9:00 PM IST",
    liveTime: "Rawalpindi Cricket Stadium, Rawalpindi (3:30 PM GMT)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+Sri+Lanka+Tour+of+Pakistan+2026+1st+T20I&sa=X",
  },
  // 5. Oman vs Canada ODI (Google Live Cricket schedule)
  {
    id: "cricket-oma-can-cwc-league2",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's Cricket World Cup League 2",
    stage: "ODI Match 41",
    matchInfo: "ODI Match 41 • CWC League 2",
    teamA: {
      name: "Oman",
      code: "OMA",
      score: "Live on Google",
      flag: "🇴🇲",
    },
    teamB: {
      name: "Canada",
      code: "CAN",
      score: "Live on Google",
      flag: "🇨🇦",
    },
    highlight: "Crucial points on the line in ICC World Cup qualification",
    statusText: "In-Play · For live scorecard visit Google",
    venueOrOvers: "In-Play · 50 ov",
    liveTime: "Al Amerat Cricket Ground (Ministry Turf 1), Al Amarat (6:00 AM GMT)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+Cricket+World+Cup+League+2+Oman+vs+Canada&sa=X",
  },
  // 6. Namibia vs United Arab Emirates ODI (Google Live Cricket schedule)
  {
    id: "cricket-nam-uae-cwc-league2",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "ICC Men's Cricket World Cup League 2",
    stage: "ODI Match 42 · Starts 9:30 PM IST",
    matchInfo: "ODI Match 42 • CWC League 2",
    teamA: {
      name: "Namibia",
      code: "NAM",
      score: "Upcoming",
      flag: "🇳🇦",
    },
    teamB: {
      name: "United Arab Emirates",
      code: "UAE",
      score: "Upcoming",
      flag: "🇦🇪",
    },
    highlight: "League 2 showdown hosted at Grand Prairie Stadium",
    statusText: "Starts today at 9:30 PM IST · For live score visit Google",
    venueOrOvers: "Starts 9:30 PM IST",
    liveTime: "Grand Prairie Stadium, Texas (4:00 PM GMT / 9:30 PM IST)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+Cricket+World+Cup+League+2+Namibia+vs+UAE&sa=X",
  },
  // 7. Malaysia vs Saudi Arabia T20I (Google Live Cricket schedule)
  {
    id: "cricket-mas-ksa-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "Malaysia",
      code: "MAS",
      score: "Live on Google",
      flag: "🇲🇾",
    },
    teamB: {
      name: "Saudi Arabia",
      code: "KSA",
      score: "Live on Google",
      flag: "🇸🇦",
    },
    highlight: "High-stakes Asia regional qualifier match at Bayuemas Oval",
    statusText: "In-Play · For live score visit Google",
    venueOrOvers: "In-Play · 20 ov",
    liveTime: "Bayuemas Oval, Kuala Lumpur (7:00 AM GMT)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+B+Malaysia+vs+Saudi+Arabia&sa=X",
  },
  // 8. China vs Hong Kong T20I (Google Live Cricket schedule)
  {
    id: "cricket-chn-hk-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "China",
      code: "CHN",
      score: "Live on Google",
      flag: "🇨🇳",
    },
    teamB: {
      name: "Hong Kong",
      code: "HK",
      score: "Live on Google",
      flag: "🇭🇰",
    },
    highlight: "East Asian clash at UKM-YSD Cricket Oval",
    statusText: "In-Play · For live score visit Google",
    venueOrOvers: "In-Play · 20 ov",
    liveTime: "UKM-YSD Cricket Oval, Bangi (7:00 AM GMT)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+B+China+vs+Hong+Kong&sa=X",
  },
  // 9. Maldives vs Singapore T20I (Google Live Cricket schedule)
  {
    id: "cricket-mdv-sgp-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "Maldives",
      code: "MDV",
      score: "Live on Google",
      flag: "🇲🇻",
    },
    teamB: {
      name: "Singapore",
      code: "SGP",
      score: "Live on Google",
      flag: "🇸🇬",
    },
    highlight: "Sub-regional qualifier fixture at Selangor Turf Club",
    statusText: "In-Play · For live score visit Google",
    venueOrOvers: "In-Play · 20 ov",
    liveTime: "Selangor Turf Club, Kuala Lumpur (7:00 AM GMT)",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+B+Maldives+vs+Singapore&sa=X",
  },
  // 10. Bahrain vs Kuwait T20I (Google Live Cricket schedule)
  {
    id: "cricket-bhr-kuw-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Bahrain",
      code: "BHR",
      score: "Finished",
      flag: "🇧🇭",
    },
    teamB: {
      name: "Kuwait",
      code: "KUW",
      score: "Finished",
      flag: "🇰🇼",
    },
    highlight: "Gulf rivalry in ICC Asia Sub Regional Qualifier A",
    statusText: "Match Finished · For scorecard visit Google",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "UKM-YSD Cricket Oval, Bangi",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+A+Bahrain+vs+Kuwait&sa=X",
  },
  // 11. Qatar vs Myanmar T20I (Google Live Cricket schedule)
  {
    id: "cricket-qat-mya-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Qatar",
      code: "QAT",
      score: "Finished",
      flag: "🇶🇦",
    },
    teamB: {
      name: "Myanmar",
      code: "MYA",
      score: "Finished",
      flag: "🇲🇲",
    },
    highlight: "Qualifier round fixture at Selangor Turf Club",
    statusText: "Match Finished · For scorecard visit Google",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "Selangor Turf Club, Kuala Lumpur",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+A+Qatar+vs+Myanmar&sa=X",
  },
  // 12. Mongolia vs Thailand T20I (Google Live Cricket schedule)
  {
    id: "cricket-mng-tha-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Mongolia",
      code: "MNG",
      score: "Finished",
      flag: "🇲🇳",
    },
    teamB: {
      name: "Thailand",
      code: "THA",
      score: "Finished",
      flag: "🇹🇭",
    },
    highlight: "Qualifier round match at Bayuemas Oval",
    statusText: "Match Finished · For scorecard visit Google",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "Bayuemas Oval, Kuala Lumpur",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+ICC+T20+World+Cup+Asia+Qualifier+A+Mongolia+vs+Thailand&sa=X",
  },
  // 13. WPL RCB vs MI
  {
    id: "cricket-wpl-rcb-mi",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "Women's Premier League (WPL)",
    stage: "Match 14 · Starts 7:30 PM IST",
    matchInfo: "Match 14 • WPL 2026",
    teamA: { name: "Royal Challengers Bengaluru", code: "RCB-W", score: "Upcoming", flag: "🔴" },
    teamB: { name: "Mumbai Indians", code: "MI-W", score: "Upcoming", flag: "🔵" },
    highlight: "Blockbuster WPL clash · Smriti Mandhana vs Harmanpreet Kaur",
    statusText: "Upcoming · Starts 7:30 PM IST on Google",
    venueOrOvers: "Starts 7:30 PM IST",
    liveTime: "M. Chinnaswamy Stadium, Bengaluru",
    source: "Google Sports Live Feed",
    hasSchedule: true,
    googleUrl:
      "https://www.google.com/search?num=10&sca_esv=afb89ae158309890&q=Live+Cricket+match+today+RCB+vs+MI+Women+Premier+League+WPL&sa=X",
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
    teamA: { name: "India", code: "IND", score: "4", flag: "🇮🇳" },
    teamB: { name: "Germany", code: "GER", score: "3", flag: "🇩🇪" },
    highlight: "Harmanpreet Singh hat-trick on drag flicks",
    statusText: "Full Time · India clinched shootout bonus",
    venueOrOvers: "Full Time (60')",
    liveTime: "Birsa Munda Hockey Stadium, Rourkela",
    source: "Google Sports",
    hasSchedule: true,
  },
  {
    id: "tennis-atp-bopanna",
    sport: "Tennis",
    status: "UPCOMING",
    tournament: "ATP Masters 1000 Indian Wells",
    stage: "Men's Doubles Semi-Final",
    teamA: { name: "Bopanna / Ebden", code: "IND/AUS", score: "-", flag: "🇮🇳" },
    teamB: { name: "Granollers / Zeballos", code: "ESP/ARG", score: "-", flag: "🇪🇸" },
    highlight: "Match scheduled at 18:30 IST today",
    statusText: "Warm-up in progress",
    venueOrOvers: "Starts 18:30 IST",
    liveTime: "Stadium Court 1, Indian Wells",
    source: "Google Sports",
    hasSchedule: true,
  },
  {
    id: "cricket-wpl-rcb-mi",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "Women's Premier League (WPL)",
    stage: "League Stage · Match 14",
    matchInfo: "Match 14 • WPL 2026",
    teamA: { name: "Royal Challengers Bengaluru", code: "RCB-W", score: "-", flag: "🔴" },
    teamB: { name: "Mumbai Indians", code: "MI-W", score: "-", flag: "🔵" },
    highlight: "Blockbuster clash · Smriti Mandhana vs Harmanpreet Kaur",
    statusText: "Toss at 19:00 IST",
    venueOrOvers: "Starts 19:30 IST",
    liveTime: "M. Chinnaswamy Stadium, Bengaluru",
    source: "Live Cricket Feed",
    hasSchedule: true,
  },
  {
    id: "football-pl-ars-mci",
    sport: "Football",
    status: "LIVE",
    tournament: "Premier League",
    stage: "Matchday 28",
    matchInfo: "Matchday 28 • Premier League",
    teamA: { name: "Arsenal", code: "ARS", score: "2", flag: "🔴" },
    teamB: { name: "Manchester City", code: "MCI", score: "2", flag: "🩵" },
    highlight: "Saka 58' equalizer · End-to-end title showdown",
    statusText: "2nd Half · 82' in-play",
    venueOrOvers: "82'",
    liveTime: "Emirates Stadium, London",
    source: "Google Sports",
    isRealTime: true,
  },
  {
    id: "badminton-french-sindhu",
    sport: "Badminton",
    status: "RECENT",
    tournament: "French Open Super 750",
    stage: "Women's Singles Semi-Final",
    matchInfo: "Semi-Final • BWF Super 750",
    teamA: { name: "PV Sindhu", code: "IND", score: "21, 19, 21", flag: "🇮🇳" },
    teamB: { name: "An Se Young", code: "KOR", score: "18, 21, 17", flag: "🇰🇷" },
    highlight: "Sindhu converts 2nd match point after 74 min thriller",
    statusText: "Sindhu won 2-1 (21-18, 19-21, 21-17)",
    venueOrOvers: "Finished (74 mins)",
    liveTime: "Porte de La Chapelle Arena, Paris",
    source: "Google Sports",
    hasSchedule: true,
  },
  {
    id: "kabaddi-pkl-pat-ben",
    sport: "Kabaddi",
    status: "RECENT",
    tournament: "Pro Kabaddi League",
    stage: "League Stage · Match 88",
    matchInfo: "Match 88 • PKL Season 11",
    teamA: { name: "Patna Pirates", code: "PAT", score: "42", flag: "🟢" },
    teamB: { name: "Bengaluru Bulls", code: "BLR", score: "39", flag: "🐂" },
    highlight: "Sachin 14 raid points leads Pirates to thrilling win",
    statusText: "Full Time · Patna Pirates won by 3 points",
    venueOrOvers: "Full Time (40')",
    liveTime: "Patliputra Sports Complex, Patna",
    source: "Google Sports",
  },
  {
    id: "hockey-women-ind-aus",
    sport: "Hockey",
    status: "UPCOMING",
    tournament: "Women's FIH Nations Cup",
    stage: "Group Stage",
    matchInfo: "Group B • Nations Cup",
    teamA: { name: "India Women", code: "IND-W", score: "-", flag: "🇮🇳" },
    teamB: { name: "Australia Hockeyroos", code: "AUS-W", score: "-", flag: "🇦🇺" },
    highlight: "Savita Punia leads squad in high-stakes qualification match",
    statusText: "Scheduled tomorrow at 16:00 IST",
    venueOrOvers: "Starts Tomorrow 16:00 IST",
    liveTime: "Major Dhyan Chand National Stadium, Delhi",
    source: "Google Sports",
  },
];

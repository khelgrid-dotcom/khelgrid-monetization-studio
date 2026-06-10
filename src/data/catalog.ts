// Master catalog powering 100+ dynamically-generated pages across
// /sport/$slug, /city/$slug, /guide/$slug and /tools/$slug.

export interface Sport {
  slug: string;
  name: string;
  tagline: string;
  level: "Entry" | "Intermediate" | "Elite";
  ageBand: string;
  emoji: string;
  highlights: string[];
}

export interface City {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  venues: number;
  hubs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  category: "Trial prep" | "Sports CV" | "Scholarships" | "Nutrition" | "Mindset" | "Parents" | "Recovery" | "Tech";
  readMins: number;
  excerpt: string;
  steps: string[];
}

export interface Tool {
  slug: string;
  name: string;
  category: "Calculator" | "Checklist" | "Planner" | "Estimator";
  blurb: string;
  inputs: { label: string; placeholder: string }[];
}

export const SPORTS_CATALOG: Sport[] = [
  { slug: "cricket", name: "Cricket", tagline: "Ranji, IPL pathways & U-19 trials", level: "Elite", ageBand: "U-12 to Pro", emoji: "🏏", highlights: ["BCCI scouted trials", "Ranji Trophy net sessions", "IPL franchise feeder camps"] },
  { slug: "football", name: "Football", tagline: "ISL & I-League scout days", level: "Elite", ageBand: "U-13 to U-23", emoji: "⚽", highlights: ["ISL combine pathways", "AIFF-licensed academies", "Goa & Kerala showcase weeks"] },
  { slug: "badminton", name: "Badminton", tagline: "Gopichand, Padukone & Khelo India", level: "Elite", ageBand: "U-11 to Senior", emoji: "🏸", highlights: ["State-rank entry routes", "BAI-recognised camps", "Doubles pairing trials"] },
  { slug: "athletics", name: "Athletics", tagline: "Sprint, throws and long-distance trials", level: "Elite", ageBand: "U-14 to Senior", emoji: "🏃", highlights: ["SAI Patiala & Bengaluru centres", "AFI selection routes", "Para-athletics pathways"] },
  { slug: "hockey", name: "Hockey", tagline: "Odisha, Punjab & sub-junior camps", level: "Elite", ageBand: "U-14 to Senior", emoji: "🏑", highlights: ["Hockey India sub-junior camps", "Punjab & Odisha promotion", "Goalkeeper-only trials"] },
  { slug: "tennis", name: "Tennis", tagline: "AITA ranked events & academy days", level: "Elite", ageBand: "U-10 to Pro", emoji: "🎾", highlights: ["AITA-rated tournaments", "Sania Mirza & Krish centres", "Wildcards into nationals"] },
  { slug: "kabaddi", name: "Kabaddi", tagline: "Pro Kabaddi pathway trials", level: "Intermediate", ageBand: "U-17 to Pro", emoji: "🤼", highlights: ["PKL franchise scout days", "Raider/defender splits", "Mat-trial preparation"] },
  { slug: "basketball", name: "Basketball", tagline: "NBA India academy & UBA league trials", level: "Intermediate", ageBand: "U-14 to Senior", emoji: "🏀", highlights: ["3x3 city leagues", "NBA India Academy spots", "Height/wingspan combines"] },
  { slug: "volleyball", name: "Volleyball", tagline: "Prime Volleyball League selection", level: "Intermediate", ageBand: "U-16 to Senior", emoji: "🏐", highlights: ["PVL franchise trials", "Sub-junior nationals", "Block + spike test drills"] },
  { slug: "table-tennis", name: "Table Tennis", tagline: "UTT & PSPB ranked routes", level: "Intermediate", ageBand: "U-11 to Senior", emoji: "🏓", highlights: ["Ultimate Table Tennis camps", "PSPB pathway support", "Cadet & sub-junior trials"] },
  { slug: "boxing", name: "Boxing", tagline: "IBA youth & elite India trials", level: "Elite", ageBand: "U-15 to Senior", emoji: "🥊", highlights: ["BFI weight-class trials", "SAI boxing centres", "Sparring evaluation camps"] },
  { slug: "wrestling", name: "Wrestling", tagline: "Akhada & WFI selection meets", level: "Elite", ageBand: "U-15 to Senior", emoji: "🤼", highlights: ["WFI ranking meets", "Chhatrasal & Guru Hanuman akhadas", "Greco-Roman + Freestyle splits"] },
  { slug: "swimming", name: "Swimming", tagline: "SFI age-group nationals", level: "Intermediate", ageBand: "U-10 to Senior", emoji: "🏊", highlights: ["50m pool centres", "SFI national qualifiers", "Open-water trial events"] },
  { slug: "shooting", name: "Shooting", tagline: "NRAI ranking & Olympic pathway", level: "Elite", ageBand: "U-14 to Senior", emoji: "🎯", highlights: ["10m air rifle/pistol trials", "Trap & skeet selection", "NRAI ranking-tournament prep"] },
  { slug: "archery", name: "Archery", tagline: "AAI national ranking events", level: "Intermediate", ageBand: "U-12 to Senior", emoji: "🏹", highlights: ["Recurve + compound divisions", "AAI ranking meets", "School-level talent hunts"] },
  { slug: "esports", name: "Esports", tagline: "Online competitions across BGMI, FIFA, Valorant", level: "Entry", ageBand: "16+", emoji: "🎮", highlights: ["Online qualifier brackets", "Streamed finals & casts", "Cash-prize pool tournaments"] },
];

export const CITIES_CATALOG: City[] = [
  { slug: "delhi", name: "Delhi", state: "Delhi NCR", tagline: "SAI hub with year-round national camps", venues: 320, hubs: ["JLN Stadium", "SAI Karni Singh", "Thyagaraj Stadium"] },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", tagline: "Cricket, football and combined-sport combines", venues: 280, hubs: ["Wankhede", "MCA-BKC", "Cooperage"] },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", tagline: "Padukone-Dravid centre and ISL academies", venues: 240, hubs: ["Chinnaswamy", "Kanteerava", "Sree Kanteerava Aquatic"] },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", tagline: "Gopichand badminton + Sania Mirza tennis", venues: 180, hubs: ["Gachibowli Stadium", "Uppal Cricket", "GMC Balayogi"] },
  { slug: "chandigarh", name: "Chandigarh", state: "Chandigarh", tagline: "Punjab hockey + athletics pipeline", venues: 130, hubs: ["Sector-7 Stadium", "PCA Mohali", "Sukhna Lake"] },
  { slug: "pune", name: "Pune", state: "Maharashtra", tagline: "Tennis, football and tier-1 academy belt", venues: 160, hubs: ["Balewadi Stadium", "MCA-Gahunje", "DECCAN Gymkhana"] },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", tagline: "Football mecca with derby-level trials", venues: 150, hubs: ["Salt Lake Stadium", "Eden Gardens", "Mohun Bagan ground"] },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", tagline: "Chess, athletics and TNCA cricket trials", venues: 170, hubs: ["MA Chidambaram", "Nehru Stadium", "SDAT Tennis Stadium"] },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", tagline: "Narendra Modi Stadium and IPL feeder camps", venues: 140, hubs: ["Narendra Modi Stadium", "Sardar Patel Stadium", "TransStadia"] },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", tagline: "Sawai Mansingh trials & athletics meets", venues: 100, hubs: ["Sawai Mansingh Stadium", "SMS Indoor", "JKP Hockey"] },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", tagline: "Ekana cricket + Sports College pathway", venues: 110, hubs: ["Ekana Stadium", "KD Singh Babu", "Guru Govind Singh Sports College"] },
  { slug: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", tagline: "Hockey capital with Kalinga showcase weeks", venues: 90, hubs: ["Kalinga Stadium", "Kalinga Hockey", "BSE Aquatic"] },
  { slug: "guwahati", name: "Guwahati", state: "Assam", tagline: "Northeast pathway for football and athletics", venues: 70, hubs: ["Sarusajai Stadium", "Nehru Stadium", "Indira Gandhi Athletics"] },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", tagline: "Holkar trials + central-zone combines", venues: 85, hubs: ["Holkar Stadium", "Nehru Stadium", "Abhay Prashal"] },
  { slug: "kochi", name: "Kochi", state: "Kerala", tagline: "Kerala Blasters academy + ISL hunts", venues: 95, hubs: ["Jawaharlal Nehru Stadium", "Maharaja's", "Rajiv Gandhi Indoor"] },
  { slug: "goa", name: "Goa", state: "Goa", tagline: "FC Goa pipeline and beach-sport selections", venues: 80, hubs: ["GMC Stadium Bambolim", "Tilak Maidan", "Nehru Stadium Fatorda"] },
];

export const GUIDES_CATALOG: Guide[] = [
  { slug: "cricket-trial-prep-checklist", title: "Cricket trial-prep checklist (T-7 days)", category: "Trial prep", readMins: 6, excerpt: "Kit, fitness, food and mental drills for the seven days before a state cricket trial.", steps: ["Pack kit a day in advance", "Hydrate from T-3", "Visualise dismissals & shots"] },
  { slug: "football-combine-fitness-test", title: "How to ace the football combine fitness tests", category: "Trial prep", readMins: 7, excerpt: "Yo-Yo IR1, beep test and 40m sprint benchmarks for ISL combines.", steps: ["Hit Yo-Yo IR1 17.6", "Sub-5.3s 40m sprint", "1.65m vertical jump"] },
  { slug: "badminton-rankings-explained", title: "Badminton rankings, BAI ladders & wildcards", category: "Trial prep", readMins: 8, excerpt: "How sub-junior, junior and senior BAI ladders feed into national trials.", steps: ["Register with state association", "Hit 800 points by U-15", "Apply for wildcards"] },
  { slug: "athletics-personal-best-tracker", title: "Tracking PBs the right way for athletics", category: "Trial prep", readMins: 5, excerpt: "A simple framework to log timed events, throws and jumps for selection.", steps: ["Wind-legal vs wind-aided", "Implement weight check", "Video every PB attempt"] },
  { slug: "hockey-trial-positions-guide", title: "Picking your hockey position for trials", category: "Trial prep", readMins: 6, excerpt: "Where selectors look first — and how to pick a position you can dominate.", steps: ["Audit your turning radius", "Time your push & flick", "Try goalkeeper drills"] },
  { slug: "tennis-aita-points-roadmap", title: "AITA points roadmap for U-14 to U-18", category: "Trial prep", readMins: 7, excerpt: "Tournament sequencing to climb the AITA ladder fast.", steps: ["Pick 6 super-series events", "Track ranking weekly", "Travel in clusters"] },
  { slug: "sports-cv-template-india", title: "The India-ready Sports CV template", category: "Sports CV", readMins: 5, excerpt: "What Indian selectors actually look for in a one-page Sports CV.", steps: ["Headline + sport + level", "Top 3 results", "Coach reference"] },
  { slug: "verified-sports-cv-benefits", title: "Why a Verified Sports CV gets you 3× more callbacks", category: "Sports CV", readMins: 4, excerpt: "Verification badges signal trust — here's the data behind them.", steps: ["Upload ID + result proofs", "Coach endorsement", "Live profile link"] },
  { slug: "uploading-match-footage-tips", title: "Uploading match footage that actually gets watched", category: "Sports CV", readMins: 6, excerpt: "Camera angles, length and editing rules for highlight reels.", steps: ["90-second cap", "Wide angle, not zoom", "Add timestamps"] },
  { slug: "khelo-india-scholarships-2026", title: "Khelo India scholarships 2026 — eligibility & timelines", category: "Scholarships", readMins: 8, excerpt: "Stipends, age caps and quotas under the 2026 Khelo India update.", steps: ["Verify state-rank entry", "Submit medical certificate", "Get coach to co-sign"] },
  { slug: "sai-stipend-process", title: "SAI stipend application — step by step", category: "Scholarships", readMins: 7, excerpt: "Documents, deadlines and common rejection reasons for SAI stipends.", steps: ["Aadhaar + bank proof", "Performance affidavit", "Submit before March 31"] },
  { slug: "private-academy-scholarship-list", title: "12 private academies offering full scholarships", category: "Scholarships", readMins: 9, excerpt: "Who covers tuition, boarding, kit and travel — and how to apply.", steps: ["Shortlist 3 by sport", "Submit Sports CV", "Schedule trial week"] },
  { slug: "pre-trial-meal-plan", title: "What to eat 24 hours before a trial", category: "Nutrition", readMins: 5, excerpt: "A carb-loading window, hydration and what to avoid.", steps: ["Carbs at 6g/kg", "3L water across day", "No new foods"] },
  { slug: "indian-veg-athlete-protein", title: "Protein hits for vegetarian Indian athletes", category: "Nutrition", readMins: 6, excerpt: "Dal-paneer-egg combinations that hit 1.6g/kg body weight.", steps: ["Soya + curd combo", "Sprouts at breakfast", "Paneer post-training"] },
  { slug: "hydration-summer-trials", title: "Hydration plan for summer trials in India", category: "Nutrition", readMins: 4, excerpt: "Electrolyte ratios for 35°C+ outdoor sessions.", steps: ["500ml at -90 min", "Salt + lemon mid-session", "Coconut water post"] },
  { slug: "performance-anxiety-fix", title: "5-minute fixes for performance anxiety", category: "Mindset", readMins: 4, excerpt: "Box breathing, anchoring and trigger phrases used by Indian pros.", steps: ["Box breathing 4-4-4-4", "Anchor a trigger word", "Visualise success rep"] },
  { slug: "post-trial-recovery", title: "Post-trial recovery — 48 hours that matter", category: "Recovery", readMins: 5, excerpt: "Sleep, ice and mobility windows after high-intensity trial days.", steps: ["8h sleep minimum", "Contrast bath night 1", "Light mobility day 2"] },
  { slug: "managing-rejection", title: "Coping with rejection from a major trial", category: "Mindset", readMins: 5, excerpt: "A 7-day reset cycle to get back on the pitch stronger.", steps: ["Day 1: rest", "Day 3: review tape", "Day 7: new goal"] },
  { slug: "parent-guide-trial-day", title: "Parent's guide to trial day", category: "Parents", readMins: 6, excerpt: "What to say, what to pack and how to back your kid without pressure.", steps: ["Arrive 60 min early", "Stay invisible during play", "One question at exit"] },
  { slug: "supporting-young-athletes", title: "Supporting a 12-15 year old athlete", category: "Parents", readMins: 7, excerpt: "Balancing academics, screen time and training load for teens.", steps: ["Cap training to 14h/week", "Protect 9h sleep", "Weekly check-in chat"] },
  { slug: "academy-fee-negotiation", title: "Negotiating academy fees & boarding costs", category: "Parents", readMins: 5, excerpt: "Scripts, leverage and the right questions to ask academy directors.", steps: ["Get 3 written quotes", "Ask for performance discount", "Bundle siblings"] },
  { slug: "injury-prevention-15-min-warmup", title: "The 15-min FIFA-11+ inspired warm-up", category: "Recovery", readMins: 6, excerpt: "A universal warm-up that cuts soft-tissue injury risk by 30%.", steps: ["6 min jog + dynamic", "5 min strength holds", "4 min sport-specific"] },
  { slug: "sleep-and-performance", title: "Sleep × performance for Indian athletes", category: "Recovery", readMins: 5, excerpt: "Why 9 hours beats 7 for U-21 athletes — and how to get them.", steps: ["Hard cutoff for screens", "Cool room <22°C", "No caffeine after 2pm"] },
  { slug: "ai-talent-scanner-explainer", title: "What the AI Talent Scanner actually measures", category: "Tech", readMins: 6, excerpt: "Under the hood: pose estimation, repeatability and how it ranks.", steps: ["Upload 3 clips", "Get repeatability score", "Compare vs cohort"] },
  { slug: "wearables-for-young-athletes", title: "Which wearable should a young athlete pick?", category: "Tech", readMins: 7, excerpt: "Heart-rate, GPS and load metrics that matter at U-18.", steps: ["Stick to HR + GPS", "Cap notifications", "Weekly load review"] },
  { slug: "video-analysis-tools", title: "Free video-analysis tools for clip breakdown", category: "Tech", readMins: 5, excerpt: "Slow-mo, angle overlays and tagging tools that don't cost a rupee.", steps: ["Pick a tagging app", "Slow to 0.25x", "Share via timestamped link"] },
  { slug: "selectors-checklist", title: "What selectors actually score you on", category: "Trial prep", readMins: 6, excerpt: "Technical, tactical, physical, psychological — with weightings.", steps: ["Technical 35%", "Physical 25%", "Mental 20%, tactical 20%"] },
  { slug: "online-competitions-india", title: "Best online competitions for Indian athletes", category: "Trial prep", readMins: 5, excerpt: "From e-cricket to chess.com Titled Tuesdays — a list that opens doors.", steps: ["Pick rated platforms", "Streamed = sponsor visible", "Archive your runs"] },
  { slug: "transfer-rules-academy", title: "Transferring between academies — the rules", category: "Trial prep", readMins: 6, excerpt: "NOC, cooling-off periods and how transfers actually work in India.", steps: ["Request written NOC", "Honour 30-day cool-off", "Re-register with state body"] },
  { slug: "scholarship-essay-templates", title: "Scholarship essay templates that win", category: "Scholarships", readMins: 6, excerpt: "Three opening paragraphs that selection committees actually read.", steps: ["Lead with one moment", "Quantify a result", "End with the ask"] },
];

export const TOOLS_CATALOG: Tool[] = [
  { slug: "trial-readiness-score", name: "Trial readiness score", category: "Calculator", blurb: "Get a 0-100 readiness rating before your next trial.", inputs: [{ label: "Sessions/week", placeholder: "6" }, { label: "Sleep avg (h)", placeholder: "8" }, { label: "Recent PR delta %", placeholder: "+3" }] },
  { slug: "sports-cv-builder-checklist", name: "Sports CV builder checklist", category: "Checklist", blurb: "Tick off the 12 sections every selector expects.", inputs: [{ label: "Sport", placeholder: "Cricket" }, { label: "Level", placeholder: "U-19 state" }] },
  { slug: "scholarship-eligibility-checker", name: "Scholarship eligibility checker", category: "Estimator", blurb: "See which schemes you qualify for in under a minute.", inputs: [{ label: "Age", placeholder: "16" }, { label: "Best rank", placeholder: "State silver" }] },
  { slug: "calorie-needs-athlete", name: "Athlete calorie needs", category: "Calculator", blurb: "Get a daily calorie target tuned for your sport & weight.", inputs: [{ label: "Weight (kg)", placeholder: "62" }, { label: "Training hrs/day", placeholder: "3" }] },
  { slug: "weekly-load-planner", name: "Weekly training-load planner", category: "Planner", blurb: "Distribute volume so you peak on trial day.", inputs: [{ label: "Trial date", placeholder: "Apr 12" }, { label: "Current weekly load", placeholder: "12h" }] },
  { slug: "travel-budget-estimator", name: "Travel-budget estimator", category: "Estimator", blurb: "Ballpark cost of attending an out-of-state trial.", inputs: [{ label: "From city", placeholder: "Patna" }, { label: "To city", placeholder: "Bengaluru" }] },
  { slug: "vo2-max-estimator", name: "VO2 max estimator", category: "Estimator", blurb: "Quick estimate from a 12-min Cooper run.", inputs: [{ label: "Distance (m)", placeholder: "2800" }] },
  { slug: "sprint-split-calculator", name: "Sprint-split calculator", category: "Calculator", blurb: "Break a 100m PB into 10m splits.", inputs: [{ label: "100m time (s)", placeholder: "11.4" }] },
  { slug: "match-fee-roi", name: "Match-fee ROI calculator", category: "Calculator", blurb: "Compare entry fee × shot at scouts × callback rate.", inputs: [{ label: "Fee", placeholder: "1500" }, { label: "Scouts present", placeholder: "8" }] },
  { slug: "academy-shortlist-builder", name: "Academy shortlist builder", category: "Planner", blurb: "Score 5 academies on fit, fees and pathway.", inputs: [{ label: "Sport", placeholder: "Football" }, { label: "Max fee/yr", placeholder: "1.5L" }] },
  { slug: "boost-vs-organic-estimator", name: "Boost vs organic-reach estimator", category: "Estimator", blurb: "Organizers: estimate applies for boosted vs free listings.", inputs: [{ label: "Listing budget", placeholder: "1500" }, { label: "City reach", placeholder: "Mumbai" }] },
  { slug: "trial-day-packing-list", name: "Trial-day packing list", category: "Checklist", blurb: "Don't forget the one thing that disqualifies most athletes.", inputs: [{ label: "Sport", placeholder: "Hockey" }, { label: "Outdoor?", placeholder: "Yes" }] },
];

export const ALL_CATALOG_PATHS: string[] = [
  ...SPORTS_CATALOG.map(s => `/sport/${s.slug}`),
  ...CITIES_CATALOG.map(c => `/city/${c.slug}`),
  ...GUIDES_CATALOG.map(g => `/guide/${g.slug}`),
  ...TOOLS_CATALOG.map(t => `/tools/${t.slug}`),
];

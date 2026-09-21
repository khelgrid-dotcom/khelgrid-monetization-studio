export interface SportsNewsArticle {
  id: string;
  slug: string;
  title: string;
  headline: string;
  excerpt: string;
  content: string;
  sport:
    "Cricket" | "Football" | "Badminton" | "Athletics" | "Kabaddi" | "Grassroots" | "Multi-Sport";
  category: "National" | "Trials & Selection" | "Grassroots" | "Championships" | "Scholarship";
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  trending?: boolean;
  featured?: boolean;
}

export const SPORTS_NEWS_CATALOG: SportsNewsArticle[] = [
  {
    id: "news-khelo-india-2026",
    slug: "khelo-india-youth-games-2026-dates-state-selection-trials-announced",
    title:
      "Khelo India Youth Games 2026: State Selection Trials Dates & Eligibility Framework Released",
    headline:
      "Sports Authority of India (SAI) confirms nationwide trials schedule for U-18 athletes across 27 disciplines.",
    excerpt:
      "The Ministry of Youth Affairs and Sports and SAI have published the official roadmap for the upcoming Khelo India Youth Games. Over 8,500 athletes will compete following open district and state screening trials.",
    content:
      "District sports officers across all 28 states and union territories will commence open trials starting next month. Athletes registered on the National Sports Repository System (NSRS) with verified Aadhaar credentials and birth verification are eligible to compete in athletics, badminton, wrestling, boxing, and archery selection rounds.",
    sport: "Grassroots",
    category: "Trials & Selection",
    publishedAt: "2026-09-21T05:30:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "KhelGrid Editorial Desk",
      role: "Grassroots Sports Correspondent",
    },
    tags: ["Khelo India", "SAI", "Open Trials", "U-18", "National Sports"],
    featured: true,
    trending: true,
  },
  {
    id: "news-bcci-junior-zonal",
    slug: "bcci-junior-cricket-academy-zonal-registrations-open",
    title: "BCCI Opens Junior Zonal Trials for U-16 & U-19 National Cricket Academy Programs",
    headline:
      "Affiliated state cricket associations invite registered district performers for centralized NCA scouting camps.",
    excerpt:
      "State cricket bodies have published notification forms for the 2026-27 domestic junior pipeline. Scouts from the National Cricket Academy will monitor multi-day games and high-performance metrics.",
    content:
      "The talent development committee has integrated digital performance tracking including ball-tracking radar and biomechanics screening into zonal trials. District tournament top-scorers and leading wicket-takers will receive direct invitations.",
    sport: "Cricket",
    category: "Trials & Selection",
    publishedAt: "2026-09-20T18:00:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1531415074868-036b1c57e359?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Rohan Varma",
      role: "Cricket Talent Analyst",
    },
    tags: ["BCCI", "NCA", "Cricket Trials", "U-19", "Junior Cricket"],
    trending: true,
  },
  {
    id: "news-aiff-youth-league",
    slug: "aiff-grassroots-youth-league-club-accreditations",
    title: "AIFF Launches Decentralized Grassroots League to Screen 15,000 U-15 Talents",
    headline:
      "Indian football governing body introduces club-licensing criteria tied directly to youth development minutes.",
    excerpt:
      "Under the Vision 2047 roadmap, every Tier-1 and Tier-2 club must field an academy side in the regional Youth League, giving emerging talents competitive game time with accredited coaches.",
    content:
      "The initiative ensures that youth footballers receive a minimum of 30 competitive matches each calendar year. International scouts and Indian national team talent spotters will attend regional play-offs.",
    sport: "Football",
    category: "Grassroots",
    publishedAt: "2026-09-20T11:45:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Tenzing Namgyal",
      role: "Youth Football Lead",
    },
    tags: ["AIFF", "Youth League", "Football Academies", "Grassroots", "Scouting"],
    trending: true,
  },
  {
    id: "news-athletics-federation-grand-prix",
    slug: "afi-national-open-athletics-championships-qualifying-marks",
    title:
      "Athletics Federation of India Updates National Qualifying Standards for Sprints & Field Events",
    headline:
      "Stricter electronic timing standards introduced for 100m, 400m, and Javelin ahead of Asian Athletics Circuit.",
    excerpt:
      "Junior and senior athletes aiming for national camps must record their marks at AFI-sanctioned state meets with approved FAT (Fully Automatic Timing) and certified wind gauges.",
    content:
      "Athletes achieving the benchmark times will qualify for high-performance training centers in Patiala and Bengaluru, including nutritional stipends and international coach supervision.",
    sport: "Athletics",
    category: "National",
    publishedAt: "2026-09-19T14:15:00.000Z",
    readTime: "2 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Pooja Deshmukh",
      role: "Track & Field Correspondent",
    },
    tags: ["AFI", "Athletics", "Track and Field", "National Camp", "Sprints"],
    trending: false,
  },
  {
    id: "news-badminton-bai-ranking-circuit",
    slug: "bai-all-india-senior-junior-ranking-tournaments-schedule",
    title: "Badminton Association of India Announces 12-City National Ranking Tournament Circuit",
    headline:
      "Rankings points from these tournaments will directly determine entries for international BWF Challenge events.",
    excerpt:
      "With prize purses exceeding ₹2.4 Crores across both junior and senior legs, the tour provides emerging shuttlers a transparent route to the Indian National Squad.",
    content:
      "Top players from state ranking events will participate in qualifying draws. Matches will be live-streamed with automated rally metrics provided through national academy partnerships.",
    sport: "Badminton",
    category: "Championships",
    publishedAt: "2026-09-19T09:00:00.000Z",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Aditi Iyer",
      role: "Racquet Sports Editor",
    },
    tags: ["BAI", "Badminton", "BWF", "Ranking Tournaments", "National Squad"],
    trending: false,
  },
  {
    id: "news-reliance-foundation-scholarship",
    slug: "sports-scholarships-2026-applications-open-for-promising-indian-athletes",
    title:
      "National Sports Scholarships 2026: Financial Grants & Equipment Support for Junior Medalists",
    headline:
      "Private & public trust foundations disburse over ₹15 Crores in training stipends for student-athletes.",
    excerpt:
      "Eligible school and collegiate athletes who won medals at district, state or national championships can now submit their verified performance certificates to secure full educational and coaching funding.",
    content:
      "Grants cover specialized coaching fees, strength & conditioning coaches, tournament travel allowances, and injury rehabilitation insurance. Deadlines for the winter cohort end on October 15th.",
    sport: "Multi-Sport",
    category: "Scholarship",
    publishedAt: "2026-09-18T16:20:00.000Z",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "KhelGrid Career Desk",
      role: "Athlete Pathway Advisory",
    },
    tags: ["Scholarship", "Athlete Funding", "Sports Grants", "Education", "Grassroots"],
    trending: true,
  },
];

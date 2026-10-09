export type LearningSourceType = "book" | "video" | "text" | "audio" | "quiz" | "diagram";

export type LearningLevel = "Beginner" | "Intermediate" | "Advanced" | "Coach & Referee";

export interface LearningChapter {
  title: string;
  timestamp?: string; // for videos (e.g., "02:15")
  page?: string; // for books
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  sport: string;
  sportEmoji: string;
  sourceType: LearningSourceType;
  level: LearningLevel;
  authorOrCreator: string;
  organizationOrPublisher?: string;
  estimatedTime: string; // e.g. "18 min watch", "240 pages", "12 min read"
  summary: string;
  coverImage?: string;
  videoEmbedUrl?: string; // or demo streaming embed
  videoDurationSeconds?: number;
  keyTakeaways: string[];
  chapters?: LearningChapter[];
  fullTextContent?: string;
  quiz?: QuizQuestion[];
  equipmentRequired?: string[];
  fieldSpecs?: {
    length: string;
    width: string;
    boundaryNote: string;
    keyLines: string[];
  };
  externalLink?: string;
  featured?: boolean;
  tags: string[];
}

export interface SportLearningOverview {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  governingBody: string;
  governingBodyIndia: string;
  olympicStatus: string;
  quickRulesSummary: string[];
  courtOrFieldSummary: string;
  scoringSummary: string;
  keyEquipment: string[];
}

export const SPORT_OVERVIEWS: Record<string, SportLearningOverview> = {
  Cricket: {
    slug: "cricket",
    name: "Cricket",
    emoji: "🏏",
    tagline: "Batting mechanics, bowling variations, pitch craft & tactical field placements",
    governingBody: "International Cricket Council (ICC)",
    governingBodyIndia: "Board of Control for Cricket in India (BCCI)",
    olympicStatus: "Returning at Los Angeles 2028 Olympic Games (T20 format)",
    quickRulesSummary: [
      "2 teams of 11 players; 1 innings per side in limited overs (T20: 20 overs, ODI: 50 overs).",
      "Pitch length is exactly 22 yards (20.12m) with stumps 9 inches wide.",
      "Dismissals include Bowled, Caught, LBW (Leg Before Wicket), Run Out, Stumped, and Hit Wicket.",
      "Powerplay rules govern field placements inside the 30-yard circle to incentivize aggressive strokeplay.",
    ],
    courtOrFieldSummary:
      "Oval field (boundary 65–85m from pitch center). 22-yard turf/mat pitch with popping, bowling, and return creases.",
    scoringSummary:
      "Runs scored by running between wickets or hitting boundaries (4 runs on bounce, 6 runs on the full). Extras include No-balls, Wides, Byes, and Leg-byes.",
    keyEquipment: [
      "Willow Cricket Bat",
      "Leather Ball (156g)",
      "Pads & Gloves",
      "Helmet with Grille",
      "Spiked Shoes",
      "Abdominal Guard",
    ],
  },
  Football: {
    slug: "football",
    name: "Football (Soccer)",
    emoji: "⚽",
    tagline: "Passing geometry, pressing structures, positional play & transition speed",
    governingBody: "Fédération Internationale de Football Association (FIFA)",
    governingBodyIndia: "All India Football Federation (AIFF)",
    olympicStatus: "Summer Olympic Sport (U-23 tournament with 3 overage players)",
    quickRulesSummary: [
      "11 players per team including 1 goalkeeper; match duration is two 45-minute halves.",
      "Offside rule: An attacking player is offside if closer to opponent goal line than both the ball and second-last opponent when ball is played.",
      "No handling the ball with hands/arms except the goalkeeper inside their own 18-yard penalty area.",
      "Direct/indirect free kicks, yellow cards (caution) and red cards (dismissal).",
    ],
    courtOrFieldSummary:
      "Rectangular pitch 100-110m long by 64-75m wide. Goalposts are 7.32m wide by 2.44m high.",
    scoringSummary:
      "1 goal scored when the whole ball crosses the goal line between the posts and under the crossbar.",
    keyEquipment: [
      "Size 5 Football (410–450g)",
      "Studded Cleats (Moulded/Metal)",
      "Shin Guards",
      "Team Jersey & Shorts",
      "Goalkeeper Padded Gloves",
    ],
  },
  Badminton: {
    slug: "badminton",
    name: "Badminton",
    emoji: "🏸",
    tagline: "Footwork split-steps, wrist pronation, deception & rapid net interchanges",
    governingBody: "Badminton World Federation (BWF)",
    governingBodyIndia: "Badminton Association of India (BAI)",
    olympicStatus: "Summer Olympic Sport since Barcelona 1992",
    quickRulesSummary: [
      "Best of 3 games to 21 points (rally point scoring system); at 20-all, must lead by 2 points (capped at 30).",
      "Serve must be hit below 1.15m waist height from the surface and travel diagonally into the receiver's court.",
      "Faults include shuttle hitting outside the court lines, shuttle passing through or under net, and racket crossing the net line.",
      "Singles uses the long and narrow court boundary; doubles uses the wide and short serve court boundary.",
    ],
    courtOrFieldSummary:
      "Court is 13.4m long by 6.1m wide (doubles) or 5.18m wide (singles). Net height is 1.55m at posts and 1.524m at center.",
    scoringSummary:
      "1 point on every rally won. Service changes to whichever player or pair won the preceding point.",
    keyEquipment: [
      "Graphite Racket (75–88g)",
      "Feather (Goose/Duck) or Nylon Shuttlecock",
      "Gum-Sole Non-Marking Badminton Shoes",
      "Overgrip Tape",
    ],
  },
  Athletics: {
    slug: "athletics",
    name: "Athletics (Track & Field)",
    emoji: "🏃",
    tagline: "Sprint mechanics, hurdle clearance, endurance pacing & explosive field events",
    governingBody: "World Athletics",
    governingBodyIndia: "Athletics Federation of India (AFI)",
    olympicStatus: "Core Summer Olympic Foundation Sport since 1896",
    quickRulesSummary: [
      "Sprint starts require starting blocks; one false start results in immediate disqualification.",
      "Runners must stay entirely within their assigned lane during 100m, 200m, 400m, and hurdle events.",
      "Field events allow 3 preliminary attempts plus 3 final attempts for the top 8 qualifiers.",
      "Relay baton exchanges must occur strictly inside the 30-meter exchange zone.",
    ],
    courtOrFieldSummary:
      "Standard 400m outdoor synthetic oval track with 8 lanes (each 1.22m wide), infield for throws and jumps.",
    scoringSummary:
      "Finishing order decided by torso crossing the finish line. Electronic photo-finish timing to thousandths of a second.",
    keyEquipment: [
      "Track Spike Shoes",
      "Starting Blocks",
      "Relay Batons",
      "Fiberglass Vaulting Poles / Throwing Implements",
      "High Jump Foam Mats",
    ],
  },
  Tennis: {
    slug: "tennis",
    name: "Tennis",
    emoji: "🎾",
    tagline: "Topspin forehand kinetic chain, slice variation, serve trajectory & court coverage",
    governingBody: "International Tennis Federation (ITF)",
    governingBodyIndia: "All India Tennis Association (AITA)",
    olympicStatus: "Summer Olympic Sport (Re-introduced Seoul 1988)",
    quickRulesSummary: [
      "Scoring progresses 15, 30, 40, Game. At 40-40 (Deuce), player must win 2 consecutive points (Advantage).",
      "Sets are won by reaching 6 games with a 2-game margin, or via a 7-point Tiebreak at 6-6.",
      "Server gets 2 serves per point; ball must land in opposite diagonal service box without touching net on landing.",
      "Players switch sides of the net on odd game totals (after 1st game, 3rd game, etc.).",
    ],
    courtOrFieldSummary:
      "Court is 23.77m long by 8.23m wide (singles) or 10.97m wide (doubles). Net is 0.914m high at center.",
    scoringSummary: "Points form Games, Games form Sets, Sets form Matches (Best of 3 or 5 sets).",
    keyEquipment: [
      "Composite Graphite Racket (280–320g)",
      "Pressurized Felt Tennis Balls",
      "Hard-Court or Clay-Court Tennis Shoes",
      "Vibration Dampener",
    ],
  },
  Basketball: {
    slug: "basketball",
    name: "Basketball",
    emoji: "🏀",
    tagline: "Pick-and-roll reads, shooting arc mechanics, transition defense & spatial spacing",
    governingBody: "International Basketball Federation (FIBA)",
    governingBodyIndia: "Basketball Federation of India (BFI)",
    olympicStatus: "Summer Olympic Sport (5v5 since 1936, 3x3 since Tokyo 2020)",
    quickRulesSummary: [
      "5 players on court; four 10-minute quarters (FIBA) or four 12-minute quarters (NBA).",
      "24-second shot clock to attempt a basket that touches the ring; 8 seconds to cross half-court.",
      "Dribbling violations include Traveling (moving pivot foot without dribbling) and Double Dribble.",
      "5 personal fouls (FIBA) disqualify a player from returning to the game.",
    ],
    courtOrFieldSummary:
      "Hardwood/polyurethane court 28m long by 15m wide. Rim height is 3.05m (10 feet) with backboard 1.8m x 1.05m.",
    scoringSummary:
      "2 points for field goals inside 3-point arc (6.75m FIBA), 3 points beyond arc, 1 point per free throw.",
    keyEquipment: [
      "Size 7 Basketball (Men) / Size 6 (Women)",
      "High-Top Basketball Shoes with Ankle Support",
      "Compression Sleeve",
      "Mouthguard",
    ],
  },
  Kabaddi: {
    slug: "kabaddi",
    name: "Kabaddi",
    emoji: "🤼",
    tagline: "Raid cant discipline, toe-touch execution, ankle hold locks & corner coordination",
    governingBody: "International Kabaddi Federation (IKF)",
    governingBodyIndia: "Amateur Kabaddi Federation of India (AKFI)",
    olympicStatus: "Asian Games Regular Sport; Active Campaign for 2036 Olympic inclusion",
    quickRulesSummary: [
      "7 players per side on court; match consists of two 20-minute halves.",
      "A raider enters the opponent half chanting continuous 'Kabaddi' within a 30-second raid clock.",
      "The raider must touch at least one defender and return past the mid-line safely to score touch points.",
      "Defenders score 1 tackle point by pinning the raider down inside their half before mid-line return.",
      "Do-or-Die Raid: If a team has 2 successive empty raids, the 3rd raid must yield a point or raider is declared out.",
    ],
    courtOrFieldSummary:
      "Synthetic EVA foam mat measuring 13m x 10m (Men) or 12m x 8m (Women), divided into two halves by a mid-line, with baulk line and bonus line.",
    scoringSummary:
      "Touch points, Tackle points, Bonus point (crossing bonus line with trailing foot in air when 6+ defenders present), and 2-point All-Out bonus.",
    keyEquipment: [
      "High-Traction Wrestling/Kabaddi Mat Shoes",
      "Knee & Elbow Protective Sleeves",
      "Breathable Technical Jersey",
    ],
  },
  "Table Tennis": {
    slug: "table-tennis",
    name: "Table Tennis",
    emoji: "🏓",
    tagline: "Loop drive spin revolutions, pendulum service variations & lightning reflexes",
    governingBody: "International Table Tennis Federation (ITTF)",
    governingBodyIndia: "Table Tennis Federation of India (TTFI)",
    olympicStatus: "Summer Olympic Sport since Seoul 1988",
    quickRulesSummary: [
      "Best of 5 or 7 games to 11 points; service alternates every 2 points (or every point in deuce at 10-10).",
      "Service toss must rise at least 16cm vertically from an open, flat palm behind the table end-line.",
      "Ball must bounce once on server's side then once on receiver's side during serve; must clear net cleanly.",
      "No touching the table surface with free hand during live rally.",
    ],
    courtOrFieldSummary: "Table is 2.74m long, 1.525m wide, and 76cm high. Net height is 15.25cm.",
    scoringSummary: "1 point per rally. Must win by 2 clear points to claim game.",
    keyEquipment: [
      "Laminated Wood Blade with Inverted Pimpled Rubbers",
      "40mm+ Plastic Poly Balls (3-Star)",
      "Low-Profile Court Shoes",
    ],
  },
  Boxing: {
    slug: "boxing",
    name: "Boxing",
    emoji: "🥊",
    tagline: "Jab distance management, slip & weave defense, pivot angles & combination punching",
    governingBody: "World Boxing / IBA",
    governingBodyIndia: "Boxing Federation of India (BFI)",
    olympicStatus: "Core Olympic Combat Sport",
    quickRulesSummary: [
      "Olympic boxing consists of three 3-minute rounds (Men & Women) with 1-minute rest intervals.",
      "Punch must land cleanly with the knuckled part of the closed glove on the front or sides of head/body above belt.",
      "Fouls include holding, hitting behind the head (rabbit punch), low blows, hitting with inner glove or elbow.",
      "Five judges score each round on a 10-point must system (10-9 for clear winner, 10-8 with knockdown).",
    ],
    courtOrFieldSummary:
      "Elevated ring 6.1m square inside ropes, canvas floor over high-density foam padding.",
    scoringSummary:
      "10-Point Must scoring by 5 ringside judges, Knockout (KO), Referee Stops Contest (RSC), or Disqualification.",
    keyEquipment: [
      "10oz or 12oz Competition Gloves",
      "Hand Wraps (4.5m)",
      "Custom Fitted Mouthguard",
      "Headgear (Amateur Youth/Women)",
      "Boxing Boots",
    ],
  },
  Swimming: {
    slug: "swimming",
    name: "Swimming",
    emoji: "🏊",
    tagline: "Freestyle catch & pull, streamline hydrodynamics, flip turns & breath regulation",
    governingBody: "World Aquatics",
    governingBodyIndia: "Swimming Federation of India (SFI)",
    olympicStatus: "Core Summer Olympic Foundation Sport",
    quickRulesSummary: [
      "Four competitive strokes: Freestyle, Backstroke, Breaststroke, and Butterfly; Medley combines all four.",
      "Swimmers must touch the wall at every turn and at the finish with specific rules per stroke (e.g. 2-hand touch in Breaststroke & Fly).",
      "Underwater dolphin kicks are limited to 15 meters after starts and turns.",
      "False start on the starting platform results in disqualification.",
    ],
    courtOrFieldSummary:
      "Olympic pool is 50m long, 25m wide, 2-3m deep, with 10 lanes (each 2.5m wide) and water temperature at 25–28°C.",
    scoringSummary:
      "Fastest time from starter horn to wall pad touch recorded via electronic touchpads.",
    keyEquipment: [
      "Silicone Swimming Cap",
      "Low-Profile Hydrodynamic Goggles",
      "FINA-Approved Racing Jammers/Kneeskin",
      "Kickboard & Pull Buoy for Training",
    ],
  },
  Hockey: {
    slug: "hockey",
    name: "Field Hockey",
    emoji: "🏑",
    tagline:
      "Reverse stick slap-shots, aerial reception, penalty corner drag-flicks & zonal pressing",
    governingBody: "International Hockey Federation (FIH)",
    governingBodyIndia: "Hockey India (HI)",
    olympicStatus: "Summer Olympic Sport (India holds 8 historic Olympic Gold Medals)",
    quickRulesSummary: [
      "11 players per team; match played in four 15-minute quarters (60 minutes total).",
      "Players can only use the flat face side of the stick; no rounded back side allowed.",
      "Goals can only be scored from inside the 23-meter striking circle (the 'D').",
      "Penalty Corners awarded for defensive fouls inside the circle or intentional fouls inside 23m.",
    ],
    courtOrFieldSummary:
      "Synthetic watered turf 91.4m long by 55m wide. Goal cage is 3.66m wide by 2.14m high.",
    scoringSummary:
      "1 goal scored when the ball is legally struck inside the D and crosses the goal line.",
    keyEquipment: [
      "Composite Hockey Stick",
      "Dimpled Hard Plastic Ball (156–163g)",
      "Turf Astroturf Shoes",
      "Shin Guards",
      "Face Mask (for Penalty Corner Defence)",
    ],
  },
  Chess: {
    slug: "chess",
    name: "Chess",
    emoji: "♟️",
    tagline: "Opening repertoire preparation, middle-game pawn structures & endgame calculation",
    governingBody: "International Chess Federation (FIDE)",
    governingBodyIndia: "All India Chess Federation (AICF)",
    olympicStatus: "FIDE Chess Olympiad; Recognized by IOC",
    quickRulesSummary: [
      "2 players on an 8x8 checkered board of 64 squares; White moves first.",
      "Ultimate objective is Checkmate: placing opponent king in inescapable attack.",
      "Special rules include Castling (king safety & rook activation) and En Passant pawn capture.",
      "Touch-move rule: If a player touches a piece that has legal moves, they must move that piece.",
      "Draw conditions: Stalemate, 3-fold repetition, 50-move rule without pawn move or capture, insufficient mating material.",
    ],
    courtOrFieldSummary: "64-square board (32 light, 32 dark). Standard square size 50–60mm.",
    scoringSummary: "1 win = 1 point, Draw = 0.5 points, Loss = 0 points.",
    keyEquipment: [
      "Staunton Pattern Chess Set (King height ~95mm)",
      "Digital DGT Chess Clock with Fischer Increment",
      "Scorebook for Notation",
    ],
  },
};

export const LEARNING_RESOURCES: LearningResource[] = [
  // ===================== BOOKS =====================
  {
    id: "book-cricket-art",
    title: "The Art of Cricket",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Sir Donald Bradman",
    organizationOrPublisher: "Hodder & Stoughton / Sports Classics",
    estimatedTime: "240 pages (Definitive Masterwork)",
    summary:
      "Regarded as the greatest instructional coaching manual in cricket history. Written with meticulous precision by Don Bradman himself, exploring biomechanics of the grip, backlift, foot positioning, hook shot, cover drive, and bowling spin deception.",
    keyTakeaways: [
      "The 'rotary' backlift versus straight backlift: why Bradman's circular arc generates effortless bat speed.",
      "Weight transfer principles: never commit footwork before reading length from the bowler's hand.",
      "Field placement geometry: how fielders dictate where gaps open up when striking through the line.",
      "Running between wickets as an aggressive psychological weapon against fielding sides.",
    ],
    chapters: [
      {
        page: "Ch 1–4",
        title: "Grip, Stance & The Backlift",
        summary: "Detailed diagrams of the V-grip and weight distribution on balls of feet.",
      },
      {
        page: "Ch 5–9",
        title: "Attacking & Defensive Strokes",
        summary:
          "Forward defence, back-foot punch, off-drive, leg glance, and pull shot mechanics.",
      },
      {
        page: "Ch 10–14",
        title: "Bowling Fundamentals & Spin Craft",
        summary: "Seam positioning, wrist release for leg-spin, flight, and drift dynamics.",
      },
      {
        page: "Ch 15–18",
        title: "Captaincy & Tactical Geometry",
        summary: "Field placings for pace vs spin and managing game tempo in crunch phases.",
      },
    ],
    tags: ["Batting", "Masterclass", "Biomechanics", "History", "Coaching"],
    featured: true,
  },
  {
    id: "book-football-pyramid",
    title: "Inverting the Pyramid: The History of Football Tactics",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "book",
    level: "Advanced",
    authorOrCreator: "Jonathan Wilson",
    organizationOrPublisher: "Orion Publishing Group",
    estimatedTime: "464 pages (Tactical Bible)",
    summary:
      "The undisputed classic on the tactical evolution of football — from 1-2-7 in 19th-century Victorian England to the Hungarian Golden Team, Dutch Total Football, Italian Catenaccio, and modern high-pressing 4-3-3 & 3-2-4-1 shapes.",
    keyTakeaways: [
      "How tactical innovations occur as defensive counters to dominant attacking systems.",
      "The role of spatial pressing pioneered by Ernst Happel, Valeriy Lobanovskyi, and Arrigo Sacchi.",
      "Why the modern inverted full-back and false nine evolved to overwhelm central midfield overload zones.",
      "Positional play (Juego de Posición): dividing the pitch into 5 vertical corridors to ensure numerical superiority.",
    ],
    chapters: [
      {
        page: "Ch 1–5",
        title: "Origins: From Chaos to Formations",
        summary:
          "The evolution from Victorian dribbling games to passing combinations and the 2-3-5 Pyramid.",
      },
      {
        page: "Ch 6–10",
        title: "The W-M, Danubian School & Hungary 1953",
        summary:
          "Herbert Chapman's defensive revolution and Nandor Hidegkuti's deep-lying center-forward role.",
      },
      {
        page: "Ch 11–15",
        title: "Total Football & Italian Pragmatism",
        summary:
          "Rinus Michels' interchangeable roles, Cruyff's leadership, and Rocco's libero sweepers.",
      },
      {
        page: "Ch 16–20",
        title: "Modern Pressing & Spatial Overloads",
        summary:
          "Gegenpressing, half-spaces, inverted full-backs, and data analytics in match planning.",
      },
    ],
    tags: ["Tactics", "History", "Formations", "Coaching", "Positional Play"],
    featured: true,
  },
  {
    id: "book-badminton-steps",
    title: "Badminton: Steps to Success (Master Guide)",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "book",
    level: "Beginner",
    authorOrCreator: "Tony Grice & BWF Master Coaches",
    organizationOrPublisher: "Human Kinetics",
    estimatedTime: "192 pages (Illustrated)",
    summary:
      "A complete progression curriculum for players and academy coaches. Covers grip correction, explosive split-step footwork, overhead clears, drop shots, smashes, deceptive net tumbles, and singles/doubles court positioning.",
    keyTakeaways: [
      "Pronation and supination of the forearm: why power comes from rotational snap rather than arm swing.",
      "Split-step timing: landing precisely as the opponent strikes the shuttlecock to minimize reaction latency.",
      "The 6-point court corner coverage grid: base recovery position in singles vs doubles.",
      "Doubles rotational system: attacking (front-to-back) transitioning smoothly into defensive (side-by-side).",
    ],
    chapters: [
      {
        page: "Step 1–3",
        title: "Grips, Stances & The Split-Step",
        summary: "Forehand, backhand, bevel, and panhandle grips; balance recovery routines.",
      },
      {
        page: "Step 4–6",
        title: "High Clear, Drop Shot & Smash",
        summary: "Kinetic chain overhead strokes with steep downward trajectory training.",
      },
      {
        page: "Step 7–9",
        title: "Net Play, Tumbling Drops & Lifts",
        summary: "Subtle touch at the tape, deception holds, and cross-court hairpin lifts.",
      },
      {
        page: "Step 10–12",
        title: "Singles Strategy & Doubles Rotation",
        summary: "Exploiting backhand corners, building pressure, and front-court interception.",
      },
    ],
    tags: ["Footwork", "Technique", "Drills", "BWF", "Singles & Doubles"],
    featured: true,
  },
  {
    id: "book-tennis-winning-ugly",
    title: "Winning Ugly: Mental Warfare in Tennis",
    sport: "Tennis",
    sportEmoji: "🎾",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Brad Gilbert & Steve Jamison",
    organizationOrPublisher: "Fireside / Simon & Schuster",
    estimatedTime: "224 pages (Mental Strategy)",
    summary:
      "Written by former World No. 4 and Andre Agassi's coach Brad Gilbert. Teaches club and competitive tennis players how to defeat opponents who possess superior raw strokes through tactical preparation, mental composure, and pattern disruption.",
    keyTakeaways: [
      "Most matches are not won by hitting winners; they are lost by unforced errors under scoreboard pressure.",
      "The 'First 15 Minutes' rule: scout an opponent's backhand depth, footwork habits, and temperament immediately.",
      "Destroying rhythm: using moonballs, slice changes, and body serves against aggressive ball-strikers.",
      "Managing critical points: 30-15 and 15-30 swings, serving first percentage in tiebreaks.",
    ],
    chapters: [
      {
        page: "Part 1",
        title: "Thinking Before You Step on Court",
        summary:
          "Equipment check, pre-match warmup observation, and emotional energy conservation.",
      },
      {
        page: "Part 2",
        title: "Destroying the Opponent's Rhythm",
        summary: "Playing to weaknesses, altering ball height, and changing court pacing.",
      },
      {
        page: "Part 3",
        title: "Clutch Points & Closing Sets",
        summary: "Breaks of serve, protecting leads, and navigating tiebreak psychology.",
      },
    ],
    tags: ["Mental Toughness", "Tactics", "Match Play", "Coaching"],
  },
  {
    id: "book-athletics-science-running",
    title: "The Science of Running: Analyses of Runner's Mechanics & Training",
    sport: "Athletics",
    sportEmoji: "🏃",
    sourceType: "book",
    level: "Advanced",
    authorOrCreator: "Steve Magness",
    organizationOrPublisher: "Origin Press",
    estimatedTime: "368 pages (Biomechanics & Physiology)",
    summary:
      "Comprehensive breakdown of modern running physiology, lactate threshold dynamics, VO2 max optimization, stride cadence biomechanics, and periodization frameworks for track and distance athletes.",
    keyTakeaways: [
      "The myth of arbitrary target cadence: optimal stride frequency depends on velocity and leg length.",
      "Lactate is not a waste product; it is an energetic fuel recycled through oxidative muscle fibers.",
      "High-power neuromuscular sprints (flying 30s) recruit Type IIx motor units without metabolic fatigue.",
      "Peaking and tapering: balancing training volume reduction while maintaining high-intensity stimuli.",
    ],
    chapters: [
      {
        page: "Section 1",
        title: "Biomechanics of the Running Gait",
        summary:
          "Foot strike patterns, hip extension, vertical oscillation, and ground reaction forces.",
      },
      {
        page: "Section 2",
        title: "Cardiorespiratory Physiology & Energy Systems",
        summary: "Aerobic enzymes, mitochondrial density, and lactate buffering capacity.",
      },
      {
        page: "Section 3",
        title: "Training Design & Periodization",
        summary: "Building microcycles, mesocycles, tempo runs, and track interval progressions.",
      },
    ],
    tags: ["Biomechanics", "Physiology", "Endurance", "Sprints", "Periodization"],
  },
  {
    id: "book-relentless-mindset",
    title: "Relentless: From Good to Great to Unstoppable",
    sport: "Basketball",
    sportEmoji: "🏀",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Tim S. Grover",
    organizationOrPublisher: "Scribner",
    estimatedTime: "256 pages (Athletic Mindset)",
    summary:
      "Tim Grover, legendary trainer to Michael Jordan, Kobe Bryant, and Dwyane Wade, breaks down the relentless mental code required to dominate high-pressure sporting environments.",
    keyTakeaways: [
      "The 'Cleaner' mindset: refusing to seek praise, thriving under adversity, and delivering clutch execution.",
      "Physical conditioning is the prerequisite for mental confidence in the final two minutes.",
      "Eliminating overthinking: training instinct until execution happens without conscious hesitation.",
    ],
    chapters: [
      {
        page: "Ch 1–4",
        title: "When You're a Cleaner...",
        summary: "The three tiers of performers: Coolers, Closers, and Cleaners.",
      },
      {
        page: "Ch 5–8",
        title: "Pushing Beyond Physical Pain",
        summary: "Conditioning regimens that turn fourth quarters into dominant displays.",
      },
      {
        page: "Ch 9–13",
        title: "The Dark Side of Focus",
        summary: "Channelling internal drive and handling championship expectations.",
      },
    ],
    tags: ["Mindset", "Conditioning", "Basketball", "Clutch Performance"],
  },
  {
    id: "book-kabaddi-techniques",
    title: "Kabaddi: Modern Techniques & Tactical Formations",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "book",
    level: "Beginner",
    authorOrCreator: "E. Prasad Rao (Dronacharya Awardee)",
    organizationOrPublisher: "National Institute of Sports (NIS) Patiala",
    estimatedTime: "180 pages (Standard Textbook)",
    summary:
      "The definitive Indian manual on competitive mat Kabaddi by legendary coach E. Prasad Rao. Covers raid hand-touches, lion jumps, dubki escapes, ankle holds, chain tackles, and 3-defender bonus defense formations.",
    keyTakeaways: [
      "The continuous 'Cant' rhythm: breath regulation during high-intensity 30-second raid intervals.",
      "Corner coordination: why the right and left corners dictate defensive trap triggers.",
      "The Dubki mechanism: ducking beneath an oncoming defender's outstretched arm with forward momentum.",
      "Thigh and ankle locks: leverage principles using bodyweight and mat traction.",
    ],
    chapters: [
      {
        page: "Ch 1–3",
        title: "History, Mat Dimensions & Rules",
        summary: "Baulk line, bonus line, out zones, and match timing guidelines.",
      },
      {
        page: "Ch 4–7",
        title: "Offensive Skills (Raiding)",
        summary: "Hand touch, toe touch, side kick, dubki, frog jump, and back kick execution.",
      },
      {
        page: "Ch 8–11",
        title: "Defensive Skills (Catching)",
        summary: "Ankle hold, thigh hold, waist hold, dash, and chain tackle coordination.",
      },
      {
        page: "Ch 12–14",
        title: "Team Strategy & Match Situations",
        summary: "Do-or-Die raid tactics, super tackle scenarios, and bonus line prevention.",
      },
    ],
    tags: ["Kabaddi", "NIS", "Raiding", "Tackling", "Mat Rules"],
    featured: true,
  },

  // ===================== VIDEOS =====================
  {
    id: "video-cricket-cover-drive",
    title: "Batting Masterclass: The Perfect Cover Drive & Head Position",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "NCA Master Coaches / Cricket Academy Online",
    organizationOrPublisher: "BCCI National Cricket Academy Curriculum",
    estimatedTime: "16 min masterclass",
    videoDurationSeconds: 960,
    summary:
      "A step-by-step biomechanical breakdown of the classical cover drive. Demonstrates how head alignment over the front knee prevents aerial edges and transfers maximum power through the off-side field.",
    keyTakeaways: [
      "Initial trigger movement: weight slightly on balls of feet, eyes level with the horizon.",
      "Front foot stride direction: step toward the pitch of the ball, not straight down the wicket.",
      "High front elbow: the steering wheel that ensures the bat face comes down strictly perpendicular.",
      "Follow-through completion: holding pose to maintain spinal posture and balance.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Introduction & Common Flaws",
        summary: "Why reaching with hands without moving feet causes outside edges.",
      },
      {
        timestamp: "03:15",
        title: "Stance & Eye Line Alignment",
        summary: "Ensuring dominant eye remains directly over off-stump.",
      },
      {
        timestamp: "07:30",
        title: "Stride Length & Knee Bend",
        summary: "Preventing over-striding so the head remains over the ball.",
      },
      {
        timestamp: "11:45",
        title: "The High Elbow & Downward Swing",
        summary: "Top hand grip control vs bottom hand snap on impact.",
      },
      {
        timestamp: "14:10",
        title: "Three Progressive Drills",
        summary: "Drop-ball drill, throwdown cone drill, and bowling machine progression.",
      },
    ],
    equipmentRequired: ["Cricket Bat", "3 Cones", "Tennis or Leather Ball", "Batting Gloves"],
    tags: ["Cover Drive", "Batting Drills", "Biomechanics", "Video Clinic"],
    featured: true,
  },
  {
    id: "video-football-rondo",
    title: "The Positional Rondo Masterclass: 4v2 to 7v4 Overloads",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "video",
    level: "Intermediate",
    authorOrCreator: "UEFA Pro Coaching Series",
    organizationOrPublisher: "La Masia & European Football Lab",
    estimatedTime: "22 min clinic",
    videoDurationSeconds: 1320,
    summary:
      "How elite academies use rondos to train scanning frequency, open body orientation, disguise passing, and immediate counter-pressing within a 3-second recovery window.",
    keyTakeaways: [
      "Body shape: never face square to the passer; open hips at 45 degrees to see 3 progressive passing options.",
      "Head scanning: taking 3 to 5 micro-scans per 5 seconds before receiving the ball.",
      "Weight of pass: striking the ball into the teammate's back foot to direct their next touch forward.",
      "The 3-second counter-press trigger upon losing possession in the middle zone.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Why Rondos are Football's DNA",
        summary: "Translating small-sided rondos into 11v11 match patterns.",
      },
      {
        timestamp: "04:30",
        title: "The Classic 4v2 Setup & Rules",
        summary: "Grid dimensions 10x10m, 1-touch and 2-touch constraints.",
      },
      {
        timestamp: "09:45",
        title: "Line-Breaking Passes",
        summary: "Splitting the two central pressing defenders with pace.",
      },
      {
        timestamp: "15:20",
        title: "The 7v4 Positional Grid",
        summary: "Adding center-backs, pivot (No. 6), and wingers with transition goals.",
      },
      {
        timestamp: "19:50",
        title: "Coaching Points & Key Metrics",
        summary: "Turnover counts, pass completion streaks, and transition speed.",
      },
    ],
    equipmentRequired: ["8 Cones", "Size 5 Balls", "Bibs (2 Colors)"],
    tags: ["Rondo", "Passing", "Tactics", "Scanning", "Pressing"],
    featured: true,
  },
  {
    id: "video-badminton-deceptive-drop",
    title: "Badminton Trick Shots & Deceptive Net Tumbling Drops",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "video",
    level: "Intermediate",
    authorOrCreator: "BWF World Tour Analysis",
    organizationOrPublisher: "Badminton Masters Academy",
    estimatedTime: "14 min clinic",
    videoDurationSeconds: 840,
    summary:
      "Learn how World Champions disguise the cross-court slice and slow drop from the exact same preparation as a 400 km/h jump smash.",
    keyTakeaways: [
      "Identical full-body preparation: racket drawn back fully behind head, shoulders turned 90 degrees.",
      "Last-millisecond racket head deceleration or slice angle alteration across the feathers.",
      "Recovering to the 'T' immediately after playing the drop to punish the opponent's defensive lift.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The Concept of Stroke Disguise",
        summary: "Why identical setup freezes the defender's legs.",
      },
      {
        timestamp: "03:10",
        title: "Forehand Cross-Court Reverse Slice",
        summary: "Brushing the right side of the shuttle feathers.",
      },
      {
        timestamp: "07:20",
        title: "Backhand Net Hold & Flick",
        summary: "Holding racket stationary at net tape before flicking to rear court.",
      },
      {
        timestamp: "11:30",
        title: "Solo & Partner Feed Drills",
        summary: "Multi-shuttle feeding to master consistent feather contact.",
      },
    ],
    equipmentRequired: ["Badminton Racket", "Tube of Feather Shuttles", "Feeder Partner"],
    tags: ["Deception", "Drop Shot", "Net Play", "Smash", "BWF"],
  },
  {
    id: "video-tennis-serve-kinetic-chain",
    title: "Tennis Serve Mechanics: Leg Drive, Pronation & Trophy Pose",
    sport: "Tennis",
    sportEmoji: "🎾",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "ATP Tour Biomechanics Clinic",
    organizationOrPublisher: "Global Tennis Performance Center",
    estimatedTime: "20 min masterclass",
    videoDurationSeconds: 1200,
    summary:
      "The serve is the most important shot in tennis. Master the 7 stages of the kinetic chain: platform vs pinpoint stance, toss location at 1 o'clock, knee bend coil, racket drop, upward explosive drive, forearm pronation, and landing balance.",
    keyTakeaways: [
      "Continental grip is mandatory: never use an eastern forehand grip for serving.",
      "The toss: place the ball into the air with straight arm, landing 30cm inside the baseline.",
      "Forearm pronation snaps the racket face through the ball at the highest contact apex.",
      "Landing on the front foot inside the court to initiate forward court momentum.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Grip & The Trophy Pose",
        summary: "Continental grip alignment and coil angle of hips.",
      },
      {
        timestamp: "05:15",
        title: "Toss Placement & Left Arm Discipline",
        summary: "Holding the tossing arm up to maintain shoulder tilt.",
      },
      {
        timestamp: "10:00",
        title: "Racket Drop & Shoulder-over-Shoulder",
        summary: "Letting racket scratch the back for maximal elastic stretch.",
      },
      {
        timestamp: "14:40",
        title: "Pronation & Contact Point",
        summary: "High contact point with internal shoulder rotation.",
      },
      {
        timestamp: "18:00",
        title: "Target Practice Targets",
        summary: "Aiming for T, body, and wide out-wide service cones.",
      },
    ],
    equipmentRequired: ["Tennis Racket", "Tennis Balls", "4 Cones on Service Box"],
    tags: ["Serve", "Pronation", "Kinetic Chain", "Trophy Pose"],
  },
  {
    id: "video-kabaddi-ankle-hold",
    title: "Kabaddi Defense: Perfect Corner Ankle Hold & Chain Coordination",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "PKL Pro Coaches Masterclass",
    organizationOrPublisher: "Pro Kabaddi Training Camp",
    estimatedTime: "18 min clinic",
    videoDurationSeconds: 1080,
    summary:
      "A complete guide to executing the match-winning corner ankle hold against swift raiders. Breakdown of timing, grip around Achilles tendon, lifting opponent leg, and the supporting chain tackle rush.",
    keyTakeaways: [
      "Never dive at the ankle while the raider is balanced on both feet; wait for the outstretched leading toe touch.",
      "Clamp fingers tightly behind the ankle bone, pulling the foot upward and toward your chest.",
      "Cover defenders must rush in within 0.8 seconds to secure upper body containment.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Corner Stance & Stride Reading",
        summary: "Low center of gravity and staying on balls of feet.",
      },
      {
        timestamp: "04:15",
        title: "The Attack Moment (Baiting the Raider)",
        summary: "Feigning vulnerability to invite the toe touch.",
      },
      {
        timestamp: "08:50",
        title: "Hand Clamp & Leg Lift Mechanics",
        summary: "Leverage principles to prevent raider from lunging to mid-line.",
      },
      {
        timestamp: "13:20",
        title: "In-Cover & Center Support Rush",
        summary: "Team chain tackle locking techniques.",
      },
    ],
    equipmentRequired: ["Kabaddi Mat / Soft Turf", "Knee Pads"],
    tags: ["Kabaddi", "Ankle Hold", "Defense", "PKL", "Chain Tackle"],
  },
  {
    id: "video-basketball-shooting-form",
    title: "Pure Basketball Shooting Form: BEEF Principles & Arc Dynamics",
    sport: "Basketball",
    sportEmoji: "🏀",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "NBA Shooting Coaches Lab",
    organizationOrPublisher: "Pure Sweat Basketball",
    estimatedTime: "15 min clinic",
    videoDurationSeconds: 900,
    summary:
      "Unlock high-percentage jump shooting using the timeless BEEF system: Balance, Eyes, Elbow under the ball, and Follow-through. Includes slow-motion analysis of Steph Curry's 1-motion fluid shot release.",
    keyTakeaways: [
      "1-motion release: energy flows continuously from feet to fingertips without pausing at the top.",
      "Guide hand discipline: thumb flick on non-shooting hand causes errant spin and misses.",
      "Optimal entry arc of 45 to 50 degrees increases the basket's effective surface area by 40%.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The BEEF Shooting Foundation",
        summary: "Balance, Eyes, Elbow, Follow-through breakdown.",
      },
      {
        timestamp: "03:45",
        title: "Footwork: 1-2 Step vs Hop",
        summary: "Catch-and-shoot preparations under defensive pressure.",
      },
      {
        timestamp: "07:30",
        title: "The Set Point & Release Angle",
        summary: "Elbow tucked directly below wrist; release apex.",
      },
      {
        timestamp: "11:20",
        title: "Form Shooting Progression Drills",
        summary: "1-handed close shots building out to 3-point line.",
      },
    ],
    equipmentRequired: ["Basketball", "Hoop", "Smartphone Camera for Form Review"],
    tags: ["Shooting Form", "BEEF", "Jump Shot", "Basketball Drills"],
  },

  // ===================== TEXT GUIDES & RULEBOOKS =====================
  {
    id: "text-cricket-official-laws",
    title: "MCC Laws of Cricket Explained: Dismissals, Crease Lines & DRS",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "text",
    level: "Beginner",
    authorOrCreator: "Marylebone Cricket Club (MCC) & ICC Umpires Panel",
    organizationOrPublisher: "Official Laws of Cricket (Code 2017 / 3rd Edition 2022)",
    estimatedTime: "12 min read (Comprehensive Guide)",
    summary:
      "An authoritative yet accessible guide to the 42 Laws of Cricket. Understand tricky rules including Mankad run-outs at non-striker's end, LBW pitching and impact zones, umpire's call in DRS ball-tracking, and dead ball scenarios.",
    keyTakeaways: [
      "Law 36 (LBW): Three criteria must be satisfied — ball must not pitch outside leg stump, impact must be in line with stumps (unless no stroke offered), and ball must be hitting stumps.",
      "Law 38 (Run Out Non-Striker): The bowler is legally permitted to attempt a run-out prior to entering their delivery stride if non-striker backs up excessively.",
      "Law 31 (Timed Out): Incoming batter must be in position to receive the ball within 3 minutes (or 2 minutes in T20I) of dismissal.",
      "Crease measurements: Popping crease is 4 feet in front of bowling crease; return creases extend at right angles.",
    ],
    fullTextContent: `### Foundational Pitch Dimensions & Creases
Cricket is played on a 22-yard (20.12m) pitch framed by bowling, popping, and return creases.
- **Bowling Crease:** The line passing through the centers of the stumps (8 feet 8 inches / 2.64m wide).
- **Popping Crease:** The line 4 feet (1.22m) in front of the bowling crease and parallel to it. To be 'safe' from stumpings and run-outs, a batter must have some part of their bat or body grounded behind this line.
- **Return Creases:** Lines drawn at right angles to the bowling and popping creases, 4 feet 4 inches on either side of the middle stump.

### The 10 Primary Methods of Dismissal
1. **Bowled (Law 32):** The ball hits and dislodges at least one bail from the stumps.
2. **Caught (Law 33):** The ball hits bat or glove holding the bat and is cleanly caught before touching the ground.
3. **Leg Before Wicket / LBW (Law 36):** A delivered ball that does not pitch outside leg stump strikes the batter's pad/body and would have hit the stumps.
4. **Run Out (Law 38):** A fielder breaks the wicket with the ball while the batter is out of their ground.
5. **Stumped (Law 39):** The wicketkeeper breaks the wicket when the batter is out of ground while playing a shot and not attempting a run.
6. **Hit Wicket (Law 35):** Batter dislodges bails with bat, body, or gear during delivery or initial run.
7. **Handled the Ball / Obstructing the Field (Law 37):** Willfully deflecting the ball or obstructing a fielder's throw.
8. **Hit the Ball Twice (Law 34):** Striking the ball a second time unless purely defending stumps without scoring.
9. **Timed Out (Law 40):** Batter fails to arrive on field within the time limit.
10. **Retired Out:** Leaving the field without umpire permission and without injury.

### Decision Review System (DRS) & Umpire's Call
When teams challenge an on-field decision, ultra-edge (snickometer) checks for bat contact first. If reviewing LBW, Hawk-Eye ball tracking plots pitch point, impact point, and trajectory into stumps. If less than 50% of the ball is projected to hit the stump zone, the ruling defaults to 'Umpire's Call', preserving the on-field decision and the reviewing team's challenge.`,
    tags: ["Rules", "MCC Laws", "LBW", "DRS", "Crease Dimensions"],
    featured: true,
  },
  {
    id: "text-football-fifa-laws",
    title: "IFAB Laws of the Game: Offside Rule, VAR & Handball Interpretations",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "text",
    level: "Beginner",
    authorOrCreator: "International Football Association Board (IFAB)",
    organizationOrPublisher: "IFAB Official Rulebook",
    estimatedTime: "14 min read",
    summary:
      "Clear, detailed breakdowns of Law 11 (Offside), Law 12 (Fouls and Misconduct), and VAR protocols. Explains the difference between deliberate play vs deflection in offside situations, and the silhouette body enlargement rule for handballs.",
    keyTakeaways: [
      "Offside is assessed at the exact moment the ball is played, not when the attacker receives it.",
      "A player is NOT offside if they are in their own half, or level with the second-to-last opponent, or receive the ball directly from a throw-in, corner, or goal kick.",
      "Handball offenses require deliberate movement or the arm making the player's body unnaturally bigger above the T-shirt sleeve line.",
      "The DOGSO (Denial of an Obvious Goal-Scoring Opportunity) rule in the penalty box: yellow card if genuine attempt for the ball, red card if pulling/pushing.",
    ],
    fullTextContent: `### Law 11: The Complete Offside Rule
A player is in an **offside position** if:
- Any part of their head, body, or feet is in the opponents' half (excluding the halfway line); and
- Any part of their head, body, or feet is nearer to the opponents' goal line than both the ball and the second-last opponent.

*Crucial note:* Hands and arms of all players (including goalkeepers) are NOT considered when judging offside position.

#### When is an offside position penalized?
A player in an offside position at the moment the ball is played or touched by a teammate is only penalized on becoming involved in active play by:
1. **Interfering with play:** playing or touching the ball passed or touched by a teammate.
2. **Interfering with an opponent:** preventing an opponent from playing or being able to play the ball by clearly obstructing their line of vision, or challenging for the ball.
3. **Gaining an advantage:** playing the ball or interfering with an opponent when it has rebounded or deflected off the goalpost, crossbar, or an opponent.

### Law 12: Modern Handball Criteria
It is an offense if a player:
- Deliberately touches the ball with their hand/arm (e.g., moving hand toward ball).
- Touches the ball with their hand/arm when it has made their body **unnaturally bigger**. A player is considered to have made their body unnaturally bigger when the position of their hand/arm is not a consequence of, or justifiable by, the player's body movement for that specific situation.
- Scores in the opponents' goal directly from their hand/arm, even if accidental.`,
    tags: ["FIFA", "IFAB", "Offside", "Handball", "VAR"],
    featured: true,
  },
  {
    id: "text-badminton-court-specs",
    title: "Official BWF Badminton Court Dimensions & Service Line Specifications",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "diagram",
    level: "Beginner",
    authorOrCreator: "BWF Technical Committee",
    organizationOrPublisher: "Badminton World Federation Facilities Handbook",
    estimatedTime: "8 min read & blueprints",
    summary:
      "Interactive specifications and diagrams for standard BWF badminton courts. Learn all lines: short service line, long service line for doubles, center line, singles side lines, and net height calibrations.",
    keyTakeaways: [
      "Total court length: 13.40 meters (44 feet); Total court width: 6.10 meters (20 feet) for doubles.",
      "Singles court width: 5.18 meters (17 feet) using inside boundary lines.",
      "Short service line is 1.98 meters (6.5 feet) from the net.",
      "Net height must be exactly 1.55 meters at the side posts and 1.524 meters (5 feet) at center.",
    ],
    fieldSpecs: {
      length: "13.40 meters (44 feet)",
      width: "6.10m (Doubles) / 5.18m (Singles)",
      boundaryNote:
        "Lines must be 40mm wide, easily distinguishable (usually white or yellow) on synthetic court mat.",
      keyLines: [
        "Short Service Line: 1.98m from net",
        "Doubles Long Service Line: 0.76m inside back boundary line",
        "Center Line: divides left and right service courts from short service line to back line",
        "Post height: 1.55m placed firmly on doubles side lines",
      ],
    },
    tags: ["Court Dimensions", "BWF Specs", "Lines", "Net Height"],
  },
  {
    id: "text-kabaddi-mat-specs",
    title: "IKF Kabaddi Mat Layout: Baulk Line, Bonus Line & Lobby Rules",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "diagram",
    level: "Beginner",
    authorOrCreator: "Amateur Kabaddi Federation of India (AKFI)",
    organizationOrPublisher: "International Kabaddi Federation Mat Rulebook",
    estimatedTime: "7 min read & diagrams",
    summary:
      "Detailed breakdown of standard EVA synthetic Kabaddi mat dimensions for Men and Women, explaining the crucial purpose of the Baulk line, Bonus line, 1-meter lobbies, and sitting blocks.",
    keyTakeaways: [
      "Men's court dimensions: 13 meters x 10 meters; divided into two equal halves of 6.5m x 10m by the mid-line.",
      "Baulk line is located 3.75 meters from mid-line; raider must cross it with at least one foot over and trailing foot in the air to make the raid valid.",
      "Bonus line is located 4.75 meters from mid-line (1 meter past the baulk line); bonus is awarded when 6 or 7 defenders are on court.",
      "Side lobbies are 1 meter wide on each flank; become active for movement ONLY after a touch has been established.",
    ],
    fieldSpecs: {
      length: "13.0 meters (Men) / 12.0 meters (Women)",
      width: "10.0 meters (Men) / 8.0 meters (Women)",
      boundaryNote: "Surrounded by a 4-meter safety clearance zone on all sides.",
      keyLines: [
        "Mid Line: Divides the two 6.5m halves",
        "Baulk Line: 3.75m from Mid Line",
        "Bonus Line: 4.75m from Mid Line (1.0m past Baulk)",
        "Lobby: 1.0m yellow side corridors active post-touch",
      ],
    },
    tags: ["Kabaddi Mat", "Baulk Line", "Bonus Line", "Lobby Rules", "AKFI"],
  },

  // ===================== PODCASTS / AUDIO =====================
  {
    id: "audio-coaching-pullela-gopichand",
    title: "The Architecture of Olympic Champions: Gopichand on Discipline & Grit",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "audio",
    level: "Intermediate",
    authorOrCreator: "Pullela Gopichand (Chief National Coach)",
    organizationOrPublisher: "India Sports Excellence Audio Archives",
    estimatedTime: "32 min audio masterclass",
    summary:
      "Dronacharya awardee and national coach Pullela Gopichand discusses the daily training structure that produced Saina Nehwal, PV Sindhu, and Kidambi Srikanth. Insights into 4:15 AM court sessions, multi-shuttle endurance, and managing psychological tournament peaks.",
    keyTakeaways: [
      "Physical conditioning must outstrip match demands by at least 25% to maintain composure in 3rd-set deuces.",
      "Removing smartphone distractions during competitive training blocks.",
      "How to convert unforced errors into immediate tactical adjustments rather than self-chastisement.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The 4:00 AM Routine & Mental Fortitude",
        summary: "Why early morning court sessions create an irreplaceable psychological edge.",
      },
      {
        timestamp: "11:20",
        title: "Multi-Shuttle Drill Progression",
        summary: "Feeding 40 shuttles in 30 seconds to push VO2 thresholds.",
      },
      {
        timestamp: "22:45",
        title: "Handling Olympic & World Championship Pressure",
        summary: "De-escalating athlete anxiety before final matches.",
      },
    ],
    tags: ["Coaching", "Pullela Gopichand", "Olympic Mindset", "Discipline"],
  },
  {
    id: "audio-tactics-cricket-captaincy",
    title: "Fielding Geometry & Match Tempo: Reading Batting Wagon Wheels",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "audio",
    level: "Intermediate",
    authorOrCreator: "Elite Indian First-Class Captains Panel",
    organizationOrPublisher: "Cricket Strategy & Tactics Network",
    estimatedTime: "25 min audio",
    summary:
      "In-depth discussion on captaincy strategy: setting ring fields vs boundary catchers, using non-regular bowlers in transitional overs, and manipulating run rate pressure in multi-day and limited overs matches.",
    keyTakeaways: [
      "How an extra cover fielder positioned 5 yards deeper stops 1s while tempting aerial mistakes.",
      "Fielding positions must match bowler strengths rather than generic textbook charts.",
      "Bowler captain dialogue: agreeing on dismissal plans over 6 consecutive balls.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Reading the Pitch on Morning of Day 1",
        summary: "Moisture, crack lines, and early bounce analysis.",
      },
      {
        timestamp: "08:30",
        title: "Death Overs Field Placement in T20s",
        summary: "Protecting the short boundary with sweeper cover and deep square leg.",
      },
      {
        timestamp: "17:15",
        title: "Setting Traps for Set Batters",
        summary: "Starving singles to provoke aggressive shots against spin.",
      },
    ],
    tags: ["Captaincy", "Fielding", "Cricket Strategy", "Audio"],
  },

  // ===================== INTERACTIVE QUIZZES =====================
  {
    id: "quiz-cricket-rules",
    title: "ICC Laws & Match Scenarios: Test Your Umpire Knowledge",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "quiz",
    level: "Intermediate",
    authorOrCreator: "KhelGrid Umpiring Academy",
    organizationOrPublisher: "ICC Certified Match Officials Program",
    estimatedTime: "5 questions (3 mins)",
    summary:
      "Put your rule knowledge to the test! Can you answer scenarios on non-striker run-outs, LBW ball-tracking, boundary catches with airborne fielders, and dead ball rulings?",
    keyTakeaways: [
      "Instant feedback with official MCC Law references.",
      "Learn nuances that distinguish club cricket from international match decisions.",
    ],
    quiz: [
      {
        question: "When is a non-striker legally run out by the bowler during their approach?",
        options: [
          "Only after warning the batter once verbally",
          "At any time before the bowler enters their delivery stride",
          "Only when the bowler stops completely at the crease",
          "It is never allowed under official MCC laws",
        ],
        correctIndex: 1,
        explanation:
          "Under MCC Law 38.3, the bowler is permitted to attempt a run-out of the non-striker at any point prior to entering their delivery stride if the batter is out of their ground. No prior warning is legally required.",
      },
      {
        question:
          "For an LBW appeal to succeed, where must the ball NOT pitch under any circumstance?",
        options: [
          "Outside off stump",
          "In line with stumps",
          "Outside leg stump",
          "Inside the bowler's half of the pitch",
        ],
        correctIndex: 2,
        explanation:
          "Law 36 states that if the ball pitches outside leg stump, the batter CANNOT be given out LBW, even if the ball would have gone on to hit middle stump.",
      },
      {
        question:
          "A boundary fielder airborne outside the boundary cushion taps the ball back into play. What was their last point of ground contact required to be?",
        options: [
          "Anywhere inside or outside the field",
          "Completely inside the boundary line",
          "Touching the boundary rope",
          "On both feet simultaneously",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 19, an airborne fielder's first contact with the ball is only legal if their last contact with the ground was inside the boundary playing area.",
      },
      {
        question:
          "In T20 internationals, what is the maximum time allowed for an incoming batter to be ready to face the next ball?",
        options: ["90 seconds", "120 seconds (2 minutes)", "180 seconds (3 minutes)", "60 seconds"],
        correctIndex: 1,
        explanation:
          "In T20 International cricket, the incoming batter must be ready to receive the ball within 2 minutes (120 seconds). In Test cricket, the limit is 3 minutes.",
      },
      {
        question:
          "If a delivery strikes a fielding helmet placed on the turf behind the wicketkeeper, how many penalty runs are awarded to the batting side?",
        options: ["1 run", "4 runs", "5 penalty runs", "No penalty runs"],
        correctIndex: 2,
        explanation:
          "Under Law 28.3, if the ball in play touches protective equipment placed on the ground, 5 penalty runs are awarded to the batting side and the ball immediately becomes dead.",
      },
    ],
    tags: ["Quiz", "Cricket Laws", "Umpiring", "Interactive"],
    featured: true,
  },
  {
    id: "quiz-football-rules",
    title: "IFAB Laws of the Game Scenario Challenge: Referee Exam",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "quiz",
    level: "Intermediate",
    authorOrCreator: "AIFF / IFAB Referee Development",
    organizationOrPublisher: "Referee Certification Board",
    estimatedTime: "5 questions (3 mins)",
    summary:
      "Scenario-based refereeing test covering offside deflections vs deliberate play, denial of obvious goalscoring opportunities (DOGSO), and penalty kick encroachment.",
    keyTakeaways: [
      "Master the subtle distinction between a deflection and deliberate play in offside situations.",
      "Understand the double jeopardy rule inside the penalty box.",
    ],
    quiz: [
      {
        question:
          "An attacker in an offside position receives the ball directly from an opponent who intentionally played the ball. Is the attacker penalized for offside?",
        options: [
          "Yes, always offside",
          "No, because the opponent deliberately played the ball",
          "Yes, unless the opponent scored an own goal",
          "It depends on the referee's discretion",
        ],
        correctIndex: 1,
        explanation:
          "Under IFAB Law 11, a player in an offside position receiving the ball from an opponent who deliberately plays the ball is NOT considered to have gained an advantage, unless it was a deliberate save.",
      },
      {
        question: "Can a player score a valid goal directly from a throw-in?",
        options: [
          "Yes, if it crosses the goal line cleanly",
          "No; if it goes into the opponent's goal, a goal kick is awarded",
          "Yes, in amateur football only",
          "No; it results in a penalty kick",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 15, a goal cannot be scored directly from a throw-in. If the ball enters the opponent's goal without touching any other player, a goal kick is awarded to the defending team.",
      },
      {
        question:
          "Inside the penalty area, a defender accidentally trips an attacker while genuinely attempting to challenge for the ball, stopping an obvious goal. What is the sanction?",
        options: [
          "Penalty kick and Red Card (DOGSO)",
          "Penalty kick and Yellow Card (Double Jeopardy prevention)",
          "Direct free kick only",
          "Indirect free kick and Yellow Card",
        ],
        correctIndex: 1,
        explanation:
          "To avoid 'triple punishment' (penalty, red card, suspension), when a foul inside the box denies an obvious goal opportunity but is a genuine attempt to play the ball, the sanction is downgraded to a Yellow Card + Penalty.",
      },
      {
        question:
          "Can a goalkeeper handle the ball inside their own penalty box if passed back by a teammate using their foot?",
        options: [
          "Yes, whenever they choose",
          "No; handling a deliberate kick back from a teammate results in an indirect free kick",
          "Yes, if passed from outside the half-way line",
          "No; it results in a penalty kick",
        ],
        correctIndex: 1,
        explanation:
          "Under the back-pass rule (Law 12), a goalkeeper cannot touch the ball with their hands if it was deliberately kicked to them by a teammate. An indirect free kick is awarded.",
      },
      {
        question:
          "How many players must a team have at minimum to start or continue a competitive 11-a-side match?",
        options: ["9 players", "8 players", "7 players", "6 players"],
        correctIndex: 2,
        explanation:
          "Under Law 3, a match may not start or continue if either team has fewer than 7 players (including the goalkeeper).",
      },
    ],
    tags: ["Football Quiz", "IFAB", "Referee Exam", "Interactive"],
    featured: true,
  },
  {
    id: "quiz-badminton-rules",
    title: "BWF Rally Point & Service Rule Quiz: Test Your Court IQ",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "quiz",
    level: "Beginner",
    authorOrCreator: "BWF Umpire Certification Hub",
    organizationOrPublisher: "Badminton World Federation",
    estimatedTime: "4 questions (2 mins)",
    summary:
      "Sharpen your understanding of rally scoring, the fixed height service rule (1.15m), receiver readiness, and service court rotation in doubles.",
    keyTakeaways: [
      "Understand where to stand for service based on score parity (even vs odd).",
      "Learn what constitutes a legal service height under contemporary BWF standards.",
    ],
    quiz: [
      {
        question:
          "When the server's score is an EVEN number (0, 2, 4, 6...), from which service court must they serve?",
        options: [
          "Right-hand service court",
          "Left-hand service court",
          "Whichever court they choose",
          "Center of the court",
        ],
        correctIndex: 0,
        explanation:
          "In both singles and doubles, the server serves from the right-hand service court when their score is even (or 0), and from the left-hand service court when their score is odd.",
      },
      {
        question:
          "Under the modern BWF fixed-height service rule, the entire shuttlecock must be below what height at the instant of being hit?",
        options: [
          "Waist height of the server",
          "1.15 meters from the court surface",
          "1.00 meters from the court surface",
          "The top of the net tape",
        ],
        correctIndex: 1,
        explanation:
          "BWF Law 9.1.5 mandates that the whole shuttlecock shall be below 1.15 meters from the surface of the court at the instant of being hit by the server's racket.",
      },
      {
        question: "If a badminton game reaches 29-all, what score wins the game?",
        options: [
          "Must lead by 2 points (e.g. 31-29)",
          "The side scoring the 30th point wins (30-29)",
          "A tiebreaker shootout is played",
          "A coin toss determines the winner",
        ],
        correctIndex: 1,
        explanation:
          "Under BWF rules, if the score reaches 29-all, the side scoring the 30th point wins that game (capped strictly at 30 points).",
      },
      {
        question:
          "During a doubles rally, the shuttlecock touches one player's racket and then their partner's racket before going over the net. What is the call?",
        options: [
          "Legal play if in one motion",
          "Fault: double hit by partners",
          "Let: point is replayed",
          "Only allowed if returning a smash",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 13.3.8, it is a Fault if the shuttlecock is hit by a player and their partner successively during a rally.",
      },
    ],
    tags: ["Badminton Quiz", "BWF Rules", "Service Height", "Doubles Rotation"],
  },
];

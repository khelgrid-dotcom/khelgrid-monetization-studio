export type BlogCategory =
  "Training" | "Trial preparation" | "Sports career" | "Recovery" | "Mindset";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readMins: number;
  coverImage: string;
  sections: BlogSection[];
  isUserPublished?: boolean;
}

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=78`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "build-a-four-week-athlete-training-base",
    title: "How to build a four-week training base before chasing a trial",
    excerpt:
      "A practical way to organize skill work, conditioning, recovery and review so your training week has a purpose instead of just more volume.",
    category: "Training",
    author: "KhelGrid Sports Editorial Team",
    authorRole: "Athlete education desk",
    publishedAt: "2026-03-04",
    updatedAt: "2026-03-04",
    readMins: 8,
    coverImage: image("photo-1517836357463-d25dfeac3438"),
    sections: [
      {
        heading: "Start with the outcome, not the exercise list",
        paragraphs: [
          "A useful training block starts with a question: what does the next month need to improve? For a cricket trial that may be repeatable batting decisions under pressure. For a sprinter it may be acceleration mechanics. For a footballer it may be receiving and releasing the ball at speed. The answer determines what earns space in the week.",
          "Write down one primary outcome and two supporting outcomes. Keep them observable: number of quality repetitions, a timed split recorded under the same conditions, or a coach-reviewed decision-making drill. Avoid turning every weakness into a priority. A long list creates busy sessions but makes progress difficult to see.",
        ],
        bullets: [
          "Primary outcome: the skill or quality most relevant to the next opportunity.",
          "Supporting outcomes: two qualities that help the primary one hold up under fatigue.",
          "Review measure: one repeatable test, video angle or coach observation to revisit weekly.",
        ],
      },
      {
        heading: "Use a repeatable weekly rhythm",
        paragraphs: [
          "A four-week base usually works better when hard and easy days are separated. The exact number of sessions depends on age, sport, school or work, injury history and coaching support. A general template can include two high-quality sport sessions, one conditioning session, one lighter technical session and at least one full rest day. That is a starting point, not a prescription.",
          "Keep the hardest work away from the day when you need to perform your most precise skill. If fatigue changes your technique, shorten the session or move the conditioning work. Training more is not automatically training better; repeatable quality is what gives a coach useful evidence of progress.",
        ],
      },
      {
        heading: "Review the block before adding more",
        paragraphs: [
          "At the end of each week, record what you completed, how your body felt, and whether the quality target was met. A simple note with session duration, perceived effort from 1 to 10, sleep context and one learning point is enough. Do not compare numbers collected in different conditions as though they were a formal test.",
          "After four weeks, keep the parts that improved your target and change one variable at a time. If pain, unusual fatigue, dizziness or a persistent drop in performance appears, pause and speak with a qualified medical or coaching professional. This article is general education, not individualized medical advice.",
        ],
      },
    ],
  },
  {
    slug: "trial-preparation-week-without-overtraining",
    title: "The week before a trial: prepare without overtraining",
    excerpt:
      "A calm final week protects the work you have already done. Use this checklist to reduce surprises, preserve freshness and confirm the organizer's instructions.",
    category: "Trial preparation",
    author: "KhelGrid Sports Editorial Team",
    authorRole: "Athlete education desk",
    publishedAt: "2026-02-26",
    updatedAt: "2026-02-26",
    readMins: 7,
    coverImage: image("photo-1552674605-db6ffd4facb5"),
    sections: [
      {
        heading: "Confirm the event before changing your training",
        paragraphs: [
          "Before planning the final week, check the latest notice from the organizer. Confirm the reporting time, venue, age or eligibility rules, documents, equipment, fee instructions and whether the assessment is one day or multiple stages. A forwarded message can be out of date, so use the official channel whenever one is available.",
          "Save the confirmation in one place and tell a parent, guardian or trusted teammate where it is. If an instruction is unclear, ask the organizer rather than guessing. This is especially important when travel, payment or identity documents are involved.",
        ],
      },
      {
        heading: "Keep intensity familiar and volume sensible",
        paragraphs: [
          "The final week is usually a poor time to introduce a new lifting routine, unfamiliar footwear, a drastic diet or a personal-best challenge. Keep the movement patterns and equipment familiar. Short, focused sessions can maintain rhythm while leaving enough recovery for the assessment.",
          "Your coach can adjust the details for your sport and training age. As a general planning idea, place the last demanding session early enough that you can recover, then use lighter technical work, mobility and rest as the event approaches. The right taper varies; the goal is to arrive able to show your current level, not to create a new one overnight.",
        ],
      },
      {
        heading: "Pack for a predictable day",
        paragraphs: [
          "Prepare equipment, identification, water, familiar food and weather-appropriate clothing the evening before. Check transport time and add a buffer for finding the entrance. On the day, follow the warm-up instructions from the coaching team and avoid copying a stranger's routine just because it looks intense.",
          "After the trial, write down what you remember while it is fresh: drills, positions, timings, feedback and any follow-up instruction. A result is useful, but the learning record is what helps you prepare for the next opportunity.",
        ],
      },
    ],
  },
  {
    slug: "sports-cv-that-helps-coaches-review-you",
    title: "How to write a sports CV that helps a coach review you",
    excerpt:
      "A strong athlete profile makes evidence easy to find. Here is a one-page structure for results, video, references and the context selectors need.",
    category: "Sports career",
    author: "KhelGrid Sports Editorial Team",
    authorRole: "Athlete education desk",
    publishedAt: "2026-02-18",
    updatedAt: "2026-02-18",
    readMins: 9,
    coverImage: image("photo-1526232761682-d26e03ac148e"),
    sections: [
      {
        heading: "Lead with identity and a clear playing context",
        paragraphs: [
          "Put your name, sport, primary position or event, age group, city and a reliable contact method at the top. If you have a coach, academy or school reference, name the relationship and provide a way for the reviewer to verify it with permission. A coach should understand the context of your profile in the first few seconds.",
          "Do not describe yourself as selected, ranked or certified unless you can support the claim with the relevant result or official record. Precise wording builds trust: say the competition, date, age group and outcome rather than using broad labels such as elite or professional.",
        ],
      },
      {
        heading: "Show evidence with dates and context",
        paragraphs: [
          "Choose three to five results that match the opportunity you are pursuing. Include the event name, location, date, format or distance, and your result. For a team sport, add your position and the level of competition. For timed or measured events, mention the conditions when they affect comparison.",
          "Add video links that open without a login when possible. A short clip with a clear label is easier to review than a long montage. Include the date and role in the description, and never upload another athlete's image without consent. Keep a private folder of full-match footage so you can provide more context when a coach requests it.",
        ],
        bullets: [
          "Result: event, date, age group, format and outcome.",
          "Evidence: one focused clip or document for the claim.",
          "Context: position, role, conditions and the coach who can confirm it.",
        ],
      },
      {
        heading: "Finish with the next step you want",
        paragraphs: [
          "State whether you are looking for an assessment, academy conversation, club trial, scholarship information or a training environment. This gives the reader a useful response path. End with your availability, location and the questions you want answered about schedule, fees, selection process and support.",
          "Review your CV every few months. Remove old claims that are no longer accurate, update dates and check every link on a phone. A short, current profile is more useful than a long document that asks a coach to reconstruct your history.",
        ],
      },
    ],
  },
  {
    slug: "choose-between-academy-club-school-pathway",
    title: "Academy, club or school team: how to compare a sports pathway",
    excerpt:
      "The most expensive option is not always the best fit. Compare coaching, competition, travel, education and written terms before committing.",
    category: "Sports career",
    author: "KhelGrid Sports Editorial Team",
    authorRole: "Athlete education desk",
    publishedAt: "2026-02-09",
    updatedAt: "2026-02-09",
    readMins: 8,
    coverImage: image("photo-1547347298-4074fc3086f0"),
    sections: [
      {
        heading: "Compare the environment, not only the brand",
        paragraphs: [
          "A pathway should be judged by the daily environment an athlete will actually use. Ask who coaches the group, how often athletes train, how playing or competition opportunities are decided, and what feedback looks like. A recognizable name can be helpful, but it cannot replace a clear schedule and qualified attention.",
          "Visit when possible. Watch how staff speak to athletes, how safety is handled, whether beginners and developing athletes receive feedback, and whether the stated schedule matches what is happening. If a program refuses reasonable questions about fees or selection, treat that as important information.",
        ],
      },
      {
        heading: "Put the cost and commitment in writing",
        paragraphs: [
          "Request a written breakdown of tuition, registration, kit, travel, accommodation, tournament fees and refund or exit terms. Ask which costs are optional and when they can change. For a scholarship or discount, confirm the duration, renewal conditions, performance expectations and what happens if the athlete changes school, city or sport.",
          "Do not pay because someone promises guaranteed selection, a government connection or access to a scout. Confirm the identity of the organization through an official channel and keep receipts and messages. A legitimate program should be able to explain its process without pressuring a family to decide immediately.",
        ],
      },
      {
        heading: "Protect the athlete's long-term options",
        paragraphs: [
          "The best choice leaves room for education, recovery, family logistics and healthy competition. Map the weekly travel time and total hours, not just the advertised session length. Ask how missed sessions, injuries, exams and changes in level are handled.",
          "Make a simple comparison table and discuss it with the athlete, family and a trusted coach. Revisit the decision after an agreed trial period. A pathway is a partnership that should keep producing learning, evidence and safe opportunities—not a permanent promise that one organization controls the athlete's future.",
        ],
      },
    ],
  },
  {
    slug: "recovery-review-after-hard-training-week",
    title: "A simple recovery and review routine after a hard training week",
    excerpt:
      "Recovery is more than a rest day. Use sleep, food, movement and notes to understand whether your next week should progress, repeat or ease back.",
    category: "Recovery",
    author: "KhelGrid Sports Editorial Team",
    authorRole: "Athlete education desk",
    publishedAt: "2026-01-31",
    updatedAt: "2026-01-31",
    readMins: 6,
    coverImage: image("photo-1571019613454-1cb2f99b2d8b"),
    sections: [
      {
        heading: "Use a few reliable signals",
        paragraphs: [
          "You do not need an expensive wearable to notice recovery trends. Record sleep duration and quality, general energy, muscle soreness, mood, and whether your normal warm-up feels normal. One difficult morning is not a diagnosis; several signals moving in the wrong direction over several days are a reason to reduce load and speak with your coach.",
          "Review training effort alongside those notes. A session that felt unusually hard at the same pace or skill level may mean the next session should be adjusted. The goal is to collect enough context to make a calm decision, not to turn every number into a score.",
        ],
      },
      {
        heading: "Make recovery actions boring and repeatable",
        paragraphs: [
          "Protect a regular sleep window, eat familiar balanced meals, drink regularly, and use gentle movement if it helps you feel better. Keep recovery choices practical enough to repeat during school, work and travel. A complicated routine that lasts three days is less useful than a simple routine you can maintain.",
          "For pain, illness, dizziness, breathing problems or an injury that changes movement, seek qualified medical advice. Do not use a blog checklist to return to sport after an injury. Your coach and healthcare professional can help decide when and how to progress.",
        ],
      },
      {
        heading: "Choose the next week's adjustment",
        paragraphs: [
          "At the end of the week, choose one of three actions: progress a small amount, repeat the same workload, or reduce the load. Write why. If the target skill improved and recovery was stable, a small progression may be reasonable. If the skill is improving but fatigue is high, repeating or easing back may produce better learning.",
          "Share the notes with your coach. This turns recovery into part of the performance conversation and gives the coach evidence beyond whether you simply attended every session.",
        ],
      },
    ],
  },
];

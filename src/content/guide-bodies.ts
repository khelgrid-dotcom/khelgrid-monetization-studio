import type { Faq, Section } from "./types";

export interface GuideBody {
  intro: string[];
  sections: Section[];
  faqs: Faq[];
}

/**
 * Full editorial bodies for guides. A guide with a body here renders as a
 * long-form article and is indexable; guides without one render as a short
 * outline and are marked `noindex` until the full article is written.
 */
export const GUIDE_BODIES: Record<string, GuideBody> = {
  "cricket-trial-prep-checklist": {
    intro: [
      "The week before a cricket trial decides less than players think and more than they prepare for. You cannot build fitness or a new technique in seven days, but you can arrive fresh, correctly equipped, warmed up and clear about what the selectors will be watching.",
      "This is a day-by-day plan for the seven days before a district, state or academy trial, written for club and school cricketers in India.",
    ],
    sections: [
      {
        heading: "Days 7 to 5: last useful work",
        blocks: [
          {
            type: "p",
            text: "Finish your hard work here. Batters take a long net with a purpose — leaving, defence and one scoring option against pace, then spin. Bowlers bowl one full intensity spell of six overs with a proper run-up, not half-paced from a shortened mark. Fielders do the boring part: high catches into the sun, flat catches at chest height, and twenty throws from the boundary to the keeper's end.",
          },
          {
            type: "list",
            items: [
              "One long net at full intensity, then reduce volume for the rest of the week.",
              "Bowlers: one six-over spell off the full run-up, then no more than three overs a day.",
              "Confirm the trial time, venue, age band, reporting time and required documents in writing.",
              "Break in new shoes now if you must wear them — never on the day.",
            ],
          },
        ],
      },
      {
        heading: "Days 4 to 2: taper and rehearse",
        blocks: [
          {
            type: "p",
            text: "Cut volume by roughly half and keep intensity sharp. Short, crisp sessions maintain feel without accumulating fatigue. Rehearse the trial itself: bat in the same order of shots you will be asked for, bowl to a set field, and practise the two-minute warm-up you will do on the day so it is automatic.",
          },
          {
            type: "steps",
            items: [
              "Day 4: 30-minute net at match intensity, then throwdowns for timing only.",
              "Day 3: fielding and running between wickets; no heavy gym work.",
              "Day 2: light skills, full mobility session, early night.",
              "Pack your bag on Day 2, not the night before — it removes the panic search.",
            ],
          },
        ],
      },
      {
        heading: "Day 1: kit, food and sleep",
        blocks: [
          {
            type: "table",
            head: ["Category", "Carry"],
            rows: [
              [
                "Documents",
                "Birth certificate, school certificate, Aadhaar, photographs, medical certificate, consent letter",
              ],
              [
                "Kit",
                "Bat, pads, gloves, thigh pad, abdominal guard, helmet, spikes and rubber-sole shoes",
              ],
              ["Bowling", "Two pairs of socks, tape, spare laces, sunscreen, cap"],
              [
                "Recovery",
                "2 litres of water, electrolyte sachets, bananas, roti-sabzi or rice, glucose",
              ],
            ],
          },
          {
            type: "p",
            text: "Eat familiar food only. Aim for a normal carbohydrate-heavy dinner, keep hydration steady across the day rather than drinking a litre at once, and be in bed early enough for at least eight hours. Nothing new — no new supplement, no new energy drink, no new shoes.",
          },
        ],
      },
      {
        heading: "Trial day: the parts you control",
        blocks: [
          {
            type: "list",
            items: [
              "Arrive at least 45 minutes before reporting time and report to the official desk yourself.",
              "Do a full 15-minute warm-up before you are called; assume you will get no notice.",
              "Introduce yourself clearly to the coach with your name, age group and role.",
              "Field like the trial has already started — most selectors form their first opinion in the fielding drills.",
              "If you fail early, keep your energy visible for the rest of the day. Attitude is scored, formally or not.",
            ],
          },
          {
            type: "note",
            text: "Never hand over original documents. Carry copies to submit and keep originals in your bag for inspection only.",
          },
        ],
      },
      {
        heading: "After the trial",
        blocks: [
          {
            type: "p",
            text: "Write down what you were asked to do and how you performed while it is fresh, and photograph any result or attendance sheet. Ask the coach one specific question — the single thing to improve before the next trial. Then take two easy days: sleep, light movement and normal food. That record and that feedback are what turn one trial into a pathway rather than a one-off day out.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How many days before a cricket trial should I stop hard training?",
        a: "Do your last full-intensity session about five days out, then halve the volume while keeping intensity sharp. The final two days should be light skills, mobility and sleep.",
      },
      {
        q: "What documents do cricket trials in India usually require?",
        a: "Birth certificate and school leaving or transfer certificate as age proof, Aadhaar, passport photographs, a recent medical fitness certificate and a parental consent letter for minors. Carry copies and keep originals with you.",
      },
      {
        q: "Should I bowl flat out in the trial?",
        a: "Bowl at your repeatable maximum with a full run-up rather than straining for extra pace. Selectors assess action, control and how you hold up across a spell, not one fast delivery.",
      },
    ],
  },

  "football-combine-fitness-test": {
    intro: [
      "Football trials in India increasingly open with a fitness block before anyone sees you play. Fail it and your ball work never gets assessed. The tests are standard and, crucially, trainable in six to eight weeks.",
      "Here is what is usually tested, how each is scored, and how to prepare for the block without arriving flat for the small-sided games that follow.",
    ],
    sections: [
      {
        heading: "The tests you will most likely face",
        blocks: [
          {
            type: "table",
            head: ["Test", "What it measures", "How it is run"],
            rows: [
              [
                "Yo-Yo intermittent recovery",
                "Repeated-sprint endurance",
                "20m shuttles to a beep with a 10-second walk recovery",
              ],
              ["20m or 40m sprint", "Acceleration and speed", "Timed, standing start, best of two"],
              [
                "Countermovement or vertical jump",
                "Lower-body power",
                "Reach mark against a wall or a jump mat",
              ],
              ["Agility / T-test", "Change of direction", "Cone course, timed"],
              ["Core hold", "Trunk endurance", "Plank or side-plank held to failure"],
            ],
          },
          {
            type: "p",
            text: "Standards differ by age group and by the level of the club, and published elite figures are a poor target for a 15-year-old. Ask the organiser what the cut-offs are for your age band, and track your own numbers against your previous test rather than against a professional's.",
          },
        ],
      },
      {
        heading: "An eight-week build",
        blocks: [
          {
            type: "steps",
            items: [
              "Weeks 1–2: aerobic base. Three runs of 25–35 minutes at a conversational pace plus two mobility sessions.",
              "Weeks 3–4: add intervals. Twice a week, 10 × 30 seconds hard with 30 seconds easy, on grass.",
              "Weeks 5–6: shuttle specificity. Practise the 20m shuttle pattern with the beep audio twice a week so the turn technique is automatic.",
              "Week 7: sprint and jump work — short maximal efforts with full recovery, plus two strength sessions.",
              "Week 8: taper. Halve the volume, keep two short sharp sessions, sleep long.",
            ],
          },
          {
            type: "note",
            text: "The turn is where most players lose shuttle levels. Plant with a low centre of gravity, touch the line, and push off hard rather than rounding the turn.",
          },
        ],
      },
      {
        heading: "Test-day execution",
        blocks: [
          {
            type: "list",
            items: [
              "Warm up for a full 15 minutes: jog, dynamic mobility, three build-up sprints.",
              "In the shuttle test, run the early levels economically — do not sprint ahead of the beep.",
              "For the sprint, start still and low; a rocking start loses more time than it gains.",
              "Between tests, keep moving lightly and sip water rather than sitting down.",
              "Eat a normal carbohydrate meal three hours before, and nothing unfamiliar on the day.",
            ],
          },
        ],
      },
      {
        heading: "Do not spend everything on the fitness block",
        blocks: [
          {
            type: "p",
            text: "The games are usually where the squad is actually chosen. Compete hard in the tests, but remember that coaches are watching whether you can still make good decisions when tired. Recover deliberately between the block and the games: fluids, a little salt, a banana, and stay warm.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What fitness tests are used at Indian football trials?",
        a: "Most combine a Yo-Yo or beep shuttle test for repeated-sprint endurance with a timed 20m or 40m sprint, a vertical jump, an agility cone course and a core hold. Exact tests and cut-offs vary by club and age group, so ask the organiser in advance.",
      },
      {
        q: "How long does it take to improve shuttle-test results?",
        a: "Six to eight weeks of consistent aerobic work plus twice-weekly intervals produces a clear improvement for most youth players, provided sleep and recovery are adequate.",
      },
      {
        q: "Should I do gym work in the final week?",
        a: "No heavy lifting. Keep light strength holds and mobility, and let fatigue clear so you are sharp for both the tests and the games.",
      },
    ],
  },

  "sports-cv-template-india": {
    intro: [
      "A sports CV is not a job résumé. A coach spends well under a minute on it, wants three facts and a video link, and discards anything decorative. One page, plain layout, no photographs of trophies.",
      "This is the structure Indian selectors and academy coaches respond to, in order, with the wording to use.",
    ],
    sections: [
      {
        heading: "The one-page structure",
        blocks: [
          {
            type: "steps",
            items: [
              "Header: name, sport, primary position or event, age with date of birth, city and state, phone and email.",
              "Physical and playing profile: height, weight, dominant hand or foot, playing role in one line.",
              "Best three results: event name, level (district, state, national), year, and your placing or key statistic.",
              "Current training: club or academy, coach's name, sessions per week.",
              "Video: one link to a 60–90 second clip, plus one full-match or full-event link if you have it.",
              "References: coach name, role and contact, with their permission.",
              "Documents held: age proof, medical certificate, association registration number if any.",
            ],
          },
        ],
      },
      {
        heading: "Writing results so they are believable",
        blocks: [
          {
            type: "table",
            head: ["Weak", "Strong"],
            rows: [
              [
                "Good performance in state tournament",
                "State U-17 championship 2025 — quarter-finalist, 3 wins from 4",
              ],
              ["Fast bowler with pace", "Fast-medium; 6 overs, 2/18 in district league final 2025"],
              ["Very fit athlete", "30m sprint 4.28s, standing broad jump 2.35m (tested Jul 2026)"],
              [
                "Attended many camps",
                "SAI district camp, Mar 2026 — 10 days, selected from district trial",
              ],
            ],
          },
          {
            type: "p",
            text: "Every claim should carry a level, a date and a number. Anything unverifiable weakens the whole page, so leave it out rather than padding.",
          },
        ],
      },
      {
        heading: "The video that goes with it",
        blocks: [
          {
            type: "list",
            items: [
              "60 to 90 seconds, best work first, no music and no slow-motion edits.",
              "Wide, still camera at chest height so the coach can see your positioning.",
              "Include one clip of an unedited passage of play — coaches distrust highlight reels alone.",
              "Host it on a link that opens without a login, and check the link on a phone before sending.",
            ],
          },
        ],
      },
      {
        heading: "Sending it without contacts",
        blocks: [
          {
            type: "p",
            text: "Send it to academies that publish an intake process, to your district association, and to coaches whose teams you have played against. Keep the email to four lines: who you are, your sport and level, your single best result, and the video link. Attach the CV as a PDF named with your own name, sport and age group. Follow up once after ten days, then move on to the next name on your list.",
          },
          {
            type: "note",
            text: "Never pay anyone to 'forward your CV to selectors'. Academies with a genuine intake process publish it, and associations accept entries through clubs and schools.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How long should a sports CV be?",
        a: "One page. Coaches scan for your level, your three best results and a video link; a second page reduces the chance any of it is read.",
      },
      {
        q: "What if I have no big results yet?",
        a: "Lead with tested physical numbers, your training consistency and a clean video of unedited play, and list the competitions you have entered even if you did not place. Honest and specific beats inflated.",
      },
      {
        q: "Should I include photographs?",
        a: "One plain headshot at most. Action photographs and trophy pictures take space that a result line or video link would use better.",
      },
    ],
  },

  "pre-trial-meal-plan": {
    intro: [
      "Eating for a trial is mostly about avoiding mistakes. There is no meal that will make you faster tomorrow, but there are several that will make you slower, cramp you, or send you looking for a toilet at the wrong moment.",
      "This is a simple 24-hour plan built around normal Indian home food, with nothing exotic and nothing that needs buying from a supplement shop.",
    ],
    sections: [
      {
        heading: "The 24 hours before",
        blocks: [
          {
            type: "table",
            head: ["When", "Eat", "Why"],
            rows: [
              [
                "Lunch, day before",
                "Rice or roti, dal, vegetables, curd, a little paneer/egg/chicken",
                "Tops up carbohydrate stores with familiar food",
              ],
              [
                "Evening, day before",
                "Fruit and a handful of nuts, plenty of water",
                "Steady energy without a heavy stomach",
              ],
              [
                "Dinner, day before",
                "Carbohydrate-led, light on oil and chilli, modest protein",
                "Digestible; protects sleep",
              ],
              [
                "Before bed",
                "A glass of water or milk if you normally drink it",
                "Hydration without waking up thirsty",
              ],
            ],
          },
          {
            type: "p",
            text: "Spread water across the whole day rather than drinking a lot in the evening. Urine that is pale straw-coloured is the simplest hydration check there is.",
          },
        ],
      },
      {
        heading: "Trial morning",
        blocks: [
          {
            type: "steps",
            items: [
              "Three hours before: a proper carbohydrate meal you eat regularly — poha, upma, idli, paratha with curd, or bread and banana.",
              "Two hours before: 400–500 ml of water, sipped.",
              "45–60 minutes before: a banana or a small snack if you are hungry; stop solid food here.",
              "During: water every 15–20 minutes; add an electrolyte sachet or a pinch of salt and lemon if it is hot or the day is long.",
              "Immediately after: carbohydrate plus protein — rice and dal, a roll, or milk and a banana within about an hour.",
            ],
          },
        ],
      },
      {
        heading: "What to avoid",
        blocks: [
          {
            type: "list",
            items: [
              "Anything you have never eaten before, including a new supplement, gel or energy drink.",
              "Heavy fried food and very spicy food the night before.",
              "Large amounts of caffeine, and any caffeine after mid-afternoon the day before.",
              "Skipping breakfast to feel light — it reliably costs you in the last third of the session.",
              "Fasting on trial day for any reason other than a medical instruction.",
            ],
          },
          {
            type: "note",
            text: "This is general information, not individual dietary advice. If you have a medical condition, are managing weight for a weight-category sport, or take medication, speak to a doctor or a registered sports dietitian.",
          },
        ],
      },
      {
        heading: "Hot-weather trials",
        blocks: [
          {
            type: "p",
            text: "Outdoor trials in Indian summers are as much a heat test as a skill test. Start hydrated rather than trying to catch up mid-session, take fluid at every available break, use shade between turns, and add salt to your food the day before if you are a heavy, salty sweater. Cramping late in a session is usually a fluid and sodium problem, not a fitness problem.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What should I eat on the morning of a trial?",
        a: "A familiar carbohydrate-led meal about three hours before — poha, upma, idli, paratha with curd, or bread with banana — then only water and perhaps a banana in the final hour.",
      },
      {
        q: "Do I need an energy drink?",
        a: "For most sessions under 90 minutes, water is enough. In heat or for long days, an electrolyte sachet or salt and lemon in water is useful. Never try a new product on trial day.",
      },
      {
        q: "How do I avoid cramping in a hot trial?",
        a: "Arrive hydrated, drink at every break, include salt in your meals the day before, and do not skip breakfast. Persistent cramping despite this should be discussed with a doctor.",
      },
    ],
  },

  "injury-prevention-15-min-warmup": {
    intro: [
      "Structured warm-up programmes are among the best-evidenced injury-prevention tools in youth sport — the FIFA 11+ family of programmes has been studied across many teams and consistently reduces soft-tissue and knee injuries when it is done properly, at least twice a week.",
      "Here is a 15-minute version you can run on any ground with no equipment, and the details that determine whether it works.",
    ],
    sections: [
      {
        heading: "Part 1 — Running, 6 minutes",
        blocks: [
          {
            type: "list",
            items: [
              "Straight-ahead jog, two lengths, easy.",
              "Hip-out and hip-in walks with controlled circles at the hip.",
              "Side shuffles facing a partner, both directions.",
              "Forward and backward skips.",
              "Two build-up runs at around 70 per cent, decelerating under control.",
            ],
          },
          {
            type: "p",
            text: "The purpose is temperature and range of motion, not fatigue. You should be able to talk throughout.",
          },
        ],
      },
      {
        heading: "Part 2 — Strength, balance and control, 5 minutes",
        blocks: [
          {
            type: "steps",
            items: [
              "Plank: 3 × 20–30 seconds, hips level, ribs down.",
              "Side plank: 3 × 20 seconds each side.",
              "Nordic hamstring curl or a partner-assisted eccentric hamstring lower: 2 × 5 slow repetitions.",
              "Single-leg balance: 30 seconds per leg, then repeat while passing a ball with a partner.",
              "Squats and lateral hops: 15 controlled squats, then 15 hops per leg landing softly with the knee tracking over the toes.",
            ],
          },
          {
            type: "note",
            text: "Landing mechanics are the point of the hops. Soft, quiet landings with the knee over the toe — not collapsing inwards — is the movement most closely linked to fewer knee injuries.",
          },
        ],
      },
      {
        heading: "Part 3 — Sport-specific, 4 minutes",
        blocks: [
          {
            type: "list",
            items: [
              "Three to four progressive sprints, finishing at close to full speed.",
              "Two or three cutting and change-of-direction movements at your own pace, then faster.",
              "Sport-specific skill at low intensity: passes, throws, shadow batting, footwork drills, service action.",
              "Finish within two or three minutes of the session starting so you do not cool down again.",
            ],
          },
        ],
      },
      {
        heading: "Making it actually work",
        blocks: [
          {
            type: "p",
            text: "The evidence is clear that the benefit depends on doing it consistently and with good technique, not on doing it occasionally with sloppy form. Run it at the start of every session, at least twice a week, for a full season. Coaches should watch the strength and landing section rather than the running section, because that is where technique slips. If a movement causes pain rather than effort, stop and get it assessed.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How often should the warm-up be done to reduce injuries?",
        a: "At least twice a week through the season, ideally before every session. The research on structured warm-up programmes shows the benefit comes from consistency and good technique rather than occasional use.",
      },
      {
        q: "Is this suitable for under-14 athletes?",
        a: "Yes, with technique-first coaching and reduced hold times. Keep the emphasis on soft landings, balance and control rather than volume.",
      },
      {
        q: "Can it replace strength training?",
        a: "No. It reduces injury risk and prepares you to train, but developing strength still needs a separate, progressive programme supervised by a qualified coach.",
      },
    ],
  },

  "parent-guide-trial-day": {
    intro: [
      "Parents change trial outcomes more than they realise — not through anything they say to a selector, but through the atmosphere the athlete travels in. The job on trial day is logistics and calm, in that order.",
      "This is what to do, what to carry, and what to leave unsaid.",
    ],
    sections: [
      {
        heading: "The week before: your responsibilities",
        blocks: [
          {
            type: "list",
            items: [
              "Confirm reporting time, venue, age band and the exact document list in writing with the organiser.",
              "Assemble copies of the birth certificate, school certificate, Aadhaar, photographs, medical certificate and a signed consent letter.",
              "Plan travel so you arrive 45–60 minutes early, including a margin for traffic.",
              "Pack food and water your child already eats. Trial-day is not the time for experiments.",
              "Run the trust and safety checks if this is an organiser you do not know.",
            ],
          },
        ],
      },
      {
        heading: "On the day: what to say and not say",
        blocks: [
          {
            type: "table",
            head: ["Say", "Avoid"],
            rows: [
              ['"Warm up properly and enjoy it."', '"This is your one chance."'],
              ['"I\'ll be here whatever happens."', '"Do you know how much this cost us?"'],
              ['"Do the basics well."', "Technical instructions from the sideline"],
              ["Nothing at all, during play", "Arguing with officials or coaches"],
            ],
          },
          {
            type: "p",
            text: "Let your child report to the officials themselves. Coaches notice which athletes can speak for themselves, and a parent who takes over the interaction costs their child that impression.",
          },
        ],
      },
      {
        heading: "Where to stand, and how to behave",
        blocks: [
          {
            type: "steps",
            items: [
              "Find the parents' area and stay in it; do not stand at the boundary or courtside coaching.",
              "Keep your phone for photographs, not for filming other children — ask before filming anyone else's child.",
              "Ask questions of officials at breaks, politely, and only about logistics.",
              "If the day runs long, make sure your child eats and drinks between rounds rather than waiting.",
              "Note the names of officials present and photograph the notice board or schedule.",
            ],
          },
        ],
      },
      {
        heading: "The drive home",
        blocks: [
          {
            type: "p",
            text: "Ask one question, not ten: what was the best thing you did today? Debriefing in detail is a job for two days later, when the emotion has drained out of it. If the day went badly, treat it as one data point in a long process — the athletes who progress are usually the ones who were allowed to fail without it becoming a family crisis. If it went well, keep the celebration proportionate; the next rung of the ladder arrives quickly.",
          },
          {
            type: "note",
            text: "Never pay an individual for a promised place, and never let your child attend an assessment in a private residence or hotel room. Assessments happen on grounds and courts, in daylight, with other athletes present.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Should parents talk to selectors at a trial?",
        a: "Keep it to logistics and let your child do the introductions. Approaching selectors about your child's ability rarely helps and often creates a poor impression.",
      },
      {
        q: "How early should we arrive?",
        a: "Forty-five to sixty minutes before reporting time. That gives room for registration queues, document checks and a full warm-up without rushing.",
      },
      {
        q: "What should we do if the trial looks disorganised or suspicious?",
        a: "Do not pay anything further, do not hand over original documents, and leave if you are uncomfortable. Report it to the association whose name is being used and to us so the listing can be removed.",
      },
    ],
  },

  "selectors-checklist": {
    intro: [
      "Athletes prepare for the wrong things because nobody tells them how a trial is actually scored. Selection sheets vary between sports and bodies, but the categories are remarkably consistent: technical, physical, tactical and psychological, with an implicit fifth column for coachability.",
      "Here is what sits in each category, and how to make yourself easy to score well.",
    ],
    sections: [
      {
        heading: "The four categories",
        blocks: [
          {
            type: "table",
            head: ["Category", "What is assessed", "How to show it"],
            rows: [
              [
                "Technical",
                "Core skill executed under pressure and repeatedly",
                "Do the basics cleanly and often rather than attempting the spectacular",
              ],
              [
                "Physical",
                "Speed, power, endurance, movement quality",
                "Warm up fully; compete in every drill, including the boring ones",
              ],
              [
                "Tactical",
                "Decisions, positioning, reading the game",
                "Talk, scan, take a simple correct option over a risky one",
              ],
              [
                "Psychological",
                "Response to failure, focus, body language",
                "Reset visibly after a mistake; keep working when unnoticed",
              ],
            ],
          },
          {
            type: "p",
            text: "Weightings differ. In closed-skill individual sports, physical and technical scores dominate. In team sports, tactical and psychological columns often decide between players whose technical level is similar — which is where most trials are actually settled.",
          },
        ],
      },
      {
        heading: "The unwritten column: coachability",
        blocks: [
          {
            type: "list",
            items: [
              "Listen to an instruction, then visibly change what you do on the next repetition.",
              "Ask one clarifying question, not five.",
              "Encourage other athletes; selectors are choosing squad members, not only performers.",
              "Volunteer for the demonstration, the extra set, the unglamorous position.",
              "Never argue about a decision or blame conditions out loud.",
            ],
          },
        ],
      },
      {
        heading: "The first ten minutes and the last ten",
        blocks: [
          {
            type: "p",
            text: "Two windows carry disproportionate weight. In the first ten minutes selectors form a shortlist of who to watch, largely from warm-up intensity, movement quality and how you carry yourself. In the last ten, when everyone is tired, they check who is still competing. Deliberately raising your energy in both windows is the cheapest score improvement available.",
          },
          {
            type: "steps",
            items: [
              "Arrive warmed up so your first drill is your normal standard, not a rehearsal.",
              "Make your name and role clear to the coach at the start.",
              "Mid-session, keep errors low and effort visible; do not gamble for a highlight.",
              "In the final block, be the one still sprinting back and communicating.",
              "At the end, thank the coach and ask what to work on before the next trial.",
            ],
          },
        ],
      },
      {
        heading: "What gets athletes cut fast",
        blocks: [
          {
            type: "list",
            items: [
              "Missing or incorrect documents at registration.",
              "Turning up cold and pulling up injured in the first drill.",
              "Sulking or going quiet after a mistake.",
              "Ignoring an instruction, or arguing with it.",
              "Attempting risky, low-percentage skills to impress instead of executing basics.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What do selectors look for first at a trial?",
        a: "Movement quality, warm-up intensity and body language in the first ten minutes, which decides who they watch closely for the rest of the session. Clean execution of basics matters far more than spectacular attempts.",
      },
      {
        q: "Does attitude really affect selection?",
        a: "Yes. Most assessment sheets include a psychological or attitude column, and coaches choose squad members they can work with when two players are technically similar.",
      },
      {
        q: "Should I ask for feedback after a trial?",
        a: "Ask one specific question about what to improve before the next trial. It is usually answered, and it gives you something concrete to train.",
      },
    ],
  },

  "sleep-and-performance": {
    intro: [
      "Sleep is the highest-return, lowest-cost training input available to a young athlete, and it is the first thing sacrificed to coaching schedules, school and phones. Adolescents generally need more sleep than adults, and habitually short sleep is associated with more injuries, slower skill learning and worse mood.",
      "This is a practical plan for protecting sleep inside a real Indian schedule of early sessions, school, tuition and late dinners.",
    ],
    sections: [
      {
        heading: "How much, and why it matters",
        blocks: [
          {
            type: "p",
            text: "Sleep guidance for teenagers sits around eight to ten hours a night, and athletes training hard sit at the upper end of that. Skill consolidation, growth hormone release and tissue repair all happen during sleep, which is why a technique session followed by five hours in bed produces less learning than the same session followed by nine.",
          },
          {
            type: "list",
            items: [
              "Short sleep is linked with higher injury rates in youth athletes.",
              "Reaction time and decision-making degrade before you subjectively feel tired.",
              "Chronic sleep debt cannot be cleared with one long weekend lie-in, though a nap helps.",
              "Illness frequency rises with sustained short sleep — missed training you never planned for.",
            ],
          },
        ],
      },
      {
        heading: "A workable schedule",
        blocks: [
          {
            type: "table",
            head: ["Time", "Action"],
            rows: [
              ["After 2 pm", "No coffee, strong tea, cola or energy drinks"],
              ["Dinner", "Eat at least two hours before bed; keep it moderate and familiar"],
              ["90 minutes before bed", "Finish homework and heavy screen use; dim the lights"],
              ["60 minutes before bed", "Phone out of the room, or on greyscale and face down"],
              ["Same time nightly", "Fixed bedtime and wake time, including weekends"],
              ["Post-lunch", "A 20–30 minute nap if the night was short — no longer"],
            ],
          },
        ],
      },
      {
        heading: "Fitting it around early sessions",
        blocks: [
          {
            type: "steps",
            items: [
              "Work backwards from your alarm: a 5 am start means lights out around 9 pm, not 11.",
              "Shift bedtime earlier by 15 minutes a week rather than in one jump.",
              "Move tuition or homework blocks earlier in the evening where possible.",
              "Keep the room as dark, quiet and cool as your home allows; a fan and an eye mask cost very little.",
              "On heavy training days, protect sleep before adding an extra session.",
            ],
          },
          {
            type: "note",
            text: "If you sleep long hours and still wake unrefreshed, or you snore heavily, mention it to a doctor. Persistent fatigue is a medical question, not a discipline question.",
          },
        ],
      },
      {
        heading: "Sleep before competition",
        blocks: [
          {
            type: "p",
            text: "The night that matters most is two nights before, because pre-event nerves often shorten the last one. Bank sleep in the week leading in, keep your normal routine at an away venue, carry your own pillow if travel disrupts you, and do not panic if the final night is broken — one poor night after a good week has a modest effect. Lying calmly with your eyes closed still helps more than scrolling.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How many hours should a teenage athlete sleep?",
        a: "General guidance for teenagers is eight to ten hours a night, and athletes training hard should aim at the upper end. Consistent timing matters as much as total hours.",
      },
      {
        q: "Do naps help?",
        a: "A 20–30 minute early-afternoon nap is useful after a short night or a heavy morning session. Longer naps late in the day make it harder to fall asleep at night.",
      },
      {
        q: "Can I make up for lost sleep at the weekend?",
        a: "Partly, but not fully. A large weekend catch-up also shifts your body clock, which makes Monday's early session harder. Aim for consistency instead.",
      },
    ],
  },
};

export function hasGuideBody(slug: string): boolean {
  return Boolean(GUIDE_BODIES[slug]);
}

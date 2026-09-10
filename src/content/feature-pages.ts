import type { ContentPage } from "./types";

const UPDATED = "2026-09-01";

export const startFromZeroPage: ContentPage = {
  path: "/start-from-zero",
  eyebrow: "Beginner roadmap",
  title: "Start from zero: how to begin a sport in India with no background",
  description:
    "A practical first-90-days plan for Indian beginners: picking a sport, finding coaching you can afford, the paperwork that matters, and how school and district competition actually works.",
  updated: UPDATED,
  readMins: 9,
  intro: [
    "Most players who never make it are not short of talent — they are short of information. They do not know which body runs their sport, which competition is the first rung on the ladder, or what a fair coaching fee looks like in their city. This page is the missing instruction sheet.",
    "It assumes nothing: no academy, no equipment, no contacts. Work through it in order and you will have a sport, a coach, a competition entered and a record of your results inside three months.",
  ],
  sections: [
    {
      heading: "Step 1 — Choose a sport you can actually train for weekly",
      blocks: [
        {
          type: "p",
          text: "Pick for access first and ambition second. The best sport for you is the one with a coached session within a 45-minute journey of home, because consistency beats enthusiasm over a season. A player who trains four times a week at a modest municipal ground will progress faster than one who trains twice a month at a famous academy across the city.",
        },
        {
          type: "list",
          items: [
            "Check what your school, district association and nearest municipal stadium already run — these are usually the cheapest coached sessions available.",
            "Count the cost per month honestly: coaching fee, travel, kit and competition entries. If the total does not survive six months, choose a cheaper sport now and switch later.",
            "Individual sports (athletics, badminton, boxing, wrestling, shooting, swimming, table tennis) give you a measurable result quickly. Team sports depend on selection, which takes longer to influence.",
            "If you start after 14, favour sports where late entrants regularly progress — throws, rowing, weightlifting, wrestling, kabaddi, volleyball, goalkeeping roles.",
          ],
        },
      ],
    },
    {
      heading: "Step 2 — Understand the ladder before you climb it",
      blocks: [
        {
          type: "p",
          text: "Almost every Indian sport follows the same shape: school or club competition, then district, then state, then national age-group events, then senior national selection. Each rung is run by a different body, and you can only enter the next rung through the one below it. Knowing the sequence stops you chasing trials you are not yet eligible for.",
        },
        {
          type: "table",
          head: ["Rung", "Who runs it", "What you need to enter"],
          rows: [
            ["School / club", "School, SGFI affiliate or local club", "Enrolment, age proof"],
            ["District", "District sports association", "Club or school nomination, age proof"],
            ["State", "State association for your sport", "District result or district nomination"],
            ["National age-group", "National federation for your sport", "State selection or state entry"],
            ["Senior national camp", "Federation with SAI support", "National-level result or camp invite"],
          ],
        },
        {
          type: "note",
          text: "Do this once and it pays for years: find the official website or office of your state association, note the secretary's contact and the month their age-group calendar is published. That single phone number is worth more than any paid coaching brochure.",
        },
      ],
    },
    {
      heading: "Step 3 — Get the paperwork right early",
      blocks: [
        {
          type: "p",
          text: "Age-group sport in India is document-driven, and the most common reason a young athlete is turned away on the morning of a trial is paperwork, not performance. Assemble a folder now and keep scans on your phone.",
        },
        {
          type: "steps",
          items: [
            "Birth certificate and school leaving or transfer certificate — the primary age proofs accepted by most associations.",
            "Aadhaar and a recent passport photograph, digital and printed.",
            "A basic medical fitness certificate from a registered doctor; many trials require one dated within the last few months.",
            "Parental consent letter if you are a minor, signed and dated.",
            "A bank account in the athlete's own name — stipends and prize money are almost never paid to a third party.",
          ],
        },
      ],
    },
    {
      heading: "Step 4 — Build a training week you can repeat",
      blocks: [
        {
          type: "p",
          text: "Beginners overtrain for three weeks and then stop. Aim instead for a week you could still run in month six. A workable first block for a 13–18 year old is three to four skill sessions, two short strength or mobility sessions, one competitive game or time trial, and one genuine rest day.",
        },
        {
          type: "list",
          items: [
            "Warm up for 12–15 minutes before every session — jog, dynamic mobility, then sport-specific movement. This is the cheapest injury insurance available.",
            "Protect sleep before you add training volume. Consistent long sleep does more for a teenage athlete than an extra session.",
            "Keep one number per week that tells you whether you are improving: a sprint time, a rally count, a lift, a match statistic.",
            "Increase load gradually rather than in jumps, and back off in exam weeks instead of quitting entirely.",
          ],
        },
      ],
    },
    {
      heading: "Step 5 — Compete early, and keep the evidence",
      blocks: [
        {
          type: "p",
          text: "Selectors trust results and video, in that order. Enter the smallest competition you are eligible for within your first two months, even if you expect to lose, because an entry creates a record and a record creates eligibility. After each event, save the result sheet photograph, the certificate and one clip of your performance.",
        },
        {
          type: "list",
          items: [
            "Photograph every result sheet and certificate the day you receive it — associations rarely reissue them.",
            "Film from a wide, still angle at chest height. Selectors need context, not a zoomed-in blur.",
            "Keep clips short: under 90 seconds, best work first.",
            "Log date, event, level, opponent standard and outcome in one sheet. This becomes your sports CV without extra work.",
          ],
        },
      ],
    },
    {
      heading: "How KhelGrid fits into this",
      blocks: [
        {
          type: "p",
          text: "KhelGrid exists to remove the search cost from the steps above. Trials, camps and academy openings are collected in one searchable list by sport and city; venues and coaching can be filtered by price; and guides explain each rung of the ladder in plain language. We do not select athletes, and we are not affiliated with any federation — we publish the information you would otherwise spend weeks chasing.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is 16 too late to start a sport seriously in India?",
      a: "No, but sport choice matters more at 16 than at 10. Late starters progress most often in throws, rowing, weightlifting, wrestling, kabaddi, volleyball and specialist roles like goalkeeping, where physical development and technique can be built quickly relative to peers.",
    },
    {
      q: "Do I need an expensive academy to reach state level?",
      a: "Not usually. District and state ladders are open to school and club entrants in almost every sport. A qualified coach, regular competition and correct paperwork matter more than the fee you pay.",
    },
    {
      q: "What is the very first competition I should enter?",
      a: "Whatever your school or district association runs next in your age band. It creates the record that makes you eligible for the next rung, and it teaches you competition routine while the stakes are low.",
    },
    {
      q: "How much should beginner coaching cost?",
      a: "Fees vary widely by city and sport, so compare at least three options near you and ask each for the coach's certification, the group size and the number of sessions per month before comparing prices. Group coaching at a municipal facility is normally the lowest-cost coached option.",
    },
  ],
  cta: { to: "/search", label: "Find a trial near you" },
};

export const verifyPage: ContentPage = {
  path: "/verify",
  eyebrow: "Trust & safety",
  title: "How to check whether a sports trial or academy is genuine",
  description:
    "Fake selection camps and pay-to-play trials are common in Indian sport. Use these checks on any trial, academy or agent before you pay, travel or share documents.",
  updated: UPDATED,
  readMins: 8,
  intro: [
    "Every season, families spend money and travel across states for trials that were never connected to a real selection process. The pattern is consistent enough to be checkable in about twenty minutes, which is what this page is for.",
    "Nothing below requires contacts or insider knowledge. It is the same sequence our team runs before a listing goes live on KhelGrid.",
  ],
  sections: [
    {
      heading: "The five checks that catch most fake trials",
      blocks: [
        {
          type: "steps",
          items: [
            "Trace the authority. A genuine selection trial is announced or acknowledged by a district association, state association or national federation. Find that announcement on the body's own website or notice board — not only in the organiser's poster or WhatsApp forward.",
            "Call the association directly. Ask one question: 'Is this trial on your calendar, and who is the appointed selector?' A body that has never heard of the event is your answer.",
            "Question every payment. Registration fees exist, but selection is never sold. Any request for money in exchange for selection, a franchise contract, a 'sponsorship slot' or a guaranteed place is disqualifying.",
            "Check the venue and the date independently. Phone the stadium or ground and confirm the booking. Fake events often list well-known venues that have no such booking.",
            "Verify the people. Coaches and selectors have a traceable record: certification, a club, past teams, published results. If nothing about a person exists outside their own message, treat the event as unverified.",
          ],
        },
      ],
    },
    {
      heading: "Warning signs, ranked",
      blocks: [
        {
          type: "table",
          head: ["Signal", "What it usually means"],
          rows: [
            ["Guaranteed selection or a promised contract", "Not a selection process. Walk away."],
            ["Payment to a personal account or UPI ID", "No institutional accountability."],
            ["Pressure to decide within hours", "Designed to prevent verification."],
            ["No written schedule, selector name or age bands", "Nothing to be held to."],
            ["Asks for original documents to be handed over", "Never surrender originals — carry copies."],
            ["Contact only through a single phone number", "No organisation behind it."],
          ],
        },
        {
          type: "note",
          text: "Legitimate organisers are comfortable with questions. If asking who appointed the selector causes irritation, you have learned what you needed to know.",
        },
      ],
    },
    {
      heading: "Protecting the athlete on the day",
      blocks: [
        {
          type: "list",
          items: [
            "Carry photocopies and digital scans; keep originals at home.",
            "A minor should be accompanied by a parent or guardian, and should never travel to a private residence or hotel room for an assessment.",
            "Assessments happen on a ground, court or in a gym, in daylight, with other athletes present.",
            "Note the names of officials present and photograph the schedule or notice board.",
            "If anything about the setting feels wrong, leave. No trial is worth the risk.",
          ],
        },
      ],
    },
    {
      heading: "Checking an academy before you enrol",
      blocks: [
        {
          type: "p",
          text: "Academies are a longer commitment than a trial, so the checks are heavier. Ask for the coach-to-athlete ratio, the certification of the coaches who actually take sessions, the competition calendar the academy enters, and the names of athletes it has progressed to district or state level in the last two seasons. Ask to observe one session before paying, and read the refund and withdrawal clauses in the fee agreement.",
        },
        {
          type: "list",
          items: [
            "Written fee structure covering coaching, boarding, kit and travel separately.",
            "Named, certified coaches — not just a head-coach photograph.",
            "A published competition calendar for your age group.",
            "A safeguarding policy and a named person responsible for minors.",
            "A trial or observation session before enrolment.",
          ],
        },
      ],
    },
    {
      heading: "What verification on KhelGrid means",
      blocks: [
        {
          type: "p",
          text: "When a listing on KhelGrid is marked verified, it means we have confirmed the organiser's identity and contact details, matched the event against the relevant association's calendar or an official confirmation, and checked that no payment is being asked in exchange for selection. It is a check on the listing, not a prediction of your outcome — verification never implies that you will be selected, and unverified listings are labelled as such so you can apply your own judgement.",
        },
        {
          type: "p",
          text: "If you find a listing that fails any of the checks on this page, report it to khelgrid@gmail.com with the listing link and we will review and remove it.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is it normal for a trial to charge a registration fee?",
      a: "A modest registration fee to cover ground, officials and logistics is common and acceptable. What is never acceptable is a payment linked to selection, a place in a squad, or a contract.",
    },
    {
      q: "How do I confirm that a selector is genuine?",
      a: "Ask who appointed them and check that name against the association that is running the competition. Genuine selectors are appointed in writing by a district, state or national body, and the body will confirm the appointment on request.",
    },
    {
      q: "What should I do if I have already paid a fake organiser?",
      a: "Keep every message, receipt and transaction reference, report it to your local police cyber cell and to the association whose name was used, and warn other players publicly. Report the listing to us as well so it can be removed and blocked.",
    },
    {
      q: "Does an unverified listing mean it is fake?",
      a: "No. It means we have not yet completed our checks. Run the five checks on this page yourself before you pay or travel.",
    },
  ],
  cta: { to: "/trials", label: "Browse verified trials" },
};

export const talentScannerPage: ContentPage = {
  path: "/talent-scanner",
  eyebrow: "Self-assessment",
  title: "Talent Scanner: measuring your own athletic baseline at home",
  description:
    "A self-testing protocol Indian athletes can run with a phone, a tape and a flat surface — plus how to record it so coaches and selectors can read your results.",
  updated: UPDATED,
  readMins: 8,
  intro: [
    "Selectors work from numbers and video. If you have never been tested, you have no idea which parts of your game to fix, and no evidence to show a coach who has never seen you play. The tests below are the standard field battery used in school and academy screening across India, and they need almost no equipment.",
    "Run them on the same surface, in the same shoes, at the same time of day, every six to eight weeks. The trend matters more than any single score.",
  ],
  sections: [
    {
      heading: "What to test, and how",
      blocks: [
        {
          type: "table",
          head: ["Test", "What it measures", "How to run it"],
          rows: [
            ["30m sprint", "Acceleration", "Flat surface, standing start, film from the side with a visible timer"],
            ["Standing broad jump", "Lower-body power", "Two-foot take-off and landing, measure to the nearest heel mark"],
            ["Vertical jump", "Explosive power", "Reach mark against a wall, then jump mark; record the difference"],
            ["Medicine ball or shot throw", "Upper-body power", "Same implement weight each time, seated or standing consistently"],
            ["Beep or shuttle run", "Endurance", "20m markers, standard audio, record the level reached"],
            ["Sit-and-reach", "Flexibility", "Fixed box or step, three attempts, record the best"],
          ],
        },
        {
          type: "note",
          text: "Do not compare your raw numbers with elite published values. Compare them with your own last round, and with the entry standards your state association publishes for your age group where those exist.",
        },
      ],
    },
    {
      heading: "How to film so the result is usable",
      blocks: [
        {
          type: "list",
          items: [
            "Phone on a tripod, bag or wall — never handheld.",
            "Wide angle, chest height, side-on for sprints and jumps.",
            "Include the measuring tape, cones or markers in frame so distances are visible.",
            "Say the date and the test aloud at the start of the clip.",
            "One clean attempt per clip; keep the raw file, do not crop or slow it down.",
          ],
        },
      ],
    },
    {
      heading: "Turning scores into a plan",
      blocks: [
        {
          type: "p",
          text: "A baseline is only useful if it changes your week. Read the battery as four blocks — speed, power, endurance, mobility — and give the weakest block one extra focused session for the next six weeks while holding the rest steady. Retest, then move the focus.",
        },
        {
          type: "steps",
          items: [
            "Identify your weakest block relative to your own previous round.",
            "Add one session per week targeting it, without removing sport-specific training.",
            "Keep every other variable the same so the retest means something.",
            "Retest after six to eight weeks and record the delta in your log.",
            "Attach the two best clips and the score table to your sports CV.",
          ],
        },
      ],
    },
    {
      heading: "Where the automated scanner is at",
      blocks: [
        {
          type: "p",
          text: "We are building an automated scoring tool that reads these clips and returns a consistency and technique summary. It is in development and not yet open to the public; until it ships, the protocol on this page is exactly what it will score, so nothing you record now is wasted. We will not publish a score that we cannot explain, and no automated score will ever be presented as a selection decision.",
        },
      ],
    },
    {
      heading: "Safety notes before you test",
      blocks: [
        {
          type: "list",
          items: [
            "Warm up fully — maximal tests on cold muscles are the most common cause of avoidable strains.",
            "Test on grass or a proper track surface, not on concrete or a wet floor.",
            "Under-13 athletes should skip maximal strength testing and stick to speed, jumps and mobility.",
            "Stop immediately if you feel a sharp pain, and do not retest through an injury.",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How often should I retest?",
      a: "Every six to eight weeks. Testing more often mostly measures day-to-day noise rather than genuine improvement.",
    },
    {
      q: "Can I run these tests alone?",
      a: "Sprint and endurance tests need a second person for timing and safety. Jumps, throws and flexibility can be done alone with a phone and a tape, provided you warm up properly.",
    },
    {
      q: "Do selectors accept self-recorded results?",
      a: "They use them for shortlisting, not as final proof. Well-filmed self-tests plus competition results are enough to get a look; the confirmed numbers are taken at the trial itself.",
    },
  ],
  cta: { to: "/guides", label: "Read the training guides" },
};

export const aiGuidePage: ContentPage = {
  path: "/ai-guide",
  eyebrow: "Ask KhelGrid",
  title: "AI Guide: answers to the questions Indian athletes actually ask",
  description:
    "How the KhelGrid AI Guide works, what it can and cannot answer, and the questions it is being trained on — from trial eligibility to fees, documents and pathways.",
  updated: UPDATED,
  readMins: 7,
  intro: [
    "Most sporting questions in India are answered in a WhatsApp group by someone who half-remembers last year's rules. The AI Guide is our attempt to replace that with sourced, checkable answers about pathways, eligibility, documents and costs.",
    "It is being built carefully and is not open to everyone yet. This page sets out how it will work and, more importantly, gives you the answers to the questions people ask us most often — so the page is useful today, not only after launch.",
  ],
  sections: [
    {
      heading: "What the AI Guide is designed to do",
      blocks: [
        {
          type: "list",
          items: [
            "Explain the pathway for a specific sport, age group and state in plain language.",
            "Tell you which documents a given type of trial usually requires.",
            "Summarise what a listing on KhelGrid actually says, including whether it is verified.",
            "Point to the guide, tool or association contact that answers the question properly.",
          ],
        },
      ],
    },
    {
      heading: "What it will not do",
      blocks: [
        {
          type: "list",
          items: [
            "Predict or promise selection. No model can, and anyone who claims otherwise is selling something.",
            "Give medical, injury or dosage advice. Injuries go to a doctor or a qualified physiotherapist.",
            "Replace your state association as the authority on rules and calendars.",
            "Invent a fact when it does not have one — an honest 'not known' is the intended answer.",
          ],
        },
        {
          type: "note",
          text: "Treat every answer as a starting point to verify, not a ruling. Where an answer touches eligibility or money, confirm it with the association or academy in writing.",
        },
      ],
    },
    {
      heading: "The five questions we are asked most",
      blocks: [
        {
          type: "p",
          text: "These are the recurring questions in our inbox, answered here directly.",
        },
        {
          type: "steps",
          items: [
            "'Which trial can I enter right now?' — Whatever your district or state association has open in your age band. National trials are almost always entered through a state result, not directly.",
            "'What documents do I need?' — Birth certificate, school certificate, Aadhaar, photographs, a recent medical fitness certificate and parental consent if you are a minor.",
            "'How do I get noticed without contacts?' — Compete at the lowest rung you are eligible for, record every result, and send a one-page sports CV with two short clips to coaches at academies that publish an intake process.",
            "'Is this camp genuine?' — Run the five checks on our trust and safety page before paying or travelling.",
            "'Do I need to pay for selection?' — No. Registration fees exist; paid selection does not.",
          ],
        },
      ],
    },
    {
      heading: "How answers are sourced",
      blocks: [
        {
          type: "p",
          text: "Answers are grounded in three things: the text of the listings published on KhelGrid, our written guides, and publicly available information from federations, state associations and government sports schemes. When a question depends on a rule that changes annually — age cut-offs, scheme eligibility, entry deadlines — the answer will point you to the body that publishes it rather than quoting a number that may already be stale.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is the AI Guide available now?",
      a: "Not yet publicly. It is in development. The answers, guides and tools on this site are available today and cover the same ground.",
    },
    {
      q: "Will it cost money?",
      a: "Basic questions will be free. If we later add heavier features such as long document review, those may sit inside a paid plan; nothing that affects your eligibility or safety will be paywalled.",
    },
    {
      q: "Can it review my sports CV?",
      a: "That is a planned feature. In the meantime, our sports CV guide lists exactly what Indian selectors look for on a one-page CV.",
    },
  ],
  cta: { to: "/guides", label: "Browse the guides" },
};

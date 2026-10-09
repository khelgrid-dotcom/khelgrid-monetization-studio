import type { ContentPage } from "./types";

const UPDATED = "2026-09-01";

export const aboutPage: ContentPage = {
  path: "/about",
  eyebrow: "About us",
  title: "About KhelGrid: who we are and how this site is built",
  description:
    "KhelGrid is an independent Indian sports discovery platform for trials, venues, coaching and guides. Here is who runs it, how listings are checked, and how we make money.",
  updated: UPDATED,
  readMins: 6,
  intro: [
    "KhelGrid is an independent platform that collects sporting opportunities in India — trials, camps, academy intakes, venues and coaching — into one place you can search, and explains the pathways around them in plain language.",
    "We are not a federation, a selection body or an agent. We publish information, we check what we can, and we say clearly when something is unverified.",
  ],
  sections: [
    {
      heading: "Why we built it",
      blocks: [
        {
          type: "p",
          text: "In most Indian sports, the opportunity exists but the information does not travel. A district trial is announced on a notice board and in a WhatsApp group, and a player twenty kilometres away never hears about it. Meanwhile, families spend money on camps that turn out to have no connection to any real selection process. Both problems are information problems, and both are fixable without changing anything about how the sport itself is run.",
        },
        {
          type: "p",
          text: "So KhelGrid does three unglamorous things: it aggregates listings so they can be searched by sport and city, it applies a documented verification check before marking a listing as verified, and it writes the guides nobody had bothered to write — how ladders work, what documents are required, what a fair coaching fee looks like, how to spot a scam.",
        },
      ],
    },
    {
      heading: "What is on the site",
      blocks: [
        {
          type: "table",
          head: ["Section", "What it gives you"],
          rows: [
            [
              "Search & trials",
              "Trials, camps and academy intakes filtered by sport, city and date",
            ],
            ["Book & play", "Venue booking and open games near you"],
            ["Train & coaches", "Coaching programmes and coach profiles with fees stated up front"],
            [
              "Guides",
              "Written explainers on trials, documents, nutrition, recovery and parenting an athlete",
            ],
            ["Tools", "Simple calculators and checklists for readiness, load and eligibility"],
            ["Trust & safety", "The checks to run before paying or travelling for any trial"],
          ],
        },
      ],
    },
    {
      heading: "How we check listings",
      blocks: [
        {
          type: "p",
          text: "Before a listing carries a verified label we confirm the organiser's identity and contact details, match the event against the relevant association's calendar or a written confirmation from the organiser, and check that no payment is being requested in exchange for selection. Listings that have not been through that process are shown as unverified rather than hidden, because an unchecked opportunity is still information — it just needs your own diligence.",
        },
        {
          type: "p",
          text: "Verification is a check on the listing, not a prediction about you. Nothing on KhelGrid guarantees selection, and we never take payment to influence a selection outcome.",
        },
      ],
    },
    {
      heading: "How KhelGrid makes money",
      blocks: [
        {
          type: "list",
          items: [
            "Optional paid plans for athletes who want extra profile and application features.",
            "Paid promotion for academies and organisers, always labelled as promoted and never able to change a verification result.",
            "Advertising, including Google AdSense, which is labelled and kept out of the way of the content.",
          ],
        },
        {
          type: "note",
          text: "Editorial independence rule we hold ourselves to: money can buy visibility, never a verified badge, a ranking in a guide, or the removal of a warning.",
        },
      ],
    },
    {
      heading: "Corrections and contact",
      blocks: [
        {
          type: "p",
          text: "We publish a lot of fast-moving detail — dates, fees, eligibility — and some of it will be wrong. If you find an error, or a listing that fails the checks on our trust and safety page, write to khelgrid@gmail.com with the link. We correct or remove listings on the same basis whether or not the organiser pays us.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is KhelGrid affiliated with any federation or with SAI?",
      a: "No. KhelGrid is independent and has no official affiliation with any sports federation, state association or government body. We publish publicly available and organiser-supplied information, and we point you to the relevant authority for rules and calendars.",
    },
    {
      q: "Does KhelGrid select athletes or run trials?",
      a: "No. Selection is done entirely by the organisers, academies and associations that run each trial. We list opportunities and explain the process.",
    },
    {
      q: "Can I get my academy or trial listed?",
      a: "Yes. Email khelgrid@gmail.com with the event or academy details, the organising body and a contact number. Listing is free; verification requires the checks described above.",
    },
    {
      q: "How do you handle my data?",
      a: "What we collect and why is set out in our privacy policy, including how advertising and consent work.",
    },
  ],
  cta: { to: "/contact", label: "Contact the team" },
};

export const communityPage: ContentPage = {
  path: "/community",
  eyebrow: "Community",
  title: "Finding training partners, clubs and honest advice in Indian sport",
  description:
    "How to build a sporting circle from nothing: finding practice partners, choosing a club, using local leagues, and getting useful feedback instead of flattery.",
  updated: UPDATED,
  readMins: 7,
  intro: [
    "Talent develops in company. Players who train alone plateau earlier, not because they work less, but because nobody corrects them and nothing forces them to compete. Building a circle is a skill, and it is learnable.",
    "This page covers how to find partners and clubs in an Indian city or town, what a good training group looks like, and how to get feedback that actually improves you.",
  ],
  sections: [
    {
      heading: "Where partners and groups actually exist",
      blocks: [
        {
          type: "list",
          items: [
            "Municipal and district stadiums: morning and evening slots are where regular players congregate, and the ground staff know who trains when.",
            "School and college teams, including alumni sides that keep playing after graduation.",
            "Registered clubs affiliated to your district association — the entry point to district competition in most sports.",
            "Local leagues and weekend tournaments, which are the fastest way to meet players one level above you.",
            "Open games and bookable slots on platforms like this one, useful when you have no existing contacts.",
          ],
        },
        {
          type: "p",
          text: "The most effective single move is to attend the same ground at the same time for three weeks. Regularity gets you invited into games in a way that messaging strangers never does.",
        },
      ],
    },
    {
      heading: "What a good training group looks like",
      blocks: [
        {
          type: "table",
          head: ["Green flag", "Red flag"],
          rows: [
            [
              "Someone slightly better than you attends regularly",
              "You are always the best player present",
            ],
            ["Sessions start on time and have a purpose", "Sessions are unstructured social meets"],
            ["Warm-ups happen before intensity", "Straight into full-intensity play"],
            ["Mistakes are corrected plainly", "Only praise, or only mockery"],
            [
              "Competition entries are shared and encouraged",
              "Nobody in the group ever enters events",
            ],
          ],
        },
      ],
    },
    {
      heading: "How to ask for feedback you can use",
      blocks: [
        {
          type: "steps",
          items: [
            "Ask about one specific thing, not 'how was I' — for example your front-foot balance, your first three steps, your recovery position.",
            "Bring a clip. People give far better feedback with video in front of them.",
            "Ask for the single change that would help most, then work on only that for two weeks.",
            "Report back with the retest or the new clip. Coaches invest in players who close the loop.",
          ],
        },
      ],
    },
    {
      heading: "Staying safe in sporting groups",
      blocks: [
        {
          type: "list",
          items: [
            "Meet at public grounds and courts, never at a private residence, and tell someone at home where you are.",
            "Minors should be accompanied by a parent or guardian for first meetings and any assessment.",
            "Never share original documents, and never pay an individual for a promised place in a squad or trial.",
            "Report harassment to the club or association in writing, and to the police where a crime may have occurred.",
          ],
        },
        {
          type: "note",
          text: "Our own community features — sport and city circles, a partner finder and moderated groups — are still being built. Until they launch, the routes above are what actually works, and our trust and safety page covers the checks to run on anyone who approaches you with an opportunity.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How do I find players at my level if I am new to a city?",
      a: "Start with the nearest municipal or district stadium at a fixed time slot, ask the ground staff which clubs use it, and enter the next open local tournament. Three weeks of regular attendance usually produces more contacts than months of online searching.",
    },
    {
      q: "Should I join a club or an academy first?",
      a: "A club affiliated to your district association is usually the cheaper and more direct route into competition. Academies add structured coaching and facilities, which matters once you are competing regularly and need technical work.",
    },
    {
      q: "Are KhelGrid community features live?",
      a: "Not yet. Circles, the partner finder and moderated groups are in development; everything else on this page is available to you today without any platform at all.",
    },
  ],
  cta: { to: "/play", label: "Find an open game" },
};

export const learningHubPage: ContentPage = {
  path: "/learning-hub",
  eyebrow: "Learning hub",
  title: "Learning hub: what to read first, by where you are right now",
  description:
    "A curated reading path through KhelGrid's guides and tools — for absolute beginners, competing athletes, parents and coaches in Indian sport.",
  updated: UPDATED,
  readMins: 6,
  intro: [
    "The library on this site is large enough to be confusing. This page is the map: four reading paths, each ordered so that the next step is always obvious.",
    "Pick the path that describes you today, read in order, and act after each piece rather than reading everything first.",
  ],
  sections: [
    {
      heading: "Path 1 — Absolute beginner",
      blocks: [
        {
          type: "steps",
          items: [
            "Read the beginner roadmap and choose a sport based on weekly access, not ambition.",
            "Assemble your document folder: age proof, school certificate, Aadhaar, photographs, medical certificate.",
            "Run the self-assessment battery once to get a baseline you can compare against later.",
            "Enter the smallest competition you are eligible for and save the result sheet.",
          ],
        },
      ],
    },
    {
      heading: "Path 2 — Already competing",
      blocks: [
        {
          type: "steps",
          items: [
            "Read the trial-preparation guides for your sport and build a seven-day taper.",
            "Write a one-page sports CV using the India-specific template, with your three best results at the top.",
            "Film two clips that meet the filming rules, so a coach who has never seen you can assess you in 90 seconds.",
            "Plan your competition sequence for the season instead of entering events at random.",
            "Read the recovery guides — sleep, warm-up and the 48 hours after a hard trial.",
          ],
        },
      ],
    },
    {
      heading: "Path 3 — Parent or guardian",
      blocks: [
        {
          type: "steps",
          items: [
            "Read the trust and safety checks before you pay for or travel to any camp.",
            "Read the parent's guide to trial day, then the guide on balancing academics and training load.",
            "Use the fee-negotiation guide before enrolling in an academy, and get every cost in writing.",
            "Learn which documents are needed so your child is never turned away at the gate.",
          ],
        },
      ],
    },
    {
      heading: "Path 4 — Coach or academy",
      blocks: [
        {
          type: "steps",
          items: [
            "Read what selectors score, so your sessions target what is actually assessed.",
            "Publish your intake process, fees and calendar clearly — it is the single biggest trust signal to families.",
            "List your trials and openings so players outside your existing network can find them.",
            "Keep a safeguarding policy and a named person responsible for minors, and say so publicly.",
          ],
        },
      ],
    },
    {
      heading: "How to actually retain what you read",
      blocks: [
        {
          type: "list",
          items: [
            "One guide, one action. Do not read the next piece until you have taken the action from the last one.",
            "Keep a single log sheet for results, tests and clips — most guides here assume you have one.",
            "Revisit the trust and safety checks every season; the scams change wording, not structure.",
            "Re-run your self-assessment every six to eight weeks so your reading is anchored to real numbers.",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Where should a 12-year-old and their parent start?",
      a: "The beginner roadmap for the athlete, and the parent path on this page for the guardian. Between them they cover sport choice, documents, training load and trial-day behaviour.",
    },
    {
      q: "Are the guides free?",
      a: "Yes, every guide and tool on this site is free to read. Paid plans only add profile and application features.",
    },
    {
      q: "How often is the material updated?",
      a: "Each page carries a last-updated date. Guides that depend on annual rules point to the association that publishes them rather than quoting figures that go stale.",
    },
  ],
  cta: { to: "/guides", label: "Open the guide library" },
};

export const coachesPage: ContentPage = {
  path: "/coaches",
  eyebrow: "Coaching",
  title: "How to choose a sports coach in India — and what it should cost",
  description:
    "Certification, group size, fair fees and the questions to ask before you pay a coach in India, plus how to tell technical coaching from supervision.",
  updated: UPDATED,
  readMins: 8,
  intro: [
    "A good coach is the highest-return purchase in an athlete's development, and a bad one costs years. Yet most families choose a coach on proximity and price alone, because nobody explains what to look for.",
    "This page gives you the checks, the questions and the cost structure so you can compare options properly before paying anyone.",
  ],
  sections: [
    {
      heading: "Certification: what the letters mean",
      blocks: [
        {
          type: "p",
          text: "In India, coaching credentials come from three broad sources: the National Institute of Sports diploma and certificate courses under the Sports Authority of India, sport-specific licences issued by national federations or their international bodies, and physical-education degrees such as B.P.Ed and M.P.Ed. Any of these is a reasonable signal. What matters more is that the certified person is the one who actually takes your sessions.",
        },
        {
          type: "list",
          items: [
            "Ask which qualification the coach holds, from which body, and in which year.",
            "Ask who takes the session you will attend — head coaches often supervise while assistants deliver.",
            "Ask for two athletes they have progressed to district or state level in the last two seasons.",
            "Ask whether they hold current first-aid training and how injuries are handled on site.",
          ],
        },
      ],
    },
    {
      heading: "Group size and session structure",
      blocks: [
        {
          type: "p",
          text: "Group size determines how much correction you receive, which is the entire point of paying a coach. A group of eight to twelve with one coach allows individual feedback in most sports; beyond about twenty, a session becomes supervised practice, which is worth having but should be priced accordingly.",
        },
        {
          type: "table",
          head: ["Format", "Best for", "What to expect"],
          rows: [
            [
              "One-to-one",
              "Fixing a specific technical fault",
              "Highest cost per hour, fastest correction",
            ],
            [
              "Small group (up to 12)",
              "Regular development training",
              "Individual feedback still possible",
            ],
            ["Large group (20+)", "Volume, fitness, match play", "Supervision more than coaching"],
            [
              "Online video review",
              "Athletes far from good coaching",
              "Useful for technique, useless for load management",
            ],
          ],
        },
      ],
    },
    {
      heading: "What coaching costs, and how to compare fairly",
      blocks: [
        {
          type: "p",
          text: "Fees vary enormously between a municipal ground and a private academy in a metro, so a single national number would be misleading. Compare on a per-session cost that includes everything you will actually pay, then judge that against group size and coach certification.",
        },
        {
          type: "steps",
          items: [
            "Get three written quotes near you for the same format and frequency.",
            "Convert each to a cost per session, adding travel, ground or court fees, kit and competition entries.",
            "Divide by the group size to see how much individual attention you are buying.",
            "Ask what happens to fees during exams, injury or monsoon closures — good coaches have a stated policy.",
            "Only then compare the headline monthly figures.",
          ],
        },
        {
          type: "note",
          text: "Never pay a coach for selection, a trial place or an 'introduction' to a selector. Coaching is a service you buy; selection is not for sale.",
        },
      ],
    },
    {
      heading: "Safeguarding: non-negotiables for minors",
      blocks: [
        {
          type: "list",
          items: [
            "Sessions happen in open, visible spaces with other athletes or parents able to observe.",
            "No one-to-one sessions in a private residence or closed room for a minor.",
            "The academy or coach names a person responsible for child safety and shares their contact.",
            "Communication with a minor goes through the parent or a group channel, not private late-night messages.",
            "Any discomfort is taken seriously the first time, and you are free to leave without financial penalty.",
          ],
        },
      ],
    },
    {
      heading: "Booking coaching through KhelGrid",
      blocks: [
        {
          type: "p",
          text: "Our coaching listings show the sport, city, format, group size and fee before you contact anyone, so you can run the comparison above without a phone call. Coaches supply their own credentials, and we display them as supplied — you should still ask the questions on this page before paying. Where a coach's certification has been checked by us, the listing says so explicitly.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is an NIS-certified coach always better?",
      a: "Not automatically, but certification means they have been trained in coaching method, physiology and safety rather than only having played the sport. Combine the credential with group size, recent results and how they handle injuries.",
    },
    {
      q: "How many sessions a week does a serious young athlete need?",
      a: "For most 13–18 year olds, three to five coached skill sessions plus two short strength or mobility sessions is a workable range, with one full rest day. Volume should rise gradually and drop during exams rather than stopping altogether.",
    },
    {
      q: "Is online coaching worth it?",
      a: "For technique review from a phone clip, yes — especially if there is no strong coach near you. It cannot manage load, correct movement in real time, or replace competition, so treat it as a supplement.",
    },
    {
      q: "What if a coach asks for money to arrange a trial?",
      a: "Refuse and walk away. Trials are entered through clubs, schools and associations. Payment for access to selection is the clearest sign of a scam.",
    },
  ],
  cta: { to: "/train", label: "See coaching programmes" },
};

export const mobileAppPage: ContentPage = {
  path: "/mobile-app",
  eyebrow: "Mobile",
  title: "Using KhelGrid on your phone (and installing it like an app)",
  description:
    "KhelGrid is built mobile-first and works on any Android or iOS browser. Here is how to install it to your home screen, save data, and what the native apps will add.",
  updated: UPDATED,
  readMins: 5,
  intro: [
    "Almost everyone who uses this site is on a phone, often on a limited data pack, so KhelGrid is built mobile-first: the search, trial listings, venue booking and guides are all designed for a small screen and a slow connection before anything else.",
    "You do not need to wait for an app store listing. You can add KhelGrid to your home screen today and it will open like an app.",
  ],
  sections: [
    {
      heading: "Add KhelGrid to your home screen",
      blocks: [
        {
          type: "steps",
          items: [
            "Android (Chrome): open khelgrid.com, tap the three-dot menu, then 'Add to Home screen' and confirm.",
            "iPhone (Safari): open khelgrid.com, tap the Share icon, scroll to 'Add to Home Screen', then Add.",
            "The icon behaves like an app: it opens full screen with no browser bar.",
            "Sign in once and your session stays, so trials and bookings are two taps away.",
          ],
        },
      ],
    },
    {
      heading: "Working on a slow or limited connection",
      blocks: [
        {
          type: "list",
          items: [
            "Search results and listings are text-first, so they load before images do.",
            "Use filters instead of scrolling — fewer results means less data.",
            "Screenshot a trial listing before you travel, so you have the venue, date and contact offline.",
            "Guides are plain pages: they print and save to PDF cleanly from the browser menu.",
          ],
        },
      ],
    },
    {
      heading: "What the native apps will add",
      blocks: [
        {
          type: "p",
          text: "Android and iOS builds are planned but not released. The features that genuinely need a native app are push alerts for trials matching your sport and city, offline access to saved listings, and direct camera capture for assessment clips. Everything else already works in the browser, which is why we have prioritised the mobile web experience first rather than shipping a thin wrapper.",
        },
        {
          type: "note",
          text: "There is no KhelGrid app on Google Play or the App Store yet. If you see one, it is not ours — please report it to khelgrid@gmail.com.",
        },
      ],
    },
    {
      heading: "Troubleshooting on mobile",
      blocks: [
        {
          type: "list",
          items: [
            "Page looks broken after an update: pull to refresh, or clear the site data for khelgrid.com in your browser settings.",
            "Not signed in: check that cookies are enabled for the site; private browsing windows forget your session.",
            "Cannot change your advertising choice: use the 'Cookie settings' link in the footer to reopen the consent banner.",
            "Something still wrong: mail khelgrid@gmail.com with your phone model and browser, and a screenshot if you can.",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is there a KhelGrid Android or iOS app?",
      a: "Not yet. The mobile website is the full product and can be installed to your home screen, where it opens full screen like an app.",
    },
    {
      q: "Does the site work offline?",
      a: "Not currently. Offline access to saved listings is planned for the native apps. Screenshot a listing before travelling to a trial.",
    },
    {
      q: "How much data does it use?",
      a: "Listing and guide pages are text-first and light. Filtering rather than endlessly scrolling is the easiest way to keep usage low.",
    },
  ],
  cta: { to: "/search", label: "Search trials on your phone" },
};

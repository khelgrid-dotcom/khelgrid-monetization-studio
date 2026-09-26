export interface FAQItem {
  id: string;
  category: "monetization" | "platform" | "verification" | "academies";
  categoryLabel: string;
  question: string;
  answer: string;
  link?: {
    text: string;
    to: string;
  };
}

export const HOME_FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-free-vs-paid",
    category: "monetization",
    categoryLabel: "Monetization & Pricing",
    question: "Is KhelGrid free for athletes, and how do micropayments work?",
    answer:
      "Yes! Every athlete receives 2 free trial applications upon creating an account. Once used, athletes can submit additional verified applications via micro-transactions at just ₹49 per application or unlock unlimited applications with KhelGrid Pro (₹499/month), which also includes a Verified Sports CV and priority scouting alerts.",
    link: {
      text: "View KhelGrid Pro Plans",
      to: "/pricing",
    },
  },
  {
    id: "faq-academy-boost",
    category: "monetization",
    categoryLabel: "Monetization & Pricing",
    question: "How can sports academies and organizers monetize or boost their trials?",
    answer:
      "Organizers and academies can feature their trials at the top of national discovery searches and the homepage carousel using 'Academy Boost' (starting at ₹1,500 for 7 days). Boosted trials receive up to 5x higher reach, automated WhatsApp broadcast shares, and instant push notifications to athletes matching age and sport criteria.",
    link: {
      text: "Explore Academy Sponsorship & Boost",
      to: "/pricing",
    },
  },
  {
    id: "faq-turf-booking-monetization",
    category: "monetization",
    categoryLabel: "Monetization & Pricing",
    question: "Can sports facility and turf owners list their grounds and take bookings?",
    answer:
      "Yes. Turf, court, and stadium managers can list their sports venues on KhelGrid Play. Facility owners can set hourly rates, manage peak vs. off-peak pricing, accept digital UPI/card payments, and offer coaching batched slots with instant slot lock.",
    link: {
      text: "Find or List Sports Venues",
      to: "/play",
    },
  },
  {
    id: "faq-how-trials-verified",
    category: "verification",
    categoryLabel: "Verification & Trust",
    question: "How does KhelGrid ensure trial listings are authentic and scam-free?",
    answer:
      "Every opportunity undergoes verification against federation records (e.g., BCCI, AIFF, BAI, Hockey India, SAI). We confirm official phone contacts, physical ground addresses, state association affiliations, and public trial notifications before attaching our 'Verified Organizer' badge. We never encourage untraceable cash payments.",
    link: {
      text: "Visit the Trust Center",
      to: "/trust-center",
    },
  },
  {
    id: "faq-apply-process",
    category: "platform",
    categoryLabel: "Platform Usage",
    question: "What documents and details do athletes need when applying for a trial?",
    answer:
      "Athletes should have their digital Sports CV completed on KhelGrid, which records sport discipline, primary & secondary playing positions, date of birth proof (Aadhaar or Birth Certificate), tournament achievements, and recent match stats or video links. Organizers receive your verified candidate dossier instantly upon submission.",
    link: {
      text: "Build Your Athlete Sports CV",
      to: "/profile",
    },
  },
  {
    id: "faq-realtime-badges",
    category: "platform",
    categoryLabel: "Platform Usage",
    question: "What do the real-time opportunity badges (Closing Soon, Closed, High Demand) mean?",
    answer:
      "Our system dynamically evaluates dates and slot availability in real time: 'Closing Soon' alerts you when registration ends within 24 hours; 'Closed' marks concluded trials and archives them; 'High Demand' flags trials with fewer than 20 open trial slots remaining; and 'Scouted' denotes official ISL, IPL, or national federation scouts in attendance.",
    link: {
      text: "Explore Latest Opportunities",
      to: "/search",
    },
  },
];

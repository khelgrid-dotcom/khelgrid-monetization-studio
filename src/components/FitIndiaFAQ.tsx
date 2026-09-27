import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  FileCheck,
  UserCheck,
  MapPin,
  Trophy,
  AlertCircle,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";

export interface FitIndiaFAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Eligibility" | "Documents" | "Venue & Schedule" | "Selection & Pathway";
  highlights?: string[];
}

export const FIT_INDIA_FAQS: FitIndiaFAQItem[] = [
  {
    id: "eligibility-age-criteria",
    category: "Eligibility",
    question: "Who is eligible to participate in the Fit India School Games selection trials?",
    answer:
      "The selection trials are open to regular enrolled school students in the Under-17 age category (both boys and girls). Participants must be studying in an affiliated government, aided, or private recognized school within the district. Athletes must belong to one of the 8 Block Administrative Centers (BACs) in Namchi District (e.g., Namchi, Jorethang, Ravangla, Melli, Temi, Yangang, Namthang, and Sikip).",
    highlights: [
      "Age Bracket: Under-17 (Boys & Girls)",
      "Affiliated school students within the 8 BAC blocks of Namchi",
      "Medically fit and certified by a medical authority",
    ],
  },
  {
    id: "disciplines-sports-offered",
    category: "Eligibility",
    question: "Which sports disciplines and events are included in the Namchi district trials?",
    answer:
      "The district-level competition cum selection trials cover 8 premier sporting disciplines: Archery, Boxing, Kabaddi, Karate, Kho-Kho, Table Tennis, Taekwondo, and Track & Field (Athletics). Track events feature 100m, 400m, 800m, 1500m, and Relay races. Field events comprise Shot Put and Long Jump for both Under-17 boys and girls divisions.",
    highlights: [
      "8 Disciplines: Archery, Boxing, Kabaddi, Karate, Kho-Kho, TT, Taekwondo, Athletics",
      "Track Events: 100m, 400m, 800m, 1500m, 4x100m Relay",
      "Field Events: Shot Put & Long Jump",
    ],
  },
  {
    id: "mandatory-documents",
    category: "Documents",
    question: "What documents must student-athletes present at the time of reporting?",
    answer:
      "All student athletes must present original physical documents alongside two sets of self-attested photocopies during reporting and biometric/age verification: 1) School Bonafide Certificate or valid School Photo Identity Card; 2) Date of Birth Proof (Municipal/Panchayat Birth Certificate or Aadhaar Card); 3) BAC Block Level Athletic Meet qualification slip or Block Education Office recommendation; 4) Medical fitness certificate issued by a registered medical practitioner (MBBS/Govt PHC); and 5) 4 recent passport-size photographs in sports attire.",
    highlights: [
      "School Photo ID or Principal Bonafide Certificate",
      "Birth Certificate (issued within mandated timeframe) or Aadhaar Card",
      "BAC Block Athletic Meet qualification slip / verification pass",
      "Valid Medical Fitness & Physical Competency certificate",
      "4 passport photographs",
    ],
  },
  {
    id: "entry-fee-and-costs",
    category: "Eligibility",
    question: "Is there any registration or participation fee for the selection trials?",
    answer:
      "No. As per the mandate of the Sports & Youth Affairs Department, Government of Sikkim and the Fit India Mission, participation in the district selection trials is 100% free of charge (₹0). Athletes are provided with official trial numbers, technical officiating by certified NIS coaches/state referees, emergency medical support on-site, and refreshments.",
    highlights: [
      "Entry Fee: ₹0 (Free Entry)",
      "Organized under Government of Sikkim Sports & Youth Affairs Department",
      "No unauthorized agents or private fee collectors are permitted",
    ],
  },
  {
    id: "venues-and-hubs",
    category: "Venue & Schedule",
    question: "Where are the selection trials conducted across Namchi?",
    answer:
      "To accommodate technical standards across multiple sporting codes, the selection trials are hosted across four specialized sporting complexes in Namchi: 1) Bhaichung Stadium (Track & Field Athletics, Kabaddi, Kho-Kho); 2) Namchi Indoor Stadium (Table Tennis, Taekwondo, Karate); 3) Boxing Hall Car Plaza (Boxing bouts and weigh-ins); and 4) Namchi Public School Sports Ground (Archery range and relay heats). Reporting begins daily at 8:00 AM.",
    highlights: [
      "Bhaichung Stadium: Track & Field, Kabaddi, Kho-Kho",
      "Namchi Indoor Stadium: Table Tennis, Karate, Taekwondo",
      "Boxing Hall Car Plaza: Official weigh-ins & boxing bouts",
      "Namchi Public School: Archery target range & technical qualifiers",
    ],
  },
  {
    id: "selection-pathway-gangtok",
    category: "Selection & Pathway",
    question: "What is the advancement pathway for top performers and medal winners?",
    answer:
      "Winners, finalists, and benchmark-qualifying student-athletes from the Namchi District Competition receive official state medals and certificates of merit. More importantly, they secure direct quota qualification to represent Namchi District in the prestigious State-Level Fit India School Games in Gangtok. Outstanding state medalists are subsequently shortlisted for the national Khelo India Youth Games / National School Games contingents.",
    highlights: [
      "Gold, Silver, and Bronze state merit certificates & medals",
      "Direct qualification to represent Namchi at State School Games in Gangtok",
      "National scouting pathway for Khelo India & National School Games",
    ],
  },
  {
    id: "kit-and-gear-rules",
    category: "Documents",
    question: "What apparel and equipment should participants bring?",
    answer:
      "Participants are responsible for bringing their discipline-specific equipment and attire. Athletics competitors should wear standard running vests, shorts, and approved spikes/running shoes. Combat sports athletes (Boxing, Taekwondo, Karate) must carry their own headgear, mouthguards, hand wraps, shin guards, and approved gloves/uniforms (Gi/Dobok). Archers must bring their calibrated bow sets and arrows.",
    highlights: [
      "Approved uniforms/attire compliant with respective State Sports Association guidelines",
      "Personal safety equipment (gumshields, headguards, chest protectors)",
      "Hydration flask, towel, and track jacket for cool weather conditions in Namchi",
    ],
  },
  {
    id: "grievance-and-verification",
    category: "Selection & Pathway",
    question: "How can parents and coaches verify official circulars or report discrepancies?",
    answer:
      "Official notifications are released directly on the Government of Sikkim portal (sikkim.gov.in) and through the District Sports Officer (DSO), Namchi. An on-site Jury of Appeal comprising senior officials of the Sports & Youth Affairs Department handles age scrutiny, protests, and timekeeper disputes before final podium certification.",
    highlights: [
      "Official Source: sikkim.gov.in Sports & Youth Affairs press release",
      "On-site technical Jury of Appeal for protest resolutions",
      "Age scrutiny committee inspects civil registration records strictly",
    ],
  },
];

export interface FitIndiaFAQProps {
  className?: string;
  sourceUrl?: string;
}

export function FitIndiaFAQ({
  className = "",
  sourceUrl = "https://www.sikkim.gov.in/media/news-announcement/news-info?name=District-Level+Competition+cum+Selection+Trials+for+Fit+India+School+Games+2026+Held+in+Namchi",
}: FitIndiaFAQProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Eligibility", "Documents", "Venue & Schedule", "Selection & Pathway"];

  const filteredFaqs = FIT_INDIA_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.highlights &&
        faq.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesQuery;
  });

  return (
    <section
      aria-labelledby="fit-india-faq-title"
      className={`rounded-3xl border border-primary/20 bg-gradient-to-b from-card/90 via-card/50 to-background p-6 md:p-8 shadow-sm ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Fit India Selection Trials FAQ
          </div>
          <h2
            id="fit-india-faq-title"
            className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Frequently Asked Questions · Fit India School Games
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
            Detailed criteria, verified document checklists, venue locations in Namchi, and
            advancement pathways for student-athletes and parents.
          </p>
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary shrink-0"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Official Portal Circular
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        )}
      </div>

      {/* Category Pills & Search Filter */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search criteria or documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background/70 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div className="mt-6">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold">No questions found matching your search</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for "age", "birth certificate", or "Bhaichung Stadium".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue="eligibility-age-criteria"
            className="w-full space-y-3"
          >
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border border-border/80 bg-card/60 px-4 md:px-5 py-1 transition-colors data-[state=open]:border-primary/40 data-[state=open]:bg-primary/[0.02]"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-3.5">
                  <div className="flex items-center gap-2.5 pr-2">
                    <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {faq.category}
                    </span>
                    <span className="text-sm md:text-base font-semibold">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4 text-sm text-muted-foreground leading-relaxed">
                  <p>{faq.answer}</p>

                  {faq.highlights && faq.highlights.length > 0 && (
                    <div className="mt-3.5 rounded-xl border border-border/60 bg-background/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
                        <FileCheck className="h-3.5 w-3.5" /> Key Guidelines & Verification Points
                      </div>
                      <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-foreground/80">
                        {faq.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Official Footnote / Advisory */}
      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>
            Verified against Official Press Release by Sports & Youth Affairs Department, Government
            of Sikkim (Fit India Mission).
          </span>
        </div>
        <div className="font-medium text-foreground shrink-0">
          State Games: Gangtok · District: Namchi
        </div>
      </div>
    </section>
  );
}

export default FitIndiaFAQ;

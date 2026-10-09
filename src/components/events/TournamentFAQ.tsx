import { useState, useMemo } from "react";
import {
  HelpCircle,
  ShieldCheck,
  Users,
  UserCheck,
  FileText,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronsUpDown,
  PhoneCall,
  CalendarCheck,
  Footprints,
  Clock,
  PlusCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FAQCategory = "all" | "registration" | "eligibility" | "rules" | "prizes";

export interface TournamentFAQItem {
  id: string;
  category: "registration" | "eligibility" | "rules" | "prizes";
  question: string;
  answer: string;
  keyPoints?: string[];
  tag: string;
}

const FAQ_ITEMS: TournamentFAQItem[] = [
  {
    id: "eligibility-general",
    category: "eligibility",
    question: "Who is eligible to participate in KhelGrid tournaments?",
    answer:
      "Most tournaments on KhelGrid feature open amateur eligibility, welcoming players aged 14 and above regardless of club affiliations. However, specific tournaments specify distinct brackets: Corporate Leagues require valid company email addresses or corporate employee ID badges; Youth & Grassroots competitions are age-capped (e.g. Under-15, Under-19); and Veteran Cups require players to be 35+ years old. Active national-level and contracted professional athletes are prohibited from Open Amateur divisions to ensure competitive fairness.",
    keyPoints: [
      "Open to amateur sports enthusiasts and club members",
      "Corporate divisions strictly require employee verification",
      "Age-restricted categories require official date of birth verification",
      "Contracted professional players barred from amateur draws",
    ],
    tag: "Eligibility Criteria",
  },
  {
    id: "solo-vs-team",
    category: "registration",
    question: "Can I register as an individual / solo player without a team?",
    answer:
      "Yes! If you do not have a pre-formed squad, you can register as a 'Solo / Free Agent'. Our tournament coordinator team pairs solo registrants together to form balanced 'House Teams' or connects you with registered squads seeking guest players before the bracket draw. If an appropriate squad slot cannot be finalized 24 hours prior to tournament kickoff, your full registration fee is automatically refunded.",
    keyPoints: [
      "Solo registration mode available across all team sports",
      "Automated matchmaking based on position and skill profile",
      "Full refund guarantee if no squad match is confirmed",
    ],
    tag: "Free Agent Pool",
  },
  {
    id: "documents-required",
    category: "eligibility",
    question: "What identity documents are required at check-in on match day?",
    answer:
      "Every registered participant must present a valid government-issued photo ID (Aadhaar, Passport, Voter ID, or Driver's License) at the tournament registration desk. For Corporate Leagues, players must also present their original corporate employee badge or verify their official corporate email ID on-site. Youth category participants must carry their original birth certificate, school ID, or passport to confirm age eligibility.",
    keyPoints: [
      "Valid Government Photo ID (Aadhaar / Driving License / Passport)",
      "Corporate Employee ID for corporate tournaments",
      "Birth certificate or School ID for U-15 / U-19 divisions",
      "Digital Tournament Pass QR on your KhelGrid account",
    ],
    tag: "Document Verification",
  },
  {
    id: "roster-substitutions",
    category: "registration",
    question: "Can we modify our squad roster or substitute players after registering?",
    answer:
      "Yes. Team captains can update squad player names, jersey numbers, and add reserve bench players up to 4 hours before the official tournament opening ceremony or captain's briefing. Last-minute emergency substitutions due to injury are permitted at match desk discretion before the team's first fixture begins, provided the substitute meets the tournament's eligibility standards and completes the waiver form.",
    keyPoints: [
      "Roster edits permitted until 4 hours before tournament start",
      "Maximum squad reserves: 2–4 players depending on sport format",
      "Substitutes must complete on-site ID verification before taking the field",
    ],
    tag: "Squad Management",
  },
  {
    id: "cancellation-refund",
    category: "prizes",
    question: "What is the cancellation and refund policy if our team cannot attend?",
    answer:
      "Teams can withdraw and receive a 100% refund up to 48 hours prior to tournament day. Withdrawals made between 24 and 48 hours receive a 50% refund or can request a 100% credit transfer to any future KhelGrid tournament within 90 days. Cancellations inside 24 hours or match no-shows are non-refundable as fixtures and tournament court allocations will have already been locked.",
    keyPoints: [
      "100% refund for cancellations >48 hours in advance",
      "50% cash refund or 100% tournament credit between 24–48 hours",
      "100% immediate refund if tournament is called off by the organizer",
    ],
    tag: "Refund & Cancellations",
  },
  {
    id: "weather-postponement",
    category: "rules",
    question: "What happens in case of heavy rain or inclement weather?",
    answer:
      "For outdoor turf cricket and football tournaments, organizers inspect playing surfaces 90 minutes before scheduled match times. In case of waterlogging or rain delays, matches may be shortened into super-overs or penalty shootouts, or rescheduled to the designated reserve day (typically the following Sunday). If a tournament cannot proceed and is cancelled by organizers, all teams receive an automatic 100% refund within 48 hours.",
    keyPoints: [
      "Grounds inspection conducted 90 minutes prior to kickoff",
      "Indoor backup venues or reserve dates prioritized where feasible",
      "Instant 100% refund guarantee if an event cannot be rescheduled",
    ],
    tag: "Weather Contingency",
  },
  {
    id: "footwear-equipment",
    category: "rules",
    question: "What footwear and sports equipment are permitted?",
    answer:
      "Footwear guidelines depend strictly on the venue surface: for indoor wooden/synthetic badminton, basketball, and squash courts, non-marking gum-rubber shoes are strictly mandatory. For artificial turf pitches (football & box cricket), flat-soled trainers or TF multi-stud turf shoes are allowed; metal screw-in studs and long SG football cleats are strictly prohibited for player safety. Standard match balls, shuttlecocks, match bibs, and first-aid kits are supplied by the organizer.",
    keyPoints: [
      "Non-marking rubber shoes mandatory for indoor wooden surfaces",
      "TF turf shoes permitted; metal spikes and SG cleats prohibited",
      "High-grade match balls and nylon/feather shuttles provided by tournament organizers",
      "Teams must bring matching jerseys or wear provided bibs",
    ],
    tag: "Kit & Footwear Regulations",
  },
  {
    id: "prizes-certificates",
    category: "prizes",
    question: "How are prize pools, trophies, and certificates awarded?",
    answer:
      "Cash prize awards are distributed directly to the team captain via secure UPI or direct NEFT transfer within 24 to 48 hours following the final award ceremony. Physical trophies, individual player medals, and Best Batsman/Bowler/Player of the Tournament awards are presented immediately at the podium. Every rostered player also receives a verifiable digital certificate with QR verification linked directly to their KhelGrid athlete profile.",
    keyPoints: [
      "Cash prizes transferred via UPI / NEFT within 24–48 hours",
      "Physical championship trophies and medals awarded at the podium",
      "Verifiable digital participation and winner certificates on player profile",
      "Earn official KhelGrid City Leaderboard tournament rating points",
    ],
    tag: "Prize Disbursement",
  },
  {
    id: "referees-protests",
    category: "rules",
    question: "Who officiates the matches and how are rule disputes resolved?",
    answer:
      "All KhelGrid verified tournaments are officiated by state-association certified or vetted professional referees and umpires. The referee's on-field decision is final during active play. Team captains may lodge a formal written dispute regarding player eligibility or rule misinterpretations with the Tournament Director within 15 minutes of match conclusion, accompanied by official match score sheets.",
    keyPoints: [
      "Certified match referees and official digital scorers",
      "Code of conduct strictly enforced (zero tolerance for unsportsmanlike behavior)",
      "Protest window: 15 minutes post-match through team captain only",
    ],
    tag: "Disputes & Officiating",
  },
  {
    id: "host-tournament",
    category: "registration",
    question: "How can sports clubs or corporate companies host a tournament on KhelGrid?",
    answer:
      "Any verified academy, corporate sports committee, or independent club can publish a tournament by clicking the 'Host Tournament' button on this page. Our platform handles registration collections, fixture generation, live scoring integration, and team management dashboards. KhelGrid verifies your event details within 12 hours before publishing it across our city athlete network.",
    keyPoints: [
      "Free listing submission with instant automated registration portals",
      "Automated bracket generation and fixture scheduling tools",
      "Dedicated promotion to thousands of verified local athletes",
    ],
    tag: "Organizer Tools",
  },
];

interface TournamentFAQProps {
  onOpenHostModal?: () => void;
  className?: string;
}

export function TournamentFAQ({ onOpenHostModal, className }: TournamentFAQProps) {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>(["eligibility-general", "solo-vs-team"]);

  // Filtered FAQ list
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        (item.keyPoints && item.keyPoints.some((p) => p.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAll = () => {
    if (openItems.length === filteredFaqs.length && filteredFaqs.length > 0) {
      setOpenItems([]);
    } else {
      setOpenItems(filteredFaqs.map((f) => f.id));
    }
  };

  const isAllExpanded = filteredFaqs.length > 0 && openItems.length === filteredFaqs.length;

  return (
    <section
      aria-labelledby="events-faq-heading"
      className={cn("mt-12 mb-6 scroll-mt-24", className)}
    >
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="rounded-3xl border border-border/80 bg-card/80 p-5 sm:p-8 backdrop-blur-md shadow-xs">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Tournament Knowledge Base</span>
            </div>
            <h2
              id="events-faq-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
            >
              Tournament Registration &amp; Eligibility FAQs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Everything you need to know about squad entries, solo free agents, age &amp; corporate
              eligibility verification, refund policies, and match regulations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAll}
              className="h-9 px-3 text-xs gap-1.5 cursor-pointer font-medium"
            >
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isAllExpanded ? "Collapse All" : "Expand All"}</span>
            </Button>
            {onOpenHostModal && (
              <Button
                type="button"
                size="sm"
                onClick={onOpenHostModal}
                className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Host Tournament</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-6 pb-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", label: "All Questions", count: FAQ_ITEMS.length },
              {
                id: "registration",
                label: "Registration & Teams",
                count: FAQ_ITEMS.filter((f) => f.category === "registration").length,
              },
              {
                id: "eligibility",
                label: "Eligibility & ID Verification",
                count: FAQ_ITEMS.filter((f) => f.category === "eligibility").length,
              },
              {
                id: "rules",
                label: "Match Rules & Kits",
                count: FAQ_ITEMS.filter((f) => f.category === "rules").length,
              },
              {
                id: "prizes",
                label: "Prizes & Refunds",
                count: FAQ_ITEMS.filter((f) => f.category === "prizes").length,
              },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as FAQCategory)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer border",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground border-transparent hover:bg-secondary/70",
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search eligibility, refunds, IDs..."
              className="pl-9 h-9 text-xs rounded-xl bg-background/80 border-border/80"
              aria-label="Search tournament frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Collapsible FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border bg-secondary/20">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-bold text-foreground">No matching questions found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try searching for terms like
              "refund", "Aadhaar", "solo", or "corporate".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="w-full divide-y divide-border/60"
          >
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-border/60 py-1 transition-colors hover:bg-muted/10 rounded-xl px-2 -mx-2"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground py-4 hover:no-underline group">
                  <div className="flex items-start sm:items-center gap-3 pr-4 text-left">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5 sm:mt-0">
                      {faq.category === "eligibility" ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : faq.category === "registration" ? (
                        <Users className="h-4 w-4" />
                      ) : faq.category === "rules" ? (
                        <Footprints className="h-4 w-4" />
                      ) : (
                        <Trophy className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-medium py-0 px-2 h-4.5 bg-secondary text-secondary-foreground"
                        >
                          {faq.tag}
                        </Badge>
                      </div>
                      <span className="text-foreground group-hover:text-primary transition-colors text-sm sm:text-base font-semibold">
                        {faq.question}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-1 pb-4 pl-10 pr-4 text-muted-foreground text-xs sm:text-sm leading-relaxed space-y-3">
                  <p>{faq.answer}</p>

                  {faq.keyPoints && faq.keyPoints.length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-1.5 mt-2">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                        Key Requirements &amp; Highlights
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {faq.keyPoints.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-1.5 text-xs text-foreground/90 font-medium"
                          >
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{point}</span>
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

        {/* Footer Support Callout Card */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/5 via-primary/10 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Still have questions regarding brackets or eligibility?
              </h4>
              <p className="text-xs text-muted-foreground">
                Our Tournament Operations Desk is live Monday through Sunday, 7:00 AM – 10:00 PM
                IST.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <a
              href="mailto:tournaments@khelgrid.com"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Email Support
            </a>
            {onOpenHostModal && (
              <Button
                type="button"
                onClick={onOpenHostModal}
                size="sm"
                className="h-9 px-3.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Host an Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default TournamentFAQ;

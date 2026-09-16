import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

const PLAY_FAQS = [
  {
    id: "faq-how-it-works",
    question: "How do I find and join an amateur pickup sports game on KhelGrid?",
    answer:
      "Select your sport, city, and preferred skill level from the top filter bar. Browse available open games, check the venue location, date, start time, and cost per player. Click 'Join Game' to inspect the roster, verify equipment provided, enter your name, and confirm your slot. You will receive an instant spot reservation.",
  },
  {
    id: "faq-cancellations",
    question: "What is the cancellation and no-show policy for pickup games?",
    answer:
      "To respect fellow athletes and venue reservation fees, players must cancel their RSVP at least 4 hours before the match start time. This gives the host adequate time to notify backup players on the waitlist. Frequent no-shows without notification may lead to restrictions on joining future community slots.",
  },
  {
    id: "faq-cost-split",
    question: "How are venue rental fees and match costs split?",
    answer:
      "Match costs are 100% transparent. The total venue fee (e.g. ₹1,600 for 2 hours) plus any shared consumables (match balls, bib laundering) is divided equally by the total player capacity. The host pays the exact same share as any other player, with zero commercial markup.",
  },
  {
    id: "faq-gear-equipment",
    question: "What sports equipment should I bring to my first game?",
    answer:
      "Most hosts provide official match balls, training bibs (pinnies), and basic referee whistles. Players are responsible for their personal sports attire, personal racket/paddle (if playing badminton, tennis, or pickleball), hydration bottle, and surface-compliant footwear (turf shoes for artificial grass, gum rubber soles for indoor wooden courts).",
  },
  {
    id: "faq-skill-mismatch",
    question: "Can beginners join intermediate or advanced pickup games?",
    answer:
      "We encourage beginners to start with games tagged as 'Beginner' or 'All Welcome'. Joining an advanced game without the required stamina or fundamentals can lead to unintentional collision injuries or an unbalanced match. If you are uncertain about your level, message the host or review our Skill Level Self-Assessment Matrix above.",
  },
  {
    id: "faq-hosting",
    question: "How do I host my own pickup game at a local turf or arena?",
    answer:
      "Click the 'Host a Game' button at the top of the Play page. Select your sport, target city, and venue (or type a custom ground name). Specify the date, start time, duration, required skill level, total player capacity, and cost per player. Once submitted, your game will be published live for local players to discover and join.",
  },
  {
    id: "faq-rainout",
    question: "What happens in case of sudden rain or bad weather on outdoor turfs?",
    answer:
      "If heavy rain, waterlogging, or thunderstorm safety concerns force a cancellation, the host coordinates with the facility management. Most venues offer a free reschedule credit or full refund. The host will update all registered participants promptly through the match communication channel.",
  },
];

export function PlayFAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PLAY_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section id="play-faqs-section" className="space-y-6 pt-10 border-t border-border/80">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-primary border-primary/30">
          Knowledge Base
        </Badge>
        <span className="text-xs text-muted-foreground">Everything You Need to Know</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2.5">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Clear answers on match etiquette, safety standards, transparent cost splits, and hosting
          rules on KhelGrid Play.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["faq-how-it-works", "faq-cost-split"]}
        className="space-y-3"
      >
        {PLAY_FAQS.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            id={faq.id}
            className="rounded-2xl border border-border/70 bg-card/60 px-5 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/30"
          >
            <AccordionTrigger className="text-left text-sm sm:text-base font-semibold py-4 hover:no-underline hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4 pt-1">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

import * as React from "react";
import {
  HelpCircle,
  Clock,
  RotateCcw,
  Users,
  Footprints,
  CloudRain,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface VenueFAQProps {
  venueName: string;
  sports?: string[];
  pricePerHour?: number;
  className?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
  icon: React.ElementType;
}

export function generateVenueFAQs(
  venueName: string,
  sports: string[] = ["Football", "Badminton"],
  pricePerHour: number = 800,
): FAQItem[] {
  const sportsStr = sports.join(", ");
  const hasIndoor = sports.some((s) => /badminton|squash|table tennis|basketball/i.test(s));
  const hasTurf = sports.some((s) => /football|cricket|turf/i.test(s));

  return [
    {
      id: "faq-cancellation",
      question: "What is the cancellation and refund policy?",
      answer: `Cancellations made up to 4 hours prior to your scheduled start time are eligible for a 100% refund processed instantly to your KhelGrid wallet, or back to your original payment method within 3–5 business days. Cancellations made between 2 to 4 hours before the slot receive a 50% refund. Cancellations made less than 2 hours before the game are non-refundable as the court cannot be reallocated on short notice.`,
      tag: "Cancellation Policy",
      icon: RotateCcw,
    },
    {
      id: "faq-booking-hours",
      question: `What are the facility booking hours and night play slots for ${venueName}?`,
      answer: `${venueName} is open daily from 6:00 AM to 11:00 PM. Slots can be booked in 60-minute increments. Evening and night slots after 7:00 PM include high-grade 500-lux floodlight illumination. We advise booking at least 2 hours in advance during peak evening hours (6:00 PM – 10:00 PM) to ensure availability.`,
      tag: "Booking Hours",
      icon: Clock,
    },
    {
      id: "faq-age-restrictions",
      question: "Are there age restrictions or supervision requirements for children?",
      answer: `All age groups are welcome! Children aged 14 and under must be accompanied by an adult or certified sports coach on the premises. Toddlers and spectators are not allowed on active playing surfaces for safety reasons. Youth coaching batches and junior leagues operate regularly during weekend morning slots.`,
      tag: "Age Restrictions",
      icon: Users,
    },
    {
      id: "faq-footwear-equipment",
      question: "What footwear is required, and can equipment be rented on-site?",
      answer: hasIndoor
        ? `For indoor synthetic and wooden courts (e.g., Badminton), non-marking gum sole shoes are strictly mandatory. Outdoor turfs permit rubber studs or turf trainers (metal cleats are prohibited). High-quality racquets, shuttlecocks, footballs, and training bibs are available for rent at the reception starting at ₹50 per session.`
        : `Rubber studs, multi-ground turf boots, or standard athletic sneakers are required. Metal studs are strictly prohibited to preserve turf integrity. Footballs, cricket gear, and team bibs can be rented directly at the venue reception counter.`,
      tag: "Footwear & Gear",
      icon: Footprints,
    },
    {
      id: "faq-weather-rescheduling",
      question: "Can I reschedule my booking, and what happens in bad weather?",
      answer: `You can reschedule your slot free of charge up to 4 hours before the match directly from the "My Bookings" page. In the event of torrential rain, severe storms, or facility maintenance that renders outdoor surfaces unplayable, the venue manager will issue an immediate reschedule token or full refund credit.`,
      tag: "Weather & Rescheduling",
      icon: CloudRain,
    },
    {
      id: "faq-amenities-parking",
      question: "What parking, locker, and shower facilities are provided?",
      answer: `Complimentary on-site two-wheeler and four-wheeler parking is available for all confirmed players. Secure locker rooms, sanitized changing facilities, private showers, clean restrooms, and chilled RO drinking water dispensers are accessible free of charge during your reserved slot.`,
      tag: "Amenities & Access",
      icon: ShieldCheck,
    },
  ];
}

export function VenueFAQ({
  venueName,
  sports = ["Football", "Badminton"],
  pricePerHour = 800,
  className,
}: VenueFAQProps) {
  const faqs = React.useMemo(
    () => generateVenueFAQs(venueName, sports, pricePerHour),
    [venueName, sports, pricePerHour],
  );

  return (
    <section
      id="venue-faq-section"
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-7 space-y-5 shadow-xs",
        className,
      )}
      aria-labelledby="venue-faq-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="venue-faq-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <Badge
              variant="secondary"
              className="text-xs bg-primary/10 text-primary font-semibold hidden sm:inline-flex"
            >
              {faqs.length} Common Inquiries
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Everything you need to know about booking policies, cancellations, operating hours, and
            rules at {venueName}.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60 shrink-0 self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Instant Player Guidelines</span>
        </div>
      </div>

      {/* Accordion List */}
      <Accordion
        type="single"
        collapsible
        defaultValue="faq-cancellation"
        className="w-full space-y-3"
        id="venue-faq-accordion"
      >
        {faqs.map((faq) => {
          const Icon = faq.icon;
          return (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              id={`venue-faq-item-${faq.id}`}
              className="rounded-xl border border-border/60 bg-muted/20 px-4 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40"
            >
              <AccordionTrigger
                id={`venue-faq-trigger-${faq.id}`}
                className="py-3.5 hover:no-underline hover:text-primary gap-3 text-left group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-semibold text-foreground block group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">{faq.tag}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent
                id={`venue-faq-content-${faq.id}`}
                className="pt-1 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-11 pr-2"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Help Footer / Support Assistance */}
      <div
        id="venue-faq-support-banner"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs"
      >
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">
            Still have questions about this facility?
          </span>
          <p className="text-muted-foreground">
            Our 24/7 sports concierge and venue court manager are available to assist with slot
            reservations.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="text-[11px] bg-background text-foreground font-medium py-1 px-2.5"
          >
            Support: support@khelgrid.com
          </Badge>
        </div>
      </div>
    </section>
  );
}

export default VenueFAQ;

import * as React from "react";
import {
  Clock,
  ShieldCheck,
  RotateCcw,
  Calendar,
  Footprints,
  Users,
  AlertTriangle,
  Ban,
  CheckCircle2,
  FileText,
  CloudRain,
  Moon,
  Sun,
  Coffee,
  Sparkles,
  Award,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface VenueOperatingHoursData {
  regular_hours?: string;
  weekend_hours?: string;
  peak_hours?: string;
  floodlight_hours?: string;
  maintenance_window?: string;
  last_entry?: string;
}

export interface VenueBookingPoliciesData {
  advance_booking?: string;
  cancellation_full_refund?: string;
  cancellation_partial_refund?: string;
  cancellation_no_refund?: string;
  rescheduling?: string;
  slot_duration?: string;
  weather_policy?: string;
  id_verification?: string;
}

export interface VenueRulesRestrictionsData {
  footwear_indoor?: string;
  footwear_turf?: string;
  dress_code?: string;
  prohibited_items?: string[];
  age_guidelines?: string;
  spectators?: string;
  equipment?: string;
}

export interface VenuePoliciesAccordionProps {
  venueName: string;
  sports?: string[];
  pricePerHour?: number;
  operatingHours?: VenueOperatingHoursData | null;
  bookingPolicies?: VenueBookingPoliciesData | null;
  rulesRestrictions?: VenueRulesRestrictionsData | null;
  className?: string;
  defaultOpenSections?: string[];
}

export function VenuePoliciesAccordion({
  venueName,
  sports = ["Football", "Badminton"],
  pricePerHour = 800,
  operatingHours,
  bookingPolicies,
  rulesRestrictions,
  className,
  defaultOpenSections = ["policy-booking"],
}: VenuePoliciesAccordionProps) {
  const hasIndoorSports = sports.some((s) =>
    /badminton|squash|table tennis|basketball|volleyball/i.test(s),
  );
  const hasTurfSports = sports.some((s) => /football|cricket|turf|hockey/i.test(s));
  const hasPool = sports.some((s) => /swimming|pool|aquatics/i.test(s));

  // Resolved structured hours
  const hours = {
    regular: operatingHours?.regular_hours || "6:00 AM – 11:00 PM (Monday to Sunday)",
    weekend: operatingHours?.weekend_hours || "5:30 AM – 11:30 PM (Saturday & Sunday)",
    peak:
      operatingHours?.peak_hours ||
      "6:00 PM – 10:00 PM (Weekdays) & 6:00 AM – 10:00 PM (Saturdays/Sundays)",
    floodlights:
      operatingHours?.floodlight_hours ||
      "6:30 PM – 11:00 PM (Tournament grade 500-lux LED floodlights included)",
    maintenance:
      operatingHours?.maintenance_window ||
      "11:00 PM – 5:30 AM (Daily court rolling, turf brushing, and sanitation)",
    lastEntry: operatingHours?.last_entry || "10:15 PM (45 minutes prior to facility closing)",
  };

  // Resolved structured booking terms
  const policies = {
    advance:
      bookingPolicies?.advance_booking ||
      "Book up to 14 days in advance with real-time slot locking and instant SMS/email confirmation.",
    cancellationFull:
      bookingPolicies?.cancellation_full_refund ||
      "100% full refund for cancellations initiated at least 4 hours prior to slot kickoff.",
    cancellationPartial:
      bookingPolicies?.cancellation_partial_refund ||
      "50% refund processed for cancellations initiated 2 to 4 hours prior to game start.",
    cancellationNone:
      bookingPolicies?.cancellation_no_refund ||
      "No refund for cancellations under 2 hours or no-shows, as the slot cannot be re-listed on short notice.",
    reschedule:
      bookingPolicies?.rescheduling ||
      "1 complimentary slot reschedule permitted up to 4 hours prior to match time directly from My Bookings.",
    duration:
      bookingPolicies?.slot_duration ||
      "Standard 60-minute increments. A 5–10 minute transition buffer is observed between back-to-back matches.",
    weather:
      bookingPolicies?.weather_policy ||
      "100% weather disruption guarantee: If heavy rain or extreme weather makes outdoor turf unplayable, get an automatic reschedule token or full refund.",
    idCheck:
      bookingPolicies?.id_verification ||
      "Show your digital KhelGrid booking voucher or reference ID on mobile at the reception desk for instant check-in.",
  };

  // Resolved structured restrictions & rules
  const restrictions = {
    footwearIndoor:
      rulesRestrictions?.footwear_indoor ||
      "Non-marking gum sole shoes are strictly mandatory on all synthetic/wooden indoor courts. Running shoes, outdoor cleats, and black soles are strictly banned to prevent surface scuffs.",
    footwearTurf:
      rulesRestrictions?.footwear_turf ||
      "Multi-ground rubber studs, TF turf trainers, or standard flat-sole athletic sneakers required. Metal studs and spiked cleats are strictly prohibited on artificial turf grass.",
    dressCode:
      rulesRestrictions?.dress_code ||
      "Athletic sportswear, team jerseys, shorts, or dry-fit tracksuits required. Bare-chested play or improper civilian clothing is not permitted on the playing arena.",
    prohibitedItems: rulesRestrictions?.prohibited_items || [
      "Metal cleats or track spikes",
      "Chewing gum & outside cooked food on playing surface",
      "Smoking, tobacco, paan, and vaping on premises",
      "Alcoholic beverages and banned substances",
      "Glass bottles, breakable crockery & sharp items",
      "Pets on synthetic turf or inside court enclosures",
    ],
    age:
      rulesRestrictions?.age_guidelines ||
      "All age categories welcome. Minors aged 14 and under must be supervised by an accompanying parent, guardian, or certified sports coach.",
    spectators:
      rulesRestrictions?.spectators ||
      "Dedicated perimeter seating and gallery stands accommodate up to 20 non-playing spectators per court without additional fee.",
    equipment:
      rulesRestrictions?.equipment ||
      "Players are encouraged to bring their own balls and racquets. Tournament-approved footballs, badminton racquets, shuttlecocks, and team pinnies/bibs are also available for on-site rental starting at ₹50 per item.",
  };

  return (
    <section
      id="venue-policies-section"
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 sm:p-7 space-y-6 shadow-xs",
        className,
      )}
      aria-labelledby="venue-policies-heading"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="venue-policies-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              <FileText className="h-5 w-5 text-primary" />
              Venue Policies, Hours & Rules
            </h2>
            <Badge
              variant="outline"
              className="text-xs bg-primary/10 text-primary border-primary/20 font-semibold"
            >
              Verified Facility Terms
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Structured guidelines covering reservation rules, operating schedule, surface footwear
            mandates, and on-court restrictions at {venueName}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Updated for 2026 Season</span>
          </span>
        </div>
      </div>

      {/* Accordion Component */}
      <Accordion
        type="multiple"
        defaultValue={defaultOpenSections}
        className="w-full space-y-3"
        id="venue-policies-accordion"
      >
        {/* ITEM 1: Booking, Cancellation & Refund Policies */}
        <AccordionItem
          value="policy-booking"
          id="venue-policy-item-booking"
          className="rounded-xl border border-border/70 bg-muted/20 px-4 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40"
        >
          <AccordionTrigger
            id="venue-policy-trigger-booking"
            className="py-3.5 hover:no-underline hover:text-primary gap-3 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Booking & Cancellation Policies
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  >
                    100% Refund Window
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Advance reservation terms, refund timelines, free rescheduling, and rainout
                  guarantee
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent
            id="venue-policy-content-booking"
            className="pt-2 pb-5 text-xs sm:text-sm text-muted-foreground space-y-4"
          >
            {/* Structured Grid of Policies */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Advance Booking Window */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Advance Booking Window
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{policies.advance}</p>
              </div>

              {/* Slot Duration & Overtime Buffer */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Slot Duration & Handover Buffer
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{policies.duration}</p>
              </div>

              {/* Free Reschedule Allowance */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <RotateCcw className="h-3.5 w-3.5 text-emerald-600" /> Rescheduling Allowance
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {policies.reschedule}
                </p>
              </div>

              {/* Weather Disruption & Rainout Protection */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <CloudRain className="h-3.5 w-3.5 text-sky-500" /> Inclement Weather Policy
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{policies.weather}</p>
              </div>
            </div>

            {/* Refund Tier Breakdown Table */}
            <div className="rounded-xl border border-border/60 bg-background/90 overflow-hidden">
              <div className="bg-muted/50 px-3.5 py-2 border-b border-border/60 text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Cancellation & Refund Timelines</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Standardized KhelGrid Policy
                </span>
              </div>
              <div className="divide-y divide-border/50 text-xs">
                <div className="p-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">
                      &gt; 4 Hours Prior to Slot
                    </span>
                    <p className="text-[11px] text-muted-foreground">{policies.cancellationFull}</p>
                  </div>
                  <Badge className="bg-emerald-600 text-white shrink-0 text-[11px]">
                    100% Refund
                  </Badge>
                </div>

                <div className="p-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">
                      2 to 4 Hours Prior to Slot
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {policies.cancellationPartial}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-amber-600 dark:text-amber-400 shrink-0 text-[11px]"
                  >
                    50% Refund
                  </Badge>
                </div>

                <div className="p-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">&lt; 2 Hours / No Show</span>
                    <p className="text-[11px] text-muted-foreground">{policies.cancellationNone}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-destructive text-destructive shrink-0 text-[11px]"
                  >
                    Non-Refundable
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{policies.idCheck}</span>
              </div>
              <a
                href="/cancellation-policy"
                className="text-primary hover:underline font-semibold text-[11px]"
              >
                Read Full Cancellation &amp; Refund Policy →
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ITEM 2: Facility Operating Hours & Lighting Schedule */}
        <AccordionItem
          value="policy-hours"
          id="venue-policy-item-hours"
          className="rounded-xl border border-border/70 bg-muted/20 px-4 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40"
        >
          <AccordionTrigger
            id="venue-policy-trigger-hours"
            className="py-3.5 hover:no-underline hover:text-primary gap-3 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Operating Hours & Lighting Schedule
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                  >
                    Open Daily
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily facility timings, floodlight hours, peak rates, and routine maintenance
                  windows
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent
            id="venue-policy-content-hours"
            className="pt-2 pb-5 text-xs sm:text-sm text-muted-foreground space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Daily Operating Hours */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Sun className="h-3.5 w-3.5 text-amber-500" /> General Daily Timings
                </div>
                <div className="text-xs font-medium text-foreground">{hours.regular}</div>
                <p className="text-[11px] text-muted-foreground">
                  Weekends open early: {hours.weekend}
                </p>
              </div>

              {/* Peak Playing Times */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Award className="h-3.5 w-3.5 text-primary" /> Peak Booking Window
                </div>
                <div className="text-xs font-medium text-foreground">{hours.peak}</div>
                <p className="text-[11px] text-muted-foreground">
                  Advance booking recommended during evening slots
                </p>
              </div>

              {/* Floodlight Illumination */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Moon className="h-3.5 w-3.5 text-indigo-400" /> Night Match Floodlights
                </div>
                <div className="text-xs font-medium text-foreground">{hours.floodlights}</div>
                <p className="text-[11px] text-muted-foreground">
                  No surcharge for night floodlights; included in standard slot
                </p>
              </div>
            </div>

            {/* Maintenance & Entry Advisory */}
            <div className="rounded-xl border border-border/60 bg-background/70 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-semibold text-foreground">Surface Rolling & Ground Care</span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {hours.maintenance}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-foreground">Last Check-In & Gate Closing</span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {hours.lastEntry}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ITEM 3: Surface Footwear, Equipment & Attire Mandates */}
        <AccordionItem
          value="policy-footwear"
          id="venue-policy-item-restrictions"
          className="rounded-xl border border-border/70 bg-muted/20 px-4 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40"
        >
          <AccordionTrigger
            id="venue-policy-trigger-restrictions"
            className="py-3.5 hover:no-underline hover:text-primary gap-3 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Footprints className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Footwear, Attire & Equipment Rules
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  >
                    Strictly Enforced
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Non-marking shoes, turf stud requirements, dress codes, and on-site rental
                  equipment
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent
            id="venue-policy-content-restrictions"
            className="pt-2 pb-5 text-xs sm:text-sm text-muted-foreground space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Indoor Court Footwear */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Indoor Courts (Badminton
                  / Squash / Wooden)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {restrictions.footwearIndoor}
                </p>
              </div>

              {/* Outdoor / Turf Footwear */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Outdoor Turfs & Grounds
                  (Football / Cricket)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {restrictions.footwearTurf}
                </p>
              </div>
            </div>

            {/* Dress Code & Equipment Rental */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <span className="font-semibold text-foreground text-xs block">
                  Required Sports Attire
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {restrictions.dressCode}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <span className="font-semibold text-foreground text-xs block">
                  Equipment Rental at Reception
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {restrictions.equipment}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ITEM 4: Ground Safety, Age Limits & Prohibited Items */}
        <AccordionItem
          value="policy-safety"
          id="venue-policy-item-safety"
          className="rounded-xl border border-border/70 bg-muted/20 px-4 transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/40"
        >
          <AccordionTrigger
            id="venue-policy-trigger-safety"
            className="py-3.5 hover:no-underline hover:text-primary gap-3 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Ban className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Safety, Age Guidelines & Prohibited Items
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  >
                    Zero Tolerance
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Age limits, spectator access, banned substances, and emergency health protocols
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent
            id="venue-policy-content-safety"
            className="pt-2 pb-5 text-xs sm:text-sm text-muted-foreground space-y-4"
          >
            {/* Age & Spectator Policy */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Users className="h-3.5 w-3.5 text-primary" /> Age & Supervision Requirements
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{restrictions.age}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                  <Users className="h-3.5 w-3.5 text-primary" /> Spectators & Guest Seating
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {restrictions.spectators}
                </p>
              </div>
            </div>

            {/* Prohibited Items List */}
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Strictly Prohibited on Facility Premises
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {restrictions.prohibitedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-foreground/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency & First Aid */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">
                  On-site first aid kit, ice packs, and certified manager available for any court
                  emergencies.
                </span>
              </div>
              <span className="font-semibold text-foreground shrink-0">
                Emergency Desk: Active 24/7
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

export default VenuePoliciesAccordion;

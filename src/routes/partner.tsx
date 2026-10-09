import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Handshake,
  Building2,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Send,
  Users,
  Calendar,
  Wallet,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/partner")({
  head: () =>
    buildSeoHead({
      title: "Partner with Us · Academies, Venues & Tournament Organizers | KhelGrid",
      description:
        "Partner with KhelGrid. List verified athletic trials, monetize turf and facility bookings, and connect with scouts and youth athletes across India.",
      canonicalPath: "/partner",
      keywords:
        "sports academy partnership, turf listing India, tournament organizer partnership, sports facility onboarding, KhelGrid partner",
      type: "website",
    }),
  component: PartnerPage,
});

const PARTNERSHIP_TRACKS = [
  {
    icon: Building2,
    title: "Sports Academies & Coaching Centers",
    tag: "Trials & Talent",
    description:
      "Publish sanctioned trials, scout-verified assessments, and seasonal training camps. Attract high-potential athletes with transparent verification badges.",
    benefits: [
      "Official KhelGrid Verified Academy Badge",
      "Direct trial registrations & automated eligibility checks",
      "Talent scout portal integration for player visibility",
      "Dedicated academy profile with coach credentials",
    ],
  },
  {
    icon: Calendar,
    title: "Venues, Turfs & Sports Complexes",
    tag: "Bookings & Monetization",
    description:
      "Maximize court and pitch occupancy during off-peak and weekend hours. Receive direct digital payments and booking confirmations from players and local leagues.",
    benefits: [
      "Real-time court & slot management dashboard",
      "Zero commission on grassroots community trials",
      "Instant UPI & bank payout settlements",
      "Featured venue placement for local city searches",
    ],
  },
  {
    icon: Trophy,
    title: "Tournament Organizers & Associations",
    tag: "Event Operations",
    description:
      "Run state, district, or institutional championships with digital scorecards, automated brackets, and player verification to prevent age and eligibility fraud.",
    benefits: [
      "Digital player registration & roster management",
      "Live match updates and bracket automation",
      "Promoted tournament listings in sports event calendar",
      "Post-tournament tactical analytics publishing",
    ],
  },
  {
    icon: Users,
    title: "Corporate Brands & Athlete Sponsors",
    tag: "Sponsorship & CSR",
    description:
      "Deploy sports scholarships, equipment grants, and grassroots CSR initiatives directly to verified, deserving athletes with verifiable performance records.",
    benefits: [
      "Direct-to-athlete transparent grant disbursement",
      "Auditable impact reports and performance tracking",
      "Co-branded tournament and scholarship naming rights",
      "Grassroots athletic storytelling and brand reach",
    ],
  },
];

function PartnerPage() {
  const [partnerType, setPartnerType] = useState<string>("Sports Academy");
  const [orgName, setOrgName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sportsOffered, setSportsOffered] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactPerson.trim() || !email.trim()) {
      toast.error("Please fill in the required organization and contact details");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Partnership inquiry received! Our onboarding team will contact you within 24 hours.",
      );
    }, 600);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Handshake className="mr-1.5 h-3.5 w-3.5" /> Institutional Partnerships
          </Badge>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            500+ Active Partners
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Partner with India&apos;s Fastest Growing Sports Opportunity Network
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Join leading academies, venues, and tournament organizers. Scale your reach, verify
          genuine sporting opportunities, and connect directly with thousands of athletes and talent
          scouts.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PARTNERSHIP_TRACKS.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.title}
              className="flex flex-col justify-between rounded-3xl border border-border bg-gradient-card p-6 shadow-sm transition-all hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {track.tag}
                  </Badge>
                </div>
                <h2 className="mt-4 text-xl font-bold text-foreground">{track.title}</h2>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm leading-relaxed">
                  {track.description}
                </p>

                <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Partner Benefits
                  </span>
                  {track.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPartnerType(track.title.split(" &")[0].split(" (")[0]);
                    const formEl = document.getElementById("partner-form");
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full rounded-xl text-xs font-semibold"
                >
                  Join as {track.title.split(" &")[0]}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboarding Form */}
      <section
        id="partner-form"
        className="mt-16 rounded-3xl border border-border bg-gradient-card p-6 sm:p-10 shadow-sm"
      >
        <div className="max-w-2xl">
          <Badge variant="outline" className="border-primary/40 text-primary">
            Partnership Application
          </Badge>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Get Started in 24 Hours</h2>
          <p className="text-xs text-muted-foreground sm:text-sm mt-1">
            Submit your facility, academy, or organization details. Our partnerships team will
            review your information and assist with verification.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-lg font-bold text-foreground">
              Partnership Request Submitted
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for partnering with KhelGrid! A dedicated partner account manager will reach
              out via email and WhatsApp to finalize onboarding.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-xl text-xs"
            >
              Submit Another Partner Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="partner-org" className="text-xs font-semibold text-foreground">
                Academy / Organization Name *
              </label>
              <Input
                id="partner-org"
                placeholder="e.g. Apex Cricket Academy or Greenfield Sports Arena"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="partner-type" className="text-xs font-semibold text-foreground">
                Partner Category *
              </label>
              <select
                id="partner-type"
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
              >
                <option value="Sports Academy">Sports Academy / Coaching Facility</option>
                <option value="Turf & Venue">Turf / Sports Complex / Court Owner</option>
                <option value="Tournament Organizer">Tournament Organizer / Association</option>
                <option value="Brand Sponsor">Corporate Sponsor / CSR Foundation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="partner-contact" className="text-xs font-semibold text-foreground">
                Primary Contact Person *
              </label>
              <Input
                id="partner-contact"
                placeholder="e.g. Coach Vikram Singh / Manager Name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="partner-email" className="text-xs font-semibold text-foreground">
                Official Email Address *
              </label>
              <Input
                id="partner-email"
                type="email"
                placeholder="director@academy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="partner-phone" className="text-xs font-semibold text-foreground">
                Phone / WhatsApp *
              </label>
              <Input
                id="partner-phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="partner-city" className="text-xs font-semibold text-foreground">
                City / State *
              </label>
              <Input
                id="partner-city"
                placeholder="e.g. Bengaluru, Karnataka or New Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="partner-sports" className="text-xs font-semibold text-foreground">
                Sports Offered / Supported
              </label>
              <Input
                id="partner-sports"
                placeholder="e.g. Cricket, Football, Badminton, Swimming, Athletics"
                value={sportsOffered}
                onChange={(e) => setSportsOffered(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="partner-details" className="text-xs font-semibold text-foreground">
                Facility Details or Partnership Goals
              </label>
              <Textarea
                id="partner-details"
                rows={3}
                placeholder="Tell us about your upcoming trials, number of courts/pitches, or specific requirements…"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl px-6 text-xs font-semibold"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {isSubmitting ? "Submitting Inquiry…" : "Submit Partnership Request"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

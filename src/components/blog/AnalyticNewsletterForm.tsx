import { useState, type FormEvent } from "react";
import {
  Mail,
  CheckCircle2,
  Crown,
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Gift,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export interface AnalyticLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "athlete" | "academy" | "parent" | "coach_scout" | "analyst";
  primarySport: string;
  servicesOfInterest: string[];
  postSlug: string;
  postTitle: string;
  createdAt: string;
}

const STORAGE_KEY = "khelgrid-newsletter-leads";

const SPORTS_OPTIONS = [
  "Cricket",
  "Football",
  "Badminton",
  "Athletics",
  "Tennis",
  "Shooting",
  "Swimming",
  "Wrestling",
  "Basketball",
  "Hockey",
  "Archery",
];

const MONETIZATION_SERVICES = [
  {
    id: "pro_athlete_cv",
    label: "KhelGrid Pro Athlete (Verified Sports CV & Scout Priority)",
    badge: "₹499/mo",
    icon: Crown,
  },
  {
    id: "academy_boost",
    label: "Academy Trial Boost (7-day featured spotlight to 10k+ athletes)",
    badge: "₹1,500/wk",
    icon: Flame,
  },
  {
    id: "scouting_combines",
    label: "VIP Scout Combine Alerts & Selection Camp Access",
    badge: "Exclusive",
    icon: TrendingUp,
  },
  {
    id: "analytics_reports",
    label: "Weekly High-Performance Match Analytics & Tactical PDF Wires",
    badge: "Free Wire",
    icon: Sparkles,
  },
];

interface AnalyticNewsletterFormProps {
  postSlug: string;
  postTitle: string;
  postCategory?: string;
}

export function AnalyticNewsletterForm({
  postSlug,
  postTitle,
  postCategory = "Match analysis",
}: AnalyticNewsletterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("athlete");
  const [primarySport, setPrimarySport] = useState("Cricket");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "pro_athlete_cv",
    "scouting_combines",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = "Please enter your name";
    }
    if (!email.trim()) {
      errs.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newLead: AnalyticLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        role: role as AnalyticLead["role"],
        primarySport,
        servicesOfInterest: selectedServices,
        postSlug,
        postTitle,
        createdAt: new Date().toISOString(),
      };

      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existingLeads: AnalyticLead[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newLead, ...existingLeads]));

      setIsSubscribed(true);
      toast.success("Welcome to KhelGrid Intelligence & Monetization Network!", {
        description:
          "Your 20% discount code KHELPRO20 has been activated for KhelGrid Pro & Academy Boost.",
      });
    } catch {
      toast.error("Failed to save your subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("KHELPRO20");
    setCopiedCode(true);
    toast.success("Copied discount code: KHELPRO20");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReset = () => {
    setIsSubscribed(false);
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  return (
    <section
      id="scouting-analytics-newsletter"
      aria-labelledby="newsletter-heading"
      className="mt-12 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 shadow-xl relative"
    >
      {/* Decorative accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero" />

      {isSubscribed ? (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            You&apos;re On the VIP Scouting & Monetization Wire!
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you, <span className="font-semibold text-foreground">{name}</span>. We&apos;ve
            registered your lead for{" "}
            <span className="font-semibold text-foreground">{primarySport}</span> intelligence,
            priority combine announcements, and monetization support.
          </p>

          {/* Exclusive Voucher Reward Box */}
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-primary/30 bg-primary/10 p-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Gift className="h-4 w-4" />
                <span>Your Exclusive 20% Voucher</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                Valid for 30 Days
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border/80 bg-background/90 px-3 py-2">
              <code className="text-base font-bold tracking-wider text-primary">KHELPRO20</code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-8 gap-1 px-2.5 text-xs font-semibold"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Redeemable for 20% off{" "}
              <Link to="/pricing" className="text-primary underline">
                KhelGrid Pro Athlete Membership
              </Link>{" "}
              or{" "}
              <Link to="/academy" className="text-primary underline">
                Academy Trial Boosts
              </Link>
              .
            </p>
          </div>

          {/* Quick CTA Links based on Monetization */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-gradient-hero text-primary-foreground shadow-md hover:opacity-95"
            >
              <Link to="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Unlock Pro Athlete (₹499/mo)
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/academy">
                <Flame className="mr-2 h-4 w-4 text-amber-500" />
                Boost an Academy Trial (₹1,500)
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                toast.info("Generating scouting wire preview...", {
                  description: "Opening high-performance tactical analysis summary.",
                });
              }}
              className="rounded-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Scouting PDF Summary
            </Button>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Subscribe another email or update preferences
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <TrendingUp className="h-4 w-4" />
                <span>Monetization & Scouting Intelligence</span>
              </div>
              <h2
                id="newsletter-heading"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                Get Match Analytics & VIP Monetization Access
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join 14,000+ Indian athletes, scouts, and academy managers receiving tactical
                breakdowns, verified selection invites, and exclusive discounts on KhelGrid Pro &
                Trial Boost monetization services.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary font-medium">
              <Gift className="h-4 w-4" />
              <span>Includes 20% Off Code</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-name" className="text-xs font-medium">
                  Full Name / Athlete Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lead-name"
                  type="text"
                  placeholder="e.g. Aryan Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-email" className="text-xs font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="aryan@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`pr-8 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <Mail className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Phone / WhatsApp (Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone" className="text-xs font-medium">
                  WhatsApp / Phone{" "}
                  <span className="text-muted-foreground font-normal">(for trial alerts)</span>
                </Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* User Role */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-role" className="text-xs font-medium">
                  Your Primary Role <span className="text-destructive">*</span>
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="lead-role" className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athlete">Aspiring Athlete (Looking for Pro CV)</SelectItem>
                    <SelectItem value="academy">Academy / Organizer (Looking to Boost)</SelectItem>
                    <SelectItem value="parent">Parent of Youth Athlete</SelectItem>
                    <SelectItem value="coach_scout">Coach / Talent Scout</SelectItem>
                    <SelectItem value="analyst">Sports Analyst / Enthusiast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Sport */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-sport" className="text-xs font-medium">
                  Primary Sport <span className="text-destructive">*</span>
                </Label>
                <Select value={primarySport} onValueChange={setPrimarySport}>
                  <SelectTrigger id="lead-sport" className="w-full">
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS_OPTIONS.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Monetization Services Checklist */}
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Monetization & Intelligence Services of Interest
              </Label>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {MONETIZATION_SERVICES.map((service) => {
                  const Icon = service.icon;
                  const isChecked = selectedServices.includes(service.id);
                  return (
                    <label
                      key={service.id}
                      className={`flex items-start gap-3 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                        isChecked
                          ? "border-primary/50 bg-primary/5 text-foreground"
                          : "border-border/60 bg-background/50 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleService(service.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between gap-1 font-medium text-foreground">
                          <span className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                            {service.label.split("(")[0]}
                          </span>
                          <span className="text-[10px] rounded px-1.5 py-0.5 bg-secondary text-primary font-bold">
                            {service.badge}
                          </span>
                        </div>
                        {service.label.includes("(") && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            ({service.label.split("(")[1]}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>
                  Zero spam. Unsubscribe anytime. Strictly sports career & analytics insights.
                </span>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-hero px-6 font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    <span>Subscribe & Claim 20% Voucher</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

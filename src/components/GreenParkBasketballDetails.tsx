import React from "react";
import {
  Trophy,
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  FileText,
  Clock,
  Building2,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GreenParkBasketballDetails({
  sourceUrl = "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
}: {
  sourceUrl?: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-card to-card/60 p-6 shadow-sm sm:p-8"
      aria-labelledby="green-park-basketball-heading"
    >
      {/* Header with Badges and Authentic Source Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              UP Sports Directorate Official Trial
            </Badge>
            <Badge variant="secondary" className="bg-muted text-foreground">
              Junior Boys Category
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Free Govt Entry (₹0 Fee)
            </span>
          </div>
          <h2
            id="green-park-basketball-heading"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            Junior Basketball District &amp; Divisional Selection Trials
          </h2>
          <p className="text-sm text-muted-foreground">
            Conducted by the Regional Sports Officer (RSO), Sports Directorate, Uttar Pradesh at
            Green Park Stadium, Kanpur.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <span>Times of India Coverage</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <a href="https://upsports.gov.in/" target="_blank" rel="noopener noreferrer">
              <Building2 className="h-3.5 w-3.5" />
              <span>UP Sports Portal</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Dates &amp; Time</span>
          </div>
          <div className="mt-2 text-lg font-bold">Oct 12 &amp; 13, 2026</div>
          <p className="mt-1 text-xs text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            Reporting at 3:00 PM both days
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Venue</span>
          </div>
          <div className="mt-2 text-lg font-bold truncate">Green Park Stadium</div>
          <p className="mt-1 text-xs text-muted-foreground">Civil Lines, Kanpur, Uttar Pradesh</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pathway</span>
          </div>
          <div className="mt-2 text-lg font-bold">State Championship</div>
          <p className="mt-1 text-xs text-muted-foreground">Aligarh tournament (Oct 29–31, 2026)</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Documents</span>
          </div>
          <div className="mt-2 text-lg font-bold">Mandatory Verification</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Nagar Nigam Birth Certificate + Aadhaar
          </p>
        </div>
      </div>

      {/* Authentic Sources & Verification Details */}
      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Authentic &amp; Government Verification Sources</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          This trial notification was officially published in{" "}
          <em>The Times of India (Kanpur Edition)</em> on the same circular release as the KCA
          cricket trials, validated against official Uttar Pradesh sports administration records:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <a
            href="https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 rounded-lg border border-border/70 bg-background/80 p-3 hover:border-primary/50 transition"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">The Times of India (Kanpur)</div>
              <div className="text-[11px] text-muted-foreground">
                Published trial notice with reporting timings and venue details
              </div>
            </div>
          </a>

          <a
            href="https://upsports.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 rounded-lg border border-border/70 bg-background/80 p-3 hover:border-primary/50 transition"
          >
            <Building2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Sports Directorate, Uttar Pradesh</div>
              <div className="text-[11px] text-muted-foreground">
                Official portal of Department of Sports, Govt. of UP (upsports.gov.in)
              </div>
            </div>
          </a>

          <a
            href="https://khelsathi.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 rounded-lg border border-border/70 bg-background/80 p-3 hover:border-primary/50 transition"
          >
            <Trophy className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Khel Sathi Portal (UP Govt)</div>
              <div className="text-[11px] text-muted-foreground">
                Athlete registration and tournament tracking initiative
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Two Column Section: Stages and Instructions */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/80 bg-background/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Compass className="h-4 w-4 text-primary" />
            <span>Selection Schedule &amp; Format</span>
          </div>
          <div className="mt-3 space-y-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                1
              </span>
              <div>
                <strong className="text-foreground">
                  Day 1 (Oct 12 at 3:00 PM): District Selection
                </strong>
                <p className="mt-0.5">
                  Open trials for all junior basketball players from clubs, schools, and academies
                  across Kanpur district at Green Park Stadium basketball courts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                2
              </span>
              <div>
                <strong className="text-foreground">
                  Day 2 (Oct 13 at 3:00 PM): Divisional Selection
                </strong>
                <p className="mt-0.5">
                  Divisional combine where shortlisted district standouts compete for berths in the
                  official Kanpur Division Junior Basketball squad.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                3
              </span>
              <div>
                <strong className="text-foreground">
                  Oct 29 – Oct 31, 2026: State Junior Tournament (Aligarh)
                </strong>
                <p className="mt-0.5">
                  The selected junior boys team travels to Aligarh to represent Kanpur division in
                  the Uttar Pradesh State Junior Championship.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-primary" />
            <span>Eligibility &amp; RSO Office Instructions</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            As instructed by the Regional Sports Officer, Sports Directorate, players must strictly
            comply with the following reporting guidelines:
          </p>
          <ul className="mt-3 space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">Municipal Birth Certificate:</strong> Must be
                issued by the municipal corporation (Nagar Nigam / Nagar Palika).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">Aadhaar Card:</strong> Required for identity and
                residency verification in original and photocopy.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">RSO Office Contact:</strong> For inquiries,
                players and coaches can visit the Regional Sports Officer's office at Green Park
                Stadium, Civil Lines, Kanpur.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

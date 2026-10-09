import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileCheck2,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  GraduationCap,
  Scale,
  ShieldAlert,
  ChevronRight,
  Info,
  CheckCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface UniversityGuidance {
  name: string;
  state: string;
  sportsOffice: string;
  expectedTrialWindow: string;
  notes: string;
}

const SAMPLE_UNIVERSITIES: UniversityGuidance[] = [
  {
    name: "Rashtriya Raksha University (RRU)",
    state: "Gujarat",
    sportsOffice: "School of Physical Education and Sports, Lavad, Dahegam",
    expectedTrialWindow: "National Host (Main Championship Dec 25–30, 2026)",
    notes: "Direct national host for All India Inter-University Wushu Championship 2026–27.",
  },
  {
    name: "Gujarat University",
    state: "Gujarat",
    sportsOffice: "Directorate of Physical Education & Sports, Navrangpura, Ahmedabad",
    expectedTrialWindow: "Mid-October to Early November 2026",
    notes: "Conducts annual Inter-College selection trials for Wushu men & women contingents.",
  },
  {
    name: "Maharaja Sayajirao University of Baroda (MSU)",
    state: "Gujarat",
    sportsOffice: "Department of Physical Education, Vadodara",
    expectedTrialWindow: "Late October 2026",
    notes: "Requires bonafide collegiate enrollment and state/district Wushu experience.",
  },
  {
    name: "Gujarat Technological University (GTU)",
    state: "Gujarat",
    sportsOffice: "GTU Sports Section, Chandkheda, Ahmedabad",
    expectedTrialWindow: "Mid to Late October 2026",
    notes: "Zonal trials held across engineering institutes before finalizing AIU team.",
  },
  {
    name: "Saurashtra University",
    state: "Gujarat",
    sportsOffice: "Physical Education Department, Rajkot",
    expectedTrialWindow: "Early November 2026",
    notes: "University sports board conducts selection trials prior to Nov 20 general entry.",
  },
  {
    name: "Delhi University (DU)",
    state: "Delhi",
    sportsOffice: "Delhi University Sports Council (DUSC), Rugby Stadium, North Campus",
    expectedTrialWindow: "Mid-October to First Week November 2026",
    notes: "Inter-College tournaments act as primary trials for Sanda and Taolu squad selections.",
  },
  {
    name: "Guru Nanak Dev University (GNDU)",
    state: "Punjab",
    sportsOffice: "Directorate of Sports, Amritsar",
    expectedTrialWindow: "Mid-October 2026",
    notes: "Powerhouse university in martial arts; trials held at GNDU Indoor Stadium.",
  },
  {
    name: "Panjab University (PU)",
    state: "Chandigarh / Punjab",
    sportsOffice: "Directorate of Sports, Sector 14, Chandigarh",
    expectedTrialWindow: "Late October 2026",
    notes: "Conducts open campus trials for regular enrolled students under AIU age limits.",
  },
  {
    name: "Maharshi Dayanand University (MDU)",
    state: "Haryana",
    sportsOffice: "Directorate of Sports, Rohtak",
    expectedTrialWindow: "Mid-October to Early November 2026",
    notes: "Rigorous weigh-in and bout trials for Sanda combat divisions.",
  },
  {
    name: "University of Mumbai",
    state: "Maharashtra",
    sportsOffice: "Department of Physical Education and Sports, Marine Lines / Kalina",
    expectedTrialWindow: "Late October 2026",
    notes: "Inter-collegiate tournament results determine team selection for AIU.",
  },
];

export function WushuInterUniversityDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUni, setSelectedUni] = useState<UniversityGuidance | null>(null);

  const filteredUnis = searchQuery.trim()
    ? SAMPLE_UNIVERSITIES.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.state.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : SAMPLE_UNIVERSITIES;

  return (
    <div className="space-y-8 rounded-2xl border border-primary/20 bg-gradient-to-b from-card to-card/60 p-6 sm:p-8">
      {/* SECTION HEADER */}
      <div className="space-y-2 border-b border-border/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-red-500/40 bg-red-500/10 text-red-500">
            🥋 All India Inter-University (AIIU)
          </Badge>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            Host: Rashtriya Raksha University (RRU)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Session 2026–27
          </Badge>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
          All India Inter-University Wushu Championship 2026–27 Selection Trials
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Selection trials for the All India Inter-University Wushu Championship 2026–27 are{" "}
          <strong className="text-foreground">
            handled independently by each individual university
          </strong>
          . Because <strong className="text-foreground">Rashtriya Raksha University (RRU)</strong>{" "}
          is the national host, they set the institutional entry deadlines, but your specific
          university will determine its own local trial dates to select the team representing them.
        </p>
      </div>

      {/* 1. CRUCIAL TIMELINES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Crucial Timelines</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          If you want to clear your local university trials and be registered for the national
          stage, you must coordinate with your sports department well before these host deadlines:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/60 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" /> General Entry
            </span>
            <p className="mt-1 text-base font-bold text-foreground">20th November 2026</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last Date for General Entry submitted by your university to host RRU.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-orange-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-500" /> Detailed Entry
            </span>
            <p className="mt-1 text-base font-bold text-foreground">5th December 2026</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last Date for Detailed Entry (final competitor names and weight divisions).
            </p>
          </div>

          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" /> Main Championship
            </span>
            <p className="mt-1 text-base font-bold text-primary">25th – 30th December 2026</p>
            <p className="mt-1 text-xs text-muted-foreground">
              National Championship held at Rashtriya Raksha University (RRU), Lavad, Gujarat.
            </p>
          </div>
        </div>
      </div>

      {/* 2. HOW TO ATTEND SELECTION TRIALS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">How to Attend Selection Trials</h3>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4 rounded-xl border border-border bg-card/40 p-4.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                Check with your University’s Sports Department
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Local selection trials for Inter-University events are typically conducted{" "}
                <strong className="text-foreground">
                  4 to 6 weeks before the general entry deadline
                </strong>{" "}
                (usually mid-October to early November). Visit your university&apos;s{" "}
                <strong className="text-foreground">Directorate of Physical Education</strong> or{" "}
                <strong className="text-foreground">Sports Board office</strong> immediately to look
                for the official selection notification.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 rounded-xl border border-border bg-card/40 p-4.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                Weight Categories &amp; Disciplines
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Trials are split into <strong className="text-foreground">Sanda</strong> (sanshou /
                combat sparring) and <strong className="text-foreground">Taolu</strong> (routines /
                forms) for both Men and Women. Ensure you are practicing and measuring within your
                target weight bracket. Official weigh-in is conducted strictly prior to trial bouts.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 rounded-xl border border-border bg-card/40 p-4.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground">Mandatory Documentation</h4>
              <p className="text-xs text-muted-foreground">
                If selected during the trials, you will need to provide your university sports board
                with:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <strong className="text-foreground">Unique AIU ID</strong> (generated via the
                    official{" "}
                    <a
                      href="https://aiu.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      Association of Indian Universities Sports Portal (aiu.ac.in)
                    </a>
                    ).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <strong className="text-foreground">Current college/university ID card</strong>{" "}
                    and official fee receipts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <strong className="text-foreground">
                      Class 10th and 12th passing certificates
                    </strong>{" "}
                    (for age and eligibility verification under AIU rules).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NATIONAL ORGANIZING SECRETARIAT (RRU HOST CONTACTS) */}
      <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">National Organizing Secretariat</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If your university&apos;s sports board requires clarification regarding the entry
          processes, they can reach out directly to the national organizers at RRU:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Mr. Raghvendra Singh */}
          <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
              Organizing Secretary &amp; AIU Nodal Officer
            </span>
            <p className="font-bold text-foreground text-base">Mr. Raghvendra Singh</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <a
                href="mailto:raghvendra.singh@rru.ac.in"
                className="flex items-center gap-1.5 text-primary hover:underline font-medium"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>raghvendra.singh@rru.ac.in</span>
              </a>
              <a
                href="tel:+918384849529"
                className="flex items-center gap-1.5 text-foreground hover:text-primary font-medium"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>+91 8384849529</span>
              </a>
            </div>
          </div>

          {/* Mr. Kalpesh Sharma */}
          <div className="rounded-lg border border-border bg-card/80 p-4 space-y-2">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
              Competition Coordinator
            </span>
            <p className="font-bold text-foreground text-base">Mr. Kalpesh Sharma</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="text-muted-foreground">
                Host Event Logistics &amp; Scheduling Desk
              </div>
              <a
                href="tel:+919898230979"
                className="flex items-center gap-1.5 text-foreground hover:text-primary font-medium"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>+91 9898230979</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UNIVERSITY INQUIRY & LOOKUP WIDGET */}
      <div className="space-y-4 rounded-xl border border-border bg-card/60 p-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            Find Your University&apos;s Sports Department
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Which university in Gujarat (or India) are you currently enrolled in? Search or select
          your university below to check typical sports department channels and how to look for
          their selection trial datesheet:
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university (e.g. Gujarat University, DU, Panjab University, MSU Baroda)..."
            className="pl-9 text-xs sm:text-sm"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filteredUnis.slice(0, 5).map((u) => (
            <button
              key={u.name}
              type="button"
              onClick={() => setSelectedUni(u)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                selectedUni?.name === u.name
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>

        {/* Selected or Default University Information Card */}
        {selectedUni && (
          <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">{selectedUni.name}</span>
              <Badge variant="outline">{selectedUni.state}</Badge>
            </div>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Sports Office:</strong> {selectedUni.sportsOffice}
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Trial Window:</strong>{" "}
              {selectedUni.expectedTrialWindow}
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Guidance:</strong> {selectedUni.notes}
            </p>
          </div>
        )}

        <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <span>
            Don&apos;t see your university listed? Contact your college&apos;s Director of Physical
            Education (DPE) or Dean of Student Welfare (DSW). Every university affiliated with AIU
            sends circulars to affiliated colleges 4–6 weeks before the Nov 20 deadline.
          </span>
        </div>
      </div>

      {/* 5. VERIFIED SOURCES & REFERENCES */}
      <div className="space-y-3 border-t border-border/80 pt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Official References &amp; Circulars
        </h4>
        <div className="grid gap-2 sm:grid-cols-3 text-xs">
          <a
            href="https://www.scribd.com/document/1042960239/AIIU-Wushu-Selection-Trials"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3 hover:border-primary/40 hover:text-primary transition-colors"
          >
            <span className="truncate">[1] AIIU Wushu Selection Notification</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary ml-1" />
          </a>

          <a
            href="https://www.instagram.com/p/DeOpkCNPoaz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3 hover:border-primary/40 hover:text-primary transition-colors"
          >
            <span className="truncate">[2] RRU National Host Notification</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary ml-1" />
          </a>

          <a
            href="https://aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3 hover:border-primary/40 hover:text-primary transition-colors"
          >
            <span className="truncate">[3] AIU Sports Calendar 2026–27 [PDF]</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

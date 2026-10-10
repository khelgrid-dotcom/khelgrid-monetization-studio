import React from "react";
import {
  Trophy,
  MapPin,
  Users,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function KcaKanpurCricketDetails({
  sourceUrl = "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms",
}: {
  sourceUrl?: string;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-card to-card/60 p-6 shadow-sm sm:p-8"
      aria-labelledby="kca-kanpur-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              KCA & UPCA Official District Pathway
            </Badge>
            <Badge variant="secondary" className="bg-muted text-foreground">
              U-14 Category
            </Badge>
          </div>
          <h2 id="kca-kanpur-heading" className="text-xl font-bold tracking-tight sm:text-2xl">
            Kanpur Cricket Association (KCA) U-14 Selection & UPCA Pathway
          </h2>
          <p className="text-sm text-muted-foreground">
            Official selection trials for junior cricketers conducted at Kanpur South Ground, Kidwai
            Nagar.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            <span>Read on Times of India</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>

      {/* Highlights Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Aspirants</span>
          </div>
          <div className="mt-2 text-2xl font-bold">165 Players</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Junior aspirants from Kanpur clubs & schools assessed
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Format</span>
          </div>
          <div className="mt-2 text-2xl font-bold">2-Day Trials</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Intensive net sessions, drills & match simulations
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Venue</span>
          </div>
          <div className="mt-2 text-base font-bold truncate">Kanpur South Ground</div>
          <p className="mt-1 text-xs text-muted-foreground">Kidwai Nagar, Kanpur, Uttar Pradesh</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Advancement</span>
          </div>
          <div className="mt-2 text-base font-bold">UPCA State Trials</div>
          <p className="mt-1 text-xs text-muted-foreground">
            State camp pathway to Vijay Merchant Trophy
          </p>
        </div>
      </div>

      {/* Selectors Panel & Selection Evaluation */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/80 bg-background/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Official KCA Selection Panel</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            The Under-14 talent hunt was evaluated by experienced KCA selectors tasked with scouting
            and recommending candidates to represent Kanpur at the state level:
          </p>
          <ul className="mt-3 space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">Mr. Dinesh Katiyar</strong> — Honorary General
                Secretary, Kanpur Cricket Association
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">Mr. Rakesh Tiwari</strong> — Senior KCA Selector
                (Batting & Technical Assessment)
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <div>
                <strong className="text-foreground">Mr. Vikas Yadav</strong> — Senior KCA Selector
                (Bowling Accuracy & Match Temperament)
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border/80 bg-background/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Compass className="h-4 w-4 text-primary" />
            <span>UPCA & Domestic Cricket Pathway</span>
          </div>
          <div className="mt-3 space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                1
              </span>
              <span>
                <strong className="text-foreground">KCA District Level:</strong> 165 aspirants
                screened over two days in Kidwai Nagar.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                2
              </span>
              <span>
                <strong className="text-foreground">Shortlist & Kanpur Squad:</strong> Top
                performers selected for Kanpur district coaching camp.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                3
              </span>
              <span>
                <strong className="text-foreground">UPCA State Selection:</strong> Representing
                Kanpur against other UP districts for UP state squad berths.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

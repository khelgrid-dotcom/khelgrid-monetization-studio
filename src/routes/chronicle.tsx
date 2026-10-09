import { createFileRoute, Link } from "@tanstack/react-router";
import { Newspaper, ShieldCheck, PenLine, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SportsNewsSection } from "@/components/SportsNewsSection";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/chronicle")({
  head: () =>
    buildSeoHead({
      title: "KhelChronicle · National Sports & Selection Dispatch · KhelGrid",
      description:
        "India's verified sports wire for SAI selection trials, Khelo India pathways, national championships, and athlete journalism across disciplines.",
      canonicalPath: "/chronicle",
      keywords:
        "KhelChronicle, sports news India, SAI trials news, Khelo India circulars, athletics trials, wrestling trials, Indian sports dispatches",
      type: "website",
    }),
  component: ChroniclePage,
});

function ChroniclePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <Newspaper className="mr-1.5 h-3.5 w-3.5" />
              KhelChronicle
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Verified Sports Intelligence
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            National Sports &amp; Selection Dispatch
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Official selection circulars, Khelo India updates, state championships, and athlete
            pathways across India. Verified directly from SAI, national sports federations, and
            state sports departments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/trials">
              <Radio className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Browse Trials
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/blog/write">
              <PenLine className="mr-1.5 h-4 w-4" />
              Submit Notice
            </Link>
          </Button>
        </div>
      </header>

      <div className="mt-6">
        <SportsNewsSection variant="full" />
      </div>
    </main>
  );
}

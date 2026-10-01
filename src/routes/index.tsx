import { createFileRoute } from "@tanstack/react-router";
import {
  HomeHeroSection,
  HomeOpportunitiesSection,
  HomeGuidesSection,
  HomeMonetizationSection,
} from "@/components/home";
import { SportsNewsSection } from "@/components/SportsNewsSection";
import { LiveScoreSection } from "@/components/LiveScoreSection";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { BannerAd, ResponsiveAd } from "@/components/ads";
import { buildSeoHead } from "@/lib/seo";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "KhelGrid · India's Sports Opportunity Network",
      description:
        "India's premier sports platform for discovery and development. Find trials, tournaments, leagues, verified academies, sports turf venues, and amateur pickup games across 16+ sports.",
      canonicalPath: "/",
      keywords:
        "sports trials India, sports academies near me, book turf, pickup sports games, badminton courts, cricket trials, football tournament, athletics scholarship, real-time sports wire, sports updates national news, Asian Games medal tally",
      type: "website",
      customSchema: {
        "@type": "FAQPage",
        mainEntity: HOME_FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    }),
  component: Home,
});

function Home() {
  return (
    <div className="min-w-0 flex-1">
      {/* 1. Hero Search, Filters & Fast Action Categories */}
      <HomeHeroSection />

      {/* 2. Below-Hero Responsive Ad Slot */}
      <div className="mx-auto max-w-7xl px-4">
        <BannerAd adSlot="homeBelowHero" minHeight={100} />
      </div>

      {/* 3. Core Editorial Discovery, Opportunities & Live Wire Match Center */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
        <div className="max-w-3xl pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Sports opportunities in India
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Find the next practical step in your sports journey
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            KhelGrid brings trials, camps, tournaments, scholarships, training resources and
            preparation guidance together for athletes and families. Each listing shows what is
            known, what still needs confirmation, and where to check the organizer&apos;s latest
            instructions.
          </p>
        </div>

        {/* Latest Opportunities & Trials Carousel */}
        <HomeOpportunitiesSection />

        {/* In-Play Real-time Live Match Scores (Cricket, Football, Badminton, etc.) */}
        <LiveScoreSection />

        {/* Real-time Sports Wire & National Updates */}
        <SportsNewsSection />

        {/* Sports Guides, Pathways & Trust Verification Notice */}
        <HomeGuidesSection />
      </div>

      {/* 4. Monetization & Value Plans (Athletes & Academies) */}
      <HomeMonetizationSection />

      {/* 5. Comprehensive FAQ Accordion */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <HomeFaqSection />
      </div>

      {/* 6. Footer Ad Slot */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <ResponsiveAd adSlot="homeFooter" minHeight={250} />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  HomeHeroSection,
  HomeSectionNav,
  HomeQuickActionsSection,
  HomeOpportunitiesSection,
  HomeLiveCenterSection,
  HomeNewsWireSection,
  HomeGuidesSection,
  HomeCommunityImpactSection,
  HomeMonetizationSection,
  HomeCtaBannerSection,
} from "@/components/home";
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
    <main className="min-w-0 flex-1 space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Search, Live Metrics & Quick Sport Tags */}
      <HomeHeroSection />

      {/* 2. Below-Hero Responsive Ad Slot */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BannerAd adSlot="homeBelowHero" minHeight={100} />
      </div>

      {/* 3. Sticky Quick Jump Section Sub-Bar */}
      <HomeSectionNav />

      {/* 4. Core Action Pillars (Trials, Turfs, Pickup Games, Coaching, CV, Events) */}
      <HomeQuickActionsSection />

      {/* 4. Latest Selection Trials & Opportunities Carousel */}
      <HomeOpportunitiesSection />

      {/* 5. In-Play Match Center (Cricket, Football, Badminton Scores) */}
      <HomeLiveCenterSection />

      {/* 6. National Sports Wire & Grassroots Updates */}
      <HomeNewsWireSection />

      {/* 7. Sports Guides, Athlete Development Pathways & Trust Audit */}
      <HomeGuidesSection />

      {/* 8. Verified Academies & Community Trust Guarantee */}
      <HomeCommunityImpactSection />

      {/* 9. Membership & Listing Plans (Athletes & Academies) */}
      <HomeMonetizationSection />

      {/* 10. Comprehensive FAQ Accordion */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeFaqSection />
      </div>

      {/* 11. Dual-Track Conversion CTA Banner */}
      <HomeCtaBannerSection />

      {/* 12. Footer Responsive Ad Slot */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ResponsiveAd adSlot="homeFooter" minHeight={250} />
      </div>
    </main>
  );
}

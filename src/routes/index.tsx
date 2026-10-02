import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AppHeaderBanner,
  SportCategoryPills,
  AppLaunchpad,
  LiveMatchTicker,
  FeaturedTrialsRadar,
  QuickVenueRadar,
  PickupGameLobby,
  AthletePathwayCard,
  NativeAppBanner,
  HomeNewsWireSection,
  HomeCommunityImpactSection,
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
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");

  // Read saved city preference on client after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("khelgrid_user_city");
      if (saved) {
        setSelectedCity(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("khelgrid_user_city", city);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-w-0 flex-1 space-y-6 sm:space-y-8 pb-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-7">
        {/* 1. App Header Greeting, City Switcher, Quick Search & PWA Install Bar */}
        <AppHeaderBanner selectedCity={selectedCity} onSelectCity={handleSelectCity} />

        {/* 2. Touch-First Horizontal Sport Selector */}
        <SportCategoryPills selectedSport={selectedSport} onSelectSport={setSelectedSport} />

        {/* 3. App Launchpad: 6 Iconic Touch-Friendly Tiles */}
        <AppLaunchpad />

        {/* 4. In-Play Live Match Center (Direct target for bottom thumb Live tab) */}
        <LiveMatchTicker selectedSport={selectedSport} />

        {/* 5. Sponsored Banner Ad */}
        <div className="pt-1">
          <BannerAd adSlot="homeBelowHero" minHeight={90} />
        </div>

        {/* 6. Selection Trials & Scouting Combines */}
        <FeaturedTrialsRadar selectedSport={selectedSport} selectedCity={selectedCity} />

        {/* 7. Instant Turf & Court Booking */}
        <QuickVenueRadar selectedCity={selectedCity} selectedSport={selectedSport} />

        {/* 8. Community Pickup Games Lobby */}
        <PickupGameLobby selectedCity={selectedCity} selectedSport={selectedSport} />

        {/* 9. Athlete Passport & Verified Sports CV Feature */}
        <AthletePathwayCard />

        {/* 10. National Sports Wire & Live Editorial */}
        <HomeNewsWireSection />

        {/* 11. Multi-Platform PWA, Android & iOS Native App Showcase */}
        <NativeAppBanner />

        {/* 12. Verified Academies & Community Trust Audit */}
        <HomeCommunityImpactSection />

        {/* 13. Frequently Asked Questions Accordion */}
        <div className="pt-2">
          <HomeFaqSection />
        </div>

        {/* 14. Responsive Footer Ad Unit */}
        <div className="pt-2">
          <ResponsiveAd adSlot="homeFooter" minHeight={200} />
        </div>
      </div>
    </div>
  );
}

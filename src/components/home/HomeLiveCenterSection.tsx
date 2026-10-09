import { LiveScoreSection } from "@/components/LiveScoreSection";

export function HomeLiveCenterSection() {
  return (
    <section
      id="match-center"
      aria-label="Live Match Center"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <LiveScoreSection />
    </section>
  );
}

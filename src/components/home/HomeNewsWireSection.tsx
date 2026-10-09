import { SportsNewsSection } from "@/components/SportsNewsSection";

export function HomeNewsWireSection() {
  return (
    <section
      id="sports-wire"
      aria-label="National Sports & Selection Dispatch"
      className="w-full min-w-0 max-w-full overflow-hidden py-1"
    >
      <SportsNewsSection variant="home" />
    </section>
  );
}

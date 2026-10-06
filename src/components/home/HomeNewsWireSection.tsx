import { SportsNewsSection } from "@/components/SportsNewsSection";

export function HomeNewsWireSection() {
  return (
    <section
      id="sports-wire"
      aria-label="National Sports & Selection Dispatch"
      className="w-full py-1"
    >
      <SportsNewsSection variant="home" />
    </section>
  );
}

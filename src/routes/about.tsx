import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Info } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About · KhelGrid" }, { name: "description", content: "We're building India's sports opportunity network — from grassroots to gold." }] }),
  component: () => (
    <ComingSoon
      icon={Info}
      eyebrow="Our mission"
      title="About KhelGrid"
      description="India has 600M+ under-30s and far too few discovery channels for sporting talent. KhelGrid connects every athlete — from a Tier-3 town net session to a national camp — through one transparent, monetized grid."
      bullets={[
        "Founded 2024, headquartered in Bengaluru",
        "Backed by sports-first angels and ex-Olympians",
        "Partnered with 240+ academies & 12 state bodies",
        "Built by athletes, for athletes",
      ]}
    />
  ),
});

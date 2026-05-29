import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/coaches")({
  head: () => ({ meta: [{ title: "Coaches · KhelGrid" }, { name: "description", content: "Book sessions with NIS-certified coaches across India." }] }),
  component: () => (
    <ComingSoon
      icon={GraduationCap}
      eyebrow="Coach marketplace"
      title="Coaches"
      description="Book hourly sessions, monthly programs, or trial-prep sprints with NIS-certified coaches near you or online."
      bullets={[
        "Filter by sport, city, certification",
        "Verified reviews from athletes",
        "Pay-per-session or monthly retainer",
        "Free 15-min intro call",
      ]}
    />
  ),
});

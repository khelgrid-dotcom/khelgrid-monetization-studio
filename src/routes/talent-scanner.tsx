import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { ScanLine } from "lucide-react";

export const Route = createFileRoute("/talent-scanner")({
  head: () => ({ meta: [{ title: "Talent Scanner · KhelGrid" }, { name: "description", content: "A planned KhelGrid assessment tool for recording sports tests." }, { name: "robots", content: "noindex,follow" }] }),
  component: () => (
    <ComingSoon
      icon={ScanLine}
      eyebrow="AI-powered assessment"
      title="Talent Scanner"
      description="Point your phone, run a 60-second test, and get instant AI scoring on speed, agility, accuracy and form — benchmarked against national age-group averages."
      bullets={[
        "Sprint, vertical jump, dribble, accuracy tests",
        "On-device CV — works offline",
        "Auto-attached to your Sports CV",
        "Shared directly with scouting partners",
      ]}
    />
  ),
});

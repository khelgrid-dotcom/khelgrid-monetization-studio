import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities · KhelGrid" }, { name: "description", content: "Trials, tournaments, scholarships, camps and online competitions in one feed." }] }),
  component: () => (
    <ComingSoon
      icon={Compass}
      eyebrow="The opportunity feed"
      title="Opportunities"
      description="Live trials, tournaments, scholarships, fitness events and online competitions — refreshed hourly and ranked for you."
      bullets={["Trials & selection camps", "State / national tournaments", "Scholarships & stipends", "Online competitions & e-sports"]}
      cta={{ to: "/trials", label: "Open the feed" }}
    />
  ),
});

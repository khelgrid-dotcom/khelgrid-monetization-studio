import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Users } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community · KhelGrid" }, { name: "description", content: "Connect with athletes, coaches, and academies in your sport and city." }] }),
  component: () => (
    <ComingSoon
      icon={Users}
      eyebrow="Built by athletes"
      title="Community"
      description="Find practice partners, swap training drills, and join sport-specific groups moderated by national-level coaches."
      bullets={[
        "City + sport based circles",
        "Weekly AMAs with pros",
        "Practice partner finder",
        "Verified-only DMs to block spam",
      ]}
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/start-from-zero")({
  head: () => ({ meta: [{ title: "Start From Zero · KhelGrid" }, { name: "description", content: "Begin your sports journey from absolute beginner with a guided 30-day plan." }] }),
  component: () => (
    <ComingSoon
      icon={Sparkles}
      eyebrow="For first-time athletes"
      title="Start From Zero"
      description="A guided 30-day onboarding for first-time athletes — pick a sport, get a daily plan, and apply to your first local trial within a month."
      bullets={[
        "Pick from 20+ sports with effort & cost rated",
        "Daily 20-minute workout cards",
        "Local trial alerts within 10km",
        "Free starter CV at the end of week 4",
      ]}
    />
  ),
});

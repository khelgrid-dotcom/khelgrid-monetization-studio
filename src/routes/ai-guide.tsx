import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/ai-guide")({
  head: () => ({ meta: [{ title: "AI Guide · KhelGrid" }, { name: "description", content: "Your personal AI sports mentor — ask anything from trial prep to nutrition." }] }),
  component: () => (
    <ComingSoon
      icon={Bot}
      eyebrow="Your AI sports mentor"
      title="AI Guide"
      description="Ask anything — trial prep, fitness plans, scholarship advice, nutrition. Powered by KhelGrid's coach network and India-specific sports data."
      bullets={[
        "Voice + chat in 8 Indian languages",
        "Personalised based on your sport & level",
        "Trial readiness score before you apply",
        "Free for all Pro users",
      ]}
      cta={{ to: "/pricing", label: "Get Pro" }}
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Bot } from "lucide-react";

export const Route = createFileRoute("/ai-guide")({
  head: () => ({ meta: [{ title: "AI Guide · KhelGrid" }, { name: "description", content: "Your personal AI sports mentor — ask anything from trial prep to nutrition." }, { name: "robots", content: "noindex,follow" }] }),
  component: () => (
    <ComingSoon
      icon={Bot}
      eyebrow="Your AI sports mentor"
      title="AI Guide"
      description="A planned assistant for trial preparation, fitness planning, scholarship research, and nutrition questions. Always confirm important advice with a qualified professional or official source."
      bullets={[
        "A guided chat experience for sports questions",
        "Personalised based on your sport & level",
        "Trial readiness score before you apply",
        "Free for all Pro users",
      ]}
      cta={{ to: "/pricing", label: "Get Pro" }}
    />
  ),
});

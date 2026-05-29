import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Resources · KhelGrid" }, { name: "description", content: "Guides, templates, scholarship lists and rulebooks for Indian athletes." }] }),
  component: () => (
    <ComingSoon
      icon={BookOpen}
      eyebrow="Free resources"
      title="Resources"
      description="Trial prep checklists, Sports CV templates, scholarship databases, rulebooks and parent guides — all free, all India-specific."
      cta={{ to: "/learning-hub", label: "Open Learning Hub" }}
    />
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/learning-hub")({
  head: () => ({ meta: [{ title: "Learning Hub · KhelGrid" }, { name: "description", content: "Short courses on technique, recovery, nutrition, and the business of sport." }] }),
  component: () => (
    <ComingSoon
      icon={BookOpen}
      eyebrow="Free for all"
      title="Learning Hub"
      description="Bite-sized video courses from India's top coaches and sports scientists. Technique, recovery, nutrition, mental game and the business of sport."
      bullets={[
        "500+ lessons, 8 Indian languages",
        "Download for offline practice",
        "Quizzes + completion badges",
        "Coach-verified curriculums",
      ]}
    />
  ),
});

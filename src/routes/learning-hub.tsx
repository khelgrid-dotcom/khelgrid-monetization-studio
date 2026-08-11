import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/learning-hub")({
  head: () => ({ meta: [{ title: "Learning Hub · KhelGrid" }, { name: "description", content: "Short courses on technique, recovery, nutrition, and the business of sport." }, { name: "robots", content: "noindex,follow" }] }),
  component: () => (
    <ComingSoon
      icon={BookOpen}
      eyebrow="Free for all"
      title="Learning Hub"
      description="Bite-sized video courses from India's top coaches and sports scientists. Technique, recovery, nutrition, mental game and the business of sport."
      bullets={[
        "A growing library of lessons and practice resources",
        "Download for offline practice",
        "Quizzes + completion badges",
        "Curriculum notes and source context",
      ]}
    />
  ),
});

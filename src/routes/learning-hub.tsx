import { createFileRoute } from "@tanstack/react-router";
import { SportsLearningHub } from "@/components/learning/SportsLearningHub";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/learning-hub")({
  head: () =>
    buildSeoHead({
      title: "Sports & Learning Hub: Books, Videos, Rulebooks & Drills · KhelGrid",
      description:
        "The unified Sports & Learning Hub. Learn sports rules, tactical books, video masterclasses, and interactive quizzes across Cricket, Football, Badminton, Athletics, Tennis, Kabaddi and more.",
      canonicalPath: "/learning-hub",
      keywords:
        "sports learning hub, learn sports, cricket masterclass, football tactics, badminton rules, sports books, NIS coaching manuals, KhelGrid learning",
      type: "website",
    }),
  component: SportsLearningHub,
});

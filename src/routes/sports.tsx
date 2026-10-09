import { createFileRoute } from "@tanstack/react-router";
import { SportsLearningHub } from "@/components/learning/SportsLearningHub";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/sports")({
  head: () =>
    buildSeoHead({
      title: "Sports & Learning Hub: Books, Videos, Rulebooks & Pathways · KhelGrid",
      description:
        "Comprehensive directory and learning hub for sports disciplines in India. Learn through books, video masterclasses, official rules, and trial feeds across 16+ sports.",
      canonicalPath: "/sports",
      keywords:
        "sports learning hub, cricket trials, football academies, badminton coaching, athletics scholarships, tennis training, sports books, rules",
      type: "website",
    }),
  component: SportsLearningHub,
});

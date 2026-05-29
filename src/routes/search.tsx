import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search · KhelGrid" }, { name: "description", content: "Search trials, academies, coaches and events across India." }] }),
  component: () => (
    <ComingSoon
      icon={Search}
      eyebrow="Universal search"
      title="Search the Grid"
      description="One bar to find any trial, academy, coach, scholarship or fitness event across India — filtered by sport, city, age and fee."
      cta={{ to: "/trials", label: "Browse live trials" }}
    />
  ),
});

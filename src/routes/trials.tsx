import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidated into /search.
export const Route = createFileRoute("/trials")({
  beforeLoad: () => {
    throw redirect({
      to: "/search",
      search: { q: "", sport: "All Sports", city: "All Locations", sort: "Soonest", free: false },
    });
  },
  component: () => null,
});

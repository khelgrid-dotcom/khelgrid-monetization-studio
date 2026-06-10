import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidated into /search — keep route to preserve old links.
export const Route = createFileRoute("/opportunities")({
  beforeLoad: () => {
    throw redirect({
      to: "/search",
      search: { q: "", sport: "All Sports", city: "All Locations", sort: "Soonest", free: false },
    });
  },
  component: () => null,
});

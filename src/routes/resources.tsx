import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidated into /guides — keep route to preserve old links.
export const Route = createFileRoute("/resources")({
  beforeLoad: () => {
    throw redirect({ to: "/guides" });
  },
  component: () => null,
});

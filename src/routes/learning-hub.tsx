import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute("/learning-hub")({
  beforeLoad: () => {
    throw redirect({ to: "/guides" });
  },
  component: () => null,
});

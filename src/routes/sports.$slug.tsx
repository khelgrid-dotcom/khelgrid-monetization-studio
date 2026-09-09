import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute("/sports/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/sport/$slug", params: { slug: params.slug } });
  },
  component: () => null,
});

import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/opportunities/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/trial/$id", params: { id: params.id } });
  },
  component: () => null,
});

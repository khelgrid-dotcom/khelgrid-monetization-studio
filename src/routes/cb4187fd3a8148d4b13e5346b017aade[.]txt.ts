import { createFileRoute } from "@tanstack/react-router";

const INDEXNOW_KEY = "cb4187fd3a8148d4b13e5346b017aade";

export const Route = createFileRoute("/cb4187fd3a8148d4b13e5346b017aade.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(INDEXNOW_KEY, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});

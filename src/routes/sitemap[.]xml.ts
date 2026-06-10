import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_CATALOG_PATHS } from "@/data/catalog";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const STATIC_PATHS = [
  "/", "/about", "/academy", "/ai-guide", "/book", "/coaches", "/community",
  "/dashboard", "/events", "/learning-hub", "/login", "/memberships",
  "/mobile-app", "/play", "/pricing", "/search", "/start-from-zero",
  "/talent-scanner", "/train", "/verify",
  "/sports", "/cities", "/guides", "/tools",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [...STATIC_PATHS, ...ALL_CATALOG_PATHS];
        const urls = paths.map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`);
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
